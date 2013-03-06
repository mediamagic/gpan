# Google Panorama Montage

Download high resolution Google Streetview panorama images and stitch them together into a large panorama image

## Version
`1.1.1`

## Installation

`npm install gpan`

## Dependencies

This application depends on imagemagick and uses the montage binary to create a large image
from the separate image files downloaded via google api

## Disclaimer

This application makes use of an onducumented Google Maps API. While you may access them, there is no
guarantee that this API will not change in the future revisions to Google Maps.

## Example usage

```js
var gp = require("gpan")
	, tmpDir = '/path/to/tmp/dir'

//all settings are optional and default to the shown values
gp.init({ zoom_level:0				//panorama zoom level, default 0
		,	tiles_prefix:'image_'   //tile image prefix, useful for montage
		,	path_to_image:'panos'	//panorama will create this folder and store the panorama in it
		,	output_prefix:'output_'	//prefix for the panorama image
		, tmp_dir: 'gpan_tmp'		//temp folder prefix
		, pub: true					// path_to_image relative to app root or public folder
		})
//each setting can be changed after init
gp.set('zoom_level', 3);

//retrieve panorama image for Times Square, New York
gp.savePanorama('3q57BxQpP8dNzwD0R5PIzg', tmpDir, function(err,path){
	if(err)
		return handleError(err);
	console.log(path); //will return the path where the panorama montage is stored
});
```

## GNU GPL Licensed

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