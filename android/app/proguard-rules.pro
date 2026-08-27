# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Package: react-native-svg
-keep public class com.horcrux.svg.** { *; }

# Package: bdk-rn
-keep class com.sun.jna.** { *; }
-keep class org.bitcoindevkit.** { *; }

# JNA has optional AWT support that doesn't exist on Android
-dontwarn java.awt.**
-dontnote java.awt.**

# Package: nym-rn — no rules needed here. nym-rn ships consumer-rules.pro, which
# AGP folds into this app's R8 run (keeps org.rustls.platformverifier.**, which
# only Rust references via JNI). Requires nym-rn pinned at >= the commit adding it.