# Google Panorama Montage

Download high resolution Google Streetview panorama images and stitch them together into a large panorama image

## Version
`1.2.3`

## Installation

`npm install gpan`

## Dependencies

This application depends on imagemagick and uses the montage binary to create a large image
from the separate image files downloaded via google api

## Disclaimer

This application makes use of an onducumented Google Maps API. While you may access them, there is no
guarantee that this API will not change in the future revisions to Google Maps.

## Changes
* Changes in 1.2.3
	* updated Google API host - thanks to okofish https://github.com/okofish 
* Changes in 1.2.2
	* support for whitespaces in paths
	* proper looping of Object type config
	* Better path storage
	* *** Special thanks for these contributions to thomasjonas https://github.com/thomasjonas ***
* Changes in 1.2.1
	* fixed an issue where the montage would try to build the montage before all tiles were downloaded
* Changes in 1.2.0
    * `init()` and `set()` have merged into a single method `.config()`
    * `savePanorama()` now accepts a single pano_id or an array of pano_id's
    * gpan will now handle temporary files internally
    * gpan now depends on the `node-temp` library
* Fixes in 1.2.0
    * google cbk(x) api call are made to random numbers (0-4) to spread load
    * errors on google cbk calls will bubble up.

## Example usage

```js
var gp = require("gpan")

//all settings are optional and default to the shown values
gp.config({ zoom_level:0				//panorama zoom level, default 0
		, tiles_prefix:'image_'			//tile image prefix, useful for montage
		, path_to_image:'panos'			//panorama will create this folder and store the panorama in it
		, output_prefix:'output_'		//prefix for the panorama image
		, tmp_dir_prefix: 'gpan_tmp'	//temp folder prefix
		, pub: true						// path_to_image relative to app root or public folder
		})

//each setting can be changed separately
gp.config('zoom_level', 3);

//each setting value can be returned
var zoom = gp.config('zoom_level') // returns 3

//retrieve panorama image for Times Square, New York
gp.savePanorama('3q57BxQpP8dNzwD0R5PIzg', function(err,path){
	if(err)
		return handleError(err);
	console.log(path); //will return the full path to the panorama image
});
```

## License

Copyright (c) 2013 M.M. Alcobs LTD  licensed under the GNU GPL License
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
