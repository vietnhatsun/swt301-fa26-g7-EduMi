import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "edumi-storage";
export const NEXT_PUBLIC_R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/$/, "");

let cachedS3Client: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}

export function getR2Client(): S3Client {
  if (cachedS3Client) return cachedS3Client;

  if (!isR2Configured()) {
    throw new Error(
      "Cloudflare R2 chưa được cấu hình. Vui lòng kiểm tra R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY trong .env.local"
    );
  }

  cachedS3Client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  return cachedS3Client;
}

/**
 * Tạo URL truy cập public cho các file không yêu cầu bảo mật (như avatar, site-assets)
 */
export function getR2PublicUrl(key: string): string {
  if (NEXT_PUBLIC_R2_PUBLIC_URL) {
    return `${NEXT_PUBLIC_R2_PUBLIC_URL}/${key.replace(/^\//, "")}`;
  }
  return `https://${R2_BUCKET_NAME}.r2.cloudflarestorage.com/${key.replace(/^\//, "")}`;
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
  bucket = R2_BUCKET_NAME,
  expiresInSeconds = 600, // 10 phút
}: GenerateUploadUrlOptions): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
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
  bucket = R2_BUCKET_NAME,
  expiresInSeconds = 900, // 15 phút
}: GenerateDownloadUrlOptions): Promise<string> {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: expiresInSeconds,
  });
}
