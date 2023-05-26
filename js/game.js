////////////////////////////////////////////////////////////
// KANYE GAME!
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

var playBackgroundMusic = true; //toggle background music

var frameBackgroundColour = '#33150C'; //puzzle background colour
var frameBorderStrokeColour = '#595959'; //puzzle border stroke colour
var frameBorderColour = '#ffffff'; //puzzle border colour
var frameBorderStroke = 6; //puzzle border stroke number
var frameBorderRange = 15; //puzzle border range number

var dogMaxHeight = 130; //dog max height
var dogHeightSpace = 60; //dog height spacing

var countdownMode = true; //enable countdown mode
var elapsedTimeMode = true; //enabled elapsed time mode (for countdownmode only)
var resultCompleteText = 'STAGE[LEVEL] COMPLETE:\nYou found KANYE! in [TIME]!'; //result complete text
var resultFailText = 'GAME OVER:\nYou failed to find KANYE! you piece of SH**'; //result fail text
var puzzleFileName = 'findingkanye'; //download puzzle photo filename
var processShareText = 'Please wait...'; //process share image text

//Social share, [SCORE] will replace with game time
var sharePuzzleImage = false; //enabled to share puzzble image on facebook
var shareText ='Share and challenge your friends!'; //text for share instruction
var shareTitle = 'I found Kanye in [SCORE]!';//social share score title
var shareMessage = 'Hey I found Kanye in [SCORE] on Find Kanye game! Challenge me now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
 
var playerData = {time:0, soundTime:0, share:false, imageUploaded:false, imagePath:'', paused:true};
var gameData = {array:[], arrayNum:0, insertNum:0, startX:0, startY:0, frameWidth:0, frameHeight:0, dogScale:1, levelNum:0, time:0}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('game');
	});
	
	buttonShare.cursor = "pointer";
	buttonShare.addEventListener("click", function(evt) {
		if(playerData.share){
			toggleResult(true);
			toggleShare(false);
		}else{
			toggleShare(true);
		}
	});
	
	buttonDownload.cursor = "pointer";
	buttonDownload.addEventListener("click", function(evt) {
		saveImagePhp();
	});
	
	buttonNext.cursor = "pointer";
	buttonNext.addEventListener("click", function(evt) {
		toggleResult(false);
		toggleShare(false);
		createLevel();
	});
	
	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("click", function(evt) {
		goPage('game');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		if(sharePuzzleImage){
			uploadImage('facebook');
		}else{
			share('facebook');
		}
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		if(sharePuzzleImage){
			uploadImage('twitter');
		}else{
			share('twitter');
		}
	});
	buttonGoogle.cursor = "pointer";
	buttonGoogle.addEventListener("click", function(evt) {
		share('google');
	});
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	toggleResult(false);
	toggleShare(false);
	
	curPage=page;
	
	mainContainer.visible=false;
	gameContainer.visible=false;
	
	var targetContainer = ''
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			if(playBackgroundMusic)
				playSound('musicMain', true);
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
			if(playBackgroundMusic)
				playSound('musicGame', true);
		break;
	}
	
	targetContainer.alpha=0;
	targetContainer.visible=true;
	$(targetContainer)
	.clearQueue()
	.stop(true,true)
	.animate({ alpha:1 }, 500);
}

function toggleResult(con){
	resultContainer.visible = con;
	buttonNext.visible = false;
	if(countdownMode && playerData.time <= 0){
		txtComplete.text = resultFailText;
	}else{
		buttonNext.visible = true;
		var finalText = '';
		var finalScore = 0;
		if(elapsedTimeMode && countdownMode){
			finalText = resultCompleteText.replace('[TIME]', convertReusltTime(Number(levels_arr[gameData.levelNum].timer) - playerData.time));
			finalScore = Number(levels_arr[gameData.levelNum].timer) - playerData.time;
		}else{
			finalText = resultCompleteText.replace('[TIME]', convertReusltTime(playerData.time));
			finalScore = playerData.time;
		}
		finalText = finalText.replace('[LEVEL]', gameData.levelNum);
		txtComplete.text = finalText;
	}
	
	saveGame(finalScore);
	resultContainer.alpha = 0;
	$(resultContainer)
	.clearQueue()
	.stop(true,true)
	.animate({ alpha:1 }, 300);
}

function toggleShare(con){
	playerData.share = con;
	shareContainer.visible = con;
	
	shareContainer.alpha = 0;
	$(shareContainer)
	.clearQueue()
	.stop(true,true)
	.animate({ alpha:1 }, 300);
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
function startGame(){
	gameData.time = 0;
	gameData.levelNum = 0;
	gameData.dogScale = levels_arr[gameData.levelNum].scale;
	
	createLevel();
}

function createLevel(){
	playerData.paused = false;
	playerData.imageUploaded = false;
	txtTime.visible = true;
	toggleGameTimer(false);
	toggleGameTimer(true);
	
	frameContainer.removeAllChildren();
	puzzleContainer.removeAllChildren();
	
	gameData.frameWidth = levels_arr[gameData.levelNum].frameWidth;
	gameData.frameHeight = levels_arr[gameData.levelNum].frameHeight;
	
	createFrame();
	createDogs();
	
	gameData.levelNum++;
	if(gameData.levelNum > levels_arr.length-1){
		gameData.levelNum = levels_arr.length-1;
		gameData.time = 0;
	}
	gameData.dogScale = levels_arr[gameData.levelNum].scale;
	
	/*gameData.time++;
	if(gameData.time >= levels_arr[gameData.levelNum].totalPlay){
		gameData.time = 0;
		gameData.levelNum++;
		gameData.dogScale = levels_arr[gameData.levelNum].scale;
		if(gameData.levelNum > levels_arr.length-1){
			gameData.levelNum = levels_arr.length-1;
			gameData.time = 0;
		}
	}*/
	
	/*if(gameData.dogScale < levels_arr[gameData.levelNum].minScale){
		gameData.time = 0;
		gameData.dogScale = 1;
		gameData.levelNum++;
	}*/
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(con){
	var timer = 800;
	if(!playerData.paused){
		playerData.paused = true;
		toggleGameTimer(false);
		
		if(!con)
			timer = 0;
		
		setTimeout(function(){
			if(con){
				playSound('soundComplete');
			}else{
				playSound('soundFail');	
			}
			txtTime.visible = false;
			
			toggleGameTimer(false);
			toggleResult(true);
			if ( typeof displayB == 'function' ) { 
				displayB();
			}
		}, timer);
	}
}

/*!
 *
 * SAVE GAME - This is the function that runs to save game
 *
 */
function saveGame(score){
    /*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * CREATE FRAME - This is the function that runs to create frame
 * 
 */
function createFrame(){
	$.frame['frameMask'].alpha = 0;
	$.frame['frameMask'].graphics.clear();
	$.frame['frameMask'].graphics.beginFill(frameBackgroundColour);
	$.frame['frameMask'].graphics.drawRect(0, 0, gameData.frameWidth, gameData.frameHeight);
	
	$.frame['frameBackground'].graphics.clear();
	$.frame['frameBackground'].graphics.beginFill(frameBackgroundColour);
	$.frame['frameBackground'].graphics.drawRect(0, 0, gameData.frameWidth, gameData.frameHeight);
	
	$.frame['frameInner'].graphics.clear();
	$.frame['frameInner'].graphics.beginStroke(frameBorderStrokeColour);
	$.frame['frameInner'].graphics.beginFill(frameBorderColour);
	$.frame['frameInner'].graphics.setStrokeStyle(frameBorderStroke);
	$.frame['frameInner'].snapToPixel = true;
	$.frame['frameInner'].graphics.drawRect(0, 0, gameData.frameWidth, gameData.frameHeight);
	
	$.frame['frameOuter'].graphics.clear();
	$.frame['frameOuter'].graphics.beginStroke(frameBorderStrokeColour);
	$.frame['frameOuter'].graphics.beginFill(frameBorderColour);
	$.frame['frameOuter'].graphics.setStrokeStyle(frameBorderStroke/2);
	$.frame['frameOuter'].snapToPixel = true;
	$.frame['frameOuter'].graphics.drawRect(-frameBorderRange, -frameBorderRange, gameData.frameWidth+(frameBorderRange*2), gameData.frameHeight+(frameBorderRange*2));
	
	overlayResultFrameMask.alpha = 0;
	overlayResultFrameMask.graphics.clear();
	overlayResultFrameMask.graphics.beginFill(frameBorderColour);
	overlayResultFrameMask.graphics.drawRect(0, 0, gameData.frameWidth, gameData.frameHeight);
	
	overlayResultFrame.graphics.clear();
	overlayResultFrame.graphics.beginFill(frameBorderColour);
	overlayResultFrame.graphics.drawRect(0, 0, gameData.frameWidth, gameData.frameHeight);
	overlayResultFrame.mask = overlayResultFrameMask;
	
	overlayShareFrameMask.alpha = 0;
	overlayShareFrameMask.graphics.clear();
	overlayShareFrameMask.graphics.beginFill(frameBorderColour);
	overlayShareFrameMask.graphics.drawRect(0, 0, gameData.frameWidth, gameData.frameHeight);
	
	overlayShareFrame.graphics.clear();
	overlayShareFrame.graphics.beginFill(frameBorderColour);
	overlayShareFrame.graphics.drawRect(0, 0, gameData.frameWidth, gameData.frameHeight);
	overlayShareFrame.mask = overlayShareFrameMask;
	
	puzzleContainer.addChild($.frame['frameBackground']);
	frameContainer.addChild($.frame['frameOuter'], $.frame['frameInner']);
	
	puzzleContainer.x = frameContainer.x = canvasW/2 - (gameData.frameWidth/2);
	puzzleContainer.y = frameContainer.y = (canvasH/100 * 45) - (gameData.frameHeight/2);
	
	overlayResultFrameMask.x = overlayResultFrame.x = overlayShareFrameMask.x = overlayShareFrame.x = puzzleContainer.x;
	overlayResultFrameMask.y = overlayResultFrame.y = overlayShareFrameMask.y = overlayShareFrame.y = puzzleContainer.y;
	
	overlayResultFrame.y = puzzleContainer.y + gameData.frameHeight/100 * 82;
	overlayShareFrame.y = puzzleContainer.y + gameData.frameHeight/100 * 67;
}

/*!
 * 
 * CREATE ALL DOGS - This is the function that runs to create dogs
 * 
 */
function createDogs(){
	randomDogsList();
	gameData.insertNum = 0;
	gameData.startY = dogMaxHeight * gameData.dogScale;
	
	createDogsLoop();
	insertPug();
}

/*!
 * 
 * CREATE DOGS LOOP - This is the function that runs to create sea of dogs
 * 
 */
function createDogsLoop(){
	var rangeX = 5 * gameData.dogScale;
	var rangeY = 3 * gameData.dogScale;
	var randomX = (Math.random()*rangeX*2) - (rangeX);
	var randomY = (Math.random()*rangeY*2) - (rangeY);
	
	var curNum = gameData.array[gameData.arrayNum];
	$.dogs[gameData.insertNum] = $.clone['type_'+curNum].clone();
	$.dogs[gameData.insertNum].x = gameData.startX + randomX;
	$.dogs[gameData.insertNum].y = gameData.startY + randomY;
	$.dogs[gameData.insertNum].scaleX = $.dogs[gameData.insertNum].scaleY = gameData.dogScale;
	if(randomBoolean()){
		$.dogs[gameData.insertNum].scaleX = -(gameData.dogScale);
	}
	
	$.dogs[gameData.insertNum].mask = $.frame['frameMask'];
	puzzleContainer.addChild($.dogs[gameData.insertNum]);
	
	gameData.startX += ($.dogs[gameData.insertNum].image.naturalWidth/100 * 90) * gameData.dogScale;
	
	gameData.insertNum++;
	gameData.arrayNum++;
	if(gameData.arrayNum > gameData.array.length-1){
		randomDogsList();
	}
	
	if(gameData.startX > gameData.frameWidth/100 * 105){
		var startRangeX = 20 * gameData.dogScale;
		gameData.startX = (Math.random()*startRangeX*2) - (startRangeX);
		gameData.startY += dogHeightSpace * gameData.dogScale;
	}
	
	if(gameData.startY < gameData.frameHeight/100 * 120){
		createDogsLoop();
	}
}

/*!
 * 
 * RANDOMIZE DOG lISTS - This is the function that runs to randomize dog lists
 * 
 */
function randomDogsList(){
	gameData.arrayNum = 0;
	gameData.array = [];
	
	for(n=0;n<dogs_arr.length;n++){
		gameData.array.push(n);
	}
	
	shuffle(gameData.array);
}

/*!
 * 
 * INSERT PUG - This is the function that runs to insert pug in random position
 * 
 */
function insertPug(){
	var randomNum = Math.floor(Math.random()*(gameData.insertNum-1));
	var range = 20;
	var shuffleData = {x:false, y:false};
	if($.dogs[randomNum].x < gameData.frameWidth/100 * range || $.dogs[randomNum].x > gameData.frameWidth/100 * (100 - range)){
		shuffleData.x = true;
	}
	if($.dogs[randomNum].y < gameData.frameHeight/100 * range || $.dogs[randomNum].y > gameData.frameHeight/100 * (100 - range)){
		shuffleData.y = true;
	}
	
	if(shuffleData.x || shuffleData.y){
		insertPug();
		return;
	}
	
	var pugNum = Math.floor(Math.random()*pug_arr.length);
	$.dogs['target'] = $.clone['orginal_'+pugNum].clone();
	$.dogs['target'].mask = $.frame['frameMask'];
	puzzleContainer.addChild($.dogs['target']);
	
	var index = puzzleContainer.getChildIndex($.dogs[randomNum]);
	puzzleContainer.setChildIndex($.dogs['target'], index);
	$.dogs['target'].x = $.dogs[randomNum].x;
	$.dogs['target'].y = $.dogs[randomNum].y;
	$.dogs['target'].scaleX = $.dogs[randomNum].scaleX;
	$.dogs['target'].scaleY = $.dogs[randomNum].scaleY;
	$.dogs[randomNum].alpha = 0;
	
	//$.dogs['target'].cursor = "pointer";
	$.dogs['target'].addEventListener("click", function(evt) {
		if(!playerData.paused){
			var oldY = $.dogs['target'].y;
			$($.dogs['target'])
			.clearQueue()
			.stop(true,true)
			.animate({ y:oldY-20 }, 200)
			.animate({ y:oldY }, 300);
			
			var randomRadioNum = Math.floor(Math.random()*3)+1;
			playSound('soundPug'+randomRadioNum);
			stopGame(true);
		}
	});
}

/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
var gameTimerInterval = null;
var gameTimerUpdate = false;
var nowDate;
var beforeDate;

function toggleGameTimer(con){
	if(con){
		beforeDate = new Date();
		playerData.time = 0;
		playerData.soundTime = 0;
		updateGameTimer();
	}
	gameTimerUpdate = con;
}

function updateGame(){
	if(gameTimerUpdate){
		nowDate = new Date();
		playerData.time = (nowDate.getTime() - beforeDate.getTime());
		if(countdownMode){
			playerData.time = (Number(levels_arr[gameData.levelNum].timer) - playerData.time);
			
			if(playerData.soundTime > 0){
				playerData.soundTime--;
			}else{
				if(playerData.time > 15000){
					playerData.soundTime = 80;
				}else if(playerData.time > 10000){
					playerData.soundTime = 50;
				}else if(playerData.time > 5000){
					playerData.soundTime = 30;
				}else{
					playerData.soundTime = 10;	
				}
				updateTimerSound();
			}
			
			if(playerData.time <= 0){
				playerData.time = 0;
				stopGame(false);	
			}
		}
		updateGameTimer();
	}
}

function updateGameTimer(){
	txtTime.text = millisecondsToTime(playerData.time);
}

function updateTimerSound(){
	playSound('soundClock');
}

/*!
 * 
 * SAVE IMAGE - This is the function that runs to download puzzle photo
 * 
 */
function saveImagePhp(){
	puzzleContainer.cache(0,0,gameData.frameWidth,gameData.frameHeight);
	var data = puzzleContainer.getCacheDataURL();
	puzzleContainer.uncache();
	data = data.substr(data.indexOf(',') + 1).toString();
         
	var dataInput = document.createElement("input") ;
	dataInput.setAttribute("name", 'imgdata') ;
	dataInput.setAttribute("value", data);
	dataInput.setAttribute("type", "hidden");
	 
	var nameInput = document.createElement("input") ;
	nameInput.setAttribute("name", 'name') ;
	nameInput.setAttribute("value", puzzleFileName + '.jpg');
	
	var myForm = document.createElement("form");
	myForm.method = 'post';
	myForm.action = 'save.php';
	myForm.target = '_blank';
	myForm.appendChild(dataInput);
	myForm.appendChild(nameInput);
	 
	document.body.appendChild(myForm) ;
	myForm.submit();
	document.body.removeChild(myForm) ;	
}

/*!
 * 
 * UPLOAD IMAGE - This is the function that runs to upload your puzzle photo
 * 
 */
var uploadProgress = false;
function uploadImage(action){
	if(!uploadProgress){
		if(playerData.imageUploaded){
			share(action);
		}else{
			uploadProgress = true;
			txtShare.text = processShareText;
			puzzleContainer.cache(0,0,gameData.frameWidth,gameData.frameHeight);
			var imgData = puzzleContainer.getCacheDataURL();
			puzzleContainer.uncache();
			
			$.ajax({
				type: "POST",
				url: "upload.php",
				data: {img:imgData}
			}).done(function(o) {
				uploadProgress = false;
				txtShare.text = shareText;
				playerData.imagePath = jQuery.parseJSON(o);
				playerData.imageUploaded = true;
				share(action);
			});
		}
	}
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTime(milli) {
      var milliseconds = milli % 1000;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);
	  
	  if(seconds<10){
		seconds = '0'+seconds;  
	  }
	  
	  if(minutes<10){
		minutes = '0'+minutes;  
	  }
	  return minutes + ":" + seconds + ':' + formatDigit (milliseconds, 2);
}

function convertReusltTime(milli) {
	  var timeFormat = 'seconds';
      var milliseconds = milli % 1000;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);
	  
	  if(minutes>0){
		if(seconds<10){
			seconds = '0'+seconds;  
		}
		
		if(minutes<10){
			minutes = '0'+minutes;  
		}
		
		timeFormat = 'minutes'; 
		return minutes + ":" + seconds +'.'+milliseconds+timeFormat;
	  }else{
		return seconds + '.' + milliseconds +' '+ timeFormat; 
	  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	var title = '';
	var text = '';
	
	var finalScore = '';
	if(elapsedTimeMode && countdownMode){
		finalScore = convertReusltTime(Number(levels_arr[gameData.levelNum].timer) - playerData.time);
	}else{
		finalScore = convertReusltTime(playerData.time);
	}
	title = shareTitle.replace("[SCORE]", finalScore);
	text = shareMessage.replace("[SCORE]", finalScore);
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		if(sharePuzzleImage){
			var shareImage = loc+playerData.imagePath;
			shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+shareImage+'&width='+gameData.frameWidth+'&height='+gameData.frameHeight);
		}else{
			shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
		}
	}else if( action == 'google' ){
		shareurl = 'mailto:?subject=Can you find Kanye? &amp;body=Check out this site http://www.findkanye.xyz'+loc;
	}
	
	window.open(shareurl);
}