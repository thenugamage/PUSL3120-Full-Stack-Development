const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    barcode: { type: String, default: "", trim: true },

    // support both price styles
    unitPrice: { type: Number, required: true },
    price: { type: Number }, // legacy compatibility

    // support both category styles
    categoryId: { type: String, required: true, trim: true },
    category: { type: String, trim: true }, // legacy compatibility

    description: { type: String, default: "", trim: true },

    imageUrl: { type: String, default: null },

    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // optional extras (won’t break anything)
    brand: { type: String, default: "", trim: true },
    subcategory: { type: String, default: "", trim: true },
    tags: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

// keep legacy fields in sync automatically
ProductSchema.pre("validate", function () {
  if (!this.category && this.categoryId) {
    this.category = this.categoryId;
  }
  if ((this.price === undefined || this.price === null) && this.unitPrice !== undefined) {
    this.price = this.unitPrice;
  }
});

module.exports = mongoose.model("Product", ProductSchema);
