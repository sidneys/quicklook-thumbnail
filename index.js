/**
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Sidney Bofah
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

/**
 * @module QuicklookThumbnail
 */

/**
 * Callback for generating thumbnails.
 *
 * @callback imageCallback
 * @param {Error} error - Error that occurred generating the image
 * @param {String} imageFilepath - Absolute path to the generated image
 */

/**
 * Generate a .png thumbnail image using the 'qlmanage' binary.
 *
 * @param {String} targetFilepath - Directory to place the thumbnails (Default: Directory of file)
 * @param {Object} imageOptions - Maximum width of the generated images in pixels (Default: 512)
 * @param {imageCallback} imageCallback - Called with result when process terminates
 */
var create = function(targetFilepath, imageOptions, imageCallback) {

    // Break early on missing filepath
    if (!targetFilepath || typeof targetFilepath !== 'string') {
        throw new ReferenceError('Error: Filepath requires a string.');
    }


    /** constant */
    var EXECUTABLE_NAME = 'qlmanage',
        THUMBNAIL_EXTENSION = '.png';

    /** Modules */
    var fs = require('fs'),
        path = require('path'),
        util = require('util'),
        which = require('npm-which'),
        execFile = require('child_process').execFile;

    /** @default **/
    var filepath = path.resolve(targetFilepath),
        options = {
            folder: path.resolve(path.dirname(targetFilepath)),
            size: 512
        },
        callback = function() {};

    /** @constant **/
    var imageExtension = THUMBNAIL_EXTENSION,
        command = which.sync(EXECUTABLE_NAME, { cwd: process.cwd() });

    /** Parameters **/
    var folder,
        size;


    // Parse arguments
    var position = 1;
    if (position < arguments.length && typeof arguments[position] === 'object') {
        options = util._extend(options, arguments[position]);
        position++
    } else if (position < arguments.length && arguments[position] == null) {
        position++;
    }

    if (position < arguments.length && typeof arguments[position] === 'function') {
        callback = arguments[position];
    } else {
        callback = function() {};
    }

    // Validate settings
    if (options.folder && typeof options.folder === 'string') {
        folder = path.normalize(options.folder);
    }
    if (options.size && typeof options.size === 'number') {
        size = options.size
    }


    // Check if file exists
    fs.stat(filepath, function(err) {
        if (!err) {
            // Create folder
            fs.mkdir(folder, function(err) {
                if (!err || (err && err.code == 'EEXIST')) {
                    // Generate image
                    execFile(command, ['-t', '-s', size, filepath, '-o', folder], function(err, stdout, stderr) {
                        // Workaround: qlmanage returns no 'stderr' on most errors
                        if (stdout && (stdout.indexOf("produced one thumbnail") > -1)) {
                            var imagePath = path.resolve(path.join(folder, path.basename(filepath)) + imageExtension),
                                imagePathFixed = path.resolve(path.join(folder, path.basename(filepath, path.extname(filepath))) + imageExtension);
                            // Rename image
                            fs.rename(imagePath, imagePathFixed, function(err) {
                                if (!err) {
                                    // Validate renamed image
                                    fs.stat(imagePathFixed, function(err) {
                                        if (!err) {
                                            // Success
                                            return callback(null, imagePathFixed);
                                        } else {
                                            // Error (image not found)
                                            return callback(err);
                                        }
                                    });
                                } else {
                                    // Error (renaming image)
                                    return callback(err);
                                }
                            });
                        } else {
                            // Error (generating image)
                            return callback(new Error("Error: " + stdout || err || stderr));
                        }
                    });
                } else {
                    // Error (creating folder)
                    return callback(err);
                }
            });
        } else {
            // Error (file not found)
            return callback(err);
        }
    });
};


/**
 * Exports
 */
exports = module.exports = {
    create: create
};
