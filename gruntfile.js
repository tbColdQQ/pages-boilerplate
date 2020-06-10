/*
 * @Descripttion: 
 * @version: 
 * @Author: jie.niu
 * @Date: 2020-06-10 10:12:23
 * @LastEditors: jie.niu
 * @LastEditTime: 2020-06-10 14:11:02
 */
const sass = require('sass')

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
        }
    })

    // grunt.registerMultiTask('test', function() {
    //     console.log(this.target, this.data)
    // })

    grunt.registerTask('test', ['bar'], function() {
        console.log(this)
    })

    grunt.loadNpmTasks('grunt-contrib-htmlmin')

    grunt.loadNpmTasks('grunt-contrib-clean')

    grunt.loadNpmTasks('grunt-sass')

    grunt.registerTask('default', ['clean', 'htmlmin', 'sass'])
}