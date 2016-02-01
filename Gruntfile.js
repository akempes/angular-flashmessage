/*global module, require*/

module.exports = function (grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: {
      src: 'src',
      dist: 'dist',
      tmp: '.tmp'
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/**/*'
          ]
        }]
      }
    },

    // A multi-task to validate your JavaScript files with JSLint.
    jslint: {
      scripts: {
        src: ['<%= config.src %>/flashmessage.js'],
        directives: {
          predef: ['angular','document','window','console'],
          white: true,
          regexp: true,
          newcap: true,
          todo: true
        }
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          src: '<%= config.dist %>/flashmessage.js',
          dest: ''
        }]
      }
    },

    // Minify files with UglifyJS.
    uglify: {
      build: {
        files: {
          '<%= config.dist %>/flashmessage.min.js': ['<%= config.dist %>/flashmessage.js']
        }
      }
    },

    // Compress CSS files.
    cssmin: {
      build: {
        files: {
          '<%= config.dist %>/flashmessage.min.css': ['<%= config.src %>/flashmessage.css']
        }
      }
    },

    // Copy files and folders.
    copy: {
      build: {
        expand: true,
        cwd: '<%= config.src %>/',
        src: '**',
        dest: '<%= config.dist %>/',
        flatten: true
      }
    }

  });

  grunt.registerTask('build', [
    'clean',
    'jslint',
    'copy',
    'ngAnnotate',
    'uglify',
    'cssmin'
  ]);

};
