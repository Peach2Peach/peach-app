# Installation

Follow [react native setup guide](https://reactnative.dev/docs/environment-setup)

Run

```
npm install
npx react-native link
```

**iOS**

Install dependencies

`cd ios && pod install`

## Environment Setup

Copy template for each environment

```
cp .env.dist .env.sandbox
cp .env.dist .env.development
cp .env.dist .env.production
```

Then edit the variables according to your setup

# Run simulator

**iOS**

`npm run ios`

**Android**

`npm run android`

**Web**

`npm run web`



## Test

`npm run test`

**Run specific tests**
`npm run test ./tests/utils/validationUtils.test.js`

`npm run test ./tests/utils/*.test.js`


## Troubleshooting

### Can't build Android

#### General

1. Clean gradle

`cd android & ./gradlew clean`

2. Clear metro cache

`npm run cache:clear`

#### Error: Duplicate resources

1. Run `rm -rf android/app/src/main/res/drawable-*`
2. Then open folder android in Android Studio and build project
3. Select Build/Generate signed APK to build release



### Can't build iOS

#### After react-native updates

1. Install pods

```
npx react-native link
cd ios && pod install
```