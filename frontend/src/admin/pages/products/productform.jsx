import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct, fetchProduct } from "../../../api/products";
import "./productform.css";

function IconBack() {
  return (
    <svg className="pfBackIcon" viewBox="0 0 24 24" fill="none">
      <path d="M15 18 9 12l6-6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg className="pfUploadIcon" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 9l4-4 4 4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18.5A3.5 3.5 0 0 1 7.5 15h9A3.5 3.5 0 0 1 20 18.5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function toNumberString(v) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  const n = Number(s);
  return Number.isFinite(n) ? String(n) : "";
}

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef(null);

  const isEditMode = !!id;

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  const [form, setForm] = useState({
    name: "",
    barcode: "",
    brand: "",
    shortDesc: "",
    fullDesc: "",
    category: "",
    subcategory: "",
    tags: "",
    price: "",
    compareAt: "",
    cost: "",
    weight: "",
    dimL: "",
    dimW: "",
    dimH: "",
    stock: "",
    isActive: true,
  });

  // Load product data when in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    async function loadProduct() {
      try {
        setLoading(true);
        const product = await fetchProduct(id);
        
        // Pre-fill form with existing product data
        setForm({
          name: product.name || "",
          barcode: product.barcode || "",
          brand: product.brand || "",
          shortDesc: product.description || "",
          fullDesc: product.description || "",
          category: product.categoryId || product.category || "",
          subcategory: product.subcategory || "",
          tags: product.tags || "",
          price: String(product.unitPrice ?? product.price ?? ""),
          compareAt: "",
          cost: "",
          weight: "",
          dimL: "",
          dimW: "",
          dimH: "",
          stock: String(product.stock ?? 0),
          isActive: product.isActive !== undefined ? product.isActive : true,
        });

        // Set existing image URL if available
        if (product.imageUrl) {
          setExistingImageUrl(product.imageUrl);
        }
      } catch (e) {
        console.error(e);
        alert(e?.message || "Failed to load product.");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id, isEditMode, navigate]);

  function pickFiles() {
    fileRef.current?.click();
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const file = files[0];
    
    setImageFile(file);
    
    // Create preview using FileReader (data URL string, no cleanup needed)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  }

  async function onSave() {
    if (saving) return;

    const name = form.name.trim();
    const category = form.category.trim();
    const priceStr = toNumberString(form.price);

    if (!name) return alert("Product Name is required");
    if (!category) return alert("Category is required");
    if (!priceStr) return alert("Price is required");

    try {
      setSaving(true);

      const fd = new FormData();

      // send BOTH naming styles to satisfy any schema
      fd.append("name", name);

      const bc = form.barcode.trim();
      fd.append("barcode", bc);
      fd.append("barcodeId", bc);

      fd.append("unitPrice", priceStr);
      fd.append("price", priceStr);

      fd.append("categoryId", category);
      fd.append("category", category);

      const desc = (form.fullDesc || form.shortDesc || "").trim();
      fd.append("description", desc);
      fd.append("shortDescription", form.shortDesc.trim());
      fd.append("fullDescription", form.fullDesc.trim());

      fd.append("brand", form.brand.trim());
      fd.append("subcategory", form.subcategory.trim());
      fd.append("tags", form.tags.trim());

      fd.append("compareAtPrice", toNumberString(form.compareAt));
      fd.append("costPerItem", toNumberString(form.cost));
      fd.append("weight", toNumberString(form.weight));
      fd.append("dimL", toNumberString(form.dimL));
      fd.append("dimW", toNumberString(form.dimW));
      fd.append("dimH", toNumberString(form.dimH));

      fd.append("stock", form.stock || "0");
      fd.append("isActive", String(form.isActive ?? true));

      // Only append image if a new one was selected
      if (imageFile) fd.append("image", imageFile);

      // Use update or create based on mode
      if (isEditMode) {
        await updateProduct(id, fd);
      } else {
        await createProduct(fd);
      }

      navigate("/admin/products");
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    navigate("/admin/products");
  }
  
  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    // Note: We don't clear existingImageUrl here because the user might want to keep it
    // If they want to remove the existing image, they would need to upload a new one
  }

  // Show loading state
  if (loading) {
    return (
      <div className="pf" style={{ padding: '40px', textAlign: 'center' }}>
        <div>Loading product...</div>
      </div>
    );
  }

  return (
    <div className="pf">
      <div className="pfTopBar">
        <div className="pfTopLeft">
          <button className="pfBackBtn" onClick={() => navigate("/admin/products")} type="button">
            <IconBack />
          </button>
          <div>
            <div className="pfTopTitle">{isEditMode ? "Edit Product" : "Add New Product"}</div>
            <div className="pfTopSub">{isEditMode ? "Update product details" : "Create a new product in your catalog"}</div>
          </div>
        </div>

        <div className="pfTopActions">
          <button className="pfBtn pfBtn--ghost" type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="pfBtn pfBtn--save" type="button" onClick={onSave} disabled={saving || loading}>
            {saving ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Product" : "Save Product")}
          </button>
        </div>
      </div>

      <div className="pfGrid">
        <div className="pfCard pfCard--upload">
          <div className="pfCardTitle">Product Images</div>

          <div
            className={`pfDrop ${dragOver ? "pfDrop--over" : ""}`}
            onClick={pickFiles}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
          >
            <IconUpload />
            <div className="pfDropText">
              <div className="pfDropMain">Click to upload or drag and drop</div>
              <div className="pfDropSub">PNG, JPG, GIF up to 10MB each</div>
            </div>

            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
          </div>

          <div className="pfHint">
            <div className="pfHintTitle">
              {imageFile ? "1 image selected" : existingImageUrl ? "Current image" : "No images uploaded yet"}
            </div>
            <div className="pfHintSub">
              {isEditMode 
                ? "Upload a new image to replace the current one, or keep the existing image."
                : "Upload at least one product image. The first image will be the primary image."}
            </div>

            {(imagePreview || existingImageUrl) && (
              <div className="pfThumbs">
                <div className="pfThumb" style={{ position: 'relative' }}>
                  <img 
                    src={imagePreview || existingImageUrl} 
                    alt="Preview" 
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block'
                    }} 
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={clearImage}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        lineHeight: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove new image"
                    >
                      ×
                    </button>
                  )}
                  {imageFile && (
                    <div style={{ 
                      marginTop: '8px', 
                      fontSize: '12px', 
                      color: '#666',
                      textAlign: 'center'
                    }}>
                      {imageFile.name}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pfRight">
          <div className="pfCard">
            <div className="pfCardTitle">Basic Information</div>

            <div className="pfField">
              <label className="pfLabel">Product Name *</label>
              <input className="pfInput" placeholder="e.g., Organic Bananas" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="pfRow2">
              <div className="pfField">
                <label className="pfLabel">Barcode id</label>
                <input className="pfInput" placeholder="e.g., BAN-ORG-001" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
              </div>

              <div className="pfField">
                <label className="pfLabel">Brand</label>
                <input className="pfInput" placeholder="e.g., Fresh Farms" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
            </div>

            <div className="pfField">
              <label className="pfLabel">Short Description</label>
              <input className="pfInput" placeholder="Brief description (shown in listings)" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
            </div>

            <div className="pfField">
              <label className="pfLabel">Full Description</label>
              <textarea className="pfTextarea" placeholder="Detailed product description..." value={form.fullDesc} onChange={(e) => setForm({ ...form, fullDesc: e.target.value })} />
            </div>
          </div>

          <div className="pfCard pfCard--warm">
            <div className="pfCardTitle">Category &amp; Organization</div>

            <div className="pfRow2">
              <div className="pfField">
                <label className="pfLabel">Category *</label>
                <input className="pfInput" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>

              <div className="pfField">
                <label className="pfLabel">Subcategory</label>
                <input className="pfInput" placeholder="E.g., Tropical Fruits" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
              </div>
            </div>

            <div className="pfField">
              <label className="pfLabel">Tags</label>
              <input className="pfInput" placeholder="organic, fresh, local (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <div className="pfHelper">Separate tags with commas</div>
            </div>
          </div>

          <div className="pfCard pfCard--warm">
            <div className="pfCardTitle">Pricing</div>

            <div className="pfRow3">
              <div className="pfField">
                <label className="pfLabel">Price *</label>
                <div className="pfMoney">
                  <span>$</span>
                  <input className="pfInput pfInput--money" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
              </div>

              <div className="pfField">
                <label className="pfLabel">Compare at Price</label>
                <div className="pfMoney">
                  <span>$</span>
                  <input className="pfInput pfInput--money" placeholder="0.00" value={form.compareAt} onChange={(e) => setForm({ ...form, compareAt: e.target.value })} />
                </div>
                <div className="pfHelper">Original price for showing discounts</div>
              </div>

              <div className="pfField">
                <label className="pfLabel">Cost per Item</label>
                <div className="pfMoney">
                  <span>$</span>
                  <input className="pfInput pfInput--money" placeholder="0.00" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                </div>
                <div className="pfHelper">Your cost (for margin calculations)</div>
              </div>
            </div>
          </div>

          <div className="pfCard pfCard--warm">
            <div className="pfCardTitle">Shipping &amp; Physical Properties</div>

            <div className="pfRowShip">
              <div className="pfField">
                <label className="pfLabel">Weight</label>
                <input className="pfInput" placeholder="0.0" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </div>

              <div className="pfField pfField--dims">
                <label className="pfLabel">Dimensions (L × W × H)</label>
                <div className="pfDims">
                  <input className="pfInput" placeholder="0" value={form.dimL} onChange={(e) => setForm({ ...form, dimL: e.target.value })} />
                  <input className="pfInput" placeholder="0" value={form.dimW} onChange={(e) => setForm({ ...form, dimW: e.target.value })} />
                  <input className="pfInput" placeholder="e.g., 10 × 5 × 3 in" value={form.dimH} onChange={(e) => setForm({ ...form, dimH: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
