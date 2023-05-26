////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas");
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", tick);	
}

var canvasContainer, mainContainer, gameContainer, puzzleContainer, frameContainer, cloneContainer, resultContainer, shareContainer;
var bg, landing, buttonStart, txtTime, buttonDownload, buttonShare, buttonNext, buttonReplay, buttonFacebook, buttonTwitter, buttonGoogle, overlayResultFrame, overlayResultFrameMask, overlayShareFrame, overlayShareFrameMask, txtComplete, txtShare;

$.clone={};
$.dogs={};
$.frame={};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
	mainContainer = new createjs.Container();
	puzzleContainer = new createjs.Container();
	frameContainer = new createjs.Container();
	cloneContainer = new createjs.Container();
	gameContainer = new createjs.Container();
	resultContainer = new createjs.Container();
	shareContainer = new createjs.Container();
	
	bg = new createjs.Bitmap(loader.getResult('background'));
	
	landing = new createjs.Bitmap(loader.getResult('landing'));
	buttonStart = new createjs.Bitmap(loader.getResult('buttonStart'));
	centerReg(buttonStart);
	buttonStart.x = canvasW/2;
	buttonStart.y = canvasH/100 * 75;
	
	$.frame['frameBackground'] = new createjs.Shape();
	$.frame['frameInner'] = new createjs.Shape();
	$.frame['frameOuter'] = new createjs.Shape();
	$.frame['frameMask'] = new createjs.Shape();
	
	
	overlayResultFrame = new createjs.Shape();
	overlayResultFrameMask = new createjs.Shape();
	overlayShareFrame = new createjs.Shape();
	overlayShareFrameMask = new createjs.Shape();
	
	for(n=0;n<pug_arr.length;n++){
		$.clone['orginal_'+n] = new createjs.Bitmap(loader.getResult('orginal_'+n));
		$.clone['orginal_'+n].regX = $.clone['orginal_'+n].image.naturalWidth/2;
		$.clone['orginal_'+n].regY = $.clone['orginal_'+n].image.naturalHeight;
		cloneContainer.addChild($.clone['orginal_'+n]);
	}
	
	for(n=0;n<dogs_arr.length;n++){
		$.clone['type_'+n] = new createjs.Bitmap(loader.getResult('type_'+n));
		$.clone['type_'+n].regX = $.clone['type_'+n].image.naturalWidth/2;
		$.clone['type_'+n].regY = $.clone['type_'+n].image.naturalHeight;
		cloneContainer.addChild($.clone['type_'+n]);
	}
	
	txtTime = new createjs.Text();
	txtTime.font = "50px mine_oh_minemedium";
	txtTime.color = "#ffffff";
	txtTime.text = '00:00';
	txtTime.textAlign = "left";
	txtTime.textBaseline='alphabetic';
	txtTime.x = canvasW/100 * 42;
	txtTime.y = canvasH/100 * 95;
	
	buttonDownload = new createjs.Bitmap(loader.getResult('buttonDownload'));
	centerReg(buttonDownload);
	buttonDownload.x = canvasW/2;
	buttonDownload.y = canvasH/100 * 90;
	
	buttonShare = new createjs.Bitmap(loader.getResult('buttonShare'));
	centerReg(buttonShare);
	buttonShare.x = canvasW/100 * 32;
	buttonShare.y = canvasH/100 * 93;
	
	buttonNext = new createjs.Bitmap(loader.getResult('buttonNext'));
	centerReg(buttonNext);
	buttonNext.x = canvasW/100 * 68;
	buttonNext.y = canvasH/100 * 93;
	
	buttonReplay = new createjs.Bitmap(loader.getResult('buttonReplay'));
	centerReg(buttonReplay);
	buttonReplay.x = canvasW/100 * 68;
	buttonReplay.y = canvasH/100 * 93;
	
	buttonFacebook = new createjs.Bitmap(loader.getResult('buttonFacebook'));
	centerReg(buttonFacebook);
	buttonFacebook.x = canvasW/100 * 32;
	buttonFacebook.y = canvasH/100 * 75;
	
	buttonTwitter = new createjs.Bitmap(loader.getResult('buttonTwitter'));
	centerReg(buttonTwitter);
	buttonTwitter.x = canvasW/2;
	buttonTwitter.y = canvasH/100 * 75;
	
	buttonGoogle = new createjs.Bitmap(loader.getResult('buttonGoogle'));
	centerReg(buttonGoogle);
	buttonGoogle.x = canvasW/100 * 68;
	buttonGoogle.y = canvasH/100 * 75;
	
	txtComplete = new createjs.Text();
	txtComplete.font = "35px mine_oh_minemedium";
	txtComplete.color = "#666666";
	txtComplete.text = '00:00';
	txtComplete.textAlign = "center";
	txtComplete.textBaseline='alphabetic';
	txtComplete.lineHeight = 35;
	txtComplete.x = canvasW/2;
	txtComplete.y = canvasH/100 * 75;
	
	txtShare = new createjs.Text();
	txtShare.font = "35px mine_oh_minemedium";
	txtShare.color = "#666666";
	txtShare.text = shareText;
	txtShare.textAlign = "center";
	txtShare.textBaseline='alphabetic';
	txtShare.lineHeight = 35;
	txtShare.x = canvasW/2;
	txtShare.y = canvasH/100 * 68;
	
	mainContainer.addChild(landing, buttonStart);
	gameContainer.addChild(cloneContainer, frameContainer, puzzleContainer, txtTime)
	resultContainer.addChild(overlayResultFrame, overlayResultFrameMask, buttonDownload, buttonShare, buttonReplay, buttonNext, txtComplete);
	shareContainer.addChild(overlayShareFrame, overlayShareFrameMask, buttonFacebook, buttonTwitter, buttonGoogle, txtShare);
	canvasContainer.addChild(bg, mainContainer, gameContainer, resultContainer, shareContainer);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
 	if(canvasContainer!=undefined){
		//canvasContainer.scaleX=canvasContainer.scaleY=scalePercent;
	}
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame();
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}