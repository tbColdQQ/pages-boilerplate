/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-06-10 10:07:20
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-06-12 18:47:47
 */

const del = require('del')
    /**
     * src: 源文件/目录
     * dest: 目标文件/目录
     * parallel: 并行任务
     * series: 串行任务
     * watch: 监听
     */
const { src, dest, parallel, series, watch } = require('gulp')

// 实现这个项目的构建任务
// yarn gulp test
exports.test = done => {
    console.log('gulp test')
    done()
}

// yarn gulp 命令默认执行default任务
exports.default = done => {
    console.log('gulp two')
    done()
}

const clean = async done => {
    // 方式一
    await del.sync(['temp', 'dist'])
    done() // 如果不执行done()，gulp会认为任务没有完成，会出现错误提示信息，但del操作已经完成

    // 方式二
    // return del('dist/assets/styles')
}

const sass = require('gulp-sass')
const style = done => {
    // src 中的options选项，配置base可将文件所在的目录同时拷贝到目标目录下
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass({ outputStyle: 'expanded' })) // expanded 可以将样式文件内的括号展开，而不是与最后属性在同一行
        .pipe(dest('temp'))
}

const babel = require('gulp-babel')
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'))
}

const swig = require('gulp-swig')
const data = {
    pkg: require('./package.json')
}
const page = () => {
    return src('src/**/*.html', { base: 'src' })
        .pipe(swig({ data }))
        .pipe(dest('temp'))
}

const imagemin = require('gulp-imagemin')
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}

const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const font = done => {
    // setTimeout(() => {
    //     src('src/assets/fonts/**', { base: 'src' })
    //         .pipe(imagemin())
    //         .pipe(dest('dist'))
    //     done()
    // }, 2000)
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))

}

const useref = require('gulp-useref')
const g_if = require('gulp-if')
const uglify = require('gulp-uglify')
const cleancss = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const ur = () => {
    return src('temp/**/*.html', { base: 'temp' })
        .pipe(useref({ searchPath: ['temp', '.'] }))
        .pipe(g_if(/\.js$/, uglify()))
        .pipe(g_if('/\.css$/', cleancss()))
        .pipe(g_if(/\.html$/, htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })))
        .pipe(dest('dist'))
}

const browserSync = require('browser-sync')
const bs = browserSync.create()
const server = () => {
    // watch('src/**/*.html')
    bs.init({
        notify: false, // 关闭页面中的提示
        port: 8888,
        open: false, // 取消自动打开浏览器
        server: {
            baseDir: 'dist',
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const build1 = series(clean, parallel(style, script, page, font, image, extra))

const build = series(clean, parallel(series(parallel(page, script, style), ur), font, image, extra))

const test = series(clean, font)

module.exports = {
    style,
    clean,
    build1,
    build,
    test,
    ur,
    server
}