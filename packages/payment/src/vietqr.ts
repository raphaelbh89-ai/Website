export interface VietQrConfig {
  bankCode: string; // ví dụ: '970436' (VCB), '970418' (BIDV), '970422' (MB)
  bankName: string; // ví dụ: 'Vietcombank'
  accountNumber: string; // ví dụ: '0011001234567'
  accountHolder: string; // ví dụ: 'TRUONG PTTN ALPHA SCHOOL'
  template?: 'compact' | 'compact2' | 'qr_only' | 'print';
}

export const DEFAULT_SCHOOL_BANK: VietQrConfig = {
  bankCode: '970436', // Vietcombank
  bankName: 'Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)',
  accountNumber: '1023888999',
  accountHolder: 'TRUONG PTTN ALPHA SCHOOL',
  template: 'compact2',
};

export interface VietQrPayload {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  transferContent: string;
  qrCodeUrl: string;
  deepLink?: string;
}

/**
 * Chuẩn hóa cú pháp nội dung chuyển khoản học phí tự động:
 * Ví dụ: 'HS2026_0042_HOCPHI' hoặc 'HS2026_0042_LEPHI'
 */
export function formatTransferContent(
  applicationCodeOrSeq: string | number,
  purposeSuffix: string = 'HOCPHI'
): string {
  let cleanCode = String(applicationCodeOrSeq).trim().toUpperCase();
  // Chuẩn hóa mã như 'HS-2026-0042' -> 'HS2026_0042'
  cleanCode = cleanCode
    .replace(/^([A-Z]+)-(\d+)/, '$1$2')
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  if (!cleanCode.endsWith(`_${purposeSuffix}`)) {
    cleanCode = `${cleanCode}_${purposeSuffix}`;
  }
  return cleanCode;
}

/**
 * Sinh đối tượng VietQR Napas 247 hoàn chỉnh kèm đường link ảnh QR code
 */
export function generateVietQrPayload(
  amount: number,
  transferContent: string,
  bankConfig: VietQrConfig = DEFAULT_SCHOOL_BANK
): VietQrPayload {
  const template = bankConfig.template || 'compact2';
  const encodedContent = encodeURIComponent(transferContent);
  const encodedHolder = encodeURIComponent(bankConfig.accountHolder);

  // Chuẩn VietQR Image API (Napas 247)
  const qrCodeUrl = `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankConfig.accountNumber}-${template}.png?amount=${amount}&addInfo=${encodedContent}&accountName=${encodedHolder}`;

  return {
    bankCode: bankConfig.bankCode,
    bankName: bankConfig.bankName,
    accountNumber: bankConfig.accountNumber,
    accountHolder: bankConfig.accountHolder,
    amount,
    transferContent,
    qrCodeUrl,
    deepLink: `vietqr://transfer?bankCode=${bankConfig.bankCode}&accountNumber=${bankConfig.accountNumber}&amount=${amount}&content=${encodedContent}`,
  };
}
