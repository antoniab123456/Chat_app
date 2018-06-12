var express = require('express');
var router = express.Router();
const upload = require('../controllers/gridFS');
const uploadsController =  require('../controllers/uploads_controller'); 

router.get('/', uploadsController.main);

// router.post('/upload', upload.array('file'), uploadsController.uploads);

router.get('/files', uploadsController.files);

router.get('/files/:filename', uploadsController.filename);

router.get('/images/:filename', uploadsController.images); 

module.exports = router;