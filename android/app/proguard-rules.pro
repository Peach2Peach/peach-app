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

# After react-native upgrade to 0.73 - manual fix
-keep class java.awt.** { *; }
-dontwarn java.awt.Component
-dontwarn java.awt.GraphicsEnvironment
-dontwarn java.awt.HeadlessException
-dontwarn java.awt.Window