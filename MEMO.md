# Start Project
$ npm init
$ git init

# Install Bower
$ npm i -D bower
$ bower init

# Install AngularJS
$ bower i angular#1.6.5 --save
$ bower i angular-bootstrap --save

# Install Cordova
$ npm i -D cordova
$ cordova create AngularJSCordovaAppium com.example.angularjs.cordova.appium AngularJSCordovaAppium
$ cordova platform add ios
$ cordova platform add browser
$ cordova plugin add cordova-plugin-console
$ cordova plugin add cordova-plugin-statusbar
$ cordova plugin add cordova-plugin-browsersync

# Setup Gulp Scripts
$ npm i -D gulp gulp-load-plugins del run-sequence gulp-watch
# CSS
$ npm i -D gulp-sass gulp-sourcemaps
# JS
$ npm i -D browserify vinyl-source-stream babelify babel-preset-2015
# HTML
$ npm i -D gulp-inject wiredep