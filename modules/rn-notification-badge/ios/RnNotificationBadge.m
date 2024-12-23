#import <Foundation/Foundation.h>
#import "RnNotificationBadge.h"
#import <React/RCTLog.h>

@implementation RnNotificationBadge
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setNumber:(NSInteger)count)
{
    UIUserNotificationSettings *notificationSettings = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound) categories:nil];
    [[UIApplication sharedApplication] registerUserNotificationSettings:notificationSettings];
    [UIApplication sharedApplication].applicationIconBadgeNumber = count;
}

RCT_EXPORT_METHOD(getNumber:(RCTResponseSenderBlock)callback)
{
    NSInteger badgeNumber = [UIApplication sharedApplication].applicationIconBadgeNumber;
    callback(@[[NSNumber numberWithInteger:badgeNumber]]);
}

RCT_EXPORT_METHOD(increment)
{
    NSInteger badgeNumber = [UIApplication sharedApplication].applicationIconBadgeNumber;
    badgeNumber++;
    [UIApplication sharedApplication].applicationIconBadgeNumber = badgeNumber;
}

@end
