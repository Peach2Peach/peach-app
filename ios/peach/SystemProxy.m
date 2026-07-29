#import "SystemProxy.h"
#import <objc/runtime.h>

// Current proxy dictionary applied to RN's NSURLSession configuration, or nil
// when routing is off. Read by the swizzled +defaultSessionConfiguration below.
static NSDictionary *gProxyDict = nil;

// Weak registry of live RCTHTTPRequestHandler instances (RN's HTTP/fetch session
// owner). Populated by swizzling its -init (see the constructor). This lets us
// refresh their sessions when the proxy toggles WITHOUT needing RCTBridge —
// which is nil under the bridgeless / new-architecture runtime this app uses,
// so the old "[RCTBridge currentBridge] moduleForClass:" approach never worked.
static NSHashTable *gHandlers = nil;

@implementation SystemProxy

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

// iOS routes RN networking through the local HTTP-CONNECT bridge (NSURLSession
// honors HTTP/HTTPS proxies reliably; its SOCKS support is not). The socks args
// are ignored here (they are for Android).
RCT_EXPORT_METHOD(setProxy:(NSString *)socks5Host
                  socks5Port:(double)socks5Port
                  httpHost:(NSString *)httpHost
                  httpPort:(double)httpPort)
{
  gProxyDict = @{
    (NSString *)kCFNetworkProxiesHTTPEnable : @YES,
    (NSString *)kCFNetworkProxiesHTTPProxy : httpHost,
    (NSString *)kCFNetworkProxiesHTTPPort : @((int)httpPort),
    // HTTPS keys are not exported as constants on iOS; the string keys work.
    @"HTTPSEnable" : @YES,
    @"HTTPSProxy" : httpHost,
    @"HTTPSPort" : @((int)httpPort),
  };
  NSLog(@"[SystemProxy] setProxy http=%@:%d", httpHost, (int)httpPort);
  [SystemProxy refreshRNSessions];
}

RCT_EXPORT_METHOD(clearProxy)
{
  gProxyDict = nil;
  NSLog(@"[SystemProxy] clearProxy");
  [SystemProxy refreshRNSessions];
}

// A session's proxy is fixed at creation, and RN builds its HTTP session once
// (lazily, on the first request — long before the mixnet connects). So toggling
// the proxy has to rebuild those cached sessions. We swap each registered
// handler's `_session` for a fresh one built from the swizzled
// defaultSessionConfiguration (which now carries gProxyDict). KVC is used for
// the swap so ARC manages the ivar correctly; invalidateAndCancel on the old
// session drops any in-flight requests (they retry on the new, proxied session).
+ (void)refreshRNSessions
{
  NSArray *handlers;
  @synchronized([SystemProxy class]) {
    handlers = gHandlers ? gHandlers.allObjects : @[];
  }
  NSLog(@"[SystemProxy] refreshRNSessions: %lu handler(s), proxy %@",
        (unsigned long)handlers.count, gProxyDict ? @"ON" : @"OFF");
  for (id handler in handlers) {
    [SystemProxy rebuildSessionForHandler:handler];
  }
}

+ (void)rebuildSessionForHandler:(id)handler
{
  @try {
    NSURLSession *old = [handler valueForKey:@"session"];
    // No session yet → RN's lazy path will build a proxied one on first request
    // (via the swizzle), so nothing to do here.
    if (!old || ![old isKindOfClass:[NSURLSession class]]) return;

    NSURLSessionConfiguration *cfg =
        [NSURLSessionConfiguration defaultSessionConfiguration]; // swizzled below
    // Mirror the cookie setup RN applies in RCTHTTPRequestHandler.
    [cfg setHTTPShouldSetCookies:YES];
    [cfg setHTTPCookieAcceptPolicy:NSHTTPCookieAcceptPolicyAlways];
    [cfg setHTTPCookieStorage:[NSHTTPCookieStorage sharedHTTPCookieStorage]];

    NSURLSession *fresh = [NSURLSession sessionWithConfiguration:cfg
                                                        delegate:handler
                                                   delegateQueue:old.delegateQueue];
    [handler setValue:fresh forKey:@"session"];
    [old invalidateAndCancel];
    NSLog(@"[SystemProxy] rebuilt RN session (proxy %@)",
          gProxyDict ? @"ON" : @"OFF");
  } @catch (NSException *e) {
    NSLog(@"[SystemProxy] rebuildSessionForHandler failed: %@", e);
  }
}

@end

// Load-time swizzles. Installed from a C constructor rather than +load: RN's
// RCT_EXPORT_MODULE() already synthesizes a +load on this class, and a second
// +load is a "duplicate declaration of method 'load'" compile error. A
// constructor runs at image load too — before RN makes any network request or
// creates its HTTP handler — so both swizzles are in place in time.
static IMP gOrigSendRequest = NULL;

// True only if `cls` itself implements `sel` (not merely inherits it). Swizzling
// an inherited method mutates it for the whole hierarchy — e.g. hooking -init,
// which RCTHTTPRequestHandler inherits from NSObject, would run our block for
// every object created in the app.
static BOOL ClassOwnsSelector(Class cls, SEL sel) {
  unsigned int count = 0;
  Method *methods = class_copyMethodList(cls, &count);
  BOOL owns = NO;
  for (unsigned int i = 0; i < count; i++) {
    if (method_getName(methods[i]) == sel) {
      owns = YES;
      break;
    }
  }
  free(methods);
  return owns;
}

__attribute__((constructor)) static void SystemProxyInstallSwizzles(void)
{
  static dispatch_once_t once;
  dispatch_once(&once, ^{
    // (1) Inject the mixnet proxy into every default session configuration, so
    // any session created while routing is active carries it.
    Class cfgCls = [NSURLSessionConfiguration class];
    SEL cfgSel = @selector(defaultSessionConfiguration);
    Method cfgMethod = class_getClassMethod(cfgCls, cfgSel);
    IMP cfgOrig = method_getImplementation(cfgMethod);
    method_setImplementation(
        cfgMethod,
        imp_implementationWithBlock(^NSURLSessionConfiguration *(id self_) {
          NSURLSessionConfiguration *cfg =
              ((NSURLSessionConfiguration * (*)(id, SEL)) cfgOrig)(self_, cfgSel);
          if (gProxyDict) {
            cfg.connectionProxyDictionary = gProxyDict;
          }
          return cfg;
        }));

    // (2) Register each RN HTTP handler the first time it sends a request, so we
    // can refresh its session on proxy change without needing RCTBridge
    // (bridgeless-safe). We hook -sendRequest:withDelegate: because the class
    // OWNS that method — NOT -init, which it inherits from NSObject.
    gHandlers = [NSHashTable weakObjectsHashTable];
    Class handlerCls = NSClassFromString(@"RCTHTTPRequestHandler");
    SEL sendSel = @selector(sendRequest:withDelegate:);
    if (handlerCls && ClassOwnsSelector(handlerCls, sendSel)) {
      Method sendMethod = class_getInstanceMethod(handlerCls, sendSel);
      gOrigSendRequest = method_getImplementation(sendMethod);
      method_setImplementation(
          sendMethod,
          imp_implementationWithBlock(^id(id self_, id request, id delegate) {
            if ([self_ isKindOfClass:handlerCls]) {
              @synchronized([SystemProxy class]) {
                [gHandlers addObject:self_];
              }
            }
            return ((id (*)(id, SEL, id, id)) gOrigSendRequest)(
                self_, sendSel, request, delegate);
          }));
    }
  });
}
