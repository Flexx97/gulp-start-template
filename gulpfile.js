let project_folder = require('path').basename(__dirname),
    source_folder = "src",
    path = {
        build: {
            html: project_folder + "/",
            css: project_folder + "/css/",
            js: project_folder + "/js/",
            img: project_folder + "/img/",
            fonts: project_folder + "/fonts/"
        },
        src: {
            html: [source_folder + "/*.html", "!"+source_folder+"/_*.html"],
            css: source_folder + "/sass/style.scss",
            js: source_folder + "/js/app.js",
            img: source_folder + "/img/**/*.{jpg, png, svg, gif, ico, webp ,jpeg}",
            fonts: source_folder + "/fonts/**/*"
        },
        watch: {
            html: source_folder+"/**/*.html",
            css: source_folder+"/sass/**/*.scss",
            js: source_folder+"/js/**/*.js",
            img: source_folder+"/img/**/*.{jpg, png, svg, gif, ico, webp, jpeg}",
        },
        clean: {
            html: "./" +project_folder + "/index.html",
            css: "./" + project_folder + "/css",
            img: "./" + project_folder + "/img",
            js: "./" + project_folder + "/js",
        }
    },
    fs = require('fs')

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    groupMedia = require('gulp-group-css-media-queries'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    webpcss = require('gulp-webp-css'),
    svgsprite = require('gulp-svg-sprite'),
    tt2woff = require('gulp-ttf2woff'),
    tt2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter')


function BrowserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}


function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

function clean() {
    return del(path.clean.html)
    del(path.clean.html)
    del(path.clean.img)
    del(path.clean.css)
    del(path.clean.js)
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowserlist: ['last 5 version'],
                cascade: true
            })
        )
        .pipe(groupMedia())
        .pipe(dest(path.build.css))
        .pipe(cleanCSS())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(webp({
            quality: 70
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

let build =gulp.series(clean, gulp.parallel(css, html, images ,js))
let watch = gulp.parallel(build, watchFiles, BrowserSync)


exports.images = images
exports.js = js
exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch