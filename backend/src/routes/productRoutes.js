const express = require("express");
const multer = require("multer");
const uploadToS3 = require("../utils/uploadToS3");
const Product = require("../models/Product");

const router = express.Router();
const upload = multer(); // memory storage

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      barcode,
      barcodeId,

      unitPrice,
      price,

      description,
      shortDescription,
      fullDescription,

      categoryId,
      category,

      stock,
      isActive,

      brand,
      subcategory,
      tags,
    } = req.body;

    const finalName = (name || "").trim();
    const finalCategory = (categoryId || category || "").trim();
    const finalPriceRaw = unitPrice ?? price;
    const finalUnitPrice = Number(finalPriceRaw);

    if (!finalName) return res.status(400).json({ message: "name is required" });
    if (!finalCategory) return res.status(400).json({ message: "category/categoryId is required" });
    if (!Number.isFinite(finalUnitPrice)) return res.status(400).json({ message: "price/unitPrice is required" });

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToS3({
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
      });
      imageUrl = result.url;
    }

    const finalDesc = (description || fullDescription || shortDescription || "").trim();

    const product = await Product.create({
      name: finalName,
      barcode: (barcode || barcodeId || "").trim(),

      unitPrice: finalUnitPrice,
      price: finalUnitPrice, // legacy support

      categoryId: finalCategory,
      category: finalCategory, // legacy support

      description: finalDesc,

      stock: Number(stock ?? 0),
      isActive: String(isActive ?? "true") === "true",

      imageUrl,

      brand: (brand || "").trim(),
      subcategory: (subcategory || "").trim(),
      tags: (tags || "").trim(),
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      barcode,
      barcodeId,

      unitPrice,
      price,

      description,
      shortDescription,
      fullDescription,

      categoryId,
      category,

      stock,
      isActive,

      brand,
      subcategory,
      tags,
    } = req.body;

    if (name !== undefined) p.name = String(name).trim();
    if (barcode !== undefined || barcodeId !== undefined) p.barcode = String(barcode || barcodeId || "").trim();

    if (unitPrice !== undefined || price !== undefined) {
      const v = Number(unitPrice ?? price);
      if (Number.isFinite(v)) {
        p.unitPrice = v;
        p.price = v; // legacy sync
      }
    }

    if (description !== undefined || fullDescription !== undefined || shortDescription !== undefined) {
      p.description = String(description || fullDescription || shortDescription || "").trim();
    }

    if (categoryId !== undefined || category !== undefined) {
      const c = String(categoryId || category || "").trim();
      if (c) {
        p.categoryId = c;
        p.category = c; // legacy sync
      }
    }

    if (stock !== undefined) p.stock = Number(stock);
    if (isActive !== undefined) p.isActive = String(isActive) === "true";

    if (brand !== undefined) p.brand = String(brand || "").trim();
    if (subcategory !== undefined) p.subcategory = String(subcategory || "").trim();
    if (tags !== undefined) p.tags = String(tags || "").trim();

    if (req.file) {
      const result = await uploadToS3({
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
      });
      p.imageUrl = result.url;
    }

    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
