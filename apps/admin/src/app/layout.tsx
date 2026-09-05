import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alpha School CMS — Admin Dashboard & Page Builder',
  description: 'Bảng điều khiển quản trị trang web và hệ sinh thái đa cơ sở',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased flex flex-col">{children}</body>
    </html>
  );
}
