////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
function initPreload(){
	toggleLoader(true);
	
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[{src:'assets/background.jpg', id:'background'},
			{src:'assets/landing.png', id:'landing'},
			{src:'assets/button_start.png', id:'buttonStart'},
			{src:'assets/button_download.png', id:'buttonDownload'},
			{src:'assets/button_share.png', id:'buttonShare'},
			{src:'assets/button_next.png', id:'buttonNext'},
			{src:'assets/button_replay.png', id:'buttonReplay'},
			{src:'assets/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/button_google.png', id:'buttonGoogle'}];
			
	for(n=0;n<pug_arr.length;n++){
		manifest.push({src:pug_arr[n], id:'orginal_'+n});
	}
	
	for(n=0;n<dogs_arr.length;n++){
		manifest.push({src:dogs_arr[n], id:'type_'+n});
	}
	
	soundOn = true;		
	if($.browser.mobile || isTablet){
		if(!enableMobileSound){
			soundOn=false;
		}
	}
	
	if(soundOn){
		manifest.push({src:'assets/sounds/musicGame.ogg', id:'musicGame'})
		manifest.push({src:'assets/sounds/musicMain.ogg', id:'musicMain'})
		manifest.push({src:'assets/sounds/soundPug1.ogg', id:'soundPug1'})
		manifest.push({src:'assets/sounds/soundPug2.ogg', id:'soundPug2'})
		manifest.push({src:'assets/sounds/soundPug3.ogg', id:'soundPug3'})
		manifest.push({src:'assets/sounds/soundComplete.ogg', id:'soundComplete'})
		manifest.push({src:'assets/sounds/soundFail.ogg', id:'soundFail'})
		manifest.push({src:'assets/sounds/soundClock.ogg', id:'soundClock'})
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}