/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    bower: {
      install: {
        options: {
          targetDir: './public/lib',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },
    // Task configuration.
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['public/lib/*/*.js','public/javascripts/**/*.js'],
        dest: 'public/dist/js_d.js'
      }
    },
    uglify: {
      options: {
        separator: ';'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'public/dist/js_d.min.js'
      }
    },
    cssmin: {
      options: {
        beautify: {
          ascii_only: true
        }
      },
      my_target: {
        files: [
          {
            'public/dist/css/style.css': ['public/stylesheets/*.css']
          }
        ]
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');

  // Default task.
  grunt.registerTask('default', [ 'cssmin','concat','uglify']);

  grunt.registerTask('bower', [ 'bower','concat','uglify']);

};
