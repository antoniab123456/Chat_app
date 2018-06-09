const uploadsController = (req, res) => {
    res.json({ file: req.file });
}

module.exports = uploadsController;