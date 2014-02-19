module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dir:{
      publish:'public',
      build:'app/build',
      src:'app/resources',
      vendor:'app/bower_modules',
      jslibs:'app/resources/jslibs'
    },
    vendor: {
      js: [
      '<%= dir.vendor %>/jquery/jquery.min.js',
      '<%= dir.vendor %>/bootstrap-sass/vendor/assets/javascripts/bootstrap/button.js',
      '<%= dir.vendor %>/bootstrap-sass/vendor/assets/javascripts/bootstrap/dropdown.js',
      '<%= dir.vendor %>/bootstrap-sass/vendor/assets/javascripts/bootstrap/tab.js',
      '<%= dir.vendor %>/bootstrap-sass/vendor/assets/javascripts/bootstrap/tooltip.js',
      '<%= dir.vendor %>/underscore/underscore-min.js',
      ],
      jslibs: [
      '<%= dir.jslibs %>/paginate.min.js'
      ]
    },
    clean:{
      build:[
      '<%= dir.build %>/css',
      '<%= dir.build %>/fonts',
      '<%= dir.build %>/img',
      '<%= dir.build %>/bin',
      '<%= dir.build %>/js',
      '<%= dir.build %>/libs',
      ],
      publish:[
      '<%= dir.publish %>/css',
      '<%= dir.publish %>/fonts',
      '<%= dir.publish %>/img',
      '<%= dir.publish %>/js',
      ]
    },
    concat: {
      options: {
        separator: ';',
        stripBanners:true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      libs:{
       src: ['<%= vendor.js %>'],
       dest: '<%= dir.build %>/bin/libs.js',
       nonull:true
     }
   },
   uglify: {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    },
    libs: {
      files: {
        '<%= dir.publish %>/js/libs.min.js': ['<%= concat.libs.dest %>']
      }
    },
     dist: {
      files: [{
        expand: true,
        src: '**/*.js',
        dest: '<%= dir.publish %>/js',
        cwd: '<%= dir.src %>/js'
      }]
    }
  },
  qunit: {
    files: ['test/**/*.html']
  },
  jshint: {
    files: ['gruntfile.js', '<%= dir.src %>/**/*.js', 'test/**/*.js'],
    options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      css: {
        files: ['<%= dir.src %>/sass/**/*.scss'],
        tasks: ['compass','copy:publish'],
      },
      img: {
        files: ['<%= dir.src %>/img/**/*'],
        tasks: ['copy'],
      },
      fonts: {
        files: ['<%= dir.src %>/fonts/*','<%= dir.src %>/sass/**/{*.eot,*.svg,*ttf,*woff,*.otf}'],
        tasks: ['copy'],
      },
      html: {
        files: ['<%= dir.src %>/**/*.html','<%= dir.src %>/**/*.php'],
        tasks: ['copy'],
      },
      js_modules: {
        files: ['<%= dir.src %>/js/*.js'],
        tasks: ['copy:modules'],
      },
      js_libs: {
        files: ['<%= dir.src %>/js/libs/**/*.js'],
        tasks: ['concat','uglify'],
      }
    },
    copy: {
      build: {
        files: [
        {expand: true, cwd:'<%= dir.src %>', src: ['img/**','fonts/**'], dest: '<%= dir.build %>'},
        {expand: true, flatten:true,src: ['<%= dir.src %>/sass/**/{*.eot,*.svg,*ttf,*woff,*.otf}','<%= dir.vendor %>/**/{*.eot,*.svg,*ttf,*woff,*.otf}'], dest: '<%= dir.build %>/fonts',filter: 'isFile'},
        {expand: true, flatten:true ,src: '<%= vendor.js %>', dest: '<%= dir.build %>/libs',filter: 'isFile'}
        ]
      },
      publish: {
        files: [
        {expand: true, cwd:'<%= dir.build %>/', src: ['img/**','fonts/**','js/**'], dest: '<%= dir.publish %>/'},
        {expand: true, flatten:true ,src: '<%= dir.build %>/css/**/*.css', dest: '<%= dir.publish %>/css',filter: 'isFile'},
        {expand: true, flatten:true ,src: '<%= dir.build %>/fonts/**/{*.eot,*.svg,*ttf,*woff,*.otf}', dest: '<%= dir.publish %>/fonts',filter: 'isFile'}
        ]
      },
      modules: {
        files: [
        {expand: true, flatten:true ,src: '<%= dir.src %>/js/**/*.js', dest: '<%= dir.publish %>/js',filter: 'isFile'}
        ]
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: '<%= dir.src %>/sass',
          cssDir: '<%= dir.build %>/css',
          environment: 'production',
          raw: "preferred_syntax = :scss\n",
          outputStyle: "compressed"
        }
      }
    },
  });

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-qunit');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-compass');

grunt.registerTask('test', ['jshint', 'qunit']);
grunt.registerTask('default', ['build']);
grunt.registerTask('build', ['jshint','clean','compass','copy','concat','uglify']);

};