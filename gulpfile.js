const {
	src,
	dest,
	task,
	series,
	parallel,
	watch
} = require('gulp');

const babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload'),
	imagemin = require('gulp-imagemin'),
	changed = require('gulp-changed'),
	postcss = require('gulp-postcss'),
	postcssImport = require('postcss-import'),
	postcssPresetEnv = require('postcss-preset-env'),
	cssnano = require('cssnano'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	gutil = require('gulp-util'),
	imageResize = require('gulp-image-resize');

const imageminPngQuant = require('imagemin-pngquant'),
	imageminMozJpeg = require('imagemin-mozjpeg');

const notifyError = {
	subtitle: 'GULP',
	message: 'Error: <%= error.message %>',
	sound: 'Beep'
};

let path = {};
path.styles = {
	watch: 'www/dev/css/**/*.css',
	src: 'www/dev/css/*.css',
	dest: 'www/public/static'
};
path.scripts = {
	watch: 'www/dev/js/**/*.js',
	src: 'www/dev/js/*.js',
	dest: 'www/public/static'
};
path.assets = {
	watch: 'www/dev/assets/**/*',
	src: 'www/dev/assets/**/*',
	dest: 'www/public/assets'
};
path.galleryFull = {
	src: 'www/dev/gallery/**/*',
	dest: 'www/public/gallery/full'
};
path.galleryThumb = {
	src: 'www/dev/gallery/**/*',
	dest: 'www/public/gallery/thumb'
};

const babelConfiguration = {
	presets: ['@babel/preset-env'],
	ignore: [
		'**/*.min.js'
	]
};

const postcssConfiguration = [
	postcssImport(),
	postcssPresetEnv({
		stage: 2,
		features: {
			'nesting-rules': true,
			'color-mod-function': {
				unresolved: 'warn'
			}
		}
	}),
	cssnano()
];

task('styles', function() {
	return src(path.styles.src)
		.pipe(plumber({
			errorHandler: notify.onError(Object.assign({
				title: 'Styles'
			}, notifyError))
		}))
		.pipe(postcss(postcssConfiguration))
		.pipe(dest(path.styles.dest));
});

task('scripts', function() {
	return src(path.scripts.src)
		.pipe(plumber({
			errorHandler: notify.onError(Object.assign({
				title: 'JavaScript'
			}, notifyError))
		}))
		.pipe(babel(babelConfiguration))
		.pipe(uglify())
		.pipe(dest(path.scripts.dest));
});

task('assets', function() {
	return src(path.assets.src)
		.pipe(plumber({
			errorHandler: gutil.log
		}))
		.pipe(changed(path.assets.dest))
		.pipe(imagemin([
			imageminPngQuant({
				quality: [0.7, 0.9],
				speed: 1,
				floyd: 1
			}),
			imagemin.svgo(),
			imageminMozJpeg({
				quality: 70,
				progressive: true
			})
		]))
		.pipe(dest(path.assets.dest));
});

task('galleryFull', function() {
	return src(path.galleryFull.src)
		.pipe(plumber({
			errorHandler: gutil.log
		}))
		.pipe(imageResize({
			width: 1024,
			upscale: false
		}))
		.pipe(dest(path.galleryFull.dest));
});

task('galleryThumb', function() {
	return src(path.galleryThumb.src)
		.pipe(plumber({
			errorHandler: gutil.log
		}))
		.pipe(imageResize({
			width: 320,
			height: 320,
			crop: true,
			upscale: false
		}))
		.pipe(dest(path.galleryThumb.dest));
});

task('reload', function() {
	livereload.reload();
});

task('build', parallel([
	'styles',
	'scripts',
	'assets',
	'galleryFull',
	'galleryThumb'
]));

task('default', function() {
	livereload.listen();

	watch(path.styles.watch, series('styles'));
	watch(path.scripts.watch, series('scripts'));
	watch(path.assets.watch, series('assets'));

	watch('www/public/**/*').on('change', () => {
		livereload.reload();
	});
});
