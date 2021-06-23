const appSettings = require("tns-core-modules/application-settings");
const fileSystemModule = require("file-system");
const QrGenerator = require("nativescript-qr-generator").QrGenerator;
const imageSourceModule = require("tns-core-modules/image-source");

class QRCode {

    constructor(dbase, maxSize)
    {
        this.dbase = dbase;
        this.maxSize = maxSize;
    }

    /**
     * Generate QR Codes from given data
     */
    generateQRCodes(compressed)
    {
        const formatId = "v2";
        var maxSize = this.maxSize;
        
        var db = this.dbase;
    
        var nextIdx = 0;
        var currentSize = 0;
        var currentPackage = "";
        var images = [];
        var qrCodeIndex = 0;
        var entriesPerQrCode = 0;
        var imageMargin = 5;
        var imageSize = global.phoneWidthDip - imageMargin;
        const options = {
            size: {
                width: imageSize,
                height: imageSize
            }
        }
        while(nextIdx < db.data.length) //buffer for additional string which shows number of qr codes
        {
            
            //get next package and determine its size
            var next;

            if(!compressed)
                next = QRCode.parseRecordsToString([db.data[nextIdx]]);
            else 
                next = tools.lzw_encode(QRCode.parseRecordsToString([db.data[nextIdx]]));

            

            let nextSize = next.length;

            //check if package is small enough to fit in current QR Code
            var sizeFit = false;
            var addEntry = false;
            if(currentSize + nextSize <= (maxSize - 5)) {
                sizeFit = true;
                addEntry = true;
            }
            if (!sizeFit) {
                if (entriesPerQrCode == 0) {
                    addEntry = true;  // Add at least one entry to a QR code
                }
            }

            if(addEntry) ////buffer for additional string which shows number of qr codes
            {
                currentPackage += next;
                currentSize = currentSize + nextSize;
                nextIdx = nextIdx + 1;
                entriesPerQrCode++;
               //console.log("next : " + nextIdx);
                
            }
            else { //generate SVG from QRCode and clear temporary storage
                var text = formatId + ";";
                //if first QR add Patient ID in beginning
                //if(images.length == 0)
                text += appSettings.getString("PatientID") + ";";

                text += currentPackage;

                if(nextIdx == (db.data.length )) //all entries included -> include number of packages in QR Code
                    text += ";" + (images.length + 1);
                
                //console.log("DEBUG : stored : " + text);
                var qrBitmap = new QrGenerator().generate(text, options);
                var pngFilename = "qrimage" + qrCodeIndex + ".png";
                const qrFolder = fileSystemModule.knownFolders.documents();
                const qrPath = fileSystemModule.path.join(qrFolder.path, pngFilename);
                const qrImage = new imageSourceModule.ImageSource(qrBitmap);
/*                //const saved = qrImage.saveToFile(qrPath, "png");
                 images.push(qrPath);
                if (!saved) {
                    console.log("ERROR: PNG save failed for file " + qrPath);
                    console.log(saved);
                }
 */    
                images.push(qrImage);
                //console.log("DEBUG : stored : " + qrPath);
                                
                qrCodeIndex++;
                currentPackage = "";
                currentSize = 0;
                entriesPerQrCode = 0;
            }
        }
        //still package in pipe
        if(currentSize > 0)
        {
            var text = formatId + ";";
            //if first QR add Patient ID in beginning
            //if(images.length == 0)
            text += appSettings.getString("PatientID") + ";";
            //add number of QR Codes in total
            text += currentPackage + ";" + (images.length + 1);

            var qrBitmap = new QrGenerator().generate(text, options);
            var pngFilename = "qrimage" + qrCodeIndex + ".png";
            const qrFolder = fileSystemModule.knownFolders.documents();
            const qrPath = fileSystemModule.path.join(qrFolder.path, pngFilename);
            const qrImage = new imageSourceModule.ImageSource(qrBitmap);
            //console.log("DEBUG: ==== qrImage ======"); console.log(qrImage);
/*             const saved = qrImage.saveToFile(qrPath, "png");
            if (!saved) {
                console.log("ERROR: PNG save failed for file " + qrPath);
                console.log(saved);
            }
            images.push(qrPath);
 */ 
            images.push(qrImage);
           //console.log("DEBUG : stored : " + qrPath);
        }
        console.log("DEBUG : all svg created : " + images);
        //return SVG images
        return images;
    }

    /*
    parse a list of database records to string
    */
    static parseRecordsToString(records) {
        var res = "";
        for (var idx = 0; idx < records.length; idx++) {
            //console.log("DEBUG:   idx=" + idx + "  record:");
            //console.log(records[idx]);
            res += records[idx].timestamp + " "
                + records[idx].general + " "
                + records[idx].dia + " "
                + records[idx].eat + " "
                + records[idx].pain + " "
                + records[idx].oral + " "
                + records[idx].appetite + " "
                + records[idx].pnp + " "
                + records[idx].activity + " "
                + records[idx].weight + " "
                + records[idx].medication + " "
                + records[idx].fatigue + " "
                + records[idx].hypertension + " "
                + records[idx].eczema + " "
                + records[idx].liver + " "
                + records[idx].vision + " "
                + records[idx].raceheart + " "
                + records[idx].muscle + " "
                + records[idx].joint + " "
                + records[idx].breath + " " 
                + records[idx].exercise + " "
                + records[idx].comments + "~ ";
                //console.log(res);
                //console.log(records[idx]);    
        }

        return res;
    }
};
module.exports = QRCode;

