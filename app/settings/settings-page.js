
import { getRootView } from "tns-core-modules/application";
import SettingsViewModel from "./settings-view-model";
//import { bindGuiStrings, adjustFontSizes, setNotification } from "../tools/tools.js";
//import * as LocalNotifications from "nativescript-custom-local-notifications";
//var LocalNotifications = "blub";//require("@nativescript/local-notifications");
//configure application specific parameters using external file
import { setBoolean, hasKey, getNumber, getBoolean, setNumber, setString, getString } from "tns-core-modules/application-settings";
import { isAndroid, isIos} from "tns-core-modules/platform";
const tools = require("../tools/tools.js");   // full require needed for 'activateHyphenation', does not work with partial 'import'

/**
 * Load data from global settings 
 * */
function onNavigatingTo(args) {
    
    const page = args.object;
    page.bindingContext = new SettingsViewModel();
    tools.bindGuiStrings(page.bindingContext);
    //init font sizes 
    tools.adjustFontSizes(page.bindingContext);
    const txt2speech = page.getViewById("txt2speech");
    var voicePicker = page.getViewById("voicePicker");
    var therapyPicker = page.getViewById("therapyPicker");
    const sendNotificationsOption = page.getViewById("sendNotifications");
 
    page.bindingContext.set("txt2speechColor", "rgb(230,230,230)");
    
    
    //get settings from app-setting
    if (hasKey("PatientID")) {
        
        page.bindingContext.set("patientID", getString("PatientID"));
    }

    if (hasKey("Text2Speech")) {
        page.bindingContext.set("txt2speech", getBoolean("Text2Speech"));
        if (args.value) {
            if (isAndroid) {
                page.bindingContext.set("txt2SpeechColor", "rgb(58,83,255)");
            }
         } else {
            page.bindingContext.set("txt2SpeechColor", "rgb(230,230,230)");
         }
    } else {
        page.bindingContext.set("txt2SpeechColor", "rgb(230,230,230)");
    }
    if (hasKey("MaleVoice"))
    {
        if(getBoolean("MaleVoice"))
            voicePicker.selectedIndex = 0;
        else
            voicePicker.selectedIndex = 1;
    }

    if (hasKey("SpecTherapy"))
    {
        if(getBoolean("SpecTherapy"))
            therapyPicker.selectedIndex = 1;
        else
            therapyPicker.selectedIndex = 0;
    }
     

    if (hasKey("SendNotificationsOption")) {
        const option = getBoolean("SendNotificationsOption");
        page.bindingContext.set("sendNotificationsOption", option);
        if (option) {
            if (isAndroid) {
                page.bindingContext.set("sendNotificationColor", "rgb(58,83,255)");
            }
         } else {
            page.bindingContext.set("sendNotificationColor", "rgb(230,230,230)");
         }
    } else {
        page.bindingContext.set("sendNotificationColor", "rgb(230,230,230)");
    }

    
    txt2speech.on("checkedChange", (args) => {
        
        setBoolean("Text2Speech", args.value);
        if (args.value) {
            if (isAndroid) {
                page.bindingContext.set("txt2SpeechColor", "rgb(58,83,255)");
            }
         } else {
            page.bindingContext.set("txt2SpeechColor", "rgb(230,230,230)");
         }
    });
   
   
    voicePicker.on("selectedIndexChange", (args) => {
        const picker = args.object;
        if(picker.selectedIndex == 0)
            setBoolean("MaleVoice", true);
        else
            setBoolean("MaleVoice", false);
    });

    therapyPicker.on("selectedIndexChange", (args) => {
        const picker = args.object;
        
        setNumber("currentTab",0);
        
        if(picker.selectedIndex == 1)
        {
            setBoolean("SpecTherapy", true);
        }
        else
        {
            setBoolean("SpecTherapy", false);
        }

        //set dummy date to prevent summary screen after switching therapy
        setString("latestEntry", "1950");
    });

    
    sendNotificationsOption.on("checkedChange", (args) => {
        setBoolean("SendNotificationsOption", args.value);
        if (args.value) {
            if (isAndroid) {
                page.bindingContext.set("sendNotificationColor", "rgb(58,83,255)");
            }
         } else {
            page.bindingContext.set("sendNotificationColor", "rgb(230,230,230)");
         }
        tools.setNotification(args.value, args.object.bindingContext);     // don't provide third parameter 'startMode' to activate automatic check for diary entry from the current day
    });
    const patientId =page.getViewById("patientId");

    page.bindingContext.set("openImprint", openImprint);
    page.bindingContext.set("openDataSecurity", openDataSecurity);
}

function onLoaded(args) {
   tools.activateHyphenation(args.object);
}

/**
 * Undo overwritting of android back button
 * @param {} args 
 */
function onUnloaded(args) {
    txt2speech.on("checkedChange", function() {});
    voicePicker.on("selectedIndexChange", function() {});
    therapyPicker.on("selectedIndexChange", function() {});
}
function onDrawerButtonTap(args) {
    const sideDrawer = getRootView();
    sideDrawer.showDrawer();
}

function openImprint(args)
{
    
    args.object.page.frame.navigate("impressum/impressum-page");
}

function openDataSecurity(args)
{
    
    args.object.page.frame.navigate("datenschutz/datenschutz-page");
}
/*
Set configuration for text to speech option in global settings file
*/
function onCheckedChange(args) {
    const vm = args.object.bindingContext;
    //console.log(vm.get("txt2speech"));
    setBoolean("Text2Speech", vm.get("txt2speech"));
 }
const _onCheckedChange = onCheckedChange;
export { _onCheckedChange as onCheckedChange };
const _onNavigatingTo = onNavigatingTo;
export { _onNavigatingTo as onNavigatingTo };
const _onDrawerButtonTap = onDrawerButtonTap;
export { _onDrawerButtonTap as onDrawerButtonTap };

/* exports.openImprint = openImprint;
exports.openDataSecurity = openDataSecurity;
//exports.onLoaded = onLoaded;
const _onLoaded = onLoaded;
export { _onLoaded as onLoaded };
 */


//exports.openImprint = openImprint;
const _openImprint = openImprint;
export { _openImprint as openImprint };
//exports.openDataSecurity = openDataSecurity;
const _openDataSecurity = openDataSecurity;
export { _openDataSecurity as openDataSecurity };
//exports.onUnloaded = onUnloaded;
//const _onUnloaded = onUnloaded;
//export { _onUnloaded as onUnloaded };
//exports.onLoaded = onLoaded;
const _onLoaded = onLoaded;
export { _onLoaded as onLoaded };
