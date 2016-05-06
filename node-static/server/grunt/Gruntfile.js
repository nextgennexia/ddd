﻿module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		haml: {
		  dist: {
		    files: {
		      '../index.html': '../index.haml'
		    }
		  }
		},
		concat: {
			dist: {
				src: [
					'../Scripts/draft/*.js'
				],
				dest: '../Scripts/script.js',
			}
		},
		uglify: {
			build: {
				src: '../Scripts/script.js',
				dest: '../Scripts/script.min.js'
			}
		},
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'../Content/css/style.min.css': '../Content/scss/style.scss'
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%']
			},
			main: {
				src: '../Content/css/style.min.css',
				dest: '../Content/css/style.min.css'
			}
		},
		watch: {
			scripts: {
				files: ['../Scripts/draft/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false,
				},
			},
			scss: {
				files: ['../Content/scss/*.scss'],
				tasks: ['sass', 'autoprefixer'],
				options: {
					spawn: false,
				}
			},
			haml: {
			  files: ['../*.haml'],
			  tasks: ['haml'],
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-haml');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);

};