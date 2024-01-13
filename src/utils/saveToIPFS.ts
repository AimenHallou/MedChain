// src/utils/saveToIPFS.ts
import { unixfs } from "@helia/unixfs";
import crypto from "crypto";
import { getHeliaInstance, initializeHelia } from './initHelia.js';
import { fetchFileFromIPFS } from "./fetchAndDecryptFromIPFS"; 

const algorithm = "aes-256-cbc";
const env = process.env.NODE_ENV || "development";
const config = require(`../../config/${env}.js`);
const key = Buffer.from(config.AES_ENCRYPTION_KEY, "hex");

interface FileToSave {
  base64: string;
  name: string;
  dataType: string;
}

export interface SavedFileData {
  base64: string;
  name: string;
  dataType: string;
  ipfsCID: string;
}

const encryptBuffer = (buffer: Buffer, iv: Buffer): Buffer => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
};

export const saveFilesToIPFS = async (
  files: FileToSave[]
): Promise<SavedFileData[]> => {
  await initializeHelia();
  const helia = getHeliaInstance();
  if (!helia) {
    throw new Error("Helia is not initialized.");
  }

  let heliaFs = unixfs(helia);
  let savedFiles: SavedFileData[] = [];

  for (const file of files) {
    try {
      const fileBuffer = Buffer.from(file.base64, "base64");
      const fileIV = crypto.randomBytes(16);
      const encryptedBuffer = encryptBuffer(fileBuffer, fileIV);
      const dataWithIv = Buffer.concat([fileIV, encryptedBuffer]);
      const result = await heliaFs.addBytes(dataWithIv);
      console.log(result.toString());

      const decryptedContent = await fetchFileFromIPFS(result.toString());
      console.log(decryptedContent);

      const savedFile: SavedFileData = {
        base64: file.base64,
        name: file.name,
        dataType: file.dataType,
        ipfsCID: result.toString(),
      };
      savedFiles.push(savedFile);

      // Optionally, fetch and log the file data immediately after saving
      // Uncomment below lines if needed for debugging purposes
      // let text = '';
      // const decoder = new TextDecoder();
      // for await (const chunk of heliaFs.cat(result)) {
      //   text += decoder.decode(chunk, { stream: true });
      // }
      // console.log(`Successfully fetched file ${file.name} from IPFS:`, text);

    } catch (error) {
      console.error(`Failed to save file ${file.name} to IPFS:`, error);
    }
  }

  return savedFiles;
};
