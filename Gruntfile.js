/* jshint node:true */
module.exports = function( grunt ){
	'use strict';

	grunt.initConfig(
		{

			// Store project settings.
			pkg: grunt.file.readJSON( 'package.json' ),

			// Setting folder templates.
			dirs: {
				js: 'assets/js',
				css: 'assets/css'
			},

			// JavaScript linting with JSHint.
			jshint: {
				options: {
					jshintrc: '.jshintrc'
				},
				all: [
				'Gruntfile.js'
				]
			},

			replace: {
				dist: {
					options: {
						patterns: [
						{
							match: '{version}',
							replacement: '<%= pkg.version %>'
						}
						]
					},
					files: [
					{
						expand: true, flatten: true, src: ['src/*.php'], dest: 'src/'
					}
					]
				}
			},

			// Sass linting with Stylelint.
			stylelint: {
				options: {
					stylelintrc: '.stylelintrc'
				},
				all: [
				'<%= dirs.css %>/*.scss'
				]
			},

			// Compile all .scss files.
			sass: {
				options: {
					sourcemap: 'none',
					implementation: require( 'node-sass' )
				},
				compile: {
					files: [{
						expand: true,
						cwd: '<%= dirs.css %>/',
						src: ['*.scss'],
						dest: '<%= dirs.css %>/',
						ext: '.css'
					}]
				}
			},

			// Minify all .css files.
			cssmin: {
				minify: {
					expand: true,
					cwd: '<%= dirs.css %>/',
					src: ['*.css'],
					dest: '<%= dirs.css %>/',
					ext: '.css'
				}
			},

			// Minify all .js files
			uglify: {
				options:{
					sourcemap: 'none',
				},
				target: {
					files:[{
						expand: true,
						cwd: '<%= dirs.js %>/admin',
						src: [
							'*.js',
							'!*.min.js',
							'!gutenberg.js',
							'!settings.js',
							'!placeholder.js',
							'!review.js'
						],
						dest: '<%= dirs.js %>/admin',
						ext: '.min.js'

					}],
				},
			},

			// Watch changes for assets.
			watch: {
				css: {
					files: [
					'<%= dirs.css %>/*.scss'
					],
					tasks: ['sass', 'rtlcss', 'postcss', 'cssmin']
				}
			},

			// Generate POT files.
			makepot: {
				options: {
					type: 'wp-plugin',
					domainPath: 'languages',
					potHeaders: {
						'report-msgid-bugs-to': '',
						'language-team': 'LANGUAGE <EMAIL@ADDRESS>'
					}
				},
				dist: {
					options: {
						potFilename: 'wp-frontend-delete-account.pot',
						exclude: [
						'vendor/.*'
						]
					}
				}
			},

			// Add Textdomain.
			addtextdomain: {
				options: {
					textdomain: '<%= pkg.name %>',
					updateDomains: ['wp-frontend-delete-account']
				},
				target: {
					files: {
						src: [
						'**/*.php',         // Include all files
						'!node_modules/**', // Exclude node_modules/
						'!vendor/**'        // Exclude vendor/
						]
					}
				}
			},

			// Check textdomain errors.
			checktextdomain: {
				options: {
					text_domain: '<%= pkg.name %>',
					keywords: [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'esc_html__:1,2d',
					'esc_html_e:1,2d',
					'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d',
					'esc_attr_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d'
					]
				},
				files: {
					src: [
					'**/*.php',               // Include all files
					'!includes/libraries/**', // Exclude libraries/
					'!node_modules/**',       // Exclude node_modules/
					'!vendor/**'              // Exclude vendor/
					],
					expand: true
				}
			},

			// PHP Code Sniffer.
			phpcs: {
				options: {
					bin: 'vendor/bin/phpcs'
				},
				dist: {
					src:  [
					'**/*.php',               // Include all files
					'!includes/libraries/**', // Exclude libraries/
					'!node_modules/**',       // Exclude node_modules/
					'!vendor/**'              // Exclude vendor/
					]
				}
			},

			// Autoprefixer.
			postcss: {
				options: {
					processors: [
					require( 'autoprefixer' )(
						{
							browsers: [
							'> 0.1%',
							'ie 8',
							'ie 9'
							]
						}
					)
				]
				},
				dist: {
					src: [
					'<%= dirs.css %>/*.css'
					]
				}
			},

			// Compress files and folders.
			compress: {
				options: {
					archive: '<%= pkg.name %>.zip'
				},
				files: {
					src: [
					'**',
					'!.*',
					'!*.md',
					'!*.zip',
					'!.*/**',
					'!phpcs.xml',
					'!Gruntfile.js',
					'!package.json',
					'!composer.json',
					'!composer.lock',
					'!node_modules/**',
					'!package-lock.json',
					'!webpack.config.js',
					'!vendor/composer/installers/**'
					],
					dest: '<%= pkg.name %>',
					expand: true
				}
			}
		}
	);

	// Load NPM tasks to be used here
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-phpcs' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-rtlcss' );
	grunt.loadNpmTasks( 'grunt-postcss' );
	grunt.loadNpmTasks( 'grunt-stylelint' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-checktextdomain' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	grunt.loadNpmTasks( 'grunt-replace' );

	// Register tasks
	grunt.registerTask(
		'default',
		[
		'css',
		'i18n',
		'replace'
		]
	);

	grunt.registerTask(
		'css',
		[
		'sass',
		'postcss',
		'cssmin'
		]
	);

	// Only an alias to 'default' task.
	grunt.registerTask(
		'dev',
		[
		'default'
		]
	);

	grunt.registerTask(
		'zip',
		[
		'dev',
		'compress'
		]
	);

	grunt.registerTask(
		'i18n',
		[
		'checktextdomain',
		'makepot'
		]
	);
};
