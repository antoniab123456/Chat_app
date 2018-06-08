var express = require('express');
var uploadController = require('../controllers/uploads');
var router = express.Router();
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/upload', uploadController.upload.single('file'), (req, res) => {
    res.json({
      file: req.file
    });
});

  module.exports = router;