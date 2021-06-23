const app = require("tns-core-modules/application");
const tools = require("../tools/tools.js");
const MedicationViewModel = require("./medication-view-model");
const database = require("../database/databaseInterface");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new MedicationViewModel();
    global.guiStringsLoaded.then(function(value) {
        tools.bindGuiStrings(page.bindingContext);
    })
    tools.activateHyphenation(page);

    //init font sizes 
    tools.adjustFontSizes(page.bindingContext);
}

function onLoaded(args)
{

}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}



/**
 * 
 * @param {Button} args 
 */
function onTapMedication(args) {
    var dialogs = require("tns-core-modules/ui/dialogs");
    dialogs.confirm({
        title: global.guiStrings[0].medicationChangedTitle,
        message: global.guiStrings[0].medicationChangedDialog,
        okButtonText: global.guiStrings[0].medicationChangedConfirm,
        cancelButtonText: global.guiStrings[0].medicationChangedCancel
    }).then(function (result) {
        if(result){

            healthRecord = Array(22);
            healthRecord.fill(-1);
            //get current time in yyyy-mm-dd-hh:mm
            healthRecord[0] = tools.getCurrentTimeStamp();
            database.transmitData(tools.parseHealthRecordList(healthRecord));
        }
    });
}

exports.onTapMedication = onTapMedication;
exports.onLoaded = onLoaded;
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
