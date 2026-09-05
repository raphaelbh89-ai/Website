export type SupportedLocale = 'vi' | 'en';

export interface TranslationItem {
  key: string;
  vi: string;
  en: string;
  category: 'nav' | 'admissions' | 'common' | 'search' | 'footer';
}

export const DEFAULT_TRANSLATIONS: TranslationItem[] = [
  // Navigation
  { key: 'nav.home', vi: 'Trang Chủ', en: 'Home', category: 'nav' },
  { key: 'nav.programs', vi: 'Chương Trình Học', en: 'Academic Programs', category: 'nav' },
  { key: 'nav.campuses', vi: 'Hệ Thống Cơ Sở', en: 'Campuses', category: 'nav' },
  { key: 'nav.news', vi: 'Tin Tức & Sự Kiện', en: 'News & Events', category: 'nav' },
  { key: 'nav.admissions', vi: 'Tuyển Sinh 2025', en: 'Admissions 2025', category: 'nav' },
  { key: 'nav.handbook', vi: 'Cẩm Nang Phụ Huynh', en: 'Parent Handbook', category: 'nav' },

  // Admissions
  { key: 'admissions.apply_now', vi: 'Đăng Ký Tư Vấn', en: 'Apply for Admission', category: 'admissions' },
  { key: 'admissions.consultation_title', vi: 'Đăng Ký Tư Vấn Tuyển Sinh 2025 - 2026', en: 'Admissions Consultation Request 2025 - 2026', category: 'admissions' },
  { key: 'admissions.consultation_sub', vi: 'Nhận cẩm nang tuyển sinh và học bổng lên tới 50%', en: 'Receive admission handbook and up to 50% scholarship', category: 'admissions' },
  { key: 'admissions.parent_name', vi: 'Họ tên Phụ huynh', en: "Parent's Full Name", category: 'admissions' },
  { key: 'admissions.phone', vi: 'Số điện thoại liên hệ', en: 'Contact Phone Number', category: 'admissions' },
  { key: 'admissions.student_name', vi: 'Họ tên Học sinh', en: "Student's Full Name", category: 'admissions' },
  { key: 'admissions.grade', vi: 'Cấp lớp ứng tuyển', en: 'Applying Grade', category: 'admissions' },
  { key: 'admissions.submit_btn', vi: 'Gửi Thông Tin Đăng Ký', en: 'Submit Application', category: 'admissions' },

  // Common UI
  { key: 'common.search_placeholder', vi: 'Tìm kiếm cơ sở, chương trình, tin tức... (Ctrl+K)', en: 'Search campuses, programs, news... (Ctrl+K)', category: 'search' },
  { key: 'common.view_details', vi: 'Xem Chi Tiết', en: 'View Details', category: 'common' },
  { key: 'common.read_more', vi: 'Xem Thêm Bài Viết', en: 'Read More Articles', category: 'common' },
  { key: 'common.all_campuses', vi: 'Tất Cả Cơ Sở', en: 'All Campuses', category: 'common' },
  { key: 'common.hotline', vi: 'Hotline Tuyển Sinh: 1900 6868', en: 'Admissions Hotline: 1900 6868', category: 'common' },

  // Footer
  { key: 'footer.copyright', vi: 'Bản quyền thuộc về Hệ thống Trường Liên cấp Quốc tế Alpha School', en: 'Copyright © Alpha International School System. All rights reserved.', category: 'footer' },
  { key: 'footer.privacy', vi: 'Chính Sách Bảo Mật', en: 'Privacy Policy', category: 'footer' },
  { key: 'footer.terms', vi: 'Điều Khoản Dịch Vụ', en: 'Terms of Service', category: 'footer' },
];

export function translate(key: string, locale: SupportedLocale = 'vi', customItems?: TranslationItem[]): string {
  const items = customItems || DEFAULT_TRANSLATIONS;
  const match = items.find(item => item.key === key);
  if (match && match[locale]) {
    return match[locale];
  }
  return key;
}
