const app = require("tns-core-modules/application");
const view = require("tns-core-modules/ui/core/view");
const BrowseViewModel = require("./status_erfassen-view-model");
const Vocoder = require("../vocoder/vocoder.js").Vocoder;
const vocoder = new Vocoder();
const slidesView = require('./slides-view');
const tools = require("../tools/tools.js");
const appSettings = require("tns-core-modules/application-settings");
const database = require("../database/databaseInterface");
const frame = require('ui/frame');
const Color = require("tns-core-modules/color").Color;
const platformModule = require("tns-core-modules/platform");
const timerModule = require("tns-core-modules/timer");

//variable to store the current record 
//var healthRecord;
function onLoaded(args) {
	// set page title

	const page = args.object;
	var view = page.getViewById("slide-content");
	var vm = args.object.bindingContext;
	global.guiStringsLoaded.then(function(value) {
		tools.bindGuiStrings(vm);
	
	});
	//check for global slide number
	if(appSettings.hasKey("currentTab") && appSettings.getNumber("currentTab") == 0){
		if(vm.currentSlideNum != appSettings.getNumber("currentTab"))
			if((appSettings.getString("latestEntry") != tools.getCurrentTimeStampShort()))
				args.object.page.frame.navigate("home/home-page");
		
	}
	//tools.bindGuiStrings(vm);   // must be called here for solving diary title 'undefined' problem on iOS 
	if (vm.currentSlideNum==0)
	{	vocoder.speakQuestion(vm.currentSlideNum);
	}
	// for highlight currently spoken answer
	vocoder.cb_spoken_answer=callback_spoken_answer
	vocoder.cb_clear_highlight=callback_clear_highlight
	vocoder.page=args.object
	vocoder.cb_clear_highlight()
	vocoder.which_slide="wellness"	// always startwith this
	vocoder.special_therapy=false
	
	//gen time stamp for tab
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate();
	var hours = today.getHours();
	var minutes = today.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	var timestamp = day + "." + month + "." + year + " " + hours + ":" + minutes;

	//init text for buttons and labels
	//tools.bindGuiStrings(vm);
	var title = vm.get("diaryPageTitle");
	var titleWithTimestamp = title + " - " + timestamp;
	vm.set("diaryPageTitleWithTimestamp", titleWithTimestamp);

	//init pickers to enter weight and pulse
	initializeWeightPicker(vm);
	if(appSettings.hasKey("SpecTherapy"))
    {
        if(appSettings.getBoolean("SpecTherapy"))
			initializePulsePicker(vm);
			vocoder.special_therapy=true
	}
	
	//init font sizes 
	tools.adjustFontSizes(vm);

	//bind buttons to corresponding action
	vm.set("switchTab", switchTab);
	vm.set("doneTap", doneTap);
	vm.fromOutside = true;
	//vm.set("switchBack", switchBack);

	//redefine function of android back button -> step back to previous question
	if (app.android) {
		tools.activateHyphenation(args.object.page);
		app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
	}
	app.on(app.suspendEvent,() =>
		{	vocoder.cb_clear_highlight()
		}
	)
}

/**
 * Undo overwritting of android back button
 * @param {} args 
 */
function onUnloaded(args) {
	const page = args.object;
	const vm = page.bindingContext;
	vocoder.volume=0
	vocoder.audioPlayer.dispose();
	if (vm.currentSlideNum != 0) { //-2 as last tab is currently hidden
		const appSettings = require("application-settings");
		appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
		appSettings.setNumber("currentTab", vm.currentSlideNum);
	}
	if (app.android) {
		app.android.off(app.AndroidApplication.activityBackPressedEvent, backEvent);
	}
	app.off(app.suspendEvent)
}

function onNavigatingTo(args) {
	
	global.guiStringsLoaded.then(function(value) {
		tools.bindGuiStrings(vm);
	
	});
	const page = args.object;
	var view = page.getViewById("slide-content");
	var vm;

	var specTherapy = false;
	if (appSettings.hasKey("SpecTherapy")) {
		if (appSettings.getBoolean("SpecTherapy")) {
			specTherapy = true;
		}
	}

    var summaryIndex = 12;
	if (specTherapy) {
		summaryIndex = 21;
	}

	//if another entry was created today -> only show summary
	if (appSettings.hasKey("latestEntry") &&
		(appSettings.getString("latestEntry") == tools.getCurrentTimeStampShort())) {
		view.content = slidesView.getSlides(summaryIndex);
		page.bindingContext = new BrowseViewModel(view.content);
		vm = page.bindingContext;
		tools.bindGuiStrings(vm);
		vm.healthRecord = JSON.parse(appSettings.getString("healthRecord", "[]"));
		vm.healthRecord[0] = tools.getCurrentTimeStamp();
		appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
		vm.currentSlideNum = summaryIndex;

		// console.log("Another entry today: " + appSettings.getString("healthRecord", "[]"));
		// //extract last entry
		initSummary(vm, true);
		// //go to summary slide
	}

	//get settings from app-setting
	else if (appSettings.hasKey("currentTab")) {
		//init view at currentTab
		var cont = slidesView.getSlides(appSettings.getNumber("currentTab"));

		view.content = cont;
		page.bindingContext = new BrowseViewModel(view.content);
		vm = page.bindingContext;
		tools.bindGuiStrings(vm);
		
		//set to stored tab num
		vm.currentSlideNum = appSettings.getNumber("currentTab");

		//if not 0, get healthrecord
		let createNewEntry = true;
		if (vm.currentSlideNum != 0) {
			//initialize summary if summary tab was active last
			vm.healthRecord = JSON.parse(appSettings.getString("healthRecord", "[]"));
			//get current time in yyyy-mm-dd-hh:mm
			let currentTimestamp = tools.getCurrentTimeStamp();
			// check if unfinished diary entry is from today, otherwise discard it
			if (vm.healthRecord[0].substr(0, 10) == currentTimestamp.substr(0, 10)) {
				createNewEntry = false;
				vm.healthRecord[0] = tools.getCurrentTimeStamp();
				appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
				if (vm.currentSlideNum == summaryIndex) {
					let changeMode = false;
					if (appSettings.hasKey("summaryChangeMode")) {
						changeMode = appSettings.getBoolean("summaryChangeMode");
					}
					
					initSummary(vm, changeMode);
				}
			}
		}

		//initiate healthRecord
		if (createNewEntry) {
			//init view at currentTab
			view.content = slidesView.getSlides(0);
			appSettings.setBoolean("completed", false);
			appSettings.remove("summaryChangeMode");
			page.bindingContext = new BrowseViewModel(view.content);
			const vm = page.bindingContext;
			tools.bindGuiStrings(vm);   // must be called here for solving diary title 'undefined' problem on Android

			vm.healthRecord = Array(22);
			//get current time in yyyy-mm-dd-hh:mm
			vm.healthRecord[0] = tools.getCurrentTimeStamp();
			appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
		}
	}
	//else not initialized and tab is initialized from scratch
	else {
		view.content = slidesView.getSlides(0);
		page.bindingContext = new BrowseViewModel(view.content);
		vm = page.bindingContext;

		page.bindingContext.healthRecord = Array(22);
		page.bindingContext.healthRecord[0] = tools.getCurrentTimeStamp();
	}

	vm.fromOutside = true;
	//set to starting index when entering questionary:
	global.minBackIdx = vm.currentSlideNum;
}

/**
 * Initialize GridLayout which summarizes answers in the last tab
 * 
 */
function initSummary(bindingContext, switchBackFlag, slideNum) {
	//extract grid to fill :
	const hRec = JSON.parse(appSettings.getString("healthRecord", "[]"));
	const idx = require("./slides/index");
	//therapy sepcific display
	var shortNames = idx.names;
	var orientations = idx.orientations;
	var specTherapy = false;
	if(appSettings.hasKey("SpecTherapy"))
    {
		if(appSettings.getBoolean("SpecTherapy"))
		{
			shortNames = idx.namesSpec;
			orientations = idx.orientationsSpec;
			specTherapy = true;
		}
		else
		{
			shortNames = idx.names;
			orientations = idx.orientations;
			specTherapy = false;
		}
	}
	
	let summaryChangeMode = false;
	if (appSettings.hasKey("summaryChangeMode")) {
		summaryChangeMode = appSettings.getBoolean("summaryChangeMode");
	} else if (switchBackFlag) {
		summaryChangeMode = true;
	}
	
	
	for (i = 0; i < shortNames.length; i++) {
		let shortName = shortNames[i];
		let value = hRec[i + 1];   // the health record has an additional first column
		if (summaryChangeMode) {
			if (i == 9 || i == 10 || i == 20) {
				bindingContext.set(shortName + "SummaryCssClass", "-btn btn-primary my-button-summary my-button-gradX");
			} else if (i == 8) {  // movement (reverse coloring)
				bindingContext.set(shortName + "SummaryCssClass", "-btn btn-primary my-button-summary my-button-grad" + Math.abs(value - 1));
			} else if (i == 11) {
				bindingContext.set(shortName + "SummaryCssClass", "-btn btn-primary my-button-summary my-button-gradN" + value);
			} else {
				bindingContext.set(shortName + "SummaryCssClass", "-btn my-button-summary my-button-grad" + value);
			}
			bindingContext.set(shortName + "SummaryOrientation", "vertical");
			bindingContext.set("changeButtonCurrent", bindingContext.get("changeButtonTapped"));
			bindingContext.set("changeButtonSize", bindingContext.get("mySizeSummary"));
		} else {
			bindingContext.set(shortName + "SummaryCssClass", "summary text-left");
			bindingContext.set(shortName + "SummaryOrientation", orientations[i]);
			bindingContext.set("changeButtonCurrent", bindingContext.get("changeButton"));
			bindingContext.set("saveButtonCurrent", bindingContext.get("saveButton"));
			bindingContext.set("changeButtonSize", bindingContext.get("mySizeSummary"));
		}
		if (i <= 8 || i === 11 || (specTherapy && i > 11 && i <= 19)) {
			//console.log(shortName + "Answer" + value);
			bindingContext.set(shortName, bindingContext.get(shortName + "Answer" + value));
		} else if (i === 9 || i === 10 || (specTherapy && i === 20)) {
			var answerText = hRec[i + 1];
			bindingContext.set(shortName, answerText);
		}
	}

    if (summaryChangeMode) {
        bindingContext.set("switchBack", switchBack);
        bindingContext.set("activateSwitchBack", deactivateSwitchBack);
        bindingContext.set("summaryFlexWrapBefore", "true");
        bindingContext.set("summaryFlexGrow", "0");   // switch off temporarily, needed to fix button height recalculattion on iOS
        bindingContext.set("summaryEventFlexWrapBefore", "true");
        if (!hRec[11]) {
            if (platformModule.isIOS) {
                bindingContext.set("summaryEventFlexWrapBefore", "false");
            }
        }
        bindingContext.set("summaryFlexGrow", "1");  // switch on, needed to get buttons spanning the whole page width
    } else {
        bindingContext.set("switchBack", function () { });   // empty function, needed to override previous function
        bindingContext.set("activateSwitchBack", activateSwitchBack);
        bindingContext.set("summaryFlexWrapBefore", "false");
        bindingContext.set("summaryEventFlexWrapBefore", "false");
        bindingContext.set("summaryFlexGrow", "1");
    }
}



//store current state of answers
function onNavigatingFrom(args) {
	
	const page = args.object;
	const vm = page.bindingContext;
	//&& vm.currentSlideNum != vm.slideCount-1
	if (vm.currentSlideNum != 0) { //-2 as last tab is currently hidden
		const appSettings = require("application-settings");
		appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
		appSettings.setNumber("currentTab", vm.currentSlideNum);
	}
}

/**
 * Replacement function for switchTab while switchTab is running
 *   Needed for fixing multiple simultaneous button presses on the same slide 
 */
function switchTabOff() {
	return;
}

/**
 * Listen on actions of buttons on GUI-slides
 * Store given answers in healthRecord 
 * Trigger navigation to successor tab
 * Store healthrecord after completion of questions
 * @param {Button} args 
 */
function switchTabOff() {
	return;
}
function switchTab(args) {
	var id = args.object.id;
	var parentId = args.object.parent.id;
	
	let vm = args.object.bindingContext;
	vm.set("switchTab", switchTabOff);
	//var tabSelectedIndex = vm.get("currentSlideNum");
	//set therapy specific settings of slides
	var slideIdx = require('./slides/index');
	var tabSelectedIndex = slideIdx.nameToIndex[parentId];
	console.log("DEBUG: parentId=" + parentId + "  tabSelectedIndex=" + tabSelectedIndex + "  value=" + id);
	var specTherapy = false;
	if(appSettings.hasKey("SpecTherapy"))
	{
		if(appSettings.getBoolean("SpecTherapy"))
			specTherapy = true;
		else
			specTherapy = false;
	}
	
	// stop voice
	vocoder.volume=0
	vocoder.audioPlayer.dispose();

	if (tabSelectedIndex <= 8 || (specTherapy && (tabSelectedIndex >= 11 && tabSelectedIndex < 20)))
		vm.healthRecord[tabSelectedIndex + 1] = id;
	else if (tabSelectedIndex === 9)
		vm.healthRecord[tabSelectedIndex + 1] = vm.get("kgSelected") + "." + vm.get("hgSelected");
	else if (tabSelectedIndex === 10) {
		vm.healthRecord[tabSelectedIndex + 1] = cleanNote(vm.notes);
	}
	else if (!specTherapy && tabSelectedIndex === 11) {
		vm.healthRecord[tabSelectedIndex + 1] = id;
		appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
		initSummary(vm, false, tabSelectedIndex);
		appSettings.setBoolean("completed", true);
	}

	//specific for extended questionaire
	else if (specTherapy && tabSelectedIndex === 20) {
		
		vm.healthRecord[tabSelectedIndex + 1] = vm.get("pulseSelected");
		appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
		initSummary(vm, false, tabSelectedIndex);
		appSettings.setBoolean("completed", true);
	}

	//if last table, store record and jump back to home view
	else if ((!specTherapy && tabSelectedIndex === 12) || (specTherapy && tabSelectedIndex === 21)) {
		database.transmitData(tools.parseHealthRecordList(vm.healthRecord));
		appSettings.setString("latestEntry", tools.getCurrentTimeStampShort());
		appSettings.setNumber("currentTab", 0);
		vm.currentSlideNum = 0;
		appSettings.setBoolean("completed", true);
		if (appSettings.hasKey("summaryChangeMode")) {
			appSettings.remove("summaryChangeMode");
		}
		tools.setNotification(tools.getAppSetting("SendNotificationsOption", "boolean"), vm, "tomorrow");  // skip notification for the current day, if activated

		args.object.page.frame.navigate("home/home-page");
		timerModule.setTimeout(activateSwitchTab, 50, vm);
		return;
	}
	//switch to next tab
	appSettings.setString("healthRecord", JSON.stringify(vm.healthRecord));
	
	//jump back to summary if already completed
	if (appSettings.getBoolean("completed") && 
		((!specTherapy && tabSelectedIndex != 11) || 
		(specTherapy && tabSelectedIndex != 20))) {
		
		initSummary(vm, true, tabSelectedIndex);
		vm.jumpToLast();
	}
	else {
		vm.onClick();
		//play next question 
		vocoder.cb_clear_highlight()
		vocoder.page=args.object.parent.page
		if (!specTherapy)
		{	vocoder.which_slide=slideIdx.names[vm.currentSlideNum]
		}
		else
		{	vocoder.which_slide=slideIdx.namesSpec[vm.currentSlideNum]
		}
		var index_vocoder
		for (let i of Object.keys(vocoder.config.indexToId))
		{	if (vocoder.which_slide==vocoder.config.indexToId[i])
			{	index_vocoder=i
				break
			}
		}
		vocoder.speakQuestion(index_vocoder)
	}

	vm.fromOutside = false;
	timerModule.setTimeout(activateSwitchTab, 50, vm);
	//vm.set("switchTab", switchTab);

}

function activateSwitchTab(vm) {
	vm.set("switchTab", switchTab);
}

/**
 * Reactivate switchTab function binding to slide buttons
 * @param {BindingContext} vm 
 */
function activateSwitchTab(vm) {
	vm.set("switchTab", switchTab);
}

/**
 * Remove special characters from note
 * Needed for internal iOS QR code generator to avoid missing QR codes
 * @param {} note 
 */
function cleanNote(note) {
	cleanedNote = "";
	if (typeof(note) == 'undefined')
	{	return cleanedNote;
	}
	var characters = note.split("");
	var cleanedCharacters = [];
	var regExp = /[a-z]|[0-9]|[\$&@\-\/:;\(\)\.,\?!\[\]\{\}#%\^\*\+=_\\\|<>£¥äöüß` ]/i;

	for (var i=0; i<characters.length; i++) {
		var character = String(characters[i]);
		if (character.match(regExp)) {
			cleanedCharacters.push(character);
		} else {
			var singleQuote = "'";
			var doubleQuote = "\"";
			var charCode = character.charCodeAt(0);
			if (charCode == 8216 || charCode == 8217 || charCode == 39) {
				cleanedCharacters.push(singleQuote);
			} else if (charCode == 8220 || charCode == 8221 || charCode == 34) {
				cleanedCharacters.push(doubleQuote);
			}
		}
	}

	cleanedNote = cleanedCharacters.join("");
    return cleanedNote;
}

function goBack(page, index, fromOutside)
{
	let vm = page.bindingContext;
	var view = page.getViewById("slide-content");
	const idx = require("./slides/index");
	
	vm.jumpToIdx(index);
	var shortNames
	if (!vocoder.special_therapy)
	{	shortNames= idx.names;
	}
	else
	{	shortNames=idx.namesSpec
	}
	vm.fromOutside = fromOutside;
	
	appSettings.setBoolean("summaryChangeMode", true);
	if (index!=10 || index!=9)
	{	highlightSelectedButton(view, shortNames[index], vm.healthRecord[index + 1]);
	}
	if (index===10)
	{	set_comment(page, shortNames[index], vm.healthRecord[index + 1]);
	}
	vocoder.which_slide=shortNames[index]
	var index_vocoder
	for (let i of Object.keys(vocoder.config.indexToId))
	{	if (vocoder.which_slide==vocoder.config.indexToId[i])
		{	index_vocoder=i
			break
		}
	}
	vocoder.cb_clear_highlight()
	vocoder.speakQuestion(index_vocoder)
	vocoder.page=page
}

function set_comment(page,questionName, text)
{	const row = page.content.getViewById(questionName);
	const element=row.getViewById("note");
	element.text=text
}

function backEvent(args) {
	var page = frame.Frame.topmost().currentPage;
	let vm = page.bindingContext;

	if(vm.currentSlideNum > 0 && !vm.fromOutside && global.minBackIdx < vm.currentSlideNum)
	{
		var idx = vm.currentSlideNum - 1;
		goBack(page, idx, vm.fromOutside);
		args.cancel = true; //disable standard android step back functionality
	}
}
/**
 * Listen on actions of labels in summary tab
 * Jump back to question according to pressed label
 * @param {Button} args 
 */
function switchBack(args) {
	 //redefine function of android back button -> step back to previous question
	//  if (app.android) {
	//	 app.android.on(app.AndroidApplication.activityBackPressedEvent, backEvent);
	// }
	var questionID = args.object.parent.row;
	var page = args.object.page;
	goBack(page,questionID, false);
   
}

/**
 * Highlight button of answer if question was previously answered 
 * Function is called when jumping back in questionary
 * @param {} view 
 * @param {*} questionName 
 * @param {*} buttonId 
 */
function highlightSelectedButton(view, questionName, buttonId) {
	
	if (view) {
		const row = view.content.getViewById(questionName);
		if (row) {
			//unset highlights
			row.eachChildView(function(view) {view.borderWidth=0;});
			let selectedButton = row.getViewById(buttonId);
			
			if (selectedButton && selectedButton.typeName == "Button") {
				selectedButton.borderWidth = 4;
				selectedButton.borderColor = "rgb(180,180,180)";
			}
		}
	}
}

/**
 * Listen on actions of change button in summary tab
 * Activate switchBack and reformat summary
 * 
 * @param {Button} args 
 */
function activateSwitchBack(args) {
	appSettings.setBoolean("summaryChangeMode", true);
	if (args.object.bindingContext) {
		
		initSummary(args.object.bindingContext, true);
	}
}

/**
 * Listen on actions of change button in summary tab
 * Deactivate switchBack  and reformat summary
 * 
 * @param {Button} args 
 */
function deactivateSwitchBack(args) {
	if (appSettings.hasKey("summaryChangeMode")) {
		appSettings.remove("summaryChangeMode");
	}
	if (args.object.bindingContext) {
		
		initSummary(args.object.bindingContext, false);
	}
	//appSettings.setBoolean("summaryChangeMode", false);
}


/**
 Function to initialize pickers to enter weight in KG and 100 grams. Function is called when GUI is built
*/
function initializeWeightPicker(vm) {
	//init kg picker
	var kgItems = new Array();
	var kgOffset = 0;
	for (var i = kgOffset; i <= 350; i++) {
		kgItems.push(i);
	}
	vm.set("kgItems", kgItems);
	vm.set("kgOffset", kgOffset);
	vm.set("kgHeight", 120);

	//init hg picker
	hgItems = new Array();
	for (var i = 0; i <= 9; i++) {
		hgItems.push(i);
	}
	vm.set("hgItems", hgItems);
	
	// set last weight (or default if database is empty)
	getLastWeightFromDB(vm);
}

function initializePulsePicker(vm)
{
	var pulseItems = new Array();
	var pulseOffset = 30;
	for (var i = pulseOffset; i <= 180; i++) {
		pulseItems.push(i);
	}
	vm.set("pulseItems", pulseItems);
	vm.set("pulseIndex", 60 - pulseOffset);
	vm.set("pulseOffset", pulseOffset);

	// set last pulse (or default if database is empty)
	getLastPulseFromDB(vm);
}

/**
 * Unfold navigation bar on right side 
 * @param {} args 
 */
function onDrawerButtonTap(args) {
	const sideDrawer = app.getRootView();
	sideDrawer.showDrawer();
}

/**
 * Helper Function to initialiaze the weight picker with the most recent weight in database
 * 
 * @param {Object} vm, binding context
 */
function getLastWeightFromDB(vm) {
	//db related includes
	var data;
	if (appSettings.hasKey("healthRecord")) {
		data = JSON.parse(appSettings.getString("healthRecord", "[]"));
		
		var results = data[data.length - 12];
		
		
		if (typeof results == "string") {
			values = results.split(".");
			vm.set("kgIndex", values[0]);
			vm.set("hgIndex", values[1]);
			if (values[0] < 20) {
				vm.set("kgHeight", 120);
			} else {
				vm.set("kgHeight", 200);
			}
			return;
		}
	}


	data = database.requestData(0);  // default weight (no kg offset)
	//console.log("DEBUG: getLastWeightFromDB : " + data);
	data.then(function (value) { //value is database

		//console.log("DEBUG: getLastWeightFromDB : " + JSON.stringify(value));
		//extract last 
		var results = value.data[value.data.length - 1];
		//console.log("DEBUG: getLastWeightFromDB : " + results);

		if (typeof results == "object") {
			weight = results.weight;
			values = weight.split(".");
			var kgOffset = vm.get("kgOffset");
			values[0] = values[0] - kgOffset;
		}

		vm.set("kgIndex", values[0]);
		vm.set("hgIndex", values[1]);
	}, function (error) {
		
	});

}

/**
 * Helper Function to initialiaze the pulse picker with the most recent pulse in database
 * 
 * @param {Object} vm, binding context
 */
function getLastPulseFromDB(vm) {
	//db related includes
	var data;
	if (appSettings.hasKey("healthRecord")) {
		data = JSON.parse(appSettings.getString("healthRecord", "[]"));
		//console.log("DEBUG: getLastPulseFromDB data hr:"); console.log(data);
		var results = data[data.length - 1];		
		
		
		if (typeof results == "string" || typeof results == "number") {
			vm.set("pulseIndex", parseInt(results) - parseInt(vm.get("pulseOffset")));
			return;
		}
	}


	var pulseIndex = vm.get("pulseIndex");
	//console.log("DEBUG: previous pulseIndex=" + pulseIndex);
	data = database.requestData(0);  // default pulse
	//console.log("DEBUG: getLastPulseFromDB data: " + data);
	data.then(function (value) { //value is database

		//console.log("DEBUG: getLastPulseFromDB value: " + JSON.stringify(value));
		//extract last 
		var results = value.data[value.data.length - 1];
		//console.log("DEBUG: getLastPulseFromDB results: "); console.log(results);

		if (typeof results == "object") {
			var pulse = parseInt(results.raceheart);
			var pulseOffset = parseInt(vm.get("pulseOffset"));
			pulseIndex = pulse - pulseOffset;
			//console.log("DEBUG: pulse=" + pulse + "  pulseOffset=" + pulseOffset + "  pulseIndex=" + pulseIndex);
		}

		vm.set("pulseIndex", pulseIndex);
	}, function (error) {
		
	});

}

/**
 * 
 * @param {} args 
 */
function doneTap(args) {
	var myTextField = args.object;
	var text = args.object.text;
	if (typeof test == "string")
	{	var splits = text.split('\n');
		// if there is a '\n' in text close text input window
		// ???
		if (splits.length>1)
		{	myTextField.dismissSoftInput();
			text=text.replace(/\n/g," ")
		}
	}
	var vm = args.object.bindingContext;
	vm.notes=text
}

function brighten(col)
{	if (col+48>255)
	{	return 255
	}
	return col+48
}

function callback_clear_highlight()
{	if (this.highlighted_button)
	{	this.highlighted_button.style.color="black"
		this.highlighted_button.backgroundColor=this.org_button_background
	}
}	

function callback_spoken_answer(number_spoken_part)
{	
	this.cb_clear_highlight()
	if (number_spoken_part==-1)
	{	return
	}

	var button
	if (["wellness","diarrhoe","vomit","pain","muco","nausea","pnp","fatigue","hypertension"].includes(this.which_slide))
	{	
		if (number_spoken_part==4) // 'oder'
		{	return
		}
		button=number_spoken_part-1
		if (button>3)
		{	button-=1
		}
	}
	else if (["medication","breath","eczema","exercise","joint","liver","muscle","vision"].includes(this.which_slide))
	{	if (number_spoken_part==2)
		{	return;
		}
		button=number_spoken_part-1
		if (button>1)
		{	button=1
		}
	}
	else if ("movement"==this.which_slide)
	{	if (number_spoken_part==2 || number_spoken_part>3)
		{	return
		}
		if (number_spoken_part==1)
		{	button=1
		}
		else
		{	button=0
		}
	}
	else
	{	return
	}

	const idx = require("./slides/index");
	var slide=this.page.content.getViewById(vocoder.which_slide)

	var button=slide.getViewById(button.toString());
	button.style.color="rgb(255,0,0)";
	this.highlighted_button=button
	var org_color=button.backgroundColor
	this.org_button_background=org_color
	var use_color=new Color(org_color.a,brighten(org_color.r),brighten(org_color.g),brighten(org_color.b))
	button.backgroundColor=use_color
}

exports.doneTap = doneTap
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onNavigatingTo = onNavigatingTo;
exports.onNavigatingFrom = onNavigatingFrom;
exports.onLoaded = onLoaded;
exports.onUnloaded = onUnloaded;
; 
if (module.hot && global._isModuleLoadedForUI && global._isModuleLoadedForUI("./status_erfassen/status_erfassen-page.js") ) {
    
    module.hot.accept();
    module.hot.dispose(() => {
        global.hmrRefresh({ type: "script", path: "./status_erfassen/status_erfassen-page.js" });
    });
} 
