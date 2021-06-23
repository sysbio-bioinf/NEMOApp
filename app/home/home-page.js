const app = require("tns-core-modules/application");
const tools = require("../tools/tools.js");
const appSettings = require("tns-core-modules/application-settings");
const HomeViewModel = require("./home-view-model");
const database = require("../database/databaseInterface");
const frameModule = require("tns-core-modules/ui/frame");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();

    global.guiStringsLoaded.then(function (value) {

        tools.bindGuiStrings(page.bindingContext);
    });

    // let helpText = page.getViewById("helpText");

    // //display this note only when another entry was stored at the same day
    // if (appSettings.hasKey("latestEntry") &&
    //     (appSettings.getString("latestEntry") == tools.getCurrentTimeStampShort())) {
    //         helpText.visible = true;
    //         console.log(appSettings.getString("latestEntry"));
    //     }
    //     else {

    //         helpText.visible = false;
    //     }
    //init font sizes 
    tools.adjustFontSizes(page.bindingContext);

	// check for uuid
	patient_uuid=appSettings.getString("PatientID")
	if (typeof(patient_uuid)==="undefined")
	{	// no; we create one
		patient_uuid=create_uuid()
		appSettings.setString("PatientID",patient_uuid)
	}
}

function onLoaded(args) {
    const page = args.object;
    // tools.bindGuiStrings(page.bindingContext);
    global.guiStringsLoaded.then(function (value) {

        tools.bindGuiStrings(page.bindingContext);
    });
    //console.log(appSettings.getString("latestEntry : " + appSettings.("latestEntry") + "; " + appSettings.getString("latestEntry") + ", " + tools.getCurrentTimeStampShort()));
    //display this note only when another entry was stored at the same day
    let helpText = page.getViewById("helpText");
    if (appSettings.hasKey("latestEntry") &&
        (appSettings.getString("latestEntry") == tools.getCurrentTimeStampShort())) {
        
        helpText.visibility = "visible";
    }
    else {
        
        helpText.visibility = "hidden";
    }

    tools.activateHyphenation(page);
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}


function onTapPlus(args) {
    const button = args.object;
    const page = button.page;
    appSettings.setNumber("currentTab", 0);
    page.frame.navigate("status_erfassen/status_erfassen-page");





}

/* maybe use better random than Math.random
*/
function create_uuid()
{	var d=new Date().getTime()
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
		function(c)
		{	var r=Math.floor(Math.random()*16)
			r=(d+r)%16
			d=Math.floor(d/16)
			if (d==0)
			{	d=new Date().getTime()
			}
			return (c==='x' ? r : ((r & 0x3) | 0x8)).toString(16)
		})	
}

exports.onLoaded = onLoaded;
exports.onTapPlus = onTapPlus;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
