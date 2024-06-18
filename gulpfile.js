const { src, dest } = require("gulp");
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');

const site_data = require('./src/data.json');


gulp.task('sass', function(){
    return gulp.src('./sass/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({
                includePaths: ['css'],
                onError: browserSync.notify
            }))
            .pipe(gulp.dest('dist/stylesheets'))
            .pipe(browserSync.reload({stream:true}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/stylesheets'))
})

gulp.task('render', function(){
    return gulp
        .src('src/pages/**/*.html')
        .pipe(data(site_data))
        .pipe(
            nunjucksRender({
                path: ["src/templates"],
            })
        )
        .pipe(gulp.dest('dist'));
})

gulp.task('serve', gulp.series('sass', function(){
    browserSync.init({
        server: "./dist/",
    });

    gulp.watch("./sass/**/*.scss", gulp.series('sass'));
    gulp.watch("./src/**/*.html").on('change', gulp.series('render','sass'));
    gulp.watch("./src/**/*.njk").on('change', gulp.series('render','sass'));
    gulp.watch("./dist/**/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('render','serve'));

