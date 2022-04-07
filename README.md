# Installation

Follow [react native setup guide](https://reactnative.dev/docs/environment-setup)

Run

`npm install`

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