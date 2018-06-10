let getFiles = require('../app').getFiles;
let getFilename = require('../app').getFilename;
let readStream = require('../app').readStream;

const uploadsController = {
    uploads: (req, res) => {
        image = req.files.length;
        res.render('index', { image: image })
    },
    files: (req, res) => {
        getFiles((err, files) => {
            if (!files || files.length === 0) {
                res.status(404).json({
                    err: " No files found"
                });
            }
            return res.json(files);
        });
    },
    filename: (req, res) => {
        getFilename({
            filename: req.params.filename
        }, (err, file) => {
            if (!file || file.length === 0) {
                param1.status(404).json({
                    err: " No file found"
                });
            }
            return res.json(file);
        });
    },
    images: (req, res) => {
        getFilename({
            filename: req.params.filename
        }, (err, file) => {
            if (!file || file.length === 0) {
                res.status(404).json({
                    err: " No file found"
                });
            }
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                readStream(file.filename, res);
            } else {
                res.status(404).json({
                    err: 'Not an image'
                });
            }
        });
    },
}

module.exports = uploadsController;

