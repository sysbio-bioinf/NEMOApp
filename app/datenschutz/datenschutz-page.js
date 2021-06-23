const app = require("tns-core-modules/application");
const frameModule = require("tns-core-modules/ui/frame");
const PatientendatenViewModel = require("./datenschutz-view-model");
const tools = require("../tools/tools.js");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new PatientendatenViewModel();
    tools.bindGuiStrings(page.bindingContext);
}

function onLoaded(args) {
    tools.activateHyphenation(args.object);
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

/**
 * Function for software-based back button in android 
 *
 */
function backToSettings(args) {
    
    frameModule.topmost().navigate("settings/settings-page");

}

exports.backToSettings = backToSettings;
exports.onNavigatingTo = onNavigatingTo;
exports.onLoaded = onLoaded;
exports.onDrawerButtonTap = onDrawerButtonTap;
