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
	svgSymbols = require('gulp-svg-symbols'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	gutil = require('gulp-util'),
	rename = require('gulp-rename'),
	nunjucks = require('gulp-nunjucks');

const imageminPngQuant = require('imagemin-pngquant'),
	imageminMozJpeg = require('imagemin-mozjpeg');

const notifyError = {
	subtitle: 'GULP',
	message: 'Error: <%= error.message %>',
	sound: 'Beep'
};

const path = {
	templates: {
		watch: 'www/dev/templates/**/*.njk',
		src: 'www/dev/templates/*.njk',
		dest: 'www/public'
	},
	styles: {
		watch: 'www/dev/css/**/*.css',
		src: 'www/dev/css/*.css',
		dest: 'www/public/static'
	},
	scripts: {
		watch: 'www/dev/js/**/*.js',
		src: 'www/dev/js/*.js',
		dest: 'www/public/static'
	},
	assets: {
		watch: 'www/dev/assets/**/*.{png,jpg,jpeg,gif}',
		src: 'www/dev/assets/**/*.{png,jpg,jpeg,gif}',
		dest: 'www/public/static'
	},
	svgs: {
		watch: 'www/dev/assets/svgs/*.svg',
		dest: 'www/public/static'
	}
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

task('templates', function() {
	return src(path.templates.src)
		.pipe(plumber({
			errorHandler: notify.onError(Object.assign({
				title: 'Templates'
			}, notifyError))
		}))
		.pipe(nunjucks.compile())
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(dest(path.templates.dest));
});

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

task('svgs', function() {
	return src(path.svgs.watch)
		.pipe(plumber({
			errorHandler: notify.onError(Object.assign({
				title: 'Images - ERROR'
			}, notifyError))
		}))
		.pipe(imagemin([
			imagemin.svgo()
		]))
		.pipe(svgSymbols({
			slug: (filename) => `${filename}`,
			templates: ['default-svg'],
			svgAttrs: {
				style: 'display:none!important;',
				xmlns: 'http://www.w3.org/2000/svg'
			}
		}))
		.pipe(rename({
			basename: 'svgs'
		}))
		.pipe(dest(path.svgs.dest));
});

task('reload', function() {
	livereload.reload();
});

task('build', parallel([
	'templates',
	'styles',
	'scripts',
	'assets',
	'svgs'
]));

task('default', function() {
	livereload.listen();

	watch(path.templates.watch, series('templates'));
	watch(path.styles.watch, series('styles'));
	watch(path.scripts.watch, series('scripts'));
	watch(path.assets.watch, series('assets'));
	watch(path.svgs.watch, series('svgs'));

	watch('www/public/**/*', () => livereload.reload());
});
