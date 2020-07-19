/*
 * grunt-my-first-plugin
 * https://github.com/htmlfactorycz/grunt-my-first-plugin
 *
 * Copyright (c) 2020 Vitalij Petráš
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var jsdom = require('jsdom');
  var JSDOM = jsdom.JSDOM;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('my_first_plugin', 'The best Grunt plugin ever.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      copyText: ''
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Check that the source file exists
      if (f.src.length === 0) {
        // Print a success message.
        grunt.log.warn('File "' + f.dest + '" does not exist.');
        return;
      }

      // init dom
      var dom = new JSDOM(grunt.file.read(f.src));
      var doc = dom.window.document;

      grunt.log.write(('Reading: ').green + f.src.toString());

      //calculate content length
      var paragraphs = doc.querySelectorAll('p');
      Array.prototype.forEach.call(paragraphs, function(el, i){
        var contentLength = el.textContent.length;
        el.setAttribute('data-content-length', contentLength);
      });

      //lazyload images
      var images = doc.querySelectorAll('img');
      Array.prototype.forEach.call(images, function(el, i){
        el.setAttribute('data-src', el.getAttribute('src'));
        el.classList.add('js-lazyload');
        el.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      });

      //append copyright to body
      var copy = doc.createElement("p");
      copy.textContent = options.copyText;
      doc.body.append(copy);

      var modifiedHtml = dom.serialize();

      // Write the destination file.
      grunt.file.write(f.dest, modifiedHtml);

      grunt.log.write('... ' + ('ok').green);
    });
  });
};