var express = require('express');
var router = express.Router();

const upload = require('../controllers/gridFS');
const uploadsController =  require('../controllers/uploads_controller'); 




router.get('/', (req, res) => {
    res.render('index');
});

router.post('/upload', upload.array('file', 5), uploadsController.uploads);

router.get('/files', uploadsController.files);

router.get('/files/:filename', uploadsController.filename);

router.get('/images/:filename', uploadsController.images)

let getFiles = require('../app').getFiles;
module.exports = router;