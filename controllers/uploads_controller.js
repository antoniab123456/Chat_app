let getFiles = require('../app').getFiles;
let getFilename = require('../app').getFilename;
let readStream = require('../app').readStream;

const uploadsController = {
    main: (req, res) => {
        res.render('index');
      /*   getFiles((err, files) => { 
            if (!files || files.length === 0) {
                error = "No file was chosen";
                res.render('index', { files: false, error: error});
              } else {
                files.map(file => {
                  if (
                    file.contentType === 'image/jpeg' ||
                    file.contentType === 'image/png'
                  ) {
                    file.isImage = true;
                  } else {
                    file.isImage = false;
                  }
                });
                res.render('index', { files: files });   
            }
        });    */
    },
    uploads: (req, res) => {
        req.files.forEach(file => {
            let eachFileName_url = 'http://localhost:7070/images/'+file.filename;
            res.send(eachFileName_url);
        });

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
    }
}    


module.exports = uploadsController;

