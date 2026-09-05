/**
 * Pure TypeScript SHA-512 & HMAC-SHA512 implementation (FIPS 180-4 / RFC 2104)
 * Isomorphic: Runs in Node.js, Next.js Edge, and browser runtimes without native node:crypto
 */

// SHA-512 constants (high 32 bits and low 32 bits for each 64-bit constant)
const K512: [number, number][] = [
  [0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd], [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc],
  [0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019], [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118],
  [0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe], [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2],
  [0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1], [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694],
  [0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3], [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65],
  [0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483], [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5],
  [0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210], [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4],
  [0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725], [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70],
  [0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926], [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df],
  [0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8], [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b],
  [0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001], [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30],
  [0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910], [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8],
  [0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53], [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8],
  [0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb], [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3],
  [0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60], [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec],
  [0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9], [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b],
  [0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207], [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178],
  [0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6], [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b],
  [0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493], [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c],
  [0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a], [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817],
];

// Helper to add two 64-bit numbers (represented as [hi, lo])
function add64(a: [number, number], b: [number, number]): [number, number] {
  const l = (a[1] >>> 0) + (b[1] >>> 0);
  const carry = l > 0xffffffff ? 1 : 0;
  const h = ((a[0] >>> 0) + (b[0] >>> 0) + carry) | 0;
  return [h, l | 0];
}

function rotr64(x: [number, number], n: number): [number, number] {
  const h = x[0];
  const l = x[1];
  if (n < 32) {
    return [
      ((h >>> n) | (l << (32 - n))) | 0,
      ((l >>> n) | (h << (32 - n))) | 0,
    ];
  } else if (n === 32) {
    return [l, h];
  } else {
    const shift = n - 32;
    return [
      ((l >>> shift) | (h << (32 - shift))) | 0,
      ((h >>> shift) | (l << (32 - shift))) | 0,
    ];
  }
}

function shr64(x: [number, number], n: number): [number, number] {
  if (n < 32) {
    return [(x[0] >>> n) | 0, ((x[1] >>> n) | (x[0] << (32 - n))) | 0];
  } else if (n === 32) {
    return [0, x[0] | 0];
  } else {
    return [0, (x[0] >>> (n - 32)) | 0];
  }
}

function xor64(a: [number, number], b: [number, number], c?: [number, number]): [number, number] {
  if (c) {
    return [(a[0] ^ b[0] ^ c[0]) | 0, (a[1] ^ b[1] ^ c[1]) | 0];
  }
  return [(a[0] ^ b[0]) | 0, (a[1] ^ b[1]) | 0];
}

function and64(a: [number, number], b: [number, number]): [number, number] {
  return [(a[0] & b[0]) | 0, (a[1] & b[1]) | 0];
}

function not64(a: [number, number]): [number, number] {
  return [(~a[0]) | 0, (~a[1]) | 0];
}

function sha512Bytes(bytes: Uint8Array): Uint8Array {
  // Initial hash values
  let H: [number, number][] = [
    [0x6a09e667, 0xf3bcc908],
    [0xbb67ae85, 0x84caa73b],
    [0x3c6ef372, 0xfe94f82b],
    [0xa54ff53a, 0x5f1d36f1],
    [0x510e527f, 0xade682d1],
    [0x9b05688c, 0x2b3e6c1f],
    [0x1f83d9ab, 0xfb41bd6b],
    [0x5be0cd19, 0x137e2179],
  ];

  const bitLength = bytes.length * 8;
  const newLength = (((bytes.length + 16) >> 7) + 1) << 7; // 128-byte blocks
  const padded = new Uint8Array(newLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  const view = new DataView(padded.buffer);
  // Last 16 bytes: length in bits as 128-bit big-endian integer (high 64 bits = 0, low 64 bits = bitLength)
  const low64_hi = Math.floor(bitLength / 0x100000000);
  const low64_lo = bitLength >>> 0;
  view.setUint32(newLength - 8, low64_hi, false);
  view.setUint32(newLength - 4, low64_lo, false);

  const W: [number, number][] = new Array(80);

  for (let i = 0; i < newLength; i += 128) {
    for (let t = 0; t < 16; t++) {
      const hi = view.getUint32(i + t * 8, false);
      const lo = view.getUint32(i + t * 8 + 4, false);
      W[t] = [hi, lo];
    }

    for (let t = 16; t < 80; t++) {
      const s0 = xor64(rotr64(W[t - 15], 1), rotr64(W[t - 15], 8), shr64(W[t - 15], 7));
      const s1 = xor64(rotr64(W[t - 2], 19), rotr64(W[t - 2], 61), shr64(W[t - 2], 6));
      W[t] = add64(add64(W[t - 16], s0), add64(W[t - 7], s1));
    }

    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    let f = H[5];
    let g = H[6];
    let h = H[7];

    for (let t = 0; t < 80; t++) {
      const S1 = xor64(rotr64(e, 14), rotr64(e, 18), rotr64(e, 41));
      const ch = xor64(and64(e, f), and64(not64(e), g));
      const temp1 = add64(add64(add64(h, S1), add64(ch, K512[t])), W[t]);

      const S0 = xor64(rotr64(a, 28), rotr64(a, 34), rotr64(a, 39));
      const maj = xor64(and64(a, b), and64(a, c), and64(b, c));
      const temp2 = add64(S0, maj);

      h = g;
      g = f;
      f = e;
      e = add64(d, temp1);
      d = c;
      c = b;
      b = a;
      a = add64(temp1, temp2);
    }

    H[0] = add64(H[0], a);
    H[1] = add64(H[1], b);
    H[2] = add64(H[2], c);
    H[3] = add64(H[3], d);
    H[4] = add64(H[4], e);
    H[5] = add64(H[5], f);
    H[6] = add64(H[6], g);
    H[7] = add64(H[7], h);
  }

  const out = new Uint8Array(64);
  const outView = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) {
    outView.setUint32(i * 8, H[i][0], false);
    outView.setUint32(i * 8 + 4, H[i][1], false);
  }
  return out;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hmacSha512(message: string, key: string): string {
  const enc = new TextEncoder();
  let keyBytes: Uint8Array = enc.encode(key);
  const msgBytes = enc.encode(message);

  const blockSize = 128; // SHA-512 block size is 128 bytes
  if (keyBytes.length > blockSize) {
    keyBytes = new Uint8Array(sha512Bytes(keyBytes));
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
  const innerHash = sha512Bytes(innerMsg);

  // outer = H(oKeyPad || innerHash)
  const outerMsg = new Uint8Array(blockSize + innerHash.length);
  outerMsg.set(oKeyPad, 0);
  outerMsg.set(innerHash, blockSize);
  return bytesToHex(sha512Bytes(outerMsg));
}

/**
 * Constant-time string comparison preventing side-channel timing attacks
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
 * Canonicalizes parameters by alphabetically sorting keys and constructing URL-encoded query string
 * Follows VNPay, MoMo, and ZaloPay official signature guidelines
 */
export function canonicalizeParams(params: Record<string, any>): string {
  const sortedKeys = Object.keys(params)
    .filter((k) => k !== 'signature' && k !== 'vnp_SecureHash' && params[k] !== undefined && params[k] !== null && params[k] !== '')
    .sort();

  return sortedKeys
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(params[k]))}`)
    .join('&');
}

/**
 * Generates an HMAC-SHA512 checksum signature for payment payload
 */
export function generateGatewaySignature(
  params: Record<string, any>,
  secret: string
): string {
  const canonicalData = canonicalizeParams(params);
  return hmacSha512(canonicalData, secret);
}

/**
 * Verifies an incoming IPN Webhook checksum using constant-time comparison
 */
export function verifyGatewaySignature(
  params: Record<string, any>,
  receivedSignature: string,
  secret: string
): boolean {
  if (!receivedSignature || !secret) return false;
  const expectedSignature = generateGatewaySignature(params, secret);
  return timingSafeEqualStrings(expectedSignature.toLowerCase(), receivedSignature.toLowerCase());
}
