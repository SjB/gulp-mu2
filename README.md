# gulp-mu2 

> raycmorgan/Mu plugin for [gulp][https://github.com/wearefractal/gulp]

## Usage

First, install `gulp-mu2` as a development dependency:

```shell
npm install --save-dev gulp-mu2
```

Then, add it to your `gulpfile.js`

```javascript
var mu2 = require("gulp-mu2");

gulp.src("./page/*.html")
    .pipe(mu2({title: "my page"}, {root: "./templates"}))
    .pipe(gulp.dest("./dist"));
```

You may also pass a json file containing all some data for the view, like so:

```javascript
gulp.src("./page/*.html")
    .pipe(mu2("./templates/global.json", {root: "./templates"}))
    .pipe(gulp.dest("./dist"));
```

If a file with the same name but a json extension exist next to the template page, It will
get loaded and will be used as data in the template.

## API

### mu(view, options)

#### view
Type: `hash` or `string`
Default: `undefined`

#### options
Type: `hash`
Default: `{ }`

The options object to configure the plugin.

##### options.root
Type: `string`
Default: the path of the current file

##### options.extension
Type: `string`
Default: the extension of the current file

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

