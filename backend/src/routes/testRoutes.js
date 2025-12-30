const express = require('express');
const mongoose = require('mongoose');

const { s3Client } = require('../config/s3');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const router = express.Router();

// 1) Read products from MongoDB Atlas (no Mongoose schema needed for testing)
router.get('/products', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        if (!db) return res.status(500).json({ error: 'MongoDB not connected yet.' });

        const limit = Math.min(parseInt(req.query.limit || '10', 10), 50);
        const docs = await db.collection('products').find({}).limit(limit).toArray();

        res.json({ count: docs.length, docs });
    } catch (err) {
        console.error('GET /api/test/products failed:', err);
        res.status(500).json({ error: 'Failed to read products.' });
    }
});

// 2) Generate a presigned GET URL for a private S3 object
// Example: /api/test/presign?key=temp/pelewatta-milkpowder-400g.jpeg
router.get('/presign', async (req, res) => {
    try {
        const bucket = process.env.S3_BUCKET_NAME;
        const key = req.query.key;

        if (!bucket) return res.status(500).json({ error: 'S3_BUCKET_NAME is missing in .env' });
        if (!key) return res.status(400).json({ error: 'Missing query param: key' });

        const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(s3Client, cmd, { expiresIn: 60 * 10 }); // 10 minutes

        res.json({ bucket, key, url, expiresInSeconds: 600 });
    } catch (err) {
        console.error('GET /api/test/presign failed:', err);
        res.status(500).json({ error: 'Failed to generate presigned URL.' });
    }
});

// 3) Browser-friendly redirect (open in a tab)
router.get('/image', async (req, res) => {
    try {
        const bucket = process.env.S3_BUCKET_NAME;
        const key = req.query.key;

        if (!bucket) return res.status(500).send('S3_BUCKET_NAME missing');
        if (!key) return res.status(400).send('Missing query param: key');

        const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
        const url = await getSignedUrl(s3Client, cmd, { expiresIn: 60 * 10 });

        return res.redirect(url);
    } catch (err) {
        console.error('GET /api/test/image failed:', err);
        res.status(500).send('Failed to generate image URL');
    }
});

module.exports = router;
