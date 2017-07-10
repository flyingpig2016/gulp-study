# gulp-study
---
title: gulp的实时刷新、代码压缩、代码排错
date: 2017-07-10 12:33:00
tags: 前端自动化工具
---
## gulp的学习
### 一：什么是gulp？
&emsp;&emsp;简而言之，gulp是一种工具，是一种前端工具，是一种在前端开发过程中对代码进行构建的工具。
作用：对网站资源优化，比之前流行的工具grunt构建项目过程重复率低，可以愉快的编写代码。
具体作用：网页自动刷新、CSS预处理、代码检测、压缩图片、等等…… 只需用简单的命令就能全部完成，让你把重点放在功能开发上；同时减少人为失误，提高开发效率和项目质量，让专注更为专注。
### 二：为什么使用Gulp而不使用Grunt?
- 简洁：Gulp侧重“代码优于配置”(code over configuration)。最直观的感受，更为简单和清晰，不需要像Grunt一样写一堆庞大的配置文件。
- 高效：Gulp基于Node Streams（流）来构建任务，避免磁盘反复I/O（读取/写入）。每个任务都是单独执行（坚持做一件事并且做好它），这使得它速度更快、更为纯粹。
- 易学：Gulp核心API只有4个。简洁的API易于上手，学习过程比较平滑。
### 三：gulp核心API用法？
- gulp.src(globs[, options])：指明源文件路径
	globs：路径模式匹配；
    options：可选参数；  
- gulp.dest(path[, options])：指明处理后的文件输出路径
	path：路径（一个任务可以有多个输出路径）；
	options：可选参数；
- gulp.task(name[, deps], fn)：注册任务
	name：任务名称（通过 gulp name 来执行这个任务）；
	deps：可选的数组，在本任务运行中所需要所依赖的其他任务（当前任务在依赖任务执行完毕后才会执行）；
	fn：任务函数（function方法）；
- gulp.watch(glob [, opts], tasks)：监视文件的变化并运行相应的任务
	glob：路径模式匹配；
	opts：可以选配置对象；
	taks：执行的任务；
**注**：1.1 streams（流）的简述：Node.js中的I/O操作是异步的，因此磁盘的读写和网络操作都需要传递回调函数。streams的优点：不需要把文件都一次性写入内存，通过pie（管道）把文件转为数据流（将任务和操作连接起来），像瀑布一样一级级（one by one）往下流（处理），因此只需一次I/O操作。而Grunt是每执行一个任务就需要I/O一次，在任务多的时候，就会有大量I/O操作，效率自然就会比较低。
1.2. 以前Gulp有5个核心API，但随着Gulp 3.5的更新，gulp.run()方法早已被弃用。
###四：gulp安装配置？
&emsp;&emsp;gulp的安装很简单，在这我就不一一讲解，只看代码：
```
//全局安装
npm install -g gulp
//本地安装，项目开发一般就是本地安装
npm install gulp --save-dev
```
**注：**
1.--save：将保存配置信息至package.json（此文件在 node_modules\gulp 目录下）
2.-dev：将它作为你的项目依赖添加到中devDependencies内（--save和-dev是2个东西，记得分清前面的"-"号）
3.由于Gulp会自带package.json文件（用于存储项目的元数据），所以这里只做简单介绍（如果你想自己创建，也可通过命令 npm init，然后根据引导填写相关信息）：
我们在某个文件夹下面初始化一个目录：
```
npm init
```
然后会创建一个项目，然后该文件夹羡慕就出现一个package.json文件，记录了该项目的所有信息：
```
//目前是初始化，信息比较少
{
  "name": "02gulp",//模块名称：只能包含小写字母数字和中划线，如果为空则使用项目文件夹名称代替（必填）
  "version": "1.0.0",//版本号（必填）
  "description": "", //描述：会在npm搜索列表中显示
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
然后我们在该目录下安装gulp，安装完gulp后我们安装插件：
```
npm install gulp --save-dev
//例如我们通过gulp-livereload 和 gulp-webserver插件，来实现页面自动刷新，如需要安装其他插件，需要按照此方法安装
npm instal gulp-livereload  --save-dev
npm instal gulp-webserver  --save-dev
```
### 五：Gulp任务配置（Task Configuration）？
5.1.在项目根目录中，创建gulpfile.js文件，用来配置和定义任务（task）。我们在根目录下创建一个src文件夹，src文件夹下面有js和sass等文件夹，下面的例子都是这样的目录，我们处理代码后生成的目录bulid可以先不用创建，因为会自动生成。
5.2.在gulpgile.js文件中填写**实时刷新**的相关配置：
**方法一：**用gulp-webserver模块，该模块启动服务器的时候直接打开页面；
```
var gulp = require('gulp');   //基础库
//引入gulp插件
var livereload = require('gulp-livereload'); //网页自动刷新 （服务器控制客户端同步刷新）
	webserver = require('gulp-webserver');   // 本地服务器

//注册服务
gulp.task('webserver',function(){
	gulp.src('./')  			//服务器目录(./代表根目录)
	.pipe(webserver({  			//运行gulp-webserver
		livereload:true,    	//启用livereload
		open : true				//服务器启动时自动打开网页
	}))
})
//定义html任务
gulp.task('html',function(){
	gulp.src('src/*.html')
		.pipe(gulp.dest('bulid'))
});
// 监听任务
gulp.task('watch',function(){
	gulp.watch('*.html',['html'])    //监听根目录下所有.html文件
});
//默认任务
gulp.task('default',['webserver','watch','html']);
```
当然，在执行过程中我们需要在根目录下创建一个html文件，然后执行`gulp`，然后相当于执行了`gulpfile.js`中的默认任务，如果我们需要实时刷新，我们就需要执行特定任务：`gulp webserver`,然后我们修改html文件，在浏览器中就可以实时看到效果了。
**方法二：**第二种自动刷新的方法是安装gulp-connect模块，同样是上面的目录：
```
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	connect = require('gulp-connect');
//定义名为js的任务，该方法可以压缩、重命名和合并js代码，下文会讲明白的
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
```
5.3.**实时刷新并且压缩js代码**的相关配置
&emsp;&emsp;下面的方法是用gulp-webserver模块，服务器启动时自动打开网页
当然我们需要提前配置好`gulp-concat`和`gulp-rename`
```
var gulp = require('gulp');   //基础库
//引入gulp插件
var livereload = require('gulp-livereload'), //网页自动刷新 （服务器控制客户端同步刷新）
	webserver = require('gulp-webserver'),   // 本地服务器
	uglify = require('gulp-uglify'),
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
	gulp.watch('*.html',['html'])    //监听src目录下所有.html文件
	gulp.watch('src/js/*.js',['minify']);
});
//默认任务
gulp.task('default',['html','minify','webserver','watch']);
```
5.3.**实时刷新html、压缩、排错、合并js代码**的相关配置
&emsp;&emsp;排错我们当然需要用到gulp-jshint这个著名的插件了，合并代码我们需要用到gulp-concat来合并好多的js到一个js下面，这样可以减少js的请求次数，有利于用户体验。自己安装吧！，配置如下：
```
var gulp = require('gulp'); //基础库
//引入gulp插件
var livereload = require('gulp-livereload'), //网页自动刷新 （服务器控制客户端同步刷新）
	webserver = require('gulp-webserver'), // 本地服务器
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint')

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
// 监听任务
gulp.task('watch', function() {
	gulp.watch('src/*.html', ['html']) //监听src目录下所有.html文件
	gulp.watch('src/js/*.js', ['js']);
});
//默认任务
gulp.task('default', ['html', 'js', 'webserver', 'watch']);
```
5.4.**处理less**的相关配置
&emsp;&emsp;加上上面的配置，我们引入处理less的代码
```
var gulp = require('gulp'); //基础库
//引入gulp插件
var livereload = require('gulp-livereload'), //网页自动刷新 （服务器控制客户端同步刷新）
	webserver = require('gulp-webserver'), // 本地服务器
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),

	less = require('gulp-less')

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
// 监听任务
gulp.task('watch', function() {   
	watcher = gulp.watch('src/*.html', ['html']) //监听src目录下所有.html文件
//	var watcher = gulp.watch('src/*.html', ['html'])
//	watcher.on('change',function(event){
//		console.log('Event type' + event.type);
//		console.log('Event path:' + event.path);
//	})
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/less/*.less', ['less']);
});
//默认任务
gulp.task('default', ['html', 'less','js', 'webserver', 'watch']);
```
### 六：Gulp中不刷新加载页面模块-BroserSync的使用？
&emsp;&emsp;BroserSync也是gulp的一个子组件，为什么我要单独讲解呢，因为BroserSync在浏览器中展示变化的功能与LiveReload非常相似，但是它有更多的功能。当你改变代码的时候，BrowserSync会重新加载页面，或者如果是css文件，会直接添加进css中，页面并不需要再次刷新。这项功能在网站是禁止刷新的时候是很有用的。假设你正在开发单页应用的第4页，刷新页面就会导致你回到开始页。使用LiveReload的话，你就需要在每次改变代码之后还需要点击四次，而当你修改CSS时，插入一些变化时，BrowserSync会直接将需要修改的地方添加进CSS，就不用再点击回退。
	&emsp;&emsp;BrowserSync不需要使用浏览器插件，因为它本身就可以为你提供文件服务（如果文件是动态的，则为他们提供代理服务）和用来开启浏览器和服务器之间的socket的脚本服务。到目前为止这个功能的使用都十分顺畅。安装方法：
```
npm install --save-dev browser-sync
```
使用方法：
```
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
```
执行方法，执行后后会监听匹配文件的变化而且不用刷新(当然我们之前的那么多配置并不是没用，因为开发需要刷新啊)，同时为src目录提供文件服务。
```
gulp browser-sync
```
### 七：总结gulp的配置
&emsp;&emsp;说了这么多，我们应该清楚，gulp无非和其他node模块一样，先用`require()`引入模块，然后用`gulp.task()`建立任务，然后添加到监听任务`gulp.task('watch',function(){}`中，最后把这些任务名添加到默认任务`gulp.task('default', ['html', 'less','js', 'webserver', 'watch']);`中为了执行方便，直接一个`gulp`就处理了所有代码，不过特别的模块需要特别执行，比如：`browserSync`模块


