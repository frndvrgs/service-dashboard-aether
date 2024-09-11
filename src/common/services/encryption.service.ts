import { Injectable } from "@nestjs/common";
import * as crypto from "node:crypto";
import { SettingsService } from "../../core/services/settings/settings.service";
import { InterfaceException } from "../exceptions/interface.exception";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  // private readonly saltLength = 64;
  private readonly tagLength = 16;

  private readonly key: Buffer;

  constructor(private settings: SettingsService) {
    const masterKey = this.settings.app.encryption.masterKey;
    if (!masterKey) {
      throw new InterfaceException(
        "MISSING_ENCRYPTION_KEY",
        500,
        "missing encryption master key",
        "missing encryptyion master key variable",
      );
    }
    this.key = crypto.scryptSync(masterKey, "salt", this.keyLength);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    return iv.toString("hex") + encrypted + tag.toString("hex");
  }

  decrypt(encryptedText: string): string {
    const ivStart = 0;
    const ivEnd = this.ivLength * 2;
    const iv = Buffer.from(encryptedText.slice(ivStart, ivEnd), "hex");

    const tagStart = encryptedText.length - this.tagLength * 2;
    const tag = Buffer.from(encryptedText.slice(tagStart), "hex");

    const encryptedContent = encryptedText.slice(ivEnd, tagStart);

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedContent, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
