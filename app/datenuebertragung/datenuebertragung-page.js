const app = require("tns-core-modules/application");
const view = require("tns-core-modules/ui/core/view");
const DatenuebertragungViewModel = require("./datenuebertragung-view-model");
const tools = require("../tools/tools.js");
const timerModule = require("tns-core-modules/timer");
var fs = require("tns-core-modules/file-system");
const database = require("../database/databaseInterface");
const exporting = require("./dataExportInterface");
const appSettings = require("tns-core-modules/application-settings");

//string and image
var dbEntries;

var svgImage;

/**
 * When page datenübertragung is left. 
 * Stop show QR code sequence loop
 * @param {*} args 
 */
function onNavigatingFrom(args) {
    tools.stopQrCodeLoop();
}

/**
 * When page datenübertragung is left. 
 * Stop show QR code sequence loop
 * @param {*} args 
 */
function onUnloaded(args) {
    tools.stopQrCodeLoop();
}

/**
 * When page datenübertragung is opened. 
 * Initialize GUI-elements
 * Load database and create QR-Codes
 * @param {*} args 
 */
function onNavigatingTo(args) {
    
    const page = args.object;
    page.bindingContext = new DatenuebertragungViewModel();
    const vm = page.bindingContext;
    tools.bindGuiStrings(vm);
    vm.set("qrCodeButtonCurrent", vm.get("qrCodeButton"));
    tools.activateHyphenation(page);

    //init font sizes 
    tools.adjustFontSizes(vm);

    svgImage = page.getViewById("svgImg");


}

/**
 * onTap registered function to display QR-Code, when Button was tapped
 * @param {Button} args 
 */
function showQR(args) {
    console.log("DEBUG: running showQR...");
    console.log(appSettings.hasKey("PatientID"));
    console.log(appSettings.getString("PatientID"));
    if (!global.dataLoaded)
        return;
    var viewer = args.object.page;
    if (!viewer) {
        viewer = args;  // alternative call of showQR with 'page' as argument
    }
    const vm = viewer.bindingContext;
    if (!appSettings.hasKey("PatientID")) {
        vm.set("currentQrCodeButton", vm.get("qrCodeButtonNoId"));
        return;
    } else {
        vm.set("currentQrCodeButton", vm.get("qrCodeButton"));
    }
    vm.set("currentQrCodeMessage", "");

    var transferConfirmed = false;
    if (!tools.checkAppSetting("TransferConfirmed")) {
        confirmTransfer(viewer);
    }
    transferConfirmed = tools.getAppSetting("TransferConfirmed", "boolean");
    // console.log("transfer confirmed");

    if (transferConfirmed) {
        //tools.setAppSetting("TransferConfirmed", "boolean", true);
        var imageMargin = 5;
        var imageSize = global.phoneWidthDip - imageMargin;
        let qrContainer = viewer.getViewById("qrContainer");
        qrContainer.width = imageSize;
        qrContainer.height = imageSize;
        //console.log("DEBUG: svgFile: " + global.qrCodes);
        let img = viewer.getViewById("svgImg");
        img.width = imageSize;
        img.height = imageSize;

        //const successButton = args.object.page.getViewById("transferSuccess");

        //stop current QR code loop to prevent multiple parallel loops
        tools.stopQrCodeLoop();

        //start loop switching qr codes automatically
        let qrCodeNumber = 0;
        if (global.qrCodes.length == 1) {
            let currentQrCodeMessage = (qrCodeNumber + 1) + "/" + global.qrCodes.length;
            vm.set("currentQrCodeMessage", currentQrCodeMessage);
            //img.src = fs.path.join(global.qrCodes[qrCodeNumber]);
            img.src = global.qrCodes[qrCodeNumber];
        } else {
            let intervalId = timerModule.setInterval(() => {
                if (qrCodeNumber >= global.qrCodes.length) {
                    qrCodeNumber = 0;
                }
                let currentQrCodeMessage = (qrCodeNumber + 1) + "/" + global.qrCodes.length;
                vm.set("currentQrCodeMessage", currentQrCodeMessage);
//                img.src = fs.path.join(global.qrCodes[qrCodeNumber]);
                img.src = global.qrCodes[qrCodeNumber];
                qrCodeNumber++;
            }, 1000);
            tools.setAppSetting("qrIntervalId", "number", intervalId);
        }
    }
}


/**
 * Generate readable output from database (QR-Codes). 
 * Wrapper for function from dataExportInterface
 * @param {object} data , database entries to transmit
 */
function generateOutputData(data) {
    // 
    return new Promise(function (resolve, reject) {
        global.qrCodes = exporting.exportDataToImage(data, 650, false);
        // console.log("QR CODES SUCCESSFULLY CREATED");
        resolve(true);
    });
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}


function onLoaded(args) {
    const page = args.object;
    var imageMargin = 5;
    var imageSize = global.phoneWidthDip - imageMargin;
    let qrContainer = page.getViewById("qrContainer");
    qrContainer.width = imageSize;
    qrContainer.height = imageSize;
    //console.log("DEBUG: svgFile: " + global.qrCodes);
    let img = page.getViewById("svgImg");
    img.width = 200;
    img.height = 300;
    img.src = "~/datenuebertragung/focus_optimizer.png";
    const vm = page.bindingContext;
    const createQrButton = page.getViewById("createQR");
    const statusLabel = page.getViewById("status");
    statusLabel.text = vm.get("diaryEmptyMessage");
    tools.activateHyphenation(page);

    vm.set("currentQrCodeButton", vm.get("qrCodeButton"));
    createQrButton.isEnabled = false;
    vm.set("currentQrCodeMessage", "");
    //tools.getDateInfoFromDB(vm, tools);
    dbEntries = database.requestData(0);

    dbEntries.then(function (res) {
            //console.log("haa");
            new Promise( function(resolve, reject) {
            resolve(true);
            }).then(function(res) {});
            
    });
    // console.log("hup hup");
    // readRecordsFromDB(args.object);   // must be done here to prepare initial metadata for showQR function
    //when database is loaded, generate output
    dbEntries.then(function (res) {
        if (res.data.length > 0) {
            statusLabel.text = "" + res.data.length + " " + vm.get("diaryFilledMessage");
            // createQrButton.isEnabled = true;
        }
    });
    // const appFolder = fs.knownFolders.currentApp();
    // const emptySvg = fs.path.normalize(appFolder.path + "///datenuebertragung/focus_optimizer.svg");

    // img.src = emptySvg;
    confirmTransfer(args.object.page);
}

function confirmTransfer(page) {
    const vm = page.bindingContext;
    var dialogs = require("tns-core-modules/ui/dialogs");

    dialogs.confirm({
        title: vm.get("transferConfirmTitle"),
        message: vm.get("transferConfirmMessage"),
        okButtonText: vm.get("transferConfirmOkButton"),
        cancelButtonText: vm.get("transferConfirmCancelButton"),
        cancelable: false
    }).then(function (result) {
        tools.setAppSetting("TransferConfirmed", "boolean", result);
        const button = page.getViewById("createQR");
        global.dataLoaded = false; //signal when data is ready to be displayed

        if (button) {
            button.isEnabled = result;
        }
        if (!result) {
            const img = page.getViewById("svgImg");
            const appFolder = fs.knownFolders.currentApp();
            const emptySvg = fs.path.normalize(appFolder.path + "///datenuebertragung/focus_optimizer.png");
            if (img) {
                img.src = emptySvg;
            }

        }
        else { //if dialog was confirmed
            dbEntries.then(function(res){
                generateOutputData(res).then( function(res) {
                    // console.log("huu");
                    global.dataLoaded = true;
                    const createQrButton = page.getViewById("createQR");
                    createQrButton.isEnabled = true;
                });
            });
        }
    });

}

/*
"Interface" to read records from a database and connect it with the GUI
*/
function readRecordsFromDB(viewer) {
    //extract all data from database (as promise)


    dbEntries.then(function (value) { //value is database
        //statusLabel.text = vm.get("diaryFilledMessage");
        //createButton.isEnabled = false;
    }, function (error) {
        // console.log("DEBUG : readRecordsFromDB, dbEntries rejected because of : ", error);
    });


}

function onTransferSuccess(args) {
    //console.log("DEBUG: transferSuccess button tapped");
    const vm = args.object.page.bindingContext;
    const successButton = args.object.page.getViewById("transferSuccess");
    successButton.isEnabled = false;

    const createQrButton = args.object.page.getViewById("createQR");
    createQrButton.isEnabled = false;

    const qrContainer = args.object.page.getViewById("qrContainer")
    qrContainer.removeChildren();

    const labelModule = require("tns-core-modules/ui/label");
    const successLabel = new labelModule.Label();
    successLabel.textWrap = true;
    successLabel.margin = 20;
    successLabel.color = "blue";
    successLabel.horizontalAlignment = "center";
    successLabel.textAlignment = "center";
    successLabel.bind({ sourceProperty: "transferSuccessMessage", targetProperty: "text" }, vm);
    successLabel.bind({ sourceProperty: "mySizeSmall", targetProperty: "fontSize" }, vm);
    qrContainer.insertChild(successLabel);
}

exports.generateOutputData = generateOutputData;
exports.onLoaded = onLoaded;
exports.showQR = showQR;
exports.onNavigatingTo = onNavigatingTo;
exports.onNavigatingFrom = onNavigatingFrom;
exports.onUnloaded = onUnloaded;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.onTransferSuccess = onTransferSuccess;

