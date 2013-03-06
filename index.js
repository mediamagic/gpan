var http 			= require('http')
	,	fs 				= require('fs')
	,	exec 			= require('child_process').exec
	, path 			= require('path')
	, homeRoot 	= process.cwd() + '/'
	, settings 	= 	{	zoom_level:0
									,	tiles_prefix:'image_'
									,	path_to_image:'panos'
									,	output_prefix:'output_'
									, tmp_dir: 'gpan_tmp'
									, pub: true
									}


exports.version = '1.1.1';

exports.init = function(obj){
	for (var i in obj)
		settings[i] = obj[i];
}
exports.set = function(key, value){
	settings[key] = value;
}

exports.savePanorama = function(panoId, tmp_dir, cb) {
	var panoramaRule 		= getPanoramaZoom(settings.zoom_level)
		, currentImageNum = 0
		, pub 						= (settings.pub) ? '/public/' : '/' 
		, imagePath				= global.root + pub + settings.path_to_image +'/'

	if (typeof(tmp_dir) === 'function') {
		var tmpDir = settings.tmp_dir;
		cb = tmp_dir;
	} else
		tmpDir = tmp_dir;

	for(var y =0; y <= panoramaRule.y; y++) {
		for(var x =0; x <= panoramaRule.x; x++) {
			currentImageNum++;
			saveTile(panoId, x, y, padNumber(currentImageNum, 3), tmpDir, function(err, _x, _y) {
				if (err)
					return cb(err);
				if(_x == panoramaRule.x && _y == panoramaRule.y) {
					var command = 'montage '
											+ tmpDir + '/' + settings.tiles_prefix + '*.jpg -tile '
											+ (panoramaRule.x + 1) + 'x' + (panoramaRule.y + 1)
											+ ' -geometry 512x512 -quality 100 '
											+ imagePath +settings.output_prefix	+ panoId + '.jpg';
					ensureDir(imagePath, function(e){
						if (err)
							return cb(err, null);
						exec(command, function(err, stdout, stderr) {
							return cb(err, imagePath + settings.output_prefix + panoId + '.jpg');
						});
					});
				}
			});
		}
	}
}

var saveTile = function(panoId, x, y, imageNumber, tmpDir, cb) {
	var options = {	host: 'cbk0.google.com'
								,	port: 80
								,	path: '/cbk?output=tile&zoom='
									+ settings.zoom_level
									+ '&x=' + x + '&y=' + y
									+ '&panoid=' + panoId
								}
	http.get(options, function(resp){
		var image = '';
		resp.setEncoding('binary');
		resp.on('data', function(chunk){
			image += chunk;
		});
		resp.on('end', function(r) {
			var inputPath = path.join(tmpDir, settings.tiles_prefix+imageNumber+'.jpg');
			fs.writeFile(inputPath, image, 'binary', function(err){
				if (err) 
					return cb(err, null, null)
				cb(null, x, y);
			});
		});
	}).on("error", function(e){
		console.log("Got error: " + e.message);
	});
}

var getPanoramaZoom = function(zoom) {
	switch(zoom) {
		case 0:
			return {zoom:zoom,x:0,y:0}
			break;
		case 1:
			return {zoom:zoom,x:1,y:0}
			break;
		case 2:
			return {zoom:zoom,x:3,y:1}
			break;
		case 3:
			return {zoom:zoom,x:6,y:3}
			break;
		case 4:
			return {zoom:zoom,x:12,y:6}
			break;
		case 5:
			return {zoom:zoom,x:25,y:12}
			break;
		default:
			return {zoom:0,x:0,y:0}
			break;
	}
}

var padNumber = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var ensureDir = function(dir, mode, callback) {
	if (mode && typeof mode === 'function') {
		callback = mode;
		mode = null;
	}
	mode = mode || 0777 & (~process.umask());
	callback = callback || function () {};
	_ensureDir(dir, mode, callback);
}

function _ensureDir(dir, mode, callback) {
  var existsFunction = fs.exists || path.exists;
  existsFunction(dir, function (exists) {
    if (exists) return callback(null);
    var current = path.resolve(dir)
    	, parent = path.dirname(current);
    _ensureDir(parent, mode, function (err) {
      if (err) return callback(err);
      fs.mkdir(current, mode, function (err) {
        if (err) return callback(err);
        callback();
      });
    });
  });
}