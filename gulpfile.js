var gulp = require('gulp'); //基础库
//引入gulp插件
var livereload = require('gulp-livereload'), //网页自动刷新 （服务器控制客户端同步刷新）
	webserver = require('gulp-webserver'), // 本地服务器
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	browserSync = require('browser-sync');

//注册实时刷新服务
gulp.task('webserver', function() {
	gulp.src('bulid') //服务器目录(./代表根目录)
		.pipe(webserver({ //运行gulp-webserver
			livereload: true, //启用livereload
			open: true //服务器启动时自动打开网页
		}))
})
//定义js任务，排错、压缩、合并、
gulp.task('js', function() {
	gulp.src(['src/js/**/*.js', 'src/!js/**/*.min.js']) //匹配目录下所有的JavaScript文件，然后排除后缀为.min.js的文件
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
//		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(concat('main.js'))
		.pipe(gulp.dest('bulid/js'))
});
//定义html任务
gulp.task('html', function() {
	gulp.src('src/*.html')
		.pipe(gulp.dest('bulid'))
});
//定义less任务
gulp.task('less',function(){
	gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(gulp.dest('bulid/css'))
})
//定义browser-sync任务
gulp.task('browser-sync',function(){
	var files = [
		'src/**/*.html',
    	'src/css/**/*.css',
    	'src/less/**/*.less',
    	'src/imgs/**/*.png',
    	'src/js/**/*.js',
	];
	browserSync.init(files,{
		server:{
			baseDir : 'src'
		}
	})
})

// 监听任务
gulp.task('watch', function() {   
	watcher = gulp.watch('src/*.html', ['html']) //监听src目录下所有.html文件
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/less/*.less', ['less']);
});
//默认任务
gulp.task('default', ['html', 'less','js', 'webserver', 'watch']);