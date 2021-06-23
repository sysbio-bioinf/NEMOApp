var QRCode = require("./QRCode");


/**
 * Export given database entries to a specified image format (such as QR Codes)
 * @param {Object} data, data records as JSON array
 * @param {*} imageSize , width and heigh of image (is quadratic)
 */
function exportDataToImage(data, maxSize, compressed)
{
    
    return new QRCode(data,maxSize).generateQRCodes(compressed); //size not required as producing SVG data
}

exports.exportDataToImage = exportDataToImage;