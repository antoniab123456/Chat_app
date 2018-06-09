var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const upload = require('../controllers/gridFS');
const uploadsController =  require('../controllers/uploads_controller');


router.get('/', (req, res) => {
    res.render('index');
});

router.post('/upload', upload.single('file'), uploadsController);

  module.exports = router;