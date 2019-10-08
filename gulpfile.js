const gulp = require('gulp')
const Fse = require('fs-extra')
const _ = require('lodash')
const base64 = require('gulp-base64')
const rename = require('gulp-rename')
const less = require('gulp-less')
const plumber = require('gulp-plumber')
const changed = require('gulp-changed')

const NODE_ENV = process.env.NODE_ENV

const colorStyle = {
  'blue': ['\x1B[34m', '\x1B[39m'],
  'green': ['\x1B[32m', '\x1B[39m']
};

// 源目录
const srcDir = {
  file: [
    './src/**/*.*',
    '!./src/**/*.less',
    '!./src/conf.*.js',
    '!./src/config/*.js'
  ],
  config: [
    './src/conf.*.js'
  ],
  less: [
    `./src/**/*.less`,
    `./src/*.less`
  ]
}

// 输出目录
const SRC = './src'
const distDir = './dist'

const CONF_BASE_PATH = `${SRC}/conf.base`
const CONF_DEV_PATH = `${SRC}/conf.dev`
const CONF_TEST_PATH = `${SRC}/conf.test`
const CONF_PROD_PATH = `${SRC}/conf.pro`

let baseConf = require(CONF_BASE_PATH)
let devConf = require(CONF_DEV_PATH)
let testConf = require(CONF_TEST_PATH)
let prodConf = require(CONF_PROD_PATH)


gulp.task('file', () => {
  return gulp.src(srcDir.file)
    .pipe(changed(distDir))
    .pipe(gulp.dest(distDir))
    .on('end', () => {
      console.log(colorStyle['green'][0] + '> File complite!' + colorStyle['green'][1])
    })
})
// gulp.task('file:change', (file, file2) => {
//   console.log(file, file2)
//   return gulp.src(srcDir.file)
//     .pipe(changed(distDir))
//     .on('end', () => {
//       console.log(colorStyle['green'][0] + '> File changed complite!' + colorStyle['green'][1])
//     })
// })
gulp.task('file:watch', () => {
  console.log('file change')
  return gulp.watch(srcDir.file, gulp.series(['file']))
})

gulp.task('less', (file) => {
  return gulp.src(srcDir.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(base64({
      extensions: [/\.png#datauri$/i, /\.jpg#datauri$/i],
      maxImageSize: 10 * 1024
    }))
    .pipe(rename({extname: '.wxss'}))
    .pipe(gulp.dest(distDir))
    .on('end', () => {
      if(file){
        console.log(colorStyle['green'][0] + '> WXSS Complite: ' + colorStyle['green'][1] + file.path + ' to wxss complite!')
      }else{
        console.log(colorStyle['green'][0] + '> Less to wxss complite!' + colorStyle['green'][1])
      }
    })
})
gulp.task('less:watch', () => {
  console.log('less change')
  return gulp.watch(srcDir.less, gulp.series(['less']))
})

gulp.task('clean', () => {
  return Fse.emptyDir(distDir)
})

// 清除config文件的缓存
gulp.task('config:reload', done => {
  delete require.cache[require.resolve(CONF_BASE_PATH)]
  delete require.cache[require.resolve(CONF_DEV_PATH)]
  delete require.cache[require.resolve(CONF_PROD_PATH)]

  baseConf = require(CONF_BASE_PATH)
  devConf = require(CONF_DEV_PATH)
  prodConf = require(CONF_PROD_PATH)

  done()
})

gulp.task('config:env', () => {
  const envConfig = {
    dev: _.merge({}, baseConf.env, devConf.env),
    test: _.merge({}, baseConf.env, testConf.env),
    pro: _.merge({}, baseConf.env, prodConf.env)
  }[NODE_ENV]
  envConfig.GOOD_PRODUCT_ON = false
  const envStr = JSON.stringify(envConfig, null, 2)
  return Fse.outputFile(`${distDir}/config/index.js`,
    `module.exports = ${envStr}`
    , { spaces: 2 })
})

// config/index.js配置, 带好物圈插件
gulp.task('config:env:plugin', () => {
  const envConfig = {
    dev: _.merge({}, baseConf.env, devConf.env),
    test: _.merge({}, baseConf.env, testConf.env),
    pro: _.merge({}, baseConf.env, prodConf.env)
  }[NODE_ENV]
  envConfig.GOOD_PRODUCT_ON = true
  envConfig.MP_VERSION = `${envConfig.MP_VERSION}.plugin`
  const envStr = JSON.stringify(envConfig, null, 2)
  return Fse.outputFile(`${distDir}/config/index.js`,
    `module.exports = ${envStr}`
    , { spaces: 2 })
})

// app.json配置
gulp.task('config:app', () => {
  let appConfig = {
    dev: _.merge({}, baseConf.app, devConf.app),
    test: _.merge({}, baseConf.app, testConf.app),
    pro: _.merge({}, baseConf.app, prodConf.app)
  }[NODE_ENV]
  delete appConfig.plugins
  delete appConfig.usingComponents['share-button']
  return Fse.outputJSON(`${distDir}/app.json`, appConfig, { spaces: 2 })
})

// app.json配置, 带好物圈插件
gulp.task('config:app:plugin', () => {
  const appConfig = {
    dev: _.merge({}, baseConf.app, devConf.app),
    test: _.merge({}, baseConf.app, testConf.app),
    pro: _.merge({}, baseConf.app, prodConf.app)
  }[NODE_ENV]
  return Fse.outputJSON(`${distDir}/app.json`, appConfig, { spaces: 2 })
})

gulp.task('config:ext', () => {
  const minaExtConfig = {
    dev: _.merge({}, baseConf.ext, devConf.ext),
    test: _.merge({}, baseConf.ext, testConf.ext),
    pro: _.merge({}, baseConf.ext, prodConf.ext)
  }[NODE_ENV]
  return Fse.outputJSON(`${distDir}/ext.json`, minaExtConfig, { spaces: 2 })
})

gulp.task('config:project', () => {
  const minaProjectConfig = {
    dev: _.merge({}, baseConf.project, devConf.project),
    test: _.merge({}, baseConf.project, testConf.project),
    pro: _.merge({}, baseConf.project, prodConf.project)
  }[NODE_ENV]
  return Fse.outputJSON(`${distDir}/project.config.json`, minaProjectConfig, {
    spaces: 2
  })
})

gulp.task('config', gulp.series(['config:reload', 'config:env', 'config:app', 'config:ext', 'config:project']))
gulp.task('config:plugin', gulp.series(['config:reload', 'config:env:plugin', 'config:app:plugin', 'config:ext', 'config:project']))

gulp.task('config:watch', () => {
  gulp.watch(
    srcDir.config,
    gulp.series(['config:plugin'])
  )
})

// development下编译
const buildTasks = ['clean', 'config', 'file', 'less']
const buildPluginTasks = ['clean', 'file', 'less', 'config:plugin']
const watchTasks = ['file:watch', 'less:watch', 'config:watch']
gulp.task('dev', gulp.series(buildPluginTasks, gulp.parallel(watchTasks)), () => {
  console.log('complete')
})

// product下编译
gulp.task('build', gulp.series(buildTasks))
// product下编译带插件版本的
gulp.task('build:plugin', gulp.series(buildPluginTasks))