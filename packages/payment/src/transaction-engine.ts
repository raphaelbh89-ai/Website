import {
  PaymentTransaction,
  CreatePaymentRequest,
  PaymentMetrics,
  PaymentGateway,
  PaymentStatus,
} from './schema';
import { generateVietQrPayload, formatTransferContent, DEFAULT_SCHOOL_BANK } from './vietqr';
import { generateGatewaySignature } from './signature';

const DEFAULT_GATEWAY_SECRET =
  ((globalThis as any).process?.env?.PAYMENT_HASH_SECRET as string) ||
  'alpha-school-payment-gateway-secret-2026';

/**
 * Sinh mã đơn hàng chuẩn hóa: 'TXN-2026-0001'
 */
export function generateOrderCode(seq: number, year: number = 2026): string {
  return `TXN-${year}-${String(seq).padStart(4, '0')}`;
}

/**
 * Khởi tạo một giao dịch thanh toán mới
 */
export function createPaymentTransaction(
  req: CreatePaymentRequest,
  seq: number,
  options?: {
    secret?: string;
    baseUrl?: string;
  }
): PaymentTransaction {
  const secret = options?.secret || DEFAULT_GATEWAY_SECRET;
  const baseUrl = options?.baseUrl || 'http://localhost:3000';
  const orderCode = generateOrderCode(seq);
  const now = new Date().toISOString();

  const id = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const transferContent = formatTransferContent(
    req.applicationId || orderCode,
    req.purpose === 'admission_fee' ? 'LEPHI' : 'HOCPHI'
  );

  let qrCodeUrl: string | null = null;
  let paymentUrl: string | null = null;
  let bankAccount = null;

  if (req.gateway === 'vietqr') {
    const vietQr = generateVietQrPayload(req.amount, transferContent, DEFAULT_SCHOOL_BANK);
    qrCodeUrl = vietQr.qrCodeUrl;
    bankAccount = {
      bankName: vietQr.bankName,
      bankCode: vietQr.bankCode,
      accountNumber: vietQr.accountNumber,
      accountHolder: vietQr.accountHolder,
      transferContent: vietQr.transferContent,
    };
    paymentUrl = `${baseUrl}/tuyen-sinh/thanh-toan/${orderCode}`;
  } else if (req.gateway === 'vnpay') {
    // VNPay sandbox URL generation
    const vnpParams: Record<string, any> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: 'ALPHACMS',
      vnp_Amount: req.amount * 100, // VNPay expects amount * 100
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderCode,
      vnp_OrderInfo: `Thanh toan ${req.purpose} hoc sinh ${req.studentName}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: req.returnUrl || `${baseUrl}/tuyen-sinh/thanh-toan/${orderCode}?gateway=vnpay`,
      vnp_CreateDate: now.replace(/[-:T.Z]/g, '').slice(0, 14),
    };
    const signature = generateGatewaySignature(vnpParams, secret);
    const queryString = Object.keys(vnpParams)
      .map((k) => `${k}=${encodeURIComponent(vnpParams[k])}`)
      .join('&');
    paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${queryString}&vnp_SecureHash=${signature}`;
  } else if (req.gateway === 'momo') {
    paymentUrl = `https://test-payment.momo.vn/v2/gateway/pay?orderId=${orderCode}&amount=${req.amount}`;
  } else {
    paymentUrl = `${baseUrl}/tuyen-sinh/thanh-toan/${orderCode}`;
  }

  const transaction: PaymentTransaction = {
    id,
    orderCode,
    applicationId: req.applicationId || null,
    studentName: req.studentName,
    parentName: req.parentName,
    parentPhone: req.parentPhone,
    parentEmail: req.parentEmail || null,
    branchId: req.branchId,
    branchName: req.branchName,
    amount: req.amount,
    currency: 'VND',
    purpose: req.purpose,
    description: `Thanh toán ${req.purpose === 'admission_fee' ? 'Lệ phí xét tuyển' : 'Học phí'} cho học sinh ${req.studentName}`,
    gateway: req.gateway,
    status: 'PENDING',
    idempotencyKey: req.idempotencyKey || null,
    qrCodeUrl,
    paymentUrl,
    bankAccount,
    signature: generateGatewaySignature({ orderCode, amount: req.amount }, secret),
    createdAt: now,
    updatedAt: now,
  };

  return transaction;
}

/**
 * Tính toán các chỉ số KPI tài chính tuyển sinh
 */
export function calculatePaymentMetrics(
  transactions: PaymentTransaction[]
): PaymentMetrics {
  const byStatus: Record<PaymentStatus, number> = {
    PENDING: 0,
    SUCCESS: 0,
    FAILED: 0,
    EXPIRED: 0,
    REFUNDED: 0,
  };

  const byGateway: Record<PaymentGateway, number> = {
    vietqr: 0,
    vnpay: 0,
    momo: 0,
    zalopay: 0,
    stripe: 0,
  };

  let totalRevenue = 0;

  for (const txn of transactions) {
    if (byStatus[txn.status] !== undefined) {
      byStatus[txn.status]++;
    }
    if (byGateway[txn.gateway] !== undefined) {
      byGateway[txn.gateway]++;
    }
    if (txn.status === 'SUCCESS') {
      totalRevenue += txn.amount;
    }
  }

  const totalTransactions = transactions.length;
  const successRate =
    totalTransactions > 0
      ? Math.round((byStatus.SUCCESS / totalTransactions) * 1000) / 10
      : 0;

  return {
    totalRevenue,
    totalTransactions,
    byStatus,
    byGateway,
    successRate,
  };
}

/**
 * Bộ dữ liệu mẫu khởi tạo cho hệ thống tài chính
 */
export const INITIAL_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'pay-001',
    orderCode: 'TXN-2026-0001',
    applicationId: 'HS-2026-0001',
    studentName: 'Trần Minh Khang',
    parentName: 'Trần Văn Hoàng',
    parentPhone: '0903 888 999',
    parentEmail: 'hoang.tran@example.com',
    branchId: 'bien-hoa',
    branchName: 'Alpha School Biên Hòa',
    amount: 500000,
    currency: 'VND',
    purpose: 'admission_fee',
    description: 'Lệ phí hồ sơ xét tuyển lớp 6 song ngữ Cambridge',
    gateway: 'vietqr',
    status: 'SUCCESS',
    qrCodeUrl: 'https://img.vietqr.io/image/970436-1023888999-compact2.png?amount=500000&addInfo=HS2026_0001_LEPHI&accountName=TRUONG%20PTTN%20ALPHA%20SCHOOL',
    paymentUrl: 'http://localhost:3000/tuyen-sinh/thanh-toan/TXN-2026-0001',
    bankAccount: {
      bankName: DEFAULT_SCHOOL_BANK.bankName,
      bankCode: DEFAULT_SCHOOL_BANK.bankCode,
      accountNumber: DEFAULT_SCHOOL_BANK.accountNumber,
      accountHolder: DEFAULT_SCHOOL_BANK.accountHolder,
      transferContent: 'HS2026_0001_LEPHI',
    },
    gatewayTransactionId: 'VCB260901001',
    paidAt: '2026-09-01T09:15:00.000Z',
    createdAt: '2026-09-01T09:10:00.000Z',
    updatedAt: '2026-09-01T09:15:00.000Z',
  },
  {
    id: 'pay-002',
    orderCode: 'TXN-2026-0002',
    applicationId: 'HS-2026-0002',
    studentName: 'Lê Bảo Anh',
    parentName: 'Lê Quang Huy',
    parentPhone: '0912 345 678',
    parentEmail: 'huy.le@gmail.com',
    branchId: 'thu-duc',
    branchName: 'Alpha School TP. Thủ Đức',
    amount: 25000000,
    currency: 'VND',
    purpose: 'tuition',
    description: 'Học phí học kỳ 1 lớp 1 Hệ Chất Lượng Cao',
    gateway: 'vnpay',
    status: 'SUCCESS',
    paymentUrl: 'http://localhost:3000/tuyen-sinh/thanh-toan/TXN-2026-0002',
    gatewayTransactionId: 'VNP14892019',
    paidAt: '2026-09-02T14:30:00.000Z',
    createdAt: '2026-09-02T14:25:00.000Z',
    updatedAt: '2026-09-02T14:30:00.000Z',
  },
  {
    id: 'pay-003',
    orderCode: 'TXN-2026-0003',
    applicationId: 'HS-2026-0003',
    studentName: 'Nguyễn Diệu Linh',
    parentName: 'Nguyễn Quốc Hùng',
    parentPhone: '0987 654 321',
    parentEmail: 'hung.nguyen@gmail.com',
    branchId: 'cau-giay',
    branchName: 'Alpha School Cầu Giấy',
    amount: 500000,
    currency: 'VND',
    purpose: 'admission_fee',
    description: 'Lệ phí kiểm tra năng lực đầu vào lớp 10',
    gateway: 'momo',
    status: 'SUCCESS',
    paymentUrl: 'http://localhost:3000/tuyen-sinh/thanh-toan/TXN-2026-0003',
    gatewayTransactionId: 'MOMO99281726',
    paidAt: '2026-09-03T11:00:00.000Z',
    createdAt: '2026-09-03T10:55:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z',
  },
  {
    id: 'pay-004',
    orderCode: 'TXN-2026-0004',
    applicationId: 'HS-2026-0004',
    studentName: 'Phạm Gia Hưng',
    parentName: 'Phạm Văn Nam',
    parentPhone: '0933 111 222',
    branchId: 'bien-hoa',
    branchName: 'Alpha School Biên Hòa',
    amount: 18500000,
    currency: 'VND',
    purpose: 'tuition',
    description: 'Học phí tạm thu lớp 6 Song ngữ',
    gateway: 'vietqr',
    status: 'PENDING',
    qrCodeUrl: 'https://img.vietqr.io/image/970436-1023888999-compact2.png?amount=18500000&addInfo=HS2026_0004_HOCPHI&accountName=TRUONG%20PTTN%20ALPHA%20SCHOOL',
    paymentUrl: 'http://localhost:3000/tuyen-sinh/thanh-toan/TXN-2026-0004',
    bankAccount: {
      bankName: DEFAULT_SCHOOL_BANK.bankName,
      bankCode: DEFAULT_SCHOOL_BANK.bankCode,
      accountNumber: DEFAULT_SCHOOL_BANK.accountNumber,
      accountHolder: DEFAULT_SCHOOL_BANK.accountHolder,
      transferContent: 'HS2026_0004_HOCPHI',
    },
    createdAt: '2026-09-05T08:00:00.000Z',
    updatedAt: '2026-09-05T08:00:00.000Z',
  },
];
