VERSION=$(cat package.json | jq ".version" | sed s"/\"//g")
BUILDNUMBER=$(cat android/app/build.gradle | grep versionCode | head -1 | sed s/"        versionCode //")
cd android/app/build/outputs/apk/prod/release 
MANIFEST="manifest-peach-$VERSION-$BUILDNUMBER"
shasum -a 256 app-prod-* > "$MANIFEST.txt"
gpg --sign --detach-sig --default-key E970EDB410C8E84198F141584AD3CE3043D8CD1B --output "$MANIFEST.sig" "$MANIFEST.txt"