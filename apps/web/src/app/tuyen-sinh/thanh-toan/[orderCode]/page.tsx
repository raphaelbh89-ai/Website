'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PaymentGateway,
  PAYMENT_GATEWAY_LABELS,
  DEFAULT_SCHOOL_BANK,
} from '@school-cms/payment';

interface CheckoutPageProps {
  params: {
    orderCode: string;
  };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { orderCode } = params;

  // Mock initial order state matching orderCode
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('vietqr');
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paidTime, setPaidTime] = useState<string | null>(null);
  const [bankRef, setBankRef] = useState<string | null>(null);

  const amount = 500000; // 500,000 VND standard admission exam fee
  const studentName = 'Trần Gia Bảo';
  const parentName = 'Trần Quốc Tuấn';
  const branchName = 'Alpha School - Cơ sở Biên Hòa';
  const applicationCode = 'HS-2026-0001';
  const transferContent = `HS2026_0001_LEPHI`;

  const vietQrUrl = `https://img.vietqr.io/image/${DEFAULT_SCHOOL_BANK.bankCode}-${DEFAULT_SCHOOL_BANK.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(DEFAULT_SCHOOL_BANK.accountHolder)}`;

  const handleCopyContent = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(transferContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulateSuccess = () => {
    setIsPaid(true);
    setPaidTime(new Date().toLocaleString('vi-VN'));
    setBankRef(`VCB-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-800 font-black text-2xl tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-lg shadow-md">
              α
            </span>
            ALPHA SCHOOL
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Cổng Thanh Toán Lệ Phí & Học Phí Trực Tuyến
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Hệ thống thanh toán bảo mật tiêu chuẩn Napas 247 và cổng thanh toán quốc gia.
          </p>
        </div>

        {/* Successful Paid Receipt View */}
        {isPaid ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl text-center space-y-6 animate-fade-in max-w-xl mx-auto">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto ring-8 ring-emerald-50">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Thanh Toán Thành Công
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Biên Lai Thu Tiền Điện Tử
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Hệ thống đã ghi nhận thanh toán và tự động cập nhật trạng thái hồ sơ tuyển sinh sang <strong>Đã Nhập Học (Hoàn Tất)</strong>.
              </p>
            </div>

            {/* Receipt Table */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left text-sm space-y-3 border border-slate-100 font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Mã đơn hàng:</span>
                <span className="font-bold text-slate-800">{orderCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Mã hồ sơ tuyển sinh:</span>
                <span className="font-bold text-emerald-700">{applicationCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Học sinh:</span>
                <span className="font-bold text-slate-800">{studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Số tiền thanh toán:</span>
                <span className="font-black text-emerald-700 text-base font-sans">
                  {amount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans">Mã tham chiếu ngân hàng:</span>
                <span className="font-bold text-slate-800">{bankRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Thời gian ghi nhận:</span>
                <span className="text-slate-700 text-xs">{paidTime}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/tuyen-sinh"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow"
              >
                ← Quay lại Cổng Tuyển Sinh
              </Link>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all"
              >
                🖨 In Biên Lai / Lưu PDF
              </button>
            </div>
          </div>
        ) : (
          /* Active Payment Flow */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Chi Tiết Đơn Hàng
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {orderCode}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Học sinh:</span>
                    <span className="font-bold text-slate-900">{studentName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Phụ huynh nộp:</span>
                    <span className="font-medium text-slate-800">{parentName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Cơ sở đăng ký:</span>
                    <span className="font-medium text-slate-800">{branchName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Mã hồ sơ:</span>
                    <span className="font-mono font-bold text-emerald-700">{applicationCode}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="text-xs text-slate-500">Số tiền cần thanh toán:</div>
                  <div className="text-3xl font-black text-emerald-700 mt-1">
                    {amount.toLocaleString('vi-VN')} <span className="text-base font-semibold">VNĐ</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Đã bao gồm VAT và phí xử lý cổng</div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>🔒</span> Giao Dịch An Toàn & Bảo Mật Tuyệt Đối
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Mọi thông tin thanh toán được mã hóa theo chuẩn bảo mật ngân hàng Napas 247 và chữ ký số SHA-512. Trạng thái hồ sơ được cập nhật tự động 24/7.
                </p>
              </div>
            </div>

            {/* Right Column: Gateway Selection & QR / Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-bold text-slate-900 text-base">
                  Chọn Phương Thức Thanh Toán
                </h3>

                {/* Gateway Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['vietqr', 'vnpay', 'momo', 'stripe'] as PaymentGateway[]).map((gw) => {
                    const info = PAYMENT_GATEWAY_LABELS[gw];
                    const isSelected = selectedGateway === gw;
                    return (
                      <button
                        key={gw}
                        type="button"
                        onClick={() => setSelectedGateway(gw)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                        }`}
                      >
                        <div className="text-xl mb-1">{info.icon}</div>
                        <div className="text-xs">{info.name.split(' ')[0]}</div>
                      </button>
                    );
                  })}
                </div>

                {/* VietQR View */}
                {selectedGateway === 'vietqr' && (
                  <div className="border border-emerald-100 bg-emerald-50/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      Quét Mã VietQR Napas 247 (Mọi Ứng Dụng Ngân Hàng)
                    </span>

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vietQrUrl}
                      alt="VietQR Chuyển Khoản"
                      className="w-64 h-auto rounded-2xl border border-slate-200 shadow-lg bg-white p-2"
                    />

                    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Ngân hàng:</span>
                        <span className="font-bold text-slate-800">Vietcombank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Số tài khoản:</span>
                        <span className="font-bold text-slate-800 font-mono">1023888999</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">Chủ tài khoản:</span>
                        <span className="font-bold text-slate-800">TRUONG PTTN ALPHA SCHOOL</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-slate-400 font-sans">Nội dung CK:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-700">{transferContent}</span>
                          <button
                            type="button"
                            onClick={handleCopyContent}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold"
                          >
                            {copied ? '✓ Đã chép' : 'Sao chép'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VNPay View */}
                {selectedGateway === 'vnpay' && (
                  <div className="border border-blue-100 bg-blue-50/20 rounded-2xl p-6 text-center space-y-4">
                    <div className="text-4xl">💳</div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Cổng Thanh Toán Quốc Gia VNPAY
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Hỗ trợ thanh toán qua 40+ ứng dụng ngân hàng, thẻ ATM nội địa và tài khoản VNPay QR.
                    </p>
                    <button
                      type="button"
                      onClick={handleSimulateSuccess}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Tiến Hành Thanh Toán Qua VNPAY
                    </button>
                  </div>
                )}

                {/* MoMo View */}
                {selectedGateway === 'momo' && (
                  <div className="border border-pink-100 bg-pink-50/20 rounded-2xl p-6 text-center space-y-4">
                    <div className="text-4xl">📱</div>
                    <h4 className="font-bold text-slate-900 text-sm">Ví Điện Tử MoMo</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Quét mã thanh toán qua ứng dụng MoMo trên điện thoại hoặc chuyển hướng thanh toán an toàn.
                    </p>
                    <button
                      type="button"
                      onClick={handleSimulateSuccess}
                      className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Mở Ứng Dụng MoMo Thanh Toán
                    </button>
                  </div>
                )}

                {/* Stripe View */}
                {selectedGateway === 'stripe' && (
                  <div className="border border-indigo-100 bg-indigo-50/20 rounded-2xl p-6 text-center space-y-4">
                    <div className="text-4xl">🌐</div>
                    <h4 className="font-bold text-slate-900 text-sm">Thẻ Quốc Tế (Stripe)</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Dành cho phụ huynh quốc tế sử dụng thẻ Visa, MasterCard, JCB, American Express.
                    </p>
                    <button
                      type="button"
                      onClick={handleSimulateSuccess}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                      Thanh Toán Qua Stripe Checkout
                    </button>
                  </div>
                )}

                {/* Instant Verification Simulation for Testers & Parents */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-600 text-center sm:text-left">
                      <span className="font-bold text-slate-800 block">Kiểm Thử Dòng Tiền Trực Quan:</span>
                      Giả lập webhook đối soát Napas 247 báo chuyển khoản thành công.
                    </div>
                    <button
                      type="button"
                      onClick={handleSimulateSuccess}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
                    >
                      ⚡ Giả Lập Đã Chuyển Tiền
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
