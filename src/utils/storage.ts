import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

export const PROVIDER = {
  LOCAL: "local",
  CLOUDINARY: "cloudinary",
} as const;

export type Provider = (typeof PROVIDER)[keyof typeof PROVIDER];

export interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder?: string;
}

export interface LocalCredentials {
}

export type StorageCredentials = CloudinaryCredentials | LocalCredentials;

export interface StorageConfig {
  provider: Provider;
  credentials: StorageCredentials;
}

export interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface UploadResult {
  fileId: string;
  url: string;
  provider: Provider;
}

export interface DeleteResult {
  success: boolean;
  fileId: string;
}

type StorageClient = typeof cloudinary | "local";

class StorageService {
  private readonly provider: Provider;
  private readonly credentials: StorageCredentials;
  private _client: StorageClient | null = null;

  constructor(config: StorageConfig) {
    this.provider = config.provider;
    this.credentials = config.credentials;
  }

  private async _getClient(): Promise<StorageClient> {
    if (this._client) return this._client;

    const c = this.credentials;

    switch (this.provider) {
      case PROVIDER.CLOUDINARY: {
        const creds = c as CloudinaryCredentials;
        cloudinary.config({
          cloud_name: creds.cloudName,
          api_key: creds.apiKey,
          api_secret: creds.apiSecret,
        });
        this._client = cloudinary;
        break;
      }

      case PROVIDER.LOCAL:
      default:
        this._client = "local";
        break;
    }

    return this._client!;
  }

  async uploadFiles(files: UploadFile[]): Promise<UploadResult[]> {
    const client = await this._getClient();
    return Promise.all(files.map((file) => this._uploadOne(client, file)));
  }

  private async _uploadOne(
    client: StorageClient,
    file: UploadFile,
  ): Promise<UploadResult> {
    const key = this._generateKey(file.originalname);

    switch (this.provider) {
      case PROVIDER.CLOUDINARY: {
        const c = this.credentials as CloudinaryCredentials;
        const result = await new Promise<{
          public_id: string;
          secure_url: string;
        }>((res, rej) => {
          const stream = (client as typeof cloudinary).uploader.upload_stream(
            { folder: c.folder ?? "uploads", resource_type: "auto" },
            (err, data) => (err || !data ? rej(err) : res(data)),
          );
          stream.end(file.buffer);
        });
        return {
          fileId: result.public_id,
          url: result.secure_url,
          provider: this.provider,
        };
      }

      case PROVIDER.LOCAL: {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const fullFilePath = path.join(uploadDir, key);
        fs.mkdirSync(path.dirname(fullFilePath), { recursive: true });
        fs.writeFileSync(fullFilePath, file.buffer);
        return {
          fileId: key,
          url: `/uploads/${key}`,
          provider: this.provider,
        };
      }

      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  async deleteFile(fileId: string): Promise<DeleteResult> {
    const client = await this._getClient();

    switch (this.provider) {
      case PROVIDER.CLOUDINARY:
        await (client as typeof cloudinary).uploader.destroy(fileId, {
          resource_type: "auto",
        });
        break;

      case PROVIDER.LOCAL: {
        const filePath = path.join(process.cwd(), "public", fileId);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        break;
      }

      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }

    return { success: true, fileId };
  }

  getFileUrl(fileId: string): string {
    switch (this.provider) {
      case PROVIDER.CLOUDINARY:
        return cloudinary.url(fileId, { secure: true });

      case PROVIDER.LOCAL:
        return `/uploads/${fileId}`;

      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private _generateKey(originalname: string): string {
    const ext = path.extname(originalname);
    return `product/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  }
}

export const storage = new StorageService({
  provider: PROVIDER.LOCAL,
  credentials: {},
});
