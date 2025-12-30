import { useEffect, useState } from 'react';

// Optional: create frontend/.env with:
// VITE_BACKEND_URL=http://localhost:5000
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

function getS3KeyFromUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\//, ''); // remove starting slash
  } catch {
    return '';
  }
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [manualKey, setManualKey] = useState('temp/pelewatta-milkpowder-400g.jpeg');
  const [manualImgUrl, setManualImgUrl] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/test/products?limit=${limit}`)
      .then(r => r.json())
      .then(data => setProducts(data.docs || []))
      .catch(console.error);
  }, [limit]);

  const productsWithKeys = products.map(p => {
    const imageUrl = p.imageUrl || p.imageURL || p.image || '';
    const key = imageUrl ? getS3KeyFromUrl(imageUrl) : '';
    return { ...p, _imageUrl: imageUrl, _s3Key: key };
  });

  async function loadSignedUrlForKey(key) {
    const res = await fetch(`${BACKEND_URL}/api/test/presign?key=${encodeURIComponent(key)}`);
    const data = await res.json();
    return data.url;
  }

  async function testManualKey() {
    if (!manualKey) return;
    const url = await loadSignedUrlForKey(manualKey);
    setManualImgUrl(url);
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: 16, maxWidth: 1100, margin: '0 auto' }}>
      <h2>Sudu Araliya – S3 Image URL Test</h2>

      <div style={{ marginBottom: 18, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Manual test (open private S3 image)</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ flex: 1, padding: 8 }}
            value={manualKey}
            onChange={(e) => setManualKey(e.target.value)}
            placeholder="temp/your-image.jpeg"
          />
          <button onClick={testManualKey} style={{ padding: '8px 12px' }}>
            Generate & Show
          </button>
          <a
            href={`${BACKEND_URL}/api/test/image?key=${encodeURIComponent(manualKey)}`}
            target="_blank"
            rel="noreferrer"
            style={{ padding: '8px 12px', display: 'inline-block' }}
          >
            Open in new tab
          </a>
        </div>

        {manualImgUrl && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Presigned URL (expires in ~10 mins)</div>
            <img src={manualImgUrl} alt="Manual test" style={{ maxWidth: 260, marginTop: 8, border: '1px solid #eee' }} />
          </div>
        )}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          Products limit:&nbsp;
          <input
            type="number"
            value={limit}
            min={1}
            max={50}
            onChange={(e) => setLimit(Number(e.target.value))}
            style={{ width: 80, padding: 6 }}
          />
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {productsWithKeys.map((p) => (
          <ProductCard key={p._id} product={p} loadSignedUrlForKey={loadSignedUrlForKey} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, loadSignedUrlForKey }) {
  const [signedUrl, setSignedUrl] = useState('');

  async function showImage() {
    if (!product._s3Key) return;
    const url = await loadSignedUrlForKey(product._s3Key);
    setSignedUrl(url);
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <div style={{ fontWeight: 700 }}>{product.name || product.title || 'Unnamed product'}</div>

      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
        Mongo imageUrl:
        <div style={{ wordBreak: 'break-all' }}>{product._imageUrl || '(none)'}</div>
      </div>

      <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
        Parsed S3 key:
        <div style={{ wordBreak: 'break-all' }}>{product._s3Key || '(none)'}</div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <button onClick={showImage} disabled={!product._s3Key} style={{ padding: '6px 10px' }}>
          Show image
        </button>
      </div>

      {signedUrl && (
        <img
          src={signedUrl}
          alt="Product"
          style={{ marginTop: 10, maxWidth: 220, border: '1px solid #eee' }}
        />
      )}
    </div>
  );
}
