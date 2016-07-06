'use strict';

var path = require('path');

// Test data
var videoFilepath = './test.mp4',
    options = {
        folder: '/tmp',
        size: 512
    };

var quicklookThumbnail = require('../');

quicklookThumbnail.create(videoFilepath, options, function(err, result) {
   
})