/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-06-10 10:07:20
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-06-11 17:55:45
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

const clean = done => {
    // 方式一
    del('dist')
    done() // 如果不执行done()，gulp会认为任务没有完成，会出现错误提示信息，但del操作已经完成

    // 方式二
    // return del('dist/assets/styles')
}

const sass = require('gulp-sass')
const style = done => {
    // src 中的options选项，配置base可将文件所在的目录同时拷贝到目标目录下
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass({outputStyle: 'expanded'}))  // expanded 可以将样式文件内的括号展开，而不是与最后属性在同一行
        .pipe(dest('dist'))
}

const babel = require('gulp-babel')
const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(babel({ presets: ['@babel/preset-env']}))
        .pipe(dest('dist'))
}

const swig = require('gulp-swig')
const data = {
    pkg: require('./package.json')
}
const page = () => {
    return src('src/**/*.html', { base: 'src' })
        .pipe(swig({ data }))
        .pipe(dest('dist'))
}

const imagemin = require('gulp-imagemin')
const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}

const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}

const test = series(clean, parallel(style, script, page))

module.exports = {
    style,
    clean,
    test
}