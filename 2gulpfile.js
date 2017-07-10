var gulp = require('gulp');   //基础库
//引入gulp插件
var livereload = require('gulp-livereload'), //网页自动刷新 （服务器控制客户端同步刷新）
	webserver = require('gulp-webserver'),   // 本地服务器
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint')

//注册实时刷新服务
gulp.task('webserver',function(){
	gulp.src('src')  			//服务器目录(./代表根目录)
	.pipe(webserver({  			//运行gulp-webserver
		livereload:true,    	//启用livereload
		open : true				//服务器启动时自动打开网页
	})) 
}) 
//压缩JavaScript文件
gulp.task('minify',function(){
	gulp.src('./src/js/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('bulid/js'))
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('bulid/js'))
});
//定义html任务
gulp.task('html',function(){
	gulp.src('src/*.html')
		.pipe(gulp.dest('bulid'))
});
// 监听任务
gulp.task('watch',function(){
	gulp.watch('*.html',['html'])    //监听根目录下所有.html文件
	gulp.watch('src/js/*.js',['minify']);
});
//默认任务
gulp.task('default',['html','minify','webserver','watch']);
