# AngularJS Cordova Appium

AngularJS + Cordova なアプリに Appium を使って E2E テストを行うサンプルです。


## How To Use?

```sh
# Install Packages
$ npm install
$ npm run bower install
$ npm run cordova prepare

# Task Info
$ npm run info

# Live-Reload Develop
$ npm run dev

# Build To ./www/
$ npm run build
# And Cordova Build ...
$ npm run cordova build ios

# Build And Launch iPhone7 Simulator
$ npm run emu
# Also
$ npm start

# E2E Test
# Launch Appium Server
$ npm run appium
# Run Protractor
$ npm run e2e
```


## How I Made It

このように作りました。コマンドのみ列挙。

```sh
# Start Project
$ npm init
$ git init

# Install Bower
$ npm i -D bower
$ bower init

# Install AngularJS
$ bower i angular#1.6.5 --save
$ bower i angular-route --save
$ bower i angular-bootstrap --save

# Install Cordova
$ npm i -D cordova
$ cordova create AngularJSCordovaAppium com.example.angularjs.cordova.appium AngularJSCordovaAppium

# Merge Cordova Project Files ...

# Add Platforms And Plugins
$ cordova platform add ios
$ cordova platform add browser
$ cordova plugin add cordova-plugin-console
$ cordova plugin add cordova-plugin-statusbar
$ cordova plugin add cordova-plugin-browsersync

# Setup Gulp Scripts
$ npm i -D gulp gulp-load-plugins del run-sequence gulp-watch gulp-description
# CSS
$ npm i -D gulp-sass gulp-sourcemaps
# JS
$ npm i -D browserify vinyl-source-stream babelify babel-preset-2015
# HTML
$ npm i -D gulp-inject wiredep gulp-useref

# And Make gulpfile.js ...

# Agree XCode License
$ sudo xcodebuild -license

# Homebrew : Before
$ brew list
autoconf
bash-completion
git
makedepend
openssl
pkg-config
rbenv
readline
ruby-build
tig
xz

# RubyGems : Before
$ gem list

*** LOCAL GEMS ***

bigdecimal (1.2.6)
io-console (0.4.3)
json (1.8.1)
minitest (5.4.3)
power_assert (0.2.2)
psych (2.0.8)
rake (10.4.2)
rdoc (4.2.0)
test-unit (3.0.8)

# npm : Before
$ npm list -g --depth=0
/Users/Neo/.nodebrew/node/v6.10.3/lib
├── bower@1.8.0
├── cordova@7.0.1
├── eslint@4.2.0
└── npm@3.10.10

# Install Tools by Homebrew
$ brew install carthage ios-webkit-debug-proxy
$ brew upgrade libimobiledevice --HEAD

# Homebrew : After
$ brew list
autoconf
automake
bash-completion
carthage                # Cathage : appium-xcuitest-driver Requires
git
ios-webkit-debug-proxy  # iOS WebKit Debug Proxy : Proxy Safari DevTools
libimobiledevice        # Lib iMobile Device : Get iOS Device Info
libplist
libtasn1
libtool
libusb
libxml2
makedepend
openssl
pkg-config
rbenv
readline
ruby-build
tig
usbmuxd
xz

# Install Tools by RubyGems
$ gem install xcpretty

# RubyGems : After
$ gem list

*** LOCAL GEMS ***

bigdecimal (1.2.6)
io-console (0.4.3)
json (1.8.1)
minitest (5.4.3)
power_assert (0.2.2)
psych (2.0.8)
rake (10.4.2)
rdoc (4.2.0)
rouge (2.0.7)     # Rouge : XCPretty Dependencies Syntax Highlighter
test-unit (3.0.8)
xcpretty (0.2.8)  # XCPretty : Pretty XCode Log

# Install Tools by npm
$ npm install -g appium-doctor authorize-ios deviceconsole ios-deploy ios-sim
$ sudo authorize-ios
# Check Appium Doctor
$ appium-doctor --ios

# npm : After
$ npm list -g --depth=0
/Users/Neo/.nodebrew/node/v6.10.3/lib
├── appium-doctor@1.4.2  # Appium Doctor : Can I Use Appium Checker
├── authorize-ios@1.0.5  # Authorize iOS : Authorize iOS
├── bower@1.8.0
├── cordova@7.0.1
├── deviceconsole@1.0.1  # Device Console : Pretty iOS Log
├── eslint@4.2.0
├── ios-deploy@1.9.1     # iOS Deploy : Install iOS App Without XCode
├── ios-sim@6.0.0        # iOS Sim : Launch iOS Sim Without XCode
└── npm@3.10.10

# Install Protractor And Appium
$ npm i -D protractor gulp-protractor wd wd-bridge appium
$ npm i -D gulp-shell jasmine-spec-reporter
```


## Author

[Neo](http://neo.s21.xrea.com/) ([@Neos21](https://twitter.com/Neos21))


## Links

- [Neo's World](http://neo.s21.xrea.com/)
- [Corredor](http://neos21.hatenablog.com/)
- [Murga](http://neos21.hatenablog.jp/)
- [El Mylar](http://neos21.hateblo.jp/)
- [Bit-Archer](http://bit-archer.hatenablog.com/)
- [GitHub - Neos21](https://github.com/Neos21/)
