const express = require("express");
const multer = require("multer");
const uploadToS3 = require("../utils/uploadToS3");
const Product = require("../models/Product");

const router = express.Router();
const upload = multer(); // memory storage

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name, price, stock, category } = req.body;

        let imageUrl = null;

        if (req.file) {
            const result = await uploadToS3({
                buffer: req.file.buffer,
                mimeType: req.file.mimetype,
                originalName: req.file.originalname,
            });
            imageUrl = result.url;
        }

        const product = await Product.create({
            name,
            price,
            stock,
            category,
            imageUrl,
        });

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
