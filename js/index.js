$(function(){
	var container = $(".container");
	var video = $(".container video");
	var controls= $(".controls");
	var pauseBtn = $(".pause");
	var fullScreenBtn = $(".fullScreen");
	var progress = $(".progress");
	var proCover = $(".progress .proCover");
	var silder = $(".progress .slider");
	var toltime = $(".time .tolTime");
	var currtime = $(".time .currTime");
	var $volume = $(".volume");
	var volControl = $(".volControl");
	
	var videoWidth = video.width();
	var videoHeight = video.height();
	container.css("height",videoHeight+controls.height());
	var conWidth = container.width();
	var conHeight = container.height();
	
	
	function Player(){
		this.isplay = false;
		this.video = $("video")[0];
		this.isFullScreen = false;
		this.video.volume = 0.5;
	}
	Player.prototype = {
		init : function(){
			//时间获取
			var self = this;
			self.video.oncanplay = function(){
				self.videoTime = self.video.duration;
				var tolmin = parseInt(self.videoTime/60);
				var tolsec = parseInt(self.videoTime%60);
				if(tolmin<10){
					tolmin = "0"+tolmin;
				}
				if(tolsec<10){
					tolsec = "0"+tolsec;
				}			
				toltime.text(tolmin+":"+tolsec);
			}
			volControl.find(".volCover").css("height",this.video.volume*volControl.height())
			return this;
		},
		playOrPause : function(){
			if(this.isplay){
				//暂停
				this.isplay = false;
				this.video.pause();
				pauseBtn.html("&#xe733;")
			}else{
				//播放
				this.isplay	= true;			
				this.video.play();
				pauseBtn.html("&#xe96b;");
				this.updateTime();
			}
		},
		updateTime : function(){
			this.videoTime = this.video.duration;
			var timer = setInterval(function(){
				var currTime = this.video.currentTime;
				var _width = currTime/this.videoTime*progress.width();
				proCover.css("width",_width);
				silder.css("left",_width-6);
				var currmin = parseInt(currTime/60);
				var currsec = parseInt(currTime%60);
				if(currmin<10){
					currmin = "0"+currmin;
				}
				if(currsec<10){
					currsec = "0"+currsec;
				}			
				currtime.text(currmin+":"+currsec);
				
				if(currTime >= this.videoTime){
					clearInterval(timer);
					this.playOrPause();
				}
			}.bind(this),500)
		},
		fullScreen : function(){
			//全屏
			container[0].webkitRequestFullscreen();
			container.css({width:$(window).width(),height:$(window).height()});
			video.css({width:$(window).width(),height:$(window).height()});
			fullScreenBtn.html("&#xe60d;");
			this.isFullScreen = true;
		},
		exitFullScreen : function(){
			//退出全屏
			document.webkitExitFullscreen();
			container.css({width:conWidth,height:conHeight});
			video.css({width:videoWidth,height:videoHeight});
			fullScreenBtn.html("&#xe66c;");
			this.isFullScreen = false;
		}
	}
	var player = new Player().init();

	//播放暂停
	pauseBtn.click(function(){
		player.playOrPause();
	});
	video.click(function(){
		player.playOrPause();
	})
	//进度条控制
	progress.click(function(e){
		e = e || event;
		var _width = e.clientX-$(this).offset().left;
		proCover.css("width",_width);
		silder.css("left",_width-6);
		player.video.currentTime = _width/$(this).width()*player.videoTime;
	});
	//进度条拖拽
	draggable(silder[0], {y:false});
	//静音
	$volume.find("i").click(function(){
		if(player.video.muted){
			//关闭静音
			player.video.muted = false;
			$(this).html("&#xe61b;");
		}else{
			//静音
			player.video.muted = true;
			$(this).html("&#xe629;");
		}
	});
	
	$volume.hover(
		function(){
			volControl.show()
		},
		function(){
			volControl.hide()
		}
	);
	volControl.click(function(e){
		e = e || event;
		var _height = 100 - (e.clientY - $(this).offset().top);
		$(this).find(".volCover").css("height",_height);
		player.video.volume = _height/100;
	});
	
	//全屏和退出全屏
	fullScreenBtn.click(function(){
		if(player.isFullScreen){
			player.exitFullScreen();
		}else{		
			player.fullScreen();
		}
	});

})