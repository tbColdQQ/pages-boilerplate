/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-06-10 10:12:23
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-06-10 14:11:02
 */
const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')

module.exports = grunt => {
    grunt.registerTask('foo', () => {
        console.log('grunt foo task')
    })

    grunt.registerTask('async-task', function() {
        const done = this.async()
        setTimeout(() => {
            console.log('grunt async task')
            done()
        }, 5000)
    })

    grunt.registerTask('bad-task', () => {
        console.log('grunt bad task')
        return false
    })

    // grunt.registerTask('default', ['foo', 'bad-task', 'async-task'])

    grunt.initConfig({
        foo: () => {
            console.log('config task foo child task')
        },
        bar: 1,
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.html', '*.html'],
                    dest: 'dist'
                }]
            }
        },
        clean: {
            temp: 'dist'
        },
        sass: {
            options: {
                sourceMap: true,
                implementation: sass,
            },
            main: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['assets/styles/*.scss'],
                    dest: 'dist'
                }]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/js/main.js': 'src/assets/scripts/main.js'
                }
            }
        },
        uglify: {
            main: {
                options: {
                    mangle: true, //混淆变量名
                    comments: false //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dist',
                        src: ['js/*.js'],
                        dest: 'dist'
                    }
                ]
            }
        },
        imagemin: {
            main: {
                options: {
                    optimizationLevel: 7,
                    pngquant: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/images/*.{png,jpg,jpeg,gif,webp,svg}'],
                        dest: 'dist'
                    }
                ]
            }
        },
        copy: {
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['assets/fonts/*'],
                        dest: 'dist'
                    }
                ]
            }
        }
    })

    // grunt.registerMultiTask('test', function() {
    //     console.log(this.target, this.data)
    // })

    grunt.registerTask('test', ['bar'], function() {
        console.log(this)
    })

    // grunt.loadNpmTasks('grunt-contrib-htmlmin')

    // grunt.loadNpmTasks('grunt-contrib-clean')

    // grunt.loadNpmTasks('grunt-sass')

    // yarn add grunt-babel @babel/core @babel/preset-env
    // grunt.loadNpmTasks('grunt-babel')

    loadGruntTasks(grunt)

    grunt.registerTask('default', ['clean', 'htmlmin', 'sass', 'babel', 'uglify', 'imagemin', 'copy'])
}