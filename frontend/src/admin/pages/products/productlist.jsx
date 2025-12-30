import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, fetchProducts } from "../../../api/products";
import "./productlist.css";

function IconSearch() {
  return (
    <svg className="pmSearchIcon" viewBox="0 0 24 24" fill="none">
      <path d="M10.5 18.5a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 16.5 21 21" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg className="pmBtnPlus" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg className="pmAction pmAction--edit" viewBox="0 0 24 24" fill="none">
      <path d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.8l-.2-.2a2 2 0 0 0-2.8 0L5 17v3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.5 6.5 17.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="pmAction pmAction--del" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 11v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 11v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 7l1 14h10l1-14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 7V4h6v3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductList() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to load products. Check backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;

    return rows.filter((r) => {
      const name = r?.name ?? "";
      const category = r?.categoryId ?? r?.category ?? "";
      const barcode = r?.barcode ?? r?.barcodeId ?? "";
      const desc = r?.description ?? "";
      return `${name} ${category} ${barcode} ${desc}`.toLowerCase().includes(s);
    });
  }, [q, rows]);

  async function onDelete(id) {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Delete failed.");
    }
  }

  return (
    <div className="pm">
      <div className="pmTop">
        <div>
          <div className="pmTitle">Product Management</div>
          <div className="pmSub">Add, update, and manage your product catalog</div>
        </div>
      </div>

      <div className="pmControls">
        <div className="pmSearchWrap">
          <IconSearch />
          <input className="pmSearch" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <button className="pmAddBtn" onClick={() => navigate("/admin/products/new")}>
          <IconPlus />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="pmTableCard">
        <div className="pmTableHead">
          <div className="pmCol pmCol--product">Product</div>
          <div className="pmCol">Category</div>
          <div className="pmCol">Price</div>
          <div className="pmCol">Stock</div>
          <div className="pmCol">Status</div>
          <div className="pmCol pmCol--actions">Actions</div>
        </div>

        <div className="pmTableBody">
          {loading ? (
            <div className="pmRow" style={{ gridTemplateColumns: "1fr" }}>
              <div className="pmCell">Loading...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="pmRow" style={{ gridTemplateColumns: "1fr" }}>
              <div className="pmCell">No products found.</div>
            </div>
          ) : (
            filtered.map((r) => {
              const category = r.categoryId ?? r.category ?? "-";
              const price = r.unitPrice ?? r.price ?? "-";
              const stock = r.stock ?? 0;
              const active = r.isActive !== undefined ? !!r.isActive : true;
              const imageUrl = r.imageUrl || "";

              return (
                <div key={r._id} className="pmRow">
                  <div className="pmCell pmCell--product">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={r.name}
                        style={{ width: 22, height: 22, borderRadius: 6, objectFit: "cover", marginRight: 10 }}
                      />
                    ) : (
                      <span className="pmEmoji">📦</span>
                    )}
                    <span className="pmName">{r.name}</span>
                  </div>

                  <div className="pmCell">{category}</div>
                  <div className="pmCell">Rs.{price}</div>

                  <div className={`pmCell ${Number(stock) <= 50 ? "pmStockLow" : ""}`}>{stock}</div>

                  <div className="pmCell">
                    <span className={`pmBadge ${active ? "pmBadge--active" : "pmBadge--disabled"}`}>
                      {active ? "active" : "disabled"}
                    </span>
                  </div>

                  <div className="pmCell pmCell--actions">
                    <button className="pmIconBtn" title="Edit" onClick={() => navigate(`/admin/products/${r._id}/edit`)}>
                      <IconEdit />
                    </button>
                    <button className="pmIconBtn" title="Delete" onClick={() => onDelete(r._id)}>
                      <IconTrash />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
