const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");

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

const MAX_IMAGE_MB = 8;
const CACHE_CONTROL = "public, max-age=31536000, immutable";
const UPLOAD_URL_TTL_SECONDS = 300;

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

function newContentKey(folder, mimetype) {
  return `content/${folder}/${crypto.randomUUID()}${EXTENSIONS[mimetype] || ""}`;
}

async function uploadContentImage(file, folder) {
  const key = newContentKey(folder, file.mimetype);

  await getClient().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: CACHE_CONTROL,
    })
  );

  return { key, url: publicUrl(key) };
}

/**
 * A short-lived signed S3 POST so the browser uploads the file directly to
 * the bucket. This keeps large images off the admin panel's host (Vercel caps
 * request bodies at 4.5 MB). S3 itself enforces the key, content type and
 * size range, so the signature can't be reused for anything else.
 */
async function createSignedImageUpload(mimetype, folder) {
  const key = newContentKey(folder, mimetype);

  const { url, fields } = await createPresignedPost(getClient(), {
    Bucket: BUCKET,
    Key: key,
    Conditions: [
      ["content-length-range", 1, MAX_IMAGE_MB * 1024 * 1024],
      ["eq", "$Content-Type", mimetype],
      ["eq", "$Cache-Control", CACHE_CONTROL],
    ],
    Fields: { "Content-Type": mimetype, "Cache-Control": CACHE_CONTROL },
    Expires: UPLOAD_URL_TTL_SECONDS,
  });

  return { key, url: publicUrl(key), upload: { url, fields } };
}

module.exports = {
  uploadContentImage,
  createSignedImageUpload,
  IMAGE_MIME_TYPES: Object.keys(EXTENSIONS),
  MAX_IMAGE_MB,
};
