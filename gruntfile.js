/*global module */
module.exports = function (grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jslint: {
            all: {
               src: ['<%= pkg.folders.src %>/**/*.js'],
               directives: {
                   browser: true,
                   predef: [
                       'rdfx',
                       'SparkMD5',
                       'Uint8Array',
                       'FileReader' // remove when jshint catches up
                   ]
               }
            }
        },

        copy: {
            main: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        src: [
                            '<%= pkg.folders.src %>/**/*.html',
                            '<%= pkg.folders.src %>/**/*.js',
                            '<%= pkg.folders.src %>/**/*.css',
                            '<%= pkg.folders.src %>/**/*.png'
                        ],
                        dest: '<%= pkg.folders.build %>/',
                        filter: 'isFile',
                        flatten: true
                    },

                ]
            }
        },

        uglify: {
            my_target: {
                files: {
                    '<%= pkg.folders.build %>/<%= pkg.name %>.min.js': ['<%= pkg.folders.src %>/**/*.js']
      			}
    		}
  		},

        watch: {
            files: ['<%= pkg.folders.src %>/**/*'],
            tasks: ['default'],
            options: {
                livereload: true
            }
        },

        'gh-pages': {
            options: {
                base: '<%= pkg.folders.build %>'
            },
            src: ['**']
        }

    });

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-gh-pages');

    grunt.registerTask('default', ['jslint', 'uglify', 'copy']);

};
