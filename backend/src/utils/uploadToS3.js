const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const path = require("path");
const crypto = require("crypto");

function makeKey(originalName) {
    const ext = path.extname(originalName).toLowerCase();
    const name = crypto.randomBytes(16).toString("hex");
    return `products/${name}${ext}`;
}

async function uploadToS3({ buffer, mimeType, originalName }) {
    const Key = makeKey(originalName);

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key,
            Body: buffer,
            ContentType: mimeType,
            // Since your bucket is public, the object will be readable via its URL
            // (If your bucket policy requires ACLs, we can add ACL: "public-read")
        })
    );

    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
    return { Key, url };
}

module.exports = uploadToS3;
