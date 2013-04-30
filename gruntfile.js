module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  
    stylus:{
      compile:{
        options:{
          import: []
        },
        files:{
          'public/stylesheets/style.min.css': 'public/stylesheets/style.styl'
        }
      }
    },
    
    watch: {
      scripts: {
        files: ['public/stylesheets/**/*.styl'],
        tasks: ['default']
      }
    },
    
    uglify: {
      options:{
        mangle: false
      },
      my_target: {
        files: {
          'public/js/scripts.min.js': [
            'public/js/can.jquery.min.js',
            'public/js/app.js',
            'public/js/app/**/*.js']
        }
      }
    }
    
  });

  // Load the plugin that provides the "stylus" task.
  grunt.loadNpmTasks('grunt-contrib-stylus');
  
  // Load the plugin that provides the "watch" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['stylus', 'uglify']);

};