$(document).ready(function() {

/* for better height management with the svg.
there is probably a way better way to do this but I got annoyed*/
	var theResize = function(){
		if ( $(window).height() > $(window).width() ) {
		//	console.log("portrait");
			$('svg').css("height", function() { return $(window).width(); });
			$(".info").css("margin-top", function() { return $('svg').height()-50; });
		}
		else {
		//	console.log("horizontal");
			$('svg').css("height", function() { return $(window).height(); });
			$(".info").css("margin-top", function() { return $('svg').height()-50; });
		}
	}
	theResize();
	$(window).resize(function (){ theResize(); });

/* I don't feel like making a bunch of stuff browser compatible */

	// $('.lameBrowsers').html({
	// 	$.browser
	// });
// if ( $.browser.webkit ) {
//     alert( "This is WebKit!" );
//   }

/* initialize soundmanager */
	soundManager.url = 'script/swf/';
	soundManager.flashVersion = 9;
	soundManager.useFlashBlock = false;
	soundManager.useHighPerformance = true;
	soundManager.wmode = 'transparent';
	soundManager.useFastPolling = true;
	//soundManager.preferFlash = false;
	soundManager.onready(function() {
		
		var consumer_key = "09e017316a6b18e98bcc9c98fe0c35c7",
			url = "https://soundcloud.com/sweet-john-bloom/sets/picky";		
		
		$.getJSON('http://api.soundcloud.com/resolve?url=' + url + '&format=json&consumer_key=' + consumer_key + '&callback=?', function(playlist){
			$('.title').text(playlist.tracks[0].title);			
			$.each(playlist.tracks, function(index, track) {
				$('<li>' + track.title + '</li>').data('track', track).appendTo('.tracks').addClass("song"+(index+1));
				// * Get appropriate stream url depending on whether the playlist is private or public.
				// * If the track includes a *secret_token* add a '&' to the url, else add a '?'.
				// * Finally, append the consumer key and you'll have a working stream url.
				url = track.stream_url;
				(url.indexOf("secret_token") == -1) ? url = url + '?' : url = url + '&';
				url = url + 'consumer_key=' + consumer_key;
				
				soundManager.createSound({
					id: 'track_' + track.id,
					url: url,
					onplay: function() {
						$('.player').addClass('playing');
						$('.title').text(track.title);
					},
					onresume: function() {
						$('.player').addClass('playing');
					},					
					onpause: function() {
						$('.player').removeClass('playing');
					},
					onfinish: function() {
						nextTrack();
					},
					whileplaying: function() {
   			 			console.log("hi");
   			 			$(".playhead").css('width', ((this.position/this.duration) * 100) + '%');
        			}
				});
			});
		});

		/* hide the tracklist since we're playing it from the image */
		$('.tracks').hide();
		
		/*function to play the sound*/
		var playtrack = function(){
			var $track = $(this),
				data = $track.data('track'),
				playing = $track.is('.active');
			if (playing) {				
				soundManager.pause('track_' + data.id);				
			} else {
				if ($track.siblings('li').hasClass('active')) { 
					soundManager.stopAll(); 
				}
				soundManager.play('track_' + data.id);
			}	
			$track.toggleClass('active').siblings('li').removeClass('active');
		}

		
		/* play the sound when clicking on the list element, though this is hidden in SJB site */
		$('.info').on("click", ".tracks li", playtrack);

		/* play individual songs based on links outside of the tracklist 
		I'm sure there's a better way to do this too*/
		$('a.sOne').click(function(){
			$('li.song1').trigger("click");
		});
		$('a.sTwo').click(function(){
			$('li.song5').trigger("click");
		});
		$('a.sThree').click(function(){
			$('li.song4').trigger("click");
		});
		$('a.sFour').click(function(){
			$('li.song2').trigger("click");
		});
		$('a.sFive').click(function(){
			$('li.song3').trigger("click");
		});
		
		/* set up play/pause, prev, next buttons in the interface */
		$('body').on("click", '.play, .pause', function(){
			if ( $('li').hasClass('active') == true ) {
				soundManager.togglePause( 'track_' + $('li.active').data('track').id );	
			} else {
				$('.tracks li:first').click();
			}
		});
		
		$('.next').on('click', function(){
			nextTrack();
		});
				
		$('.prev').on('click', function(){
			prevTrack();
		});
		
		/* functions for next, prev */
		var nextTrack = function(){
			soundManager.stopAll();
			if ( $('li.active').next().click().length == 0 ) {
				$('.tracks li:first').click();
			}
		}

		var prevTrack = function(){						
			soundManager.stopAll();
			if ( $('li.active').prev().click().length == 0 ) {
				$('.tracks li:last').click();
			}
		}

		var playhead = function(){						
			console.log(this.position);
			//$(".playhead").css('width', ((this.position/this.duration) * 100) + '%');
		}
		 
	}); /* end soundmanager */
	
 });