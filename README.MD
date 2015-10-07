quicklook-thumbnail
====================================

**Use NodeJS to generate thumbnail images for all QuickLook-enabled filetypes (e.g. .mp4 videos, iMessage transcripts, text files) on Apple OSX.**


Contents
----

1. [Supported Platforms](#supported-platforms)
1. [Requirements](#requirements)
1. [Installation](#installation)
1. [Usage](#usage)
1. [API](#api)
1. [Limitations](#limitations)
1. [Roadmap](#roadmap)
1. [Author](#author)
1. [License](#license)


<a name="supported-platforms"></a>Supported Platforms
----
 
Tested on OSX 10.10 and 10.11


<a name="requirements"></a>Requirements
----

Node 4.0.0+

 
## <a name="installation"></a>Installation

```sh
npm install quicklook-thumbnail --save
```


## <a name="usage"></a>Usage

Require the module, then call the asynchronous *create()* method:

```javascript
thumbnail = require('quicklook-thumbnail');

var options = {
      size: 256,
      folder: '/Users/johnqpublic/Documents'
};

thumbnail.create('/Users/johnqpublic/Desktop/video.mp4', options, function(err, result){
  if (err) throw (err);
  console.log("Created thumbnail at: " + result);
})
```


<a name="api"></a>API
----

### #create()

```javascript
create: function (file, options, callback)
```

Creates a .png image thumbnail of the provided file.

- Parameters
   - **file** (String) - Absolute path to the video file
   - **options** (Object)
      - *folder* (String) - Directory to place the thumbnails (*Default: Directory of file*)
      - *size* (Number) - Maximum width of the generated images in pixels (*Default: 512*)
   - **callback** (Function) - Called with result when process terminates
      - *error* (Error)
      - *path* (String) - Absolute path to generated image


<a name="limitations"></a>Limitations
----

This module can only generate thumbnails for files supported by the [Apple OS X Quick Look framework](https://developer.apple.com/library/mac/documentation/UserExperience/Conceptual/Quicklook_Programming_Guide/Introduction/Introduction.html). Only PNG is supported as output image format.

Apart from h264 video files in mp4 containers (and many other media files) a multitude of document formats is supported out of the box.

For a list of all supported filetypes, please feel free to refer to [Wikipedia](https://en.wikipedia.org/wiki/Quick_Look#Supported_file_types_by_default).


<a name="roadmap"></a>Roadmap
----
 - Tests


<a name="author"></a>Author
----
Sidney Bofah  


<a name="license"></a>License
----

MIT
