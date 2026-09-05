export interface PreviewTokenPayload {
  pageId: string;
  revisionId: string;
  expires: number; // Unix timestamp in milliseconds
  created: number;
}

export interface GeneratedPreviewResult {
  pageId: string;
  revisionId: string;
  expires: number;
  signature: string;
  previewPath: string;
  previewUrl: string;
}

export interface PreviewVerificationResult {
  valid: boolean;
  pageId?: string;
  revisionId?: string;
  expires?: number;
  error?: 'EXPIRED' | 'INVALID_SIGNATURE' | 'MALFORMED';
}

const DEFAULT_PREVIEW_SECRET =
  (typeof process !== 'undefined' && process.env?.CMS_PREVIEW_SECRET) ||
  'alpha-school-cms-preview-hmac-secret-2026';

/**
 * Pure TypeScript SHA-256 & HMAC-SHA256 implementation (FIPS 180-4 / RFC 2104 compliant)
 * Isomorphic: Runs in Node.js, Next.js Edge, and browser runtimes without node:crypto or Buffer.
 */
function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function sha256Bytes(bytes: Uint8Array): Uint8Array {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let H0 = 0x6a09e667;
  let H1 = 0xbb67ae85;
  let H2 = 0x3c6ef372;
  let H3 = 0xa54ff53a;
  let H4 = 0x510e527f;
  let H5 = 0x9b05688c;
  let H6 = 0x1f83d9ab;
  let H7 = 0x5be0cd19;

  const bitLength = bytes.length * 8;
  const newLength = (((bytes.length + 8) >> 6) + 1) << 6;
  const padded = new Uint8Array(newLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const highBits = Math.floor(bitLength / 0x100000000);
  const lowBits = bitLength >>> 0;
  const view = new DataView(padded.buffer);
  view.setUint32(newLength - 8, highBits, false);
  view.setUint32(newLength - 4, lowBits, false);

  const W = new Int32Array(64);

  for (let i = 0; i < newLength; i += 64) {
    for (let t = 0; t < 16; t++) {
      W[t] = view.getInt32(i + t * 4, false);
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rightRotate(W[t - 15], 7) ^ rightRotate(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rightRotate(W[t - 2], 17) ^ rightRotate(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }

    let a = H0;
    let b = H1;
    let c = H2;
    let d = H3;
    let e = H4;
    let f = H5;
    let g = H6;
    let h = H7;

    for (let t = 0; t < 64; t++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    H0 = (H0 + a) | 0;
    H1 = (H1 + b) | 0;
    H2 = (H2 + c) | 0;
    H3 = (H3 + d) | 0;
    H4 = (H4 + e) | 0;
    H5 = (H5 + f) | 0;
    H6 = (H6 + g) | 0;
    H7 = (H7 + h) | 0;
  }

  const result = new Uint8Array(32);
  const outView = new DataView(result.buffer);
  outView.setInt32(0, H0, false);
  outView.setInt32(4, H1, false);
  outView.setInt32(8, H2, false);
  outView.setInt32(12, H3, false);
  outView.setInt32(16, H4, false);
  outView.setInt32(20, H5, false);
  outView.setInt32(24, H6, false);
  outView.setInt32(28, H7, false);
  return result;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hmacSha256(message: string, key: string): string {
  const enc = new TextEncoder();
  let keyBytes: Uint8Array = enc.encode(key);
  const msgBytes = enc.encode(message);

  const blockSize = 64; // SHA-256 block size
  if (keyBytes.length > blockSize) {
    keyBytes = new Uint8Array(sha256Bytes(keyBytes));
  }
  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(keyBytes);

  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] = paddedKey[i] ^ 0x5c;
    iKeyPad[i] = paddedKey[i] ^ 0x36;
  }

  // inner = H(iKeyPad || message)
  const innerMsg = new Uint8Array(blockSize + msgBytes.length);
  innerMsg.set(iKeyPad, 0);
  innerMsg.set(msgBytes, blockSize);
  const innerHash = sha256Bytes(innerMsg);

  // outer = H(oKeyPad || innerHash)
  const outerMsg = new Uint8Array(blockSize + innerHash.length);
  outerMsg.set(oKeyPad, 0);
  outerMsg.set(innerHash, blockSize);
  return bytesToHex(sha256Bytes(outerMsg));
}

/**
 * Constant-time string comparison to prevent timing side-channel attacks
 */
export function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Computes an HMAC-SHA256 signature for a preview payload
 */
export function computePreviewSignature(
  pageId: string,
  revisionId: string,
  expires: number,
  secret: string = DEFAULT_PREVIEW_SECRET
): string {
  const data = `${pageId}:${revisionId}:${expires}`;
  return hmacSha256(data, secret);
}

/**
 * Generates an HMAC-SHA256 signed, time-limited preview link
 * Can be shared securely with Board of Directors / Executives to view draft pages
 * without requiring CMS admin credentials.
 */
export function generatePreviewToken(
  pageId: string,
  revisionId: string,
  options?: {
    expiresInSeconds?: number;
    secret?: string;
    baseUrl?: string;
  }
): GeneratedPreviewResult {
  const expiresInSeconds = options?.expiresInSeconds ?? 86400; // Default 24 hours
  const secret = options?.secret ?? DEFAULT_PREVIEW_SECRET;
  const baseUrl = options?.baseUrl ?? 'http://localhost:3000';

  const expires = Date.now() + expiresInSeconds * 1000;
  const signature = computePreviewSignature(pageId, revisionId, expires, secret);

  const previewPath = `/preview/pages/${pageId}?revisionId=${encodeURIComponent(
    revisionId
  )}&expires=${expires}&signature=${signature}`;
  const previewUrl = `${baseUrl.replace(/\/$/, '')}${previewPath}`;

  return {
    pageId,
    revisionId,
    expires,
    signature,
    previewPath,
    previewUrl,
  };
}

/**
 * Validates cryptographic signature and expiration timestamp of a preview token
 */
export function verifyPreviewToken(
  pageId: string,
  revisionId: string,
  expires: number | string,
  signature: string,
  secret: string = DEFAULT_PREVIEW_SECRET
): PreviewVerificationResult {
  if (!pageId || !revisionId || !expires || !signature) {
    return { valid: false, error: 'MALFORMED' };
  }

  const expNum = typeof expires === 'string' ? parseInt(expires, 10) : expires;
  if (isNaN(expNum)) {
    return { valid: false, error: 'MALFORMED' };
  }

  // Check expiration
  if (Date.now() > expNum) {
    return { valid: false, pageId, revisionId, expires: expNum, error: 'EXPIRED' };
  }

  // Check cryptographic signature with constant-time comparison
  const expectedSig = computePreviewSignature(pageId, revisionId, expNum, secret);

  if (!timingSafeEqualStrings(expectedSig, signature)) {
    return { valid: false, pageId, revisionId, expires: expNum, error: 'INVALID_SIGNATURE' };
  }

  return {
    valid: true,
    pageId,
    revisionId,
    expires: expNum,
  };
}
