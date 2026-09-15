const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const REGION = process.env.AWS_REGION || "ap-south-1";
const BUCKET = process.env.AWS_S3_BUCKET;

let client = null;

function getClient() {
  if (!BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    const err = new Error("Image uploads aren't configured — set the AWS_* variables in the backend .env");
    err.status = 503;
    throw err;
  }
  if (!client) {
    client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return client;
}

const EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

/**
 * Permanent public URL for an uploaded object. Objects under `content/` are
 * expected to be publicly readable (bucket policy); set AWS_S3_PUBLIC_URL to
 * serve them through a CDN domain instead of the raw bucket URL.
 */
function publicUrl(key) {
  const base = process.env.AWS_S3_PUBLIC_URL || `https://${BUCKET}.s3.${REGION}.amazonaws.com`;
  return `${base.replace(/\/$/, "")}/${key}`;
}

async function uploadContentImage(file, folder) {
  const key = `content/${folder}/${crypto.randomUUID()}${EXTENSIONS[file.mimetype] || ""}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return { key, url: publicUrl(key) };
}

module.exports = { uploadContentImage, IMAGE_MIME_TYPES: Object.keys(EXTENSIONS) };
