const gulp = require('gulp');
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'browserify', 'del', 'run-sequence', 'vinyl-source-stream']
});
const cordova = require('cordova-lib').cordova;


// Default
// --------------------------------------------------------------------------------

/**
 * Default タスク : Gulp タスクの説明一覧を表示する
 * 
 * - main に記載したタスクのみが表示される
 * - main・description に存在しないタスクを記載すると無視される
 */
gulp.task('default', () => {
  $.description.help({
    main: ['build', 'emu', 'dev'],
    description: {
      'build': 'src ディレクトリのファイルをビルドし www ディレクトリに出力する',
      'dev'  : '開発用ライブリロードを開始する',
      'emu'  : 'ビルド後 iPhone7 シミュレータを起動する'
    }
  });
});


// Build
// --------------------------------------------------------------------------------

/**
 * ビルドタスク
 * 
 * - 各タスクが事前に呼び出す必要のあるタスクはこの Run-Sequence で管理する
 */
gulp.task('build', (callback) => {
  return $.runSequence(
    'del-www',
    ['css', 'js'],
    'html',
    callback
  );
});


/**
 * www ディレクトリへのビルド後 Cordova ビルドを行い iPhone7 シミュレータでアプリを起動する
 */
gulp.task('emu', (callback) => {
  return $.runSequence(
    'build',
    'cordova-emulate-iphone7',
    callback
  );
});


// Live-Reload
// --------------------------------------------------------------------------------

/**
 * 開発用ライブリロード
 * 
 * - 初回ビルド後 cordova-plugin-browsersync プラグインを準備し watch タスクを起動しておく
 */
gulp.task('dev', (callback) => {
  return $.runSequence(
    'build',
    'cordova-live-reload',
    'watch',
    callback
  );
});

/**
 * Cordova Browser ライブリロード
 * 
 * - cordova-plugin-browsersync プラグインにより Live-Reload が可能になっている
 * - プラグインの監視対象は ./www/ 配下であるため ./www/ ディレクトリへの更新ファイルの格納は watch タスクで行う
 */
gulp.task('cordova-live-reload', () => {
  return cordova.run({
    platforms: ['browser'],
    options: ['--live-reload']
  });
});

/**
 * 各ファイルの Watch タスク
 * 
 * - gulp.watch() は新規ファイルの監視ができないため Gulp-Watch を使用する
 * - ./src/ 配下のファイルが変更されると ./www/ に格納される各ビルドタスクが呼ばれ
 *   cordova-plugin-browsersync プラグインが ./www/ ディレクトリの変更を検知して Live-Reload を行う
 */
gulp.task('watch', () => {
  $.watch('./src/css/**/*.scss', () => {
    return gulp.start(['css'])
  });
  $.watch('./src/js/**/*.js', () => {
    return gulp.start(['js']);
  });
  $.watch('./src/index.html', () => {
    return gulp.start(['html'])
  });
})


// Build Tasks
// --------------------------------------------------------------------------------

/**
 * ./www/ ディレクトリを削除する
 */
gulp.task('del-www', () => {
  return $.del(['./www/']);
})

/**
 * ./src/css/ 内の SCSS ファイルを結合して CSS にトランスパイルし ./www/css/index.css に出力する
 * 
 * - Live-Reload を考慮し Gulp-Plumber を設定した
 * - ./src/css/index.scss で @import しているファイルが結合される
 * - ./www/css/index.css にソースマップをインライン出力するため Gulp-SourceMaps を使用する
 */
gulp.task('css', () => {
  return gulp
    .src(['./src/css/index.scss'])
    .pipe($.plumber(function(error) {
      return this.emit('end');
    }))
    .pipe($.sourcemaps.init())      // Include SourceMaps
    .pipe(                          // Compress SCSS
      $.sass({
        outputStyle: 'compressed'
      })
      .on('error', $.sass.logError)
    )
    .pipe($.sourcemaps.write())     // Write SourceMaps
    .pipe(gulp.dest('./www/css'));  // Output the index.css
});

/**
 * ./src/js/ 内の JS ファイルを結合して ES2015 から ES5 にトランスパイルし ./www/js/index.js に出力する
 * 
 * - Browserify の Transform に Babelify を設定する
 * - Babelify のプリセットに Babel-Preset-ES2015 を指定する
 * - Browserify は bundle() で実行される
 * - bundle() 後に形式を戻すため Vinyl-Source-Stream に流す
 * - bundle().on() で Live-Reload 時のエラーも回避できている
 */
gulp.task('js', () => {
  return $.browserify({              // Browserify Settings
    entries: ['./src/js/index.js'],  // Entry Point
    debug: true,                     // To Output SourceMaps
    transform: [                     // Browserify Transform Settings
      ['babelify', {                 // Babelify
        presets: ['es2015'],         // Babel-Preset-ES2015
        sourceMaps: true             // Output SourceMaps
      }]
    ]
  })
    .bundle()                        // Do Browserify!
    .on('error', function(error) {
      console.log(`Browserify Error : ${error.message}`);
      this.emit('end');
    })
    .pipe($.vinylSourceStream('index.js'))  // Transform to Vinyl
    .pipe(gulp.dest('./www/js'));           // Output the index.js
});

/**
 * ./src/index.html を編集し ./www/index.html を出力する
 * 
 * - html-inject → html-useref の順に呼び出す
 */
gulp.task('html', (callback) => {
  return $.runSequence(
    'html-inject',
    'html-useref',
    callback
  );
});

/**
 * ./src/index.html ファイル中の Wiredep 指定と Gulp-Inject 指定を解決し ./www/index.html を出力する
 * 
 * - 事前に css タスク・js タスクを実行し、./www/index.css・./www/index.js を出力しておくこと
 * 
 * - Wiredep で bower.json の dependencies に記載されている Bower Components を取得し
 *   その main ファイルを style 要素・ script 要素として出力する
 *   - Bower Components の main に記載されているファイルでは足りない場合は
 *     bower.json の overrides で別途修正する
 *   - CSS ファイルを style 要素として出力する場所には
 *     <!-- bower:css --> <!-- endbower --> を記載する
 *   - JS ファイルを script 要素として出力する場所には
 *     <!-- bower:js --> <!-- endbower --> を記載する
 *   - こうして生成された ./www/index.html の style 要素・script 要素の参照先は
 *     ../bower_components/ 配下を参照するようになっており
 *     このままではアセットを取り込めていないため html-useref タスクで調整する
 * - Gulp-Inject は引数の gulp.src で指定したファイル群を取得し
 *   それらを style 要素・script 要素として出力する
 *   - css タスク・js タスクで生成した index.css・index.js を決め打ちしているが glob 指定も可能
 *   - CSS ファイルを style 要素として出力する場所には
 *     <!-- inject:css --> <!-- endinject --> を記載する
 *   - JS ファイルを script 要素として出力する場所には
 *     <!-- inject:js --> <!-- endinject --> を記載する
 *   - こうして生成された ./www/index.html の style 要素・script 要素の参照先は
 *     ../www/ という冗長的なパス指定になっているため html-useref タスクで調整する
 */
gulp.task('html-inject', () => {
  const wiredep = require('wiredep').stream;
  
  return gulp
    .src('./src/index.html')
    .pipe(wiredep())            // Wiredep : Bower dependencies
    .pipe($.inject(             // Gulp-Inject : Inject JS / CSS
      gulp.src([
        './www/css/index.css',
        './www/js/index.js'
      ]),
      { relative: true }
    ))
    .pipe(gulp.dest('./www'));  // Output the index.html
});

/**
 * ./www/index.html の Gulp-Useref 部分を結合し1つの CSS・JS ファイルを生成する
 * 
 * - 事前に html-inject タスクを実行し ./www/index.html を出力しておくこと
 * 
 * - Gulp-Useref は HTML 中のコメントで囲んだ style 要素・script 要素のファイルを結合し
 *   1つの CSS・JS ファイルを読み込む style 要素・script 要素に HTML を書き換える
 *   - CSS ファイル群を結合して1ファイルの style 要素読み込みにしたい場所には
 *     <!-- build:css css/OUTPUT.css --> <!-- endbuild --> を記載する
 *   - JS ファイル群を結合して1ファイルの script 要素読み込みにしたい場所には
 *     <!-- build:js js/OUTPUT.js --> <!-- endbuild --> を記載する
 *   - これを Wiredep で挿入した Bower Components の CSS・JS に適用すると
 *     複数ファイルを結合して vendor.css・vendor.js の2ファイルを生成し
 *     HTML 中の style 要素・script 要素もこの2ファイルを読み込むよう書き換えてくれる
 *   - Gulp-Inject で挿入した index.css・index.js に Gulp-Useref を適用すると
 *     ../www/ と冗長的に出力されていたパスを css/・js/ と修正してくれる
 */
gulp.task('html-useref', () => {
  return gulp
    .src('./www/index.html')    // Source HTML File
    .pipe($.useref())           // Gulp-Useref
    .pipe(gulp.dest('./www'));  // Outout the index.html
});

/**
 * $ cordova emulate --target=iPhone-7 を実行する
 */
gulp.task('cordova-emulate-iphone7', () => {
  return cordova.emulate({
    'platforms': ['ios'],
    'options': ['--target=iPhone-7']
  });
});
