var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect');

//定义名为js的任务
gulp.task('js',function(){
	gulp.src('./src/js/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('bulid/js'))
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('bulid/js'))
		.pipe(connect.reload())
});
//定义html任务
gulp.task('html',function(){
	gulp.src('./src/*.html')
		.pipe(gulp.dest('./bulid'))
		.pipe(connect.reload());
});
//定义livereload任务
gulp.task('connect',function(){
	connect.server({
		livereload : true
	})
});
//定义监听任务watch
gulp.task('watch',function(){
	gulp.watch('src/*.html',['html']);
	gulp.watch('src/js/*.js',['js']);
});

//定义默认任务
gulp.task('default',['js','html','watch','connect']);





















