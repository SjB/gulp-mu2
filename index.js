'use strict';

var through2 = require('through2'),
	gutil = require('gulp-util'),
	mu = require('mu2'),
	fs = require('fs'),
	_ = require('lodash');

module.exports = function(view, options) {
	options = options || {};

	var viewError = null;

	var parse = function(filename) {
		var js = fs.readFileSync(filename, 'utf8');
		return eval('(' + js + ')');
	}

	if (typeof view === 'string') {
		try {
			view = parse(view);
		} catch (e) {
			viewError = e;
		}
	}

	return through2.obj(function(file, enc, callback) {
		if (file.isNull()) {
			this.push(file);
			return callback();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-mu2', 'Streaming not supported'));
		}

		if (viewError) {
			this.emit('error', new gutil.PluginError('glup-mu2', viewError.toString()));
		}
		var data = _.extend({}, view);
		try {
			var datafile = gutil.replaceExtension(file.path, '.json');
			if (fs.existsSync(datafile)) {
				data = _.extend(data, parse(datafile));
			}
		} catch (e) {
			console.log(e.toString());
		}

		if (options.root) {
			mu.root = options.root;
		} else {
			mu.root = file.base;
		}

		var stream = this;
		mu.compileText(file.path, file.contents.toString('utf8'), function(err, parsed) {
			if (parsed) {
				var html = '';
				var i = 0;
				(function next(err) {
					if (err) {
						stream.push(file);
						return callback();
					}
					if (i < parsed.partials.length) {
						mu.compile(parsed.partials[i], next);
						i++;
					} else {
						mu.render(parsed, data)
						.on('data', function (chunk) {
							html += chunk;
						})
						.on('end', function() {
							file.contents = new Buffer(html);
                            if (typeof options.extension === 'string') {
                                file.path = gutil.replaceExtension(file.path, options.extension);
                            }
							stream.push(file);
							callback();
						});
					}
				}());
			}
		});
	});
};

