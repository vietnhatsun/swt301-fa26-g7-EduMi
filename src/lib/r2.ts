import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "edumi-storage";
export const NEXT_PUBLIC_R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/$/, "");

function getR2Env() {
  const accountId = process.env.R2_ACCOUNT_ID || R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME || R2_BUCKET_NAME || "edumi-storage";
  const publicUrl = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/$/, "");
  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
}

let cachedS3Client: S3Client | null = null;

export function isR2Configured(): boolean {
  const { accountId, accessKeyId, secretAccessKey } = getR2Env();
  return Boolean(accountId && accessKeyId && secretAccessKey);
}

export function getR2Client(): S3Client {
  const { accountId, accessKeyId, secretAccessKey } = getR2Env();

  if (!isR2Configured()) {
    throw new Error(
      "Cloudflare R2 chưa được cấu hình. Vui lòng kiểm tra R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY trong .env.local"
    );
  }

  if (cachedS3Client) return cachedS3Client;

  cachedS3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

  return cachedS3Client;
}

/**
 * Tạo URL truy cập public cho các file không yêu cầu bảo mật (như avatar, site-assets)
 */
export function getR2PublicUrl(key: string): string {
  const { bucketName, publicUrl } = getR2Env();
  if (publicUrl) {
    return `${publicUrl}/${key.replace(/^\//, "")}`;
  }
  return `https://${bucketName}.r2.cloudflarestorage.com/${key.replace(/^\//, "")}`;
}

interface GenerateUploadUrlOptions {
  key: string;
  contentType: string;
  bucket?: string;
  expiresInSeconds?: number;
}

/**
 * Sinh Presigned URL để client có thể upload trực tiếp file lên Cloudflare R2 bằng HTTP PUT
 */
export async function generatePresignedUploadUrl({
  key,
  contentType,
  bucket,
  expiresInSeconds = 600, // 10 phút
}: GenerateUploadUrlOptions): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const { bucketName } = getR2Env();
  const targetBucket = bucket || bucketName;
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: targetBucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds,
  });

  return {
    uploadUrl,
    key,
    publicUrl: getR2PublicUrl(key),
  };
}

interface GenerateDownloadUrlOptions {
  key: string;
  bucket?: string;
  expiresInSeconds?: number;
}

/**
 * Sinh Presigned URL cho phép tải hoặc xem file riêng tư (Private) trong thời gian giới hạn
 */
export async function generatePresignedDownloadUrl({
  key,
  bucket,
  expiresInSeconds = 900, // 15 phút
}: GenerateDownloadUrlOptions): Promise<string> {
  const { bucketName } = getR2Env();
  const targetBucket = bucket || bucketName;
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: targetBucket,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: expiresInSeconds,
  });
}

interface DeleteObjectOptions {
  key: string;
  bucket?: string;
}

/**
 * Xóa object khỏi Cloudflare R2 để tránh file mồ côi sau khi xóa metadata trong DB.
 */
export async function deleteR2Object({ key, bucket }: DeleteObjectOptions): Promise<void> {
  const { bucketName } = getR2Env();
  const targetBucket = bucket || bucketName;
  const client = getR2Client();
  const command = new DeleteObjectCommand({
    Bucket: targetBucket,
    Key: key,
  });

  await client.send(command);
}