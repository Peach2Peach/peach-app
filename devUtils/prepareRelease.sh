VERSION=$(cat package.json | jq ".version" | sed s"/\"//g")
BUILDNUMBER=$(cat android/app/build.gradle | grep versionCode | head -1 | sed s/"        versionCode //")
cd android/app/build/outputs/apk/prod/release 
MANIFEST="manifest-peach-$VERSION-$BUILDNUMBER"
shasum -a 256 app-prod-* > "$MANIFEST.txt"
gpg --sign --detach-sig --default-key 48339A19645E2E53488E0E5479E1B270FACD1BD2 --output "$MANIFEST.sig" "$MANIFEST.txt"