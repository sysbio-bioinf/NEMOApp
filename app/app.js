const application = require("tns-core-modules/application");
const tools = require("./tools/tools.js");
require ("@nativescript/local-notifications"); //must be loaded here, when using ios10+
// const frameModule = require("tns-core-modules/ui/frame");

application.on(application.launchEvent, (args) => {
    global.guiStringsLoaded = tools.loadGUIStrings();
    
    
    
});

application.on(application.suspendEvent, (args) => {
    tools.stopQrCodeLoop();
});

application.on(application.resumeEvent, (args) => {
    global.guiStringsLoaded = tools.loadGUIStrings();
    
    
    
});
application.on(application.displayedEvent, (args) => {
    
    
});
application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
