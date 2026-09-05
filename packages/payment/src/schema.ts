import { z } from 'zod';

export const PaymentGatewaySchema = z.enum([
  'vietqr',
  'vnpay',
  'momo',
  'zalopay',
  'stripe',
]);
export type PaymentGateway = z.infer<typeof PaymentGatewaySchema>;

export const PaymentStatusSchema = z.enum([
  'PENDING',
  'SUCCESS',
  'FAILED',
  'EXPIRED',
  'REFUNDED',
]);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const PaymentPurposeSchema = z.enum([
  'admission_fee', // Lệ phí xét tuyển đầu vào
  'tuition',       // Học phí chính khóa
  'uniform_supplies', // Đồng phục & Học liệu
  'other',
]);
export type PaymentPurpose = z.infer<typeof PaymentPurposeSchema>;

export const PaymentTransactionSchema = z.object({
  id: z.string(),
  orderCode: z.string(), // ví dụ: TXN-2026-0001
  applicationId: z.string().optional().nullable(), // liên kết với HS-2026-XXXX
  studentName: z.string(),
  parentName: z.string(),
  parentPhone: z.string(),
  parentEmail: z.string().optional().nullable(),
  branchId: z.string(),
  branchName: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('VND'),
  purpose: PaymentPurposeSchema.default('admission_fee'),
  description: z.string(),
  gateway: PaymentGatewaySchema,
  status: PaymentStatusSchema.default('PENDING'),
  idempotencyKey: z.string().optional().nullable(),
  qrCodeUrl: z.string().optional().nullable(),
  paymentUrl: z.string().optional().nullable(),
  bankAccount: z
    .object({
      bankName: z.string(),
      bankCode: z.string(),
      accountNumber: z.string(),
      accountHolder: z.string(),
      transferContent: z.string(),
    })
    .optional()
    .nullable(),
  gatewayTransactionId: z.string().optional().nullable(),
  signature: z.string().optional().nullable(),
  paidAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;

export const CreatePaymentRequestSchema = z.object({
  applicationId: z.string().optional(),
  studentName: z.string().min(2, 'Họ tên học sinh không được để trống'),
  parentName: z.string().min(2, 'Họ tên phụ huynh không được để trống'),
  parentPhone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  parentEmail: z.string().email().optional(),
  branchId: z.string(),
  branchName: z.string(),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  purpose: PaymentPurposeSchema.default('admission_fee'),
  gateway: PaymentGatewaySchema.default('vietqr'),
  idempotencyKey: z.string().optional(),
  returnUrl: z.string().optional(),
});
export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>;

export const IpnWebhookRequestSchema = z.object({
  orderCode: z.string(),
  gatewayTransactionId: z.string(),
  amount: z.number(),
  status: PaymentStatusSchema,
  gateway: PaymentGatewaySchema,
  signature: z.string(),
  paidAt: z.string().optional(),
  message: z.string().optional(),
});
export type IpnWebhookRequest = z.infer<typeof IpnWebhookRequestSchema>;

export interface PaymentMetrics {
  totalRevenue: number;
  totalTransactions: number;
  byStatus: Record<PaymentStatus, number>;
  byGateway: Record<PaymentGateway, number>;
  successRate: number; // %
}

export const PAYMENT_GATEWAY_LABELS: Record<
  PaymentGateway,
  { name: string; icon: string; color: string; bg: string }
> = {
  vietqr: {
    name: 'VietQR (Napas 247)',
    icon: '⚡',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
  },
  vnpay: {
    name: 'VNPAY-QR / Thẻ ATM',
    icon: '💳',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
  },
  momo: {
    name: 'Ví MoMo',
    icon: '📱',
    color: 'text-pink-700',
    bg: 'bg-pink-50',
  },
  zalopay: {
    name: 'Ví ZaloPay',
    icon: '🪙',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
  },
  stripe: {
    name: 'Thẻ Quốc Tế (Stripe)',
    icon: '🌐',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
  },
};

export const PAYMENT_STATUS_LABELS: Record<
  PaymentStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  PENDING: {
    label: 'Chờ Thanh Toán',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  SUCCESS: {
    label: 'Thanh Toán Thành Công',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  FAILED: {
    label: 'Giao Dịch Thất Bại',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  EXPIRED: {
    label: 'Đã Hết Hạn',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    border: 'border-gray-300',
  },
  REFUNDED: {
    label: 'Đã Hoàn Tiền',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
};
