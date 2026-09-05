'use client';

import React, { useState } from 'react';
import { BlockRegistry } from '@school-cms/cms';
import {
  DEFAULT_TRANSLATIONS,
  TranslationItem,
  PIPELINE_STAGES,
  getNextPipelineStatus,
  calculatePipelineMetrics,
  AdmissionApplication,
  AdmissionStatus,
  calculateAdmissionMetrics,
  ADMISSION_STATUS_LABELS,
} from '@school-cms/shared';
import { ALL_PERMISSIONS, RolePermissions } from '@school-cms/auth';
import '@school-cms/blocks';
import {
  KnowledgeSource,
  KnowledgeCategory,
  ChatbotIntent,
  BotMessage,
  INITIAL_KNOWLEDGE_SOURCES,
  KNOWLEDGE_CATEGORY_LABELS,
  INTENT_LABELS,
  classifyIntent,
  findRelevantKnowledge,
  generateChatbotResponse,
  ChatbotQueryResponse,
} from '@school-cms/ai-chatbot';

interface BlockItem {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
}

interface PageRevision {
  id: string;
  version: number;
  createdAt: string;
  author: string;
  description: string;
  blocksSnapshot: BlockItem[];
}

interface FormFieldItem {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface LeadItem {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  studentName: string;
  grade: string;
  branch: string;
  branchId?: string;
  date: string;
  status: 'Mới' | 'Đang tư vấn' | 'Đã hẹn tham quan' | 'Đã nhập học' | 'Spam';
  notes: Array<{ text: string; author: string; date: string }>;
}

interface AuditItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'STATUS_CHANGE' | 'EXPORT';
  entityType: 'PAGE' | 'ARTICLE' | 'BRANCH' | 'LEAD' | 'THEME' | 'FORM' | 'MENU' | 'TRANSLATION' | 'USER' | 'ROLE';
  entityTitle: string;
  details?: string;
}

interface MenuItem {
  id: string;
  title: string;
  url: string;
  target: '_self' | '_blank';
  order: number;
  isActive: boolean;
  location: 'header' | 'footer';
}

interface UserAccountItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CAMPUS_DIRECTOR' | 'ADMISSIONS_OFFICER' | 'CONTENT_EDITOR';
  branchId: string | null;
  branchName: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
}

export default function AdminDashboard() {
  // Current user role switcher for testing RBAC
  const [currentRole, setCurrentRole] = useState<'SUPER_ADMIN' | 'CAMPUS_DIRECTOR' | 'ADMISSIONS_OFFICER'>('SUPER_ADMIN');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pages' | 'branches' | 'articles' | 'leads' | 'admissions' | 'chatbot' | 'theme' | 'forms' | 'media' | 'webhooks' | 'cache' | 'audit' | 'analytics' | 'menus' | 'i18n' | 'rbac'>('pages');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Admissions state
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([
    {
      id: 'app-001',
      code: 'HS-2026-0001',
      branchId: 'b-001',
      branchName: 'Alpha School - Cơ sở Biên Hòa',
      programType: 'cambridge_bilingual',
      programName: 'Hệ Song Ngữ Cambridge Quốc Tế',
      gradeLevel: 'thcs',
      gradeTarget: 'Lớp 6',
      studentInfo: {
        fullName: 'Trần Gia Bảo',
        dateOfBirth: '2014-05-12',
        gender: 'nam',
        currentSchool: 'Tiểu học Trảng Dài',
      },
      parentInfo: {
        fullName: 'Trần Quốc Tuấn',
        relationship: 'Bố',
        phone: '0912 345 678',
        email: 'quoctuan.tran@gmail.com',
        address: 'Phường Tân Hiệp, TP. Biên Hòa, Đồng Nai',
      },
      documents: [
        { id: 'doc-1', name: 'Giấy khai sinh photo công chứng', type: 'birth_certificate', url: 'https://school.edu.vn/docs/ks-001.pdf', verified: true },
        { id: 'doc-2', name: 'Học bạ tiểu học 5 năm', type: 'transcript', url: 'https://school.edu.vn/docs/hb-001.pdf', verified: true },
      ],
      status: 'HEN_PHONG_VAN',
      interviewDate: '2026-09-15 09:00',
      interviewNotes: 'Đánh giá năng lực tư duy toán & Tiếng Anh Cambridge',
      feePaid: false,
      notes: 'Học sinh có chứng chỉ Cambridge Flyers 14 khiên',
      submittedAt: '2026-09-01T08:30:00.000Z',
      updatedAt: '2026-09-02T10:15:00.000Z',
    },
    {
      id: 'app-002',
      code: 'HS-2026-0002',
      branchId: 'b-002',
      branchName: 'Alpha School - Cơ sở TP. Thủ Đức',
      programType: 'high_quality',
      programName: 'Hệ Chất Lượng Cao Tăng Cường',
      gradeLevel: 'tieu_hoc',
      gradeTarget: 'Lớp 1',
      studentInfo: {
        fullName: 'Nguyễn Ngọc Diệp',
        dateOfBirth: '2020-08-20',
        gender: 'nu',
        currentSchool: 'Mầm non Tuổi Thơ',
      },
      parentInfo: {
        fullName: 'Nguyễn Thanh Hà',
        relationship: 'Mẹ',
        phone: '0988 765 432',
        email: 'thanhha.nguyen@yahoo.com',
        address: 'Thảo Điền, TP. Thủ Đức, TP.HCM',
      },
      documents: [
        { id: 'doc-3', name: 'Giấy khai sinh bản sao', type: 'birth_certificate', url: 'https://school.edu.vn/docs/ks-002.pdf', verified: true },
        { id: 'doc-4', name: 'Hồ sơ sức khỏe trường mầm non', type: 'health_record', url: 'https://school.edu.vn/docs/sk-002.pdf', verified: true },
      ],
      status: 'DA_TRUNG_TUYEN',
      interviewDate: '2026-09-03 14:00',
      interviewNotes: 'Đạt 95/100 điểm trắc nghiệm tâm lý & nhận thức lứa tuổi',
      feePaid: true,
      feeAmount: 15000000,
      notes: 'Đã hoàn tất đóng phí giữ chỗ nhập học',
      submittedAt: '2026-08-28T09:00:00.000Z',
      updatedAt: '2026-09-04T11:00:00.000Z',
    },
    {
      id: 'app-003',
      code: 'HS-2026-0003',
      branchId: 'b-001',
      branchName: 'Alpha School - Cơ sở Biên Hòa',
      programType: 'stem_integrated',
      programName: 'Hệ Tích Hợp STEM & Công Nghệ',
      gradeLevel: 'thpt',
      gradeTarget: 'Lớp 10',
      studentInfo: {
        fullName: 'Lê Hoàng Nam',
        dateOfBirth: '2011-03-15',
        gender: 'nam',
        currentSchool: 'THCS Thống Nhất',
      },
      parentInfo: {
        fullName: 'Lê Văn Khang',
        relationship: 'Bố',
        phone: '0903 111 222',
        email: 'vankhang.le@gmail.com',
        address: 'Phường Quyết Thắng, TP. Biên Hòa, Đồng Nai',
      },
      documents: [
        { id: 'doc-5', name: 'Giấy khai sinh photo', type: 'birth_certificate', url: 'https://school.edu.vn/docs/ks-003.pdf', verified: false },
        { id: 'doc-6', name: 'Học bạ THCS 4 năm', type: 'transcript', url: 'https://school.edu.vn/docs/hb-003.pdf', verified: false },
      ],
      status: 'HO_SO_MOI',
      feePaid: false,
      notes: 'Có giải Ba môn Tin học cấp Thành phố năm 2025',
      submittedAt: '2026-09-05T07:45:00.000Z',
      updatedAt: '2026-09-05T07:45:00.000Z',
    },
    {
      id: 'app-004',
      code: 'HS-2026-0004',
      branchId: 'b-002',
      branchName: 'Alpha School - Cơ sở TP. Thủ Đức',
      programType: 'cambridge_bilingual',
      programName: 'Hệ Song Ngữ Cambridge Quốc Tế',
      gradeLevel: 'mam_non',
      gradeTarget: 'Lớp Mẫu Giáo Lớn (5 tuổi)',
      studentInfo: {
        fullName: 'Đặng Minh Anh',
        dateOfBirth: '2021-11-05',
        gender: 'nu',
        currentSchool: 'Mầm non Song Ngữ Ánh Dương',
      },
      parentInfo: {
        fullName: 'Đặng Hoàng Quân',
        relationship: 'Bố',
        phone: '0933 999 888',
        email: 'quan.dang@gmail.com',
        address: 'Phường An Phú, TP. Thủ Đức, TP.HCM',
      },
      documents: [
        { id: 'doc-7', name: 'Giấy khai sinh bản sao', type: 'birth_certificate', url: 'https://school.edu.vn/docs/ks-004.pdf', verified: true },
      ],
      status: 'HOAN_TAT_HOC_PHI',
      interviewDate: '2026-08-25 10:00',
      interviewNotes: 'Hoàn thành xuất sắc bài test phản xạ song ngữ Anh - Việt',
      feePaid: true,
      feeAmount: 25000000,
      notes: 'Đã nhận đồng phục và tài liệu nhập học năm học mới',
      submittedAt: '2026-08-20T14:10:00.000Z',
      updatedAt: '2026-08-29T16:20:00.000Z',
    },
  ]);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionApplication | null>(null);
  const [admissionFilterStatus, setAdmissionFilterStatus] = useState<string>('ALL');
  const [admissionFilterGrade, setAdmissionFilterGrade] = useState<string>('ALL');
  const [admissionSearch, setAdmissionSearch] = useState<string>('');

  // AI Chatbot Knowledge Base & Live Console state
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([...INITIAL_KNOWLEDGE_SOURCES]);
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState<string>('all');
  const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);
  const [newKbTitle, setNewKbTitle] = useState('');
  const [newKbCategory, setNewKbCategory] = useState<KnowledgeCategory>('hoc_phi');
  const [newKbBranch, setNewKbBranch] = useState<string>('all');
  const [newKbContent, setNewKbContent] = useState('');
  const [newKbTags, setNewKbTags] = useState('');

  // Live Test Chatbot Console state
  const [testChatMessages, setTestChatMessages] = useState<BotMessage[]>([
    {
      id: 'msg-welcome',
      conversationId: 'conv-test-admin',
      role: 'assistant',
      content: 'Dạ kính chào Quý Thầy/Cô và Phụ huynh! Em là Trợ lý Tuyển sinh AI của Alpha School. Em đã sẵn sàng trả lời các câu hỏi dựa trên Sổ tay Nhà trường 2026 - 2027.',
      createdAt: '2026-09-05T08:00:00Z',
      suggestedFollowUps: [
        'Học phí năm học 2026?',
        'Chương trình Cambridge có gì nổi bật?',
        'Địa chỉ cơ sở Biên Hòa?',
      ],
    },
  ]);
  const [testChatInput, setTestChatInput] = useState('');
  const [testChatLoading, setTestChatLoading] = useState(false);
  const [lastChatDebug, setLastChatDebug] = useState<ChatbotQueryResponse | null>(null);

  // Page state
  const [blocks, setBlocks] = useState<BlockItem[]>([
    {
      id: 'blk-1',
      type: 'hero_banner',
      name: 'Hero Banner Lớn',
      config: {
        title: 'Khát Vọng Vươn Tầm Cùng Alpha School',
        subtitle: 'Môi trường giáo dục liên cấp song ngữ chuẩn quốc tế',
        primaryButtonText: 'Đăng ký nhận học bổng',
      },
    },
    {
      id: 'blk-2',
      type: 'program_list',
      name: 'Danh sách Chương trình đào tạo',
      config: {
        title: 'Chương Trình Đào Tạo Chuẩn Quốc Tế',
        columns: '3',
      },
    },
    {
      id: 'blk-3',
      type: 'branch_list',
      name: 'Danh sách Cơ sở',
      config: {
        title: 'Hệ Thống Các Cơ Sở Toàn Quốc',
      },
    },
    {
      id: 'blk-4',
      type: 'form_embed',
      name: 'Form Tuyển Sinh & Liên Hệ',
      config: {
        title: 'Đăng Ký Tư Vấn Tuyển Sinh 2025 - 2026',
        subtitle: 'Nhận cẩm nang tuyển sinh và học bổng lên tới 50%',
        formCode: 'tuyen-sinh-2025',
        submitButtonText: 'Gửi thông tin đăng ký',
      },
    },
  ]);

  const [selectedBlockId, setSelectedBlockId] = useState<string>('blk-1');
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Page revisions & rollback history
  const [revisions, setRevisions] = useState<PageRevision[]>([
    {
      id: 'rev-2',
      version: 2,
      createdAt: '05/09/2026 14:35',
      author: 'Super Admin',
      description: 'Tích hợp Form Đăng ký Tuyển sinh & Cập nhật Hero Banner',
      blocksSnapshot: [
        {
          id: 'blk-1',
          type: 'hero_banner',
          name: 'Hero Banner Lớn',
          config: {
            title: 'Khát Vọng Vươn Tầm Cùng Alpha School',
            subtitle: 'Môi trường giáo dục liên cấp song ngữ chuẩn quốc tế',
            primaryButtonText: 'Đăng ký nhận học bổng',
          },
        },
        {
          id: 'blk-2',
          type: 'program_list',
          name: 'Danh sách Chương trình đào tạo',
          config: {
            title: 'Chương Trình Đào Tạo Chuẩn Quốc Tế',
            columns: '3',
          },
        },
        {
          id: 'blk-3',
          type: 'branch_list',
          name: 'Danh sách Cơ sở',
          config: {
            title: 'Hệ Thống Các Cơ Sở Toàn Quốc',
          },
        },
        {
          id: 'blk-4',
          type: 'form_embed',
          name: 'Form Tuyển Sinh & Liên Hệ',
          config: {
            title: 'Đăng Ký Tư Vấn Tuyển Sinh 2025 - 2026',
            subtitle: 'Nhận cẩm nang tuyển sinh và học bổng lên tới 50%',
            formCode: 'tuyen-sinh-2025',
            submitButtonText: 'Gửi thông tin đăng ký',
          },
        },
      ],
    },
    {
      id: 'rev-1',
      version: 1,
      createdAt: '01/09/2026 09:00',
      author: 'Super Admin',
      description: 'Khởi tạo cấu trúc trang chủ sơ khai (3 blocks cốt lõi)',
      blocksSnapshot: [
        {
          id: 'blk-1',
          type: 'hero_banner',
          name: 'Hero Banner Lớn',
          config: {
            title: 'Alpha School: Kiến Tạo Tương Lai',
            subtitle: 'Hệ thống giáo dục tiên phong công nghệ',
            primaryButtonText: 'Khám phá ngay',
          },
        },
        {
          id: 'blk-2',
          type: 'program_list',
          name: 'Danh sách Chương trình đào tạo',
          config: {
            title: 'Các Bậc Học Toàn Diện',
            columns: '3',
          },
        },
        {
          id: 'blk-3',
          type: 'branch_list',
          name: 'Danh sách Cơ sở',
          config: {
            title: 'Mạng Lưới Trường Học Toàn Quốc',
          },
        },
      ],
    },
  ]);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [inspectRevision, setInspectRevision] = useState<PageRevision | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Entities state
  const [branches, setBranches] = useState([
    { id: 'b-001', name: 'Alpha School - Cơ sở Biên Hòa', code: 'BIEN_HOA', address: 'Số 123 Đường Nguyễn Ái Quốc, TP. Biên Hòa, Đồng Nai', phone: '0251 123 4567', email: 'bienhoa@school.edu.vn', status: 'Hoạt động' },
    { id: 'b-002', name: 'Alpha School - Cơ sở TP. Thủ Đức', code: 'THU_DUC', address: 'Khu đô thị Sala, TP. Thủ Đức, TP. HCM', phone: '028 987 6543', email: 'thuduc@school.edu.vn', status: 'Hoạt động' },
    { id: 'b-003', name: 'Alpha School - Cơ sở Bình Dương', code: 'BINH_DUONG', address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Bình Dương', phone: '0274 333 8888', email: 'binhduong@school.edu.vn', status: 'Hoạt động' },
  ]);

  const [articles, setArticles] = useState([
    { id: 'art-001', title: 'Lễ Khai Giảng Năm Học 2025: Khát Vọng Vươn Tầm Quốc Tế', category: 'Tin tức & Sự kiện', branch: 'Toàn hệ thống', author: 'Ban Truyền Thông', date: '05/09/2026', status: 'PUBLISHED' },
    { id: 'art-002', title: 'Học Sinh Cơ Sở Biên Hòa Đạt Giải Nhất Robotics Quốc Tế', category: 'Thành tích học thuật', branch: 'Cơ sở Biên Hòa', author: 'CLB Robotics', date: '02/09/2026', status: 'PUBLISHED' },
    { id: 'art-003', title: 'Hội Thảo Hướng Nghiệp & Săn Học Bổng Đại Học Top 100 Thế Giới', category: 'Tuyển sinh', branch: 'Toàn hệ thống', author: 'Phòng Tuyển Sinh', date: '28/08/2026', status: 'PUBLISHED' },
  ]);

  // Lead CRM state
  const [leads, setLeads] = useState<LeadItem[]>([
    {
      id: 'lead-001',
      parentName: 'Nguyễn Văn An',
      phone: '0912 345 678',
      email: 'an.nguyen@example.com',
      studentName: 'Nguyễn Gia Hân',
      grade: 'Lớp 1',
      branch: 'Cơ sở Biên Hòa',
      branchId: 'b-001',
      date: '05/09/2026 14:30',
      status: 'Mới',
      notes: [{ text: 'Tiếp nhận qua Form trực tuyến Landing page', author: 'Hệ thống', date: '05/09/2026 14:30' }],
    },
    {
      id: 'lead-002',
      parentName: 'Trần Thị Mai',
      phone: '0988 765 432',
      email: 'mai.tran@example.com',
      studentName: 'Trần Minh Khang',
      grade: 'Mầm non 4 tuổi',
      branch: 'Cơ sở TP. Thủ Đức',
      branchId: 'b-002',
      date: '05/09/2026 11:15',
      status: 'Đang tư vấn',
      notes: [{ text: 'Đã gọi điện lần 1, phụ huynh hẹn nghe máy lại sau 17h', author: 'Chuyên viên Thu Hà', date: '05/09/2026 11:45' }],
    },
    {
      id: 'lead-003',
      parentName: 'Lê Hoàng Long',
      phone: '0903 112 233',
      email: 'long.le@example.com',
      studentName: 'Lê Bảo Anh',
      grade: 'Lớp 6 (Cambridge)',
      branch: 'Cơ sở Biên Hòa',
      branchId: 'b-001',
      date: '04/09/2026 16:45',
      status: 'Đã hẹn tham quan',
      notes: [{ text: 'Đã gửi thư mời tham quan ngày 10/09/2026', author: 'Chuyên viên Tuấn Kiệt', date: '04/09/2026 17:00' }],
    },
  ]);

  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [leadsViewMode, setLeadsViewMode] = useState<'table' | 'kanban'>('kanban');

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditItem[]>([
    { id: 'log-1', timestamp: '05/09/2026 14:35', userName: 'Super Admin', userRole: 'SUPER_ADMIN', action: 'PUBLISH', entityType: 'PAGE', entityTitle: 'Trang Chủ Alpha School', details: 'Xuất bản thành công phiên bản v1' },
    { id: 'log-2', timestamp: '05/09/2026 12:10', userName: 'Campus Director - Biên Hòa', userRole: 'CAMPUS_DIRECTOR', action: 'UPDATE', entityType: 'LEAD', entityTitle: 'Hồ sơ Lê Hoàng Long', details: 'Chuyển trạng thái sang [Đã hẹn tham quan]' },
    { id: 'log-3', timestamp: '05/09/2026 09:20', userName: 'Super Admin', userRole: 'SUPER_ADMIN', action: 'UPDATE', entityType: 'THEME', entityTitle: 'Design Tokens', details: 'Cập nhật màu chủ đạo #047857' },
  ]);

  const addAuditLog = (item: Omit<AuditItem, 'id' | 'timestamp' | 'userName' | 'userRole'>) => {
    const actorName = currentRole === 'SUPER_ADMIN' ? 'Super Admin' : currentRole === 'CAMPUS_DIRECTOR' ? 'Campus Director - Biên Hòa' : 'Admissions Officer';
    const newL: AuditItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      userName: actorName,
      userRole: currentRole,
      ...item,
    };
    setAuditLogs([newL, ...auditLogs]);
  };

  // Theme Customizer state
  const [themeTokens, setThemeTokens] = useState({
    primaryColor: '#047857',
    secondaryColor: '#065f46',
    accentColor: '#f59e0b',
    borderRadius: '12px',
    fontFamily: 'Outfit, sans-serif',
    containerMaxWidth: '1280px',
  });

  // Dynamic Form Builder state
  const [formFields, setFormFields] = useState<FormFieldItem[]>([
    { id: 'fld-1', name: 'parentName', label: 'Họ và tên Phụ huynh', type: 'text', required: true, placeholder: 'Ví dụ: Nguyễn Văn A' },
    { id: 'fld-2', name: 'phone', label: 'Số điện thoại liên hệ', type: 'tel', required: true, placeholder: '09xx xxx xxx' },
    { id: 'fld-3', name: 'email', label: 'Địa chỉ Email', type: 'email', required: false, placeholder: 'email@domain.com' },
    { id: 'fld-4', name: 'studentName', label: 'Họ tên Học sinh', type: 'text', required: true, placeholder: 'Ví dụ: Nguyễn Gia Hân' },
    { id: 'fld-5', name: 'grade', label: 'Cấp lớp ứng tuyển', type: 'select', required: true, options: ['Mầm non', 'Lớp 1', 'Lớp 6', 'Lớp 10'] },
    { id: 'fld-6', name: 'message', label: 'Nguyện vọng hoặc câu hỏi', type: 'textarea', required: false, placeholder: 'Nhập ghi chú cho ban tuyển sinh...' },
  ]);

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'email' | 'tel' | 'select' | 'textarea'>('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  // Media Library state with responsive variants
  const [mediaAssets, setMediaAssets] = useState([
    {
      id: 'med-1',
      title: 'Banner Mùa Tuyển Sinh 2025 - 2026',
      type: 'image',
      size: '1.2 MB',
      dimensions: '1920x1080',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
      tag: 'Banner',
      category: 'image',
      altText: 'Học sinh hăng say trong lễ hội tuyển sinh',
      variants: {
        thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&q=80&format=webp',
        card_small: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=480&q=80&format=webp',
        card_large: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=85&format=webp',
        hero_full: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=90&format=webp',
      },
    },
    {
      id: 'med-2',
      title: 'Khuôn viên Cơ sở Biên Hòa Xanh Mát',
      type: 'image',
      size: '2.4 MB',
      dimensions: '2400x1600',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
      tag: 'Cơ sở',
      category: 'image',
      altText: 'Toàn cảnh khuôn viên trường Alpha School Biên Hòa',
      variants: {
        thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=150&q=80&format=webp',
        card_small: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=480&q=80&format=webp',
        card_large: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=85&format=webp',
        hero_full: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=90&format=webp',
      },
    },
    {
      id: 'med-3',
      title: 'Phòng Thí Nghiệm STEM Robotics Quốc Tế',
      type: 'image',
      size: '1.8 MB',
      dimensions: '2000x1333',
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop',
      tag: 'Học thuật',
      category: 'image',
      altText: 'Học sinh thực hành nghiên cứu robot và lập trình',
      variants: {
        thumbnail: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&q=80&format=webp',
        card_small: 'https://images.unsplash.com/photo-1562774053-701939374585?w=480&q=80&format=webp',
        card_large: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=85&format=webp',
        hero_full: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=90&format=webp',
      },
    },
    {
      id: 'med-4',
      title: 'Cẩm Nang Tuyển Sinh & Học Bổng 2025.pdf',
      type: 'document',
      size: '4.5 MB',
      dimensions: 'PDF Document',
      url: 'https://school.edu.vn/cdn/docs/cam-nang-tuyen-sinh-2025.pdf',
      tag: 'Tài liệu',
      category: 'document',
      altText: 'Tài liệu hướng dẫn tuyển sinh toàn diện',
    },
    {
      id: 'med-5',
      title: 'Video Giới Thiệu Hoạt Động Ngoại Khóa Mùa Hè.mp4',
      type: 'video',
      size: '18.2 MB',
      dimensions: '1080p 60fps',
      url: 'https://school.edu.vn/cdn/videos/summer-camp-2025.mp4',
      tag: 'Video',
      category: 'video',
      altText: 'Video ghi lại các hoạt động cắm trại dã ngoại',
    },
  ]);

  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'all' | 'image' | 'document' | 'video'>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<'image' | 'document' | 'video'>('image');
  const [newMediaAlt, setNewMediaAlt] = useState('');
  const [newMediaTag, setNewMediaTag] = useState('Khác');
  const [inspectMedia, setInspectMedia] = useState<any | null>(null);

  // Webhooks Management & Live Test Console state
  const [webhooks, setWebhooks] = useState([
    {
      id: 'wh-001',
      name: 'CRM Tuyển Sinh Doanh Nghiệp (HubSpot / Salesforce Sync)',
      url: 'https://crm.school.edu.vn/api/v1/admissions/webhook',
      secretMasked: 'whsec_••••••••••••9a8f',
      events: ['lead.created', 'lead.status_updated'],
      isActive: true,
      lastDelivery: '05/09/2026 14:30 (HTTP 200 OK)',
      createdAt: '01/09/2026',
    },
    {
      id: 'wh-002',
      name: 'Slack Admissions Alert Bot',
      url: 'https://hooks.slack.com/services/T00/B00/alpha-leads',
      secretMasked: 'whsec_••••••••••••3c7e',
      events: ['lead.created'],
      isActive: true,
      lastDelivery: '05/09/2026 11:15 (HTTP 200 OK)',
      createdAt: '03/09/2026',
    },
    {
      id: 'wh-003',
      name: 'Static Edge Cache Revalidation Engine (Cloudflare / Vercel)',
      url: 'https://api.cloudflare.com/client/v4/zones/revalidate-tag',
      secretMasked: 'whsec_••••••••••••1d4b',
      events: ['page.published'],
      isActive: true,
      lastDelivery: '05/09/2026 14:35 (HTTP 200 OK)',
      createdAt: '05/09/2026',
    },
  ]);

  const [webhookLogs, setWebhookLogs] = useState([
    {
      id: 'log-wh-1',
      webhookName: 'CRM Tuyển Sinh Doanh Nghiệp',
      event: 'lead.created',
      statusCode: 200,
      timestamp: '05/09/2026 14:30:15',
      signature: 'sha256=d3b07384d113edec49eaa6238ad5ff00',
      payloadSnippet: '{"leadId":"lead-001","parentName":"Nguyễn Văn An","grade":"Lớp 1"}',
    },
    {
      id: 'log-wh-2',
      webhookName: 'Slack Admissions Alert Bot',
      event: 'lead.created',
      statusCode: 200,
      timestamp: '05/09/2026 11:15:22',
      signature: 'sha256=f84b6d8a39a2f1b74c80918ef83a8b41',
      payloadSnippet: '{"leadId":"lead-002","parentName":"Trần Thị Mai","grade":"Mầm non"}',
    },
  ]);

  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookSecret, setNewWebhookSecret] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(['lead.created']);
  const [testWebhookEvent, setTestWebhookEvent] = useState<'lead.created' | 'lead.status_updated' | 'page.published'>('lead.created');
  const [testDispatchResult, setTestDispatchResult] = useState<any | null>(null);
  const [isDispatchingTest, setIsDispatchingTest] = useState(false);

  // Performance & Multi-tier Cache Management state
  const [cacheMetrics, setCacheMetrics] = useState({
    hitRatio: 88.5,
    hits: 142,
    misses: 18,
    totalKeys: 5,
    memoryEstimate: '128 KB',
    edgeCdnStatus: 'ONLINE (Cloudflare Edge CDN)',
    redisStatus: 'CONNECTED (Redis 7 Cluster)',
    nextjsDataCache: 'ACTIVE (Tag-based ISR)',
  });
  const [cachedKeysList, setCachedKeysList] = useState<string[]>([
    'page:data:home',
    'page:data:tuyen-sinh',
    'branch:data:bien-hoa',
    'branch:data:thu-duc',
    'theme:active:tokens',
  ]);
  const [revalidationLogs, setRevalidationLogs] = useState<any[]>([
    {
      id: 'rev-01',
      target: 'branch:bien-hoa',
      type: 'TAG',
      purgedCount: 2,
      timestamp: '05/09/2026 15:45:10',
      triggeredBy: 'Admin Console',
    },
    {
      id: 'rev-02',
      target: 'global-layout',
      type: 'TAG',
      purgedCount: 3,
      timestamp: '05/09/2026 14:12:00',
      triggeredBy: 'Theme Customizer',
    },
  ]);
  const [selectedTagToRevalidate, setSelectedTagToRevalidate] = useState('page:home');
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);



  // Navigation Menus state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 'm-1', title: 'Trang Chủ', url: '/', target: '_self', order: 1, isActive: true, location: 'header' },
    { id: 'm-2', title: 'Chương Trình Học', url: '/chuong-trinh-hoc', target: '_self', order: 2, isActive: true, location: 'header' },
    { id: 'm-3', title: 'Hệ Thống Cơ Sở', url: '#co-so', target: '_self', order: 3, isActive: true, location: 'header' },
    { id: 'm-4', title: 'Tin Tức & Sự Kiện', url: '/tin-tuc', target: '_self', order: 4, isActive: true, location: 'header' },
    { id: 'm-5', title: 'Tuyển Sinh 2025', url: '/tuyen-sinh', target: '_self', order: 5, isActive: true, location: 'header' },
    { id: 'm-6', title: 'Cẩm Nang Phụ Huynh', url: '/cam-nang', target: '_blank', order: 6, isActive: false, location: 'header' },
    { id: 'm-7', title: 'Chính Sách Bảo Mật', url: '/privacy', target: '_self', order: 1, isActive: true, location: 'footer' },
    { id: 'm-8', title: 'Điều Khoản Dịch Vụ', url: '/terms', target: '_self', order: 2, isActive: true, location: 'footer' },
    { id: 'm-9', title: 'Sơ Đồ Trang Web', url: '/sitemap.xml', target: '_blank', order: 3, isActive: true, location: 'footer' },
  ]);
  const [selectedMenuLocation, setSelectedMenuLocation] = useState<'header' | 'footer'>('header');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuUrl, setNewMenuUrl] = useState('');
  const [newMenuTarget, setNewMenuTarget] = useState<'_self' | '_blank'>('_self');

  // Multi-Language (i18n) Translations state
  const [translations, setTranslations] = useState<TranslationItem[]>(DEFAULT_TRANSLATIONS);
  const [translationSearch, setTranslationSearch] = useState('');
  const [translationCategory, setTranslationCategory] = useState<string>('all');
  const [showAddTranslationModal, setShowAddTranslationModal] = useState(false);
  const [newTransKey, setNewTransKey] = useState('');
  const [newTransVi, setNewTransVi] = useState('');
  const [newTransEn, setNewTransEn] = useState('');
  const [newTransCategory, setNewTransCategory] = useState<'nav' | 'admissions' | 'common' | 'search' | 'footer'>('common');

  // Users & RBAC Matrix state
  const [userAccounts, setUserAccounts] = useState<UserAccountItem[]>([
    { id: 'usr-1', name: 'Nguyễn Đình Trọng', email: 'trong.admin@school.edu.vn', role: 'SUPER_ADMIN', branchId: null, branchName: 'Toàn hệ thống (Global)', status: 'ACTIVE', lastLogin: '05/09/2026 18:25' },
    { id: 'usr-2', name: 'Trần Minh Quang', email: 'quang.director@school.edu.vn', role: 'CAMPUS_DIRECTOR', branchId: 'b-001', branchName: 'Cơ sở Biên Hòa', status: 'ACTIVE', lastLogin: '05/09/2026 15:10' },
    { id: 'usr-3', name: 'Lê Thu Hà', email: 'ha.tuyensinh@school.edu.vn', role: 'ADMISSIONS_OFFICER', branchId: 'b-002', branchName: 'Cơ sở TP. Thủ Đức', status: 'ACTIVE', lastLogin: '05/09/2026 11:30' },
    { id: 'usr-4', name: 'Phạm Tuấn Kiệt', email: 'kiet.editor@school.edu.vn', role: 'CONTENT_EDITOR', branchId: null, branchName: 'Toàn hệ thống (Global)', status: 'ACTIVE', lastLogin: '04/09/2026 16:45' },
  ]);

  const [dynamicRolePermissions, setDynamicRolePermissions] = useState<Record<string, string[]>>({
    SUPER_ADMIN: [...RolePermissions.SUPER_ADMIN],
    CAMPUS_DIRECTOR: [...RolePermissions.CAMPUS_DIRECTOR],
    ADMISSIONS_OFFICER: [...RolePermissions.ADMISSIONS_OFFICER],
    CONTENT_EDITOR: [...RolePermissions.CONTENT_EDITOR],
  });

  const [rbacSubTab, setRbacSubTab] = useState<'users' | 'matrix'>('users');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'SUPER_ADMIN' | 'CAMPUS_DIRECTOR' | 'ADMISSIONS_OFFICER' | 'CONTENT_EDITOR'>('CONTENT_EDITOR');
  const [newUserBranch, setNewUserBranch] = useState<string>('all');

  // Modals
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('Tin tức & Sự kiện');
  const [newArticleBranch, setNewArticleBranch] = useState('Toàn hệ thống');

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const availableBlocks = BlockRegistry.getAll();

  const handleAddBlock = (type: string) => {
    const blockDef = BlockRegistry.get(type);
    if (!blockDef) return;

    const newBlock: BlockItem = {
      id: `blk-${Date.now()}`,
      type: blockDef.type,
      name: blockDef.name,
      config: { ...blockDef.defaultConfig },
    };

    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    addAuditLog({ action: 'UPDATE', entityType: 'PAGE', entityTitle: 'Trang Chủ', details: `Thêm block ${blockDef.name}` });
    showToast(`Đã thêm block: ${blockDef.name}`);
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(blocks[0]?.id || '');
    }
    addAuditLog({ action: 'DELETE', entityType: 'PAGE', entityTitle: 'Trang Chủ', details: `Xóa block id ${id}` });
    showToast('Đã xóa block khỏi trang');
  };

  const handleConfigChange = (key: string, value: any) => {
    if (!selectedBlock) return;
    setBlocks(
      blocks.map((b) =>
        b.id === selectedBlock.id
          ? { ...b, config: { ...b.config, [key]: value } }
          : b
      )
    );
  };

  const handlePublish = () => {
    const nextVer = revisions.length > 0 ? Math.max(...revisions.map((r) => r.version)) + 1 : 1;
    const authorName = currentRole === 'SUPER_ADMIN' ? 'Super Admin' : currentRole === 'CAMPUS_DIRECTOR' ? 'Campus Director' : 'Admissions Officer';
    const newRev: PageRevision = {
      id: `rev-${Date.now()}`,
      version: nextVer,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      author: authorName,
      description: `Xuất bản trang chủ phiên bản v${nextVer} (${blocks.length} blocks)`,
      blocksSnapshot: JSON.parse(JSON.stringify(blocks)),
    };

    setRevisions([newRev, ...revisions]);
    setIsPublished(true);
    addAuditLog({
      action: 'PUBLISH',
      entityType: 'PAGE',
      entityTitle: 'Trang Chủ Alpha School',
      details: `Xuất bản v${nextVer} (${blocks.length} blocks) và lưu trữ snapshot`,
    });
    showToast(`Xuất bản v${nextVer} thành công! Snapshot phiên bản đã được lưu trữ an toàn.`);
    setTimeout(() => setIsPublished(false), 3000);
  };

  const handleRollbackRevision = (rev: PageRevision) => {
    if (!confirm(`Bạn có chắc muốn khôi phục trang về phiên bản v${rev.version} (tạo bởi ${rev.author} lúc ${rev.createdAt})?`)) {
      return;
    }
    const clonedBlocks: BlockItem[] = JSON.parse(JSON.stringify(rev.blocksSnapshot));
    setBlocks(clonedBlocks);
    if (clonedBlocks.length > 0) {
      setSelectedBlockId(clonedBlocks[0].id);
    }
    addAuditLog({
      action: 'UPDATE',
      entityType: 'PAGE',
      entityTitle: 'Trang Chủ Alpha School',
      details: `Rollback về phiên bản v${rev.version} (${clonedBlocks.length} blocks)`,
    });
    setShowRevisionModal(false);
    setInspectRevision(null);
    showToast(`Đã khôi phục thành công giao diện về phiên bản v${rev.version}!`);
  };

  const handleExportSiteBackup = () => {
    const backupData = {
      meta: {
        system: 'Alpha School Enterprise Modular CMS',
        schemaVersion: '2.0.0',
        exportedAt: new Date().toISOString(),
        exportedBy: currentRole,
      },
      layout: {
        currentBlocks: blocks,
        revisionsCount: revisions.length,
        revisions: revisions,
      },
      theme: themeTokens,
      navigation: menuItems,
      localization: {
        locales: ['vi', 'en'],
        totalKeys: translations.length,
        items: translations,
      },
      contentCounts: {
        branches: branches.length,
        articles: articles.length,
        leads: leads.length,
        users: userAccounts.length,
      },
    };

    const jsonString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `alpha-school-site-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addAuditLog({
      action: 'EXPORT',
      entityType: 'PAGE',
      entityTitle: 'Toàn Bộ Cấu Hình Hệ Thống',
      details: `Xuất tệp JSON Backup toàn diện (${blocks.length} blocks, ${menuItems.length} menu items, ${translations.length} translations)`,
    });
    showToast('Đã xuất tệp JSON sao lưu cấu hình toàn bộ trang web thành công!');
  };

  const handleSaveBranch = () => {
    if (!newBranchName) return;
    const newB = {
      id: `b-${Date.now()}`,
      name: newBranchName,
      code: newBranchName.toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      address: newBranchAddress,
      phone: newBranchPhone,
      email: 'contact@school.edu.vn',
      status: 'Hoạt động',
    };
    setBranches([...branches, newB]);
    addAuditLog({ action: 'CREATE', entityType: 'BRANCH', entityTitle: newBranchName, details: `Mã cơ sở: ${newB.code}` });
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
    setShowAddBranchModal(false);
    showToast('Đã thêm cơ sở mới thành công!');
  };

  const handleSaveArticle = () => {
    if (!newArticleTitle) return;
    const newArt = {
      id: `art-${Date.now()}`,
      title: newArticleTitle,
      category: newArticleCategory,
      branch: newArticleBranch,
      author: currentRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Campus Director',
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'PUBLISHED',
    };
    setArticles([newArt, ...articles]);
    addAuditLog({ action: 'CREATE', entityType: 'ARTICLE', entityTitle: newArticleTitle, details: `Phạm vi: ${newArticleBranch}` });
    setNewArticleTitle('');
    setShowAddArticleModal(false);
    showToast('Đã xuất bản bài viết mới!');
  };

  const handleAddField = () => {
    if (!newFieldName || !newFieldLabel) return;
    const newF: FormFieldItem = {
      id: `fld-${Date.now()}`,
      name: newFieldName,
      label: newFieldLabel,
      type: newFieldType,
      required: newFieldRequired,
      placeholder: `Nhập ${newFieldLabel.toLowerCase()}...`,
    };
    setFormFields([...formFields, newF]);
    addAuditLog({ action: 'UPDATE', entityType: 'FORM', entityTitle: 'Form Tuyển Sinh 2025', details: `Thêm trường ${newFieldLabel}` });
    setNewFieldName('');
    setNewFieldLabel('');
    showToast(`Đã thêm trường '${newFieldLabel}' vào Form!`);
  };

  const handleRemoveField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
    showToast('Đã xóa trường khỏi Form');
  };

  const handleChangeLeadStatus = (leadId: string, newStatus: LeadItem['status']) => {
    setLeads(leads.map(l => {
      if (l.id === leadId) {
        const updated = {
          ...l,
          status: newStatus,
          notes: [
            {
              text: `Chuyển trạng thái sang [${newStatus}]`,
              author: currentRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admissions Officer',
              date: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
            },
            ...l.notes,
          ],
        };
        if (selectedLead?.id === leadId) setSelectedLead(updated);
        return updated;
      }
      return l;
    }));
    addAuditLog({ action: 'STATUS_CHANGE', entityType: 'LEAD', entityTitle: `Hồ sơ ${selectedLead?.parentName || leadId}`, details: `Chuyển trạng thái sang ${newStatus}` });
    showToast(`Đã cập nhật trạng thái hồ sơ: ${newStatus}`);
  };

  const handleAddLeadNote = () => {
    if (!selectedLead || !newNoteText.trim()) return;
    const author = currentRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admissions Officer';
    const noteObj = {
      text: newNoteText.trim(),
      author,
      date: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
    };
    const updated = { ...selectedLead, notes: [noteObj, ...selectedLead.notes] };
    setSelectedLead(updated);
    setLeads(leads.map(l => l.id === selectedLead.id ? updated : l));
    addAuditLog({ action: 'UPDATE', entityType: 'LEAD', entityTitle: `Hồ sơ ${selectedLead.parentName}`, details: `Thêm ghi chú: "${newNoteText.trim()}"` });
    setNewNoteText('');
    showToast('Đã ghi chú vào hồ sơ!');
  };

  const handleToggleMenuStatus = (id: string) => {
    setMenuItems(menuItems.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
    const target = menuItems.find(m => m.id === id);
    if (target) {
      addAuditLog({ action: 'UPDATE', entityType: 'MENU', entityTitle: `Menu: ${target.title}`, details: `Chuyển trạng thái sang ${!target.isActive ? 'Bật' : 'Ẩn'}` });
      showToast(`Đã ${!target.isActive ? 'kích hoạt' : 'ẩn'} liên kết menu: ${target.title}`);
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    const target = menuItems.find(m => m.id === id);
    setMenuItems(menuItems.filter(m => m.id !== id));
    if (target) {
      addAuditLog({ action: 'DELETE', entityType: 'MENU', entityTitle: `Menu: ${target.title}`, details: `Xóa khỏi menu ${target.location}` });
      showToast(`Đã xóa liên kết: ${target.title}`);
    }
  };

  const handleSaveMenuItem = () => {
    if (!newMenuTitle || !newMenuUrl) return;
    const itemsInLoc = menuItems.filter(m => m.location === selectedMenuLocation);
    const newM: MenuItem = {
      id: `m-${Date.now()}`,
      title: newMenuTitle.trim(),
      url: newMenuUrl.trim(),
      target: newMenuTarget,
      order: itemsInLoc.length + 1,
      isActive: true,
      location: selectedMenuLocation,
    };
    setMenuItems([...menuItems, newM]);
    addAuditLog({ action: 'CREATE', entityType: 'MENU', entityTitle: `Menu: ${newM.title}`, details: `Thêm vào menu ${newM.location} (${newM.url})` });
    setNewMenuTitle('');
    setNewMenuUrl('');
    setShowAddMenuModal(false);
    showToast(`Đã thêm liên kết menu mới thành công!`);
  };

  const handleMoveMenu = (id: string, direction: 'up' | 'down') => {
    const list = [...menuItems.filter(m => m.location === selectedMenuLocation)].sort((a, b) => a.order - b.order);
    const idx = list.findIndex(m => m.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx > 0) {
      const prev = list[idx - 1];
      const cur = list[idx];
      const tempOrder = prev.order;
      prev.order = cur.order;
      cur.order = tempOrder;
    } else if (direction === 'down' && idx < list.length - 1) {
      const next = list[idx + 1];
      const cur = list[idx];
      const tempOrder = next.order;
      next.order = cur.order;
      cur.order = tempOrder;
    }
    const otherLoc = menuItems.filter(m => m.location !== selectedMenuLocation);
    setMenuItems([...otherLoc, ...list]);
    showToast('Đã cập nhật thứ tự liên kết menu');
  };

  const handleExportLeadsToCsv = () => {
    // Generate CSV content with UTF-8 BOM so Vietnamese diacritics render perfectly in Microsoft Excel
    const headers = ['Mã Hồ Sơ', 'Họ Tên Phụ Huynh', 'Số Điện Thoại', 'Email', 'Họ Tên Học Sinh', 'Cấp Lớp', 'Cơ Sở', 'Ngày Đăng Ký', 'Trạng Thái', 'Số Ghi Chú'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${l.parentName.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.studentName.replace(/"/g, '""')}"`,
      `"${l.grade}"`,
      `"${l.branch}"`,
      `"${l.date}"`,
      `"${l.status}"`,
      `"${l.notes.length}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `danh-sach-tuyen-sinh-alpha-school-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addAuditLog({ action: 'EXPORT', entityType: 'LEAD', entityTitle: 'Danh Sách Hồ Sơ Tuyển Sinh', details: `Xuất tệp CSV thành công (${leads.length} bản ghi)` });
    showToast(`Đã xuất ${leads.length} hồ sơ ra tệp CSV Excel thành công!`);
  };

  const handleSaveTranslation = () => {
    if (!newTransKey.trim() || !newTransVi.trim() || !newTransEn.trim()) return;
    const cleanKey = newTransKey.trim().toLowerCase().replace(/[^a-z0-9_.]/g, '_');
    const exists = translations.some(t => t.key === cleanKey);
    if (exists) {
      showToast('Mã khóa dịch này đã tồn tại trong từ điển!');
      return;
    }
    const newItem: TranslationItem = {
      key: cleanKey,
      vi: newTransVi.trim(),
      en: newTransEn.trim(),
      category: newTransCategory,
    };
    setTranslations([...translations, newItem]);
    addAuditLog({ action: 'CREATE', entityType: 'TRANSLATION', entityTitle: `Khóa Dịch: ${cleanKey}`, details: `Thêm bản dịch [vi: "${newItem.vi}", en: "${newItem.en}"]` });
    setNewTransKey('');
    setNewTransVi('');
    setNewTransEn('');
    setShowAddTranslationModal(false);
    showToast(`Đã thêm khóa dịch: ${cleanKey}`);
  };

  const handleUpdateTranslation = (key: string, field: 'vi' | 'en', value: string) => {
    setTranslations(translations.map(t => t.key === key ? { ...t, [field]: value } : t));
    addAuditLog({ action: 'UPDATE', entityType: 'TRANSLATION', entityTitle: `Khóa Dịch: ${key}`, details: `Cập nhật trường [${field}] thành: "${value}"` });
  };

  const handleDeleteTranslation = (key: string) => {
    setTranslations(translations.filter(t => t.key !== key));
    addAuditLog({ action: 'DELETE', entityType: 'TRANSLATION', entityTitle: `Khóa Dịch: ${key}`, details: 'Xóa khỏi từ điển đa ngôn ngữ' });
    showToast(`Đã xóa khóa dịch: ${key}`);
  };

  const handleTogglePermission = (role: string, permCode: string) => {
    const currentPerms = dynamicRolePermissions[role] || [];
    const hasPerm = currentPerms.includes(permCode);
    const updated = hasPerm ? currentPerms.filter(p => p !== permCode) : [...currentPerms, permCode];
    setDynamicRolePermissions({
      ...dynamicRolePermissions,
      [role]: updated,
    });
    addAuditLog({ action: 'UPDATE', entityType: 'ROLE', entityTitle: `Vai Trò ${role}`, details: `${hasPerm ? 'Hủy quyền' : 'Cấp quyền'}: ${permCode}` });
    showToast(`Đã ${hasPerm ? 'hủy' : 'cấp'} quyền ${permCode} cho vai trò ${role}`);
  };

  const handleToggleUserStatus = (userId: string) => {
    const user = userAccounts.find(u => u.id === userId);
    if (!user) return;
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUserAccounts(userAccounts.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    addAuditLog({ action: 'STATUS_CHANGE', entityType: 'USER', entityTitle: user.name, details: `Chuyển trạng thái sang ${nextStatus === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}` });
    showToast(`Tài khoản ${user.name} hiện ${nextStatus === 'ACTIVE' ? 'được kích hoạt' : 'bị tạm dừng'}`);
  };

  const handleDeleteUser = (userId: string) => {
    const user = userAccounts.find(u => u.id === userId);
    if (!user) return;
    if (user.role === 'SUPER_ADMIN' && userAccounts.filter(u => u.role === 'SUPER_ADMIN').length <= 1) {
      showToast('Không thể xóa Super Admin duy nhất của hệ thống!');
      return;
    }
    setUserAccounts(userAccounts.filter(u => u.id !== userId));
    addAuditLog({ action: 'DELETE', entityType: 'USER', entityTitle: user.name, details: `Xóa tài khoản quản trị ${user.email}` });
    showToast(`Đã xóa tài khoản: ${user.name}`);
  };

  const handleSaveUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const branchObj = newUserBranch === 'all' ? null : branches.find(b => b.code.toLowerCase().includes(newUserBranch) || b.id === newUserBranch);
    const newU: UserAccountItem = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      branchId: branchObj ? branchObj.id : null,
      branchName: branchObj ? branchObj.name : 'Toàn hệ thống (Global)',
      status: 'ACTIVE',
      lastLogin: 'Chưa đăng nhập',
    };
    setUserAccounts([...userAccounts, newU]);
    addAuditLog({ action: 'CREATE', entityType: 'USER', entityTitle: newU.name, details: `Tạo tài khoản mới với vai trò ${newU.role}, cơ sở: ${newU.branchName}` });
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
    showToast(`Đã tạo tài khoản quản trị: ${newU.name}`);
  };

  const handleSendTestChat = (customPrompt?: string) => {
    const promptToSend = customPrompt || testChatInput;
    if (!promptToSend.trim()) return;

    const userMsg: BotMessage = {
      id: `msg-${Date.now()}-u`,
      conversationId: 'conv-test-admin',
      role: 'user',
      content: promptToSend.trim(),
      createdAt: new Date().toISOString(),
    };

    const newHistory = [...testChatMessages, userMsg];
    setTestChatMessages(newHistory);
    setTestChatInput('');
    setTestChatLoading(true);

    setTimeout(() => {
      const response = generateChatbotResponse(promptToSend.trim(), newHistory, {
        branchId: selectedBranch === 'all' ? null : selectedBranch,
        conversationId: 'conv-test-admin',
        knowledgeSources,
      });
      setTestChatMessages((prev) => [...prev, response.message]);
      setLastChatDebug(response);
      setTestChatLoading(false);
    }, 300);
  };

  const handleSaveKnowledgeChunk = () => {
    if (!newKbTitle.trim() || !newKbContent.trim()) {
      showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung tri thức!');
      return;
    }
    const tokenCount = Math.ceil(newKbContent.length / 4);
    const tags = newKbTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const newChunk: KnowledgeSource = {
      id: `kb-custom-${Date.now()}`,
      title: newKbTitle.trim(),
      category: newKbCategory,
      branchId: newKbBranch === 'all' ? null : newKbBranch,
      content: newKbContent.trim(),
      tokenCount,
      tags: tags.length > 0 ? tags : [newKbCategory],
      updatedAt: new Date().toISOString(),
    };
    setKnowledgeSources([newChunk, ...knowledgeSources]);
    addAuditLog({
      action: 'CREATE',
      entityType: 'ARTICLE',
      entityTitle: `AI Tri Thức: ${newKbTitle}`,
      details: `Thêm tài liệu tri thức vào danh mục [${newKbCategory}] (${tokenCount} tokens)`,
    });
    setNewKbTitle('');
    setNewKbContent('');
    setNewKbTags('');
    setShowAddKnowledgeModal(false);
    showToast('Đã nạp tri thức mới vào Knowledge Base thành công!');
  };

  const handleDeleteKnowledgeChunk = (id: string) => {
    const chunk = knowledgeSources.find((k) => k.id === id);
    if (!chunk) return;
    setKnowledgeSources(knowledgeSources.filter((k) => k.id !== id));
    addAuditLog({
      action: 'DELETE',
      entityType: 'ARTICLE',
      entityTitle: `AI Tri Thức: ${chunk.title}`,
      details: 'Xóa khối tri thức khỏi Knowledge Base',
    });
    showToast(`Đã xóa tài liệu tri thức: ${chunk.title}`);
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">ALPHA CMS</h1>
            <p className="text-xs text-slate-400">Enterprise Framework v1.0</p>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 text-sm font-medium overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2 pb-1">
            Quản trị nội dung
          </div>
          <button
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'pages' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📑</span> Page Builder ({blocks.length} blocks)
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'branches' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🏫</span> Quản lý Cơ sở ({branches.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'articles' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📰</span> Tin tức & Bài viết ({articles.length})
          </button>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1">
            Tuyển sinh & Tương tác
          </div>
          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'leads' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎯</span> CRM Tuyển sinh ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('admissions')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'admissions' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎓</span> Tuyển sinh Trực tuyến ({admissions.length})
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'chatbot' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🤖</span> Trợ Lý AI & Tri Thức ({knowledgeSources.length})
          </button>
          <button
            onClick={() => setActiveTab('forms')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'forms' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📝</span> Dynamic Form Builder
          </button>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1">
            Hệ thống & Giao diện
          </div>
          <button
            onClick={() => setActiveTab('theme')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'theme' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎨</span> Theme Customizer
          </button>
          <button
            onClick={() => setActiveTab('menus')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'menus' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🔗</span> Quản Lý Menu ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('i18n')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'i18n' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🌐</span> Bản Dịch i18n ({translations.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'media' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🖼️</span> Thư viện Media ({mediaAssets.length})
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'webhooks' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🔔</span> Webhooks & API ({webhooks.length})
          </button>


          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1">
            Hiệu suất & Giám sát
          </div>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'analytics' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📊</span> Báo cáo Phân tích ({leads.length} leads)
          </button>
          <button
            onClick={() => setActiveTab('cache')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'cache' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>⚡</span> Hiệu Năng & Cache ({cacheMetrics.hitRatio}%)
          </button>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1">
            Bảo Mật & Phân Quyền
          </div>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'rbac' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>👥</span> Quản Trị & Phân Quyền ({userAccounts.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'audit' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📋</span> Nhật Ký Audit ({auditLogs.length})
          </button>
        </nav>

        {/* User Scope Info & RBAC Switcher */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold text-[10px]">
              {currentRole.substring(0, 2)}
            </div>
            <div className="flex-1 truncate">
              <p className="font-semibold text-slate-200">
                {currentRole === 'SUPER_ADMIN' && 'Super Administrator'}
                {currentRole === 'CAMPUS_DIRECTOR' && 'Campus Director'}
                {currentRole === 'ADMISSIONS_OFFICER' && 'Admissions Officer'}
              </p>
              <p className="text-[10px] text-emerald-400">
                {currentRole === 'SUPER_ADMIN' ? 'Toàn quyền (Global Scope)' : 'Giới hạn phân quyền'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Chuyển Role mô phỏng RBAC:</label>
            <select
              value={currentRole}
              onChange={(e) => {
                const role = e.target.value as any;
                setCurrentRole(role);
                showToast(`Đã chuyển sang vai trò: ${role}`);
              }}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 text-[11px] focus:outline-none"
            >
              <option value="SUPER_ADMIN">👑 Super Admin</option>
              <option value="CAMPUS_DIRECTOR">🏫 Campus Director (Biên Hòa)</option>
              <option value="ADMISSIONS_OFFICER">🎯 Admissions Officer</option>
            </select>
          </div>
        </div>
      </aside>

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-slate-800 text-lg">
              {activeTab === 'pages' && 'Trình Dựng Trang Trực Quan (Page Builder)'}
              {activeTab === 'branches' && 'Quản Lý Hệ Thống Cơ Sở & Chi Nhánh'}
              {activeTab === 'articles' && 'Quản Lý Bài Viết & Tin Tức Học Đường'}
              {activeTab === 'leads' && 'Hồ Sơ Tuyển Sinh & Phễu Chăm Sóc Phụ Huynh'}
              {activeTab === 'admissions' && 'Quản Lý Tuyển Sinh Trực Tuyến Đa Bước & Hồ Sơ Điện Tử'}
              {activeTab === 'theme' && 'Tùy Biến Giao Diện Đa Cơ Sở (Theme Customizer)'}
              {activeTab === 'forms' && 'Trình Thiết Kế Biểu Mẫu Động (Dynamic Form Builder)'}
              {activeTab === 'media' && 'Thư Viện Tệp Tin Đa Phương Tiện (Media Asset Hub)'}
              {activeTab === 'webhooks' && 'Quản Lý Webhooks & Trình Giả Lập Kích Hoạt (Live Test Console)'}
              {activeTab === 'audit' && 'Nhật Ký Kiểm Toán & Giám Sát Hệ Thống (Audit Logs)'}
              {activeTab === 'analytics' && 'Báo Cáo Hiệu Suất Tuyển Sinh & Lưu Lượng (Analytics)'}
              {activeTab === 'cache' && 'Quản Trị Hiệu Năng Đa Tầng & On-Demand Edge Cache (Performance)'}
              {activeTab === 'menus' && 'Quản Lý Hệ Thống Điều Hướng & Menu (Navigation)'}

              {activeTab === 'i18n' && 'Quản Lý Bản Dịch Đa Ngôn Ngữ & Từ Điển (i18n Localization)'}
              {activeTab === 'rbac' && 'Quản Lý Người Dùng & Ma Trận Phân Quyền (RBAC Security Matrix)'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Cơ sở lọc:</span>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="border border-slate-300 rounded px-2.5 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="all">Toàn hệ thống (All)</option>
                <option value="bien-hoa">Cơ sở Biên Hòa</option>
                <option value="thu-duc">Cơ sở TP. Thủ Đức</option>
                <option value="binh-duong">Cơ sở Bình Dương</option>
              </select>
            </div>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              👁️ Xem Web Thật
            </a>

            {activeTab === 'pages' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRevisionModal(true)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Xem lịch sử và khôi phục các phiên bản đã xuất bản"
                >
                  <span>📜</span>
                  <span>Phiên Bản</span>
                  <span className="bg-slate-200 text-slate-700 text-xs px-1.5 py-0.5 rounded-full font-bold">
                    {revisions.length}
                  </span>
                </button>

                <button
                  onClick={handleExportSiteBackup}
                  className="px-3.5 py-2 border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Sao lưu toàn bộ cấu hình trang, blocks, theme, menu và từ điển ra JSON"
                >
                  <span>💾</span>
                  <span>Sao Lưu JSON</span>
                </button>

                <button
                  onClick={handlePublish}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
                >
                  🚀 Xuất Bản (Publish)
                </button>
              </div>
            )}
          </div>
        </header>

        {isPublished && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-sm font-medium flex items-center justify-between">
            <span>✅ Đã xuất bản trang thành công! Cache Edge đã được làm mới.</span>
            <button onClick={() => setIsPublished(false)} className="text-white font-bold">&times;</button>
          </div>
        )}

        {/* TAB 1: PAGE BUILDER */}
        {activeTab === 'pages' && (
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100 flex flex-col items-center">
              {/* Responsive Device Viewport Switcher Toolbar */}
              <div className="w-full max-w-4xl flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm mb-5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Khung Nhìn Thiết Bị:</span>
                  <div className="flex items-center bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        previewDevice === 'desktop'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🖥️ Desktop (100%)
                    </button>
                    <button
                      onClick={() => setPreviewDevice('tablet')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        previewDevice === 'tablet'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📱 Tablet (768px)
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        previewDevice === 'mobile'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      📲 Mobile (375px)
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono hidden sm:block">
                  {previewDevice === 'desktop' && 'Full-width Canvas (100%)'}
                  {previewDevice === 'tablet' && 'Viewport: 768px x 1024px'}
                  {previewDevice === 'mobile' && 'Viewport: 375px x 812px'}
                </div>
              </div>

              {/* Viewport Frame Container */}
              <div
                className={`transition-all duration-300 w-full ${
                  previewDevice === 'desktop'
                    ? 'max-w-4xl space-y-4'
                    : previewDevice === 'tablet'
                    ? 'max-w-[768px] space-y-4 p-5 bg-white border-4 border-slate-300 rounded-2xl shadow-xl'
                    : 'max-w-[375px] space-y-4 p-4 bg-white border-[6px] border-slate-800 rounded-[32px] shadow-2xl'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                    Các Khối Giao Diện Đang Hiển Thị Trên Trang
                  </span>
                  <span className="text-xs text-slate-400">{blocks.length} blocks</span>
                </div>

                {blocks.map((blk, idx) => (
                  <div
                    key={blk.id}
                    onClick={() => setSelectedBlockId(blk.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer bg-white flex items-center justify-between ${
                      selectedBlockId === blk.id
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{blk.name}</h4>
                        <p className="text-xs text-slate-400 font-mono">type: {blk.type}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">v1</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBlock(blk.id);
                        }}
                        className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors text-sm"
                        title="Xóa block"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                    Thêm Khối Mới Từ Block Registry (Open/Closed - Không Sửa Code)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableBlocks.map((bDef) => (
                      <button
                        key={bDef.type}
                        onClick={() => handleAddBlock(bDef.type)}
                        className="p-3 bg-white border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 rounded-lg text-left transition-all text-sm font-medium text-slate-700 flex flex-col gap-1 shadow-sm"
                      >
                        <span className="font-semibold text-slate-800">{bDef.name}</span>
                        <span className="text-xs text-slate-400 font-mono">+{bDef.type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Inspector */}
            <aside className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto flex-shrink-0 flex flex-col">
              <h3 className="font-bold text-sm text-slate-800 mb-4 pb-3 border-b border-slate-200">
                Thuộc Tính Khối (Dynamic Inspector)
              </h3>
              {selectedBlock ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Tên Block</label>
                    <input type="text" disabled value={selectedBlock.name} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mã Định Danh (Type)</label>
                    <input type="text" disabled value={selectedBlock.type} className="w-full bg-slate-100 border border-slate-200 rounded px-3 py-1.5 text-xs font-mono text-slate-600" />
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-3">
                      Cấu hình Tự sinh từ Schema
                    </span>
                    {Object.entries(selectedBlock.config).map(([key, val]) => {
                      if (typeof val === 'boolean') {
                        return (
                          <div key={key} className="flex items-center gap-2 mb-3">
                            <input
                              type="checkbox"
                              checked={val}
                              onChange={(e) => handleConfigChange(key, e.target.checked)}
                              className="rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <label className="text-xs font-medium text-slate-700">{key}</label>
                          </div>
                        );
                      }
                      return (
                        <div key={key} className="mb-3">
                          <label className="block text-xs font-medium text-slate-600 mb-1">{key}</label>
                          <input
                            type="text"
                            value={String(val)}
                            onChange={(e) => handleConfigChange(key, e.target.value)}
                            className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Chọn một block bên trái để cấu hình</p>
              )}
            </aside>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ CƠ SỞ */}
        {activeTab === 'branches' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Danh Sách Cơ Sở Giáo Dục</h3>
                  <p className="text-sm text-slate-500">Mỗi cơ sở sở hữu landing page, đội ngũ tuyển sinh và tin tức riêng biệt.</p>
                </div>
                {currentRole === 'SUPER_ADMIN' && (
                  <button
                    onClick={() => setShowAddBranchModal(true)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2"
                  >
                    ➕ Thêm Cơ Sở Mới
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Tên Cơ Sở</th>
                      <th className="px-6 py-4">Mã Code</th>
                      <th className="px-6 py-4">Địa Chỉ</th>
                      <th className="px-6 py-4">Hotline</th>
                      <th className="px-6 py-4">Trạng Thái</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {branches.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{b.name}</td>
                        <td className="px-6 py-4 font-mono text-xs text-emerald-700 bg-emerald-50/50 px-2 rounded inline-block my-3">
                          {b.code}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate">{b.address}</td>
                        <td className="px-6 py-4 font-medium">{b.phone}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={`http://localhost:3000/co-so/${b.code.toLowerCase().replace('_', '-')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:underline text-xs font-semibold mr-3"
                          >
                            Xem Web Cơ Sở
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ TIN TỨC */}
        {activeTab === 'articles' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Danh Mục Bài Viết & Sự Kiện</h3>
                  <p className="text-sm text-slate-500">Phân loại theo cơ sở hoặc xuất bản toàn hệ thống.</p>
                </div>
                <button
                  onClick={() => setShowAddArticleModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2"
                >
                  ✍️ Viết Bài Mới
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Tiêu Đề</th>
                      <th className="px-6 py-4">Chuyên Mục</th>
                      <th className="px-6 py-4">Phạm Vi Cơ Sở</th>
                      <th className="px-6 py-4">Tác Giả</th>
                      <th className="px-6 py-4">Ngày Đăng</th>
                      <th className="px-6 py-4">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {articles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{art.title}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                            {art.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-emerald-800 font-medium text-xs">{art.branch}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{art.author}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{art.date}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {art.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HỒ SƠ TUYỂN SINH (LEADS & CRM WORKFLOW) */}
        {activeTab === 'leads' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">CRM Tuyển Sinh & Quản Lý Khách Hàng Tiềm Năng</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      {leads.length} Hồ sơ
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Bấm vào từng hồ sơ để cập nhật quy trình tư vấn, lịch hẹn tham quan và ghi chú tương tác.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                    <button
                      onClick={() => setLeadsViewMode('kanban')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        leadsViewMode === 'kanban'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>📊</span> Kanban Board
                    </button>
                    <button
                      onClick={() => setLeadsViewMode('table')}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        leadsViewMode === 'table'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>📋</span> Danh Sách Bảng
                    </button>
                  </div>

                  <button
                    onClick={handleExportLeadsToCsv}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
                  >
                    📥 Xuất Excel (CSV UTF-8)
                  </button>
                </div>
              </div>

              {/* Status Pipeline Cards & Metrics */}
              {(() => {
                const metrics = calculatePipelineMetrics(leads);
                return (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 flex justify-between items-center shadow-sm">
                      <div>
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng Hồ Sơ</div>
                        <div className="text-2xl font-black text-slate-900 mt-1">{metrics.total}</div>
                      </div>
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="p-4 rounded-xl border bg-blue-50 border-blue-200 flex justify-between items-center shadow-sm">
                      <div>
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">Hồ Sơ Mới</div>
                        <div className="text-2xl font-black text-blue-900 mt-1">{metrics.newLeads}</div>
                      </div>
                      <span className="text-2xl">📥</span>
                    </div>
                    <div className="p-4 rounded-xl border bg-amber-50 border-amber-200 flex justify-between items-center shadow-sm">
                      <div>
                        <div className="text-xs font-medium text-amber-600 uppercase tracking-wider">Đang Xử Lý</div>
                        <div className="text-2xl font-black text-amber-900 mt-1">{metrics.inProgress}</div>
                      </div>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 flex justify-between items-center shadow-sm">
                      <div>
                        <div className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Đã Nhập Học</div>
                        <div className="text-2xl font-black text-emerald-900 mt-1">{metrics.enrolled}</div>
                      </div>
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div className="p-4 rounded-xl border bg-indigo-50 border-indigo-200 flex justify-between items-center shadow-sm col-span-2 md:col-span-1">
                      <div>
                        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Tỷ Lệ Chốt</div>
                        <div className="text-2xl font-black text-indigo-900 mt-1">{metrics.conversionRate}%</div>
                      </div>
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                );
              })()}

              {/* KANBAN BOARD VIEW */}
              {leadsViewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
                  {PIPELINE_STAGES.map((stage) => {
                    const stageLeads = leads.filter((l) => l.status === stage.key);
                    return (
                      <div
                        key={stage.key}
                        className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[550px] shadow-sm"
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{stage.icon}</span>
                            <span className="font-bold text-sm text-slate-800">{stage.label}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stage.badgeColor}`}>
                            {stageLeads.length}
                          </span>
                        </div>

                        {/* Cards List */}
                        <div className="space-y-3 flex-1 overflow-y-auto">
                          {stageLeads.length === 0 ? (
                            <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                              Chưa có hồ sơ ở giai đoạn này
                            </div>
                          ) : (
                            stageLeads.map((l) => {
                              const nextStatus = getNextPipelineStatus(l.status);
                              return (
                                <div
                                  key={l.id}
                                  onClick={() => setSelectedLead(l)}
                                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                                      {l.parentName}
                                    </h4>
                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold">
                                      {l.grade}
                                    </span>
                                  </div>

                                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                    <span className="font-mono text-emerald-700 font-medium">{l.phone}</span>
                                    <span>•</span>
                                    <span>{l.studentName}</span>
                                  </div>

                                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-slate-400 text-[11px]">{l.branch}</span>
                                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                                      💬 {l.notes.length} ghi chú
                                    </span>
                                  </div>

                                  {/* Quick Actions */}
                                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedLead(l);
                                      }}
                                      className="text-[11px] font-medium text-slate-600 hover:text-emerald-700 hover:underline"
                                    >
                                      Mở CRM
                                    </button>

                                    {nextStatus && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleChangeLeadStatus(l.id, nextStatus);
                                        }}
                                        className="text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded transition-colors"
                                      >
                                        Chuyển: {nextStatus} ➔
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* TABLE VIEW */
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Phụ Huynh</th>
                        <th className="px-6 py-4">Số Điện Thoại</th>
                        <th className="px-6 py-4">Học Sinh</th>
                        <th className="px-6 py-4">Cấp Lớp</th>
                        <th className="px-6 py-4">Cơ Sở</th>
                        <th className="px-6 py-4">Trạng Thái</th>
                        <th className="px-6 py-4 text-right">Chi Tiết CRM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.map((l) => (
                        <tr
                          key={l.id}
                          onClick={() => setSelectedLead(l)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            <div>{l.parentName}</div>
                            <div className="text-xs text-slate-400">{l.email}</div>
                          </td>
                          <td className="px-6 py-4 font-mono font-medium text-emerald-700">{l.phone}</td>
                          <td className="px-6 py-4 font-medium text-slate-800">{l.studentName}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                              {l.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-xs">{l.branch}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                l.status === 'Mới'
                                  ? 'bg-blue-100 text-blue-800'
                                  : l.status === 'Đang tư vấn'
                                  ? 'bg-amber-100 text-amber-800'
                                  : l.status === 'Đã hẹn tham quan'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {l.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(l);
                              }}
                              className="text-xs font-semibold text-emerald-700 hover:underline px-3 py-1 bg-emerald-50 rounded-lg"
                            >
                              Mở Hồ Sơ ➔
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4.5: ONLINE ADMISSIONS WIZARD & APPLICATION REVIEW */}
        {activeTab === 'admissions' && (() => {
          const filteredAdmissions = admissions.filter((app) => {
            if (selectedBranch !== 'all' && app.branchId !== selectedBranch) return false;
            if (admissionFilterStatus !== 'ALL' && app.status !== admissionFilterStatus) return false;
            if (admissionFilterGrade !== 'ALL' && app.gradeLevel !== admissionFilterGrade) return false;
            if (admissionSearch) {
              const q = admissionSearch.toLowerCase();
              const match =
                app.code.toLowerCase().includes(q) ||
                app.studentInfo.fullName.toLowerCase().includes(q) ||
                app.parentInfo.fullName.toLowerCase().includes(q) ||
                app.parentInfo.phone.includes(q) ||
                app.parentInfo.email.toLowerCase().includes(q);
              if (!match) return false;
            }
            return true;
          });
          const admMetrics = calculateAdmissionMetrics(filteredAdmissions);

          const handleUpdateStatus = (appId: string, newStatus: AdmissionStatus) => {
            setAdmissions((prev) =>
              prev.map((item) =>
                item.id === appId
                  ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
                  : item
              )
            );
            if (selectedAdmission && selectedAdmission.id === appId) {
              setSelectedAdmission((prev) =>
                prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null
              );
            }
          };

          return (
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Title & Subtitle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
                      <span>🎓</span> Module Tuyển Sinh Trực Tuyến Đa Bước (Docs 11.4)
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Hồ Sơ Tuyển Sinh Trực Tuyến & Thẩm Định Đa Bước
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Quản lý toàn diện quy trình 4 bước: Khai sinh, Học bạ, Khảo sát ĐGNL và Hoàn tất phí nhập học.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const csvContent =
                          'data:text/csv;charset=utf-8,' +
                          ['Mã Hồ Sơ,Học Sinh,Ngày Sinh,Phụ Huynh,SĐT,Cơ Sở,Khối Lớp,Trạng Thái']
                            .concat(
                              filteredAdmissions.map(
                                (a) =>
                                  `"${a.code}","${a.studentInfo.fullName}","${a.studentInfo.dateOfBirth}","${a.parentInfo.fullName}","${a.parentInfo.phone}","${a.branchName}","${a.gradeTarget}","${a.status}"`
                              )
                            )
                            .join('\n');
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement('a');
                        link.setAttribute('href', encodedUri);
                        link.setAttribute('download', `admissions-export-${Date.now()}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 shadow-sm transition-all"
                    >
                      <span>📥 Xuất CSV Hồ Sơ</span>
                    </button>
                  </div>
                </div>

                {/* KPI Performance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                      <span>TỔNG HỒ SƠ NỘP</span>
                      <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">📋</span>
                    </div>
                    <div className="text-3xl font-black text-slate-900">{admMetrics.total}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {admMetrics.byStatus.HO_SO_MOI} hồ sơ mới chờ duyệt
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                      <span>HẸN PHỎNG VẤN / ĐGNL</span>
                      <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">🗓️</span>
                    </div>
                    <div className="text-3xl font-black text-amber-600">
                      {admMetrics.byStatus.HEN_PHONG_VAN}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Tỷ lệ mời đánh giá: <strong className="text-amber-700">{admMetrics.interviewRate}%</strong>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                      <span>ĐÃ TRÚNG TUYỂN</span>
                      <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">🎉</span>
                    </div>
                    <div className="text-3xl font-black text-indigo-600">
                      {admMetrics.byStatus.DA_TRUNG_TUYEN}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Tỷ lệ trúng tuyển: <strong className="text-indigo-700">{admMetrics.acceptanceRate}%</strong>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                      <span>HOÀN TẤT NHẬP HỌC</span>
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">✅</span>
                    </div>
                    <div className="text-3xl font-black text-emerald-600">
                      {admMetrics.byStatus.HOAN_TAT_HOC_PHI}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Tỷ lệ chốt nhập học: <strong className="text-emerald-700">{admMetrics.conversionRate}%</strong>
                    </div>
                  </div>
                </div>

                {/* Filter & Search Toolbar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-sm">
                      🔍
                    </span>
                    <input
                      type="text"
                      value={admissionSearch}
                      onChange={(e) => setAdmissionSearch(e.target.value)}
                      placeholder="Tìm theo mã hồ sơ, thí sinh, SĐT..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                      value={admissionFilterStatus}
                      onChange={(e) => setAdmissionFilterStatus(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="ALL">Tất cả trạng thái</option>
                      <option value="HO_SO_MOI">Hồ sơ mới nộp</option>
                      <option value="HEN_PHONG_VAN">Hẹn phỏng vấn / ĐGNL</option>
                      <option value="DA_TRUNG_TUYEN">Đã trúng tuyển</option>
                      <option value="HOAN_TAT_HOC_PHI">Đã nhập học (Đóng phí)</option>
                      <option value="TU_CHOI">Từ chối / Rút hồ sơ</option>
                    </select>

                    <select
                      value={admissionFilterGrade}
                      onChange={(e) => setAdmissionFilterGrade(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="ALL">Tất cả khối học</option>
                      <option value="mam_non">Mầm non</option>
                      <option value="tieu_hoc">Tiểu học</option>
                      <option value="thcs">Trung học cơ sở</option>
                      <option value="thpt">Trung học phổ thông</option>
                    </select>

                    <span className="text-xs text-slate-400 font-medium">
                      {filteredAdmissions.length} hồ sơ
                    </span>
                  </div>
                </div>

                {/* Admissions Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                          <th className="py-3.5 px-4">Mã Hồ Sơ</th>
                          <th className="py-3.5 px-4">Học Sinh Dự Tuyển</th>
                          <th className="py-3.5 px-4">Phụ Huynh Liên Hệ</th>
                          <th className="py-3.5 px-4">Cơ Sở & Lớp Đăng Ký</th>
                          <th className="py-3.5 px-4">Hồ Sơ Đính Kèm</th>
                          <th className="py-3.5 px-4">Trạng Thái Quy Trình</th>
                          <th className="py-3.5 px-4 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredAdmissions.map((app) => {
                          const statusCfg = ADMISSION_STATUS_LABELS[app.status] || {
                            label: app.status,
                            color: 'text-slate-700',
                            bg: 'bg-slate-100',
                            border: 'border-slate-200',
                          };

                          return (
                            <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-4 px-4 font-mono font-bold text-emerald-700">
                                {app.code}
                                <span className="block text-[11px] font-sans font-normal text-slate-400">
                                  {new Date(app.submittedAt).toLocaleDateString('vi-VN')}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-bold text-slate-900">{app.studentInfo.fullName}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${app.studentInfo.gender === 'nam' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                                    {app.studentInfo.gender === 'nam' ? 'Nam' : 'Nữ'}
                                  </span>
                                  <span>{app.studentInfo.dateOfBirth}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium text-slate-800">
                                  {app.parentInfo.fullName} ({app.parentInfo.relationship})
                                </div>
                                <div className="text-xs text-slate-500 font-mono mt-0.5">
                                  📞 {app.parentInfo.phone}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-block font-semibold text-slate-900">
                                  {app.gradeTarget}
                                </span>
                                <span className="block text-xs text-slate-500 truncate max-w-[180px]">
                                  {app.branchName}
                                </span>
                                <span className="inline-block text-[11px] font-medium text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded mt-0.5">
                                  {app.programName}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                    📁 {app.documents.length} tệp
                                  </span>
                                  {app.documents.every((d) => d.verified) ? (
                                    <span className="text-xs text-emerald-600 font-bold" title="Tất cả giấy tờ đã thẩm định">
                                      ✓ Đủ
                                    </span>
                                  ) : (
                                    <span className="text-xs text-amber-600 font-medium" title="Có giấy tờ chưa thẩm định">
                                      ⏳ Chờ
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={app.status}
                                  onChange={(e) => handleUpdateStatus(app.id, e.target.value as AdmissionStatus)}
                                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
                                >
                                  <option value="HO_SO_MOI">Hồ Sơ Mới Nộp</option>
                                  <option value="HEN_PHONG_VAN">Hẹn Phỏng Vấn / ĐGNL</option>
                                  <option value="DA_TRUNG_TUYEN">Đã Trúng Tuyển</option>
                                  <option value="HOAN_TAT_HOC_PHI">Đã Nhập Học (Hoàn Tất)</option>
                                  <option value="TU_CHOI">Từ Chối / Rút Hồ Sơ</option>
                                </select>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedAdmission(app)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                                >
                                  <span>Thẩm Định</span>
                                  <span>➔</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Admission Review Modal */}
                {selectedAdmission && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedAdmission(null)}
                  >
                    <div
                      className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Modal Header */}
                      <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold">
                            🎓
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-emerald-700 text-sm">
                                {selectedAdmission.code}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${ADMISSION_STATUS_LABELS[selectedAdmission.status]?.bg} ${ADMISSION_STATUS_LABELS[selectedAdmission.status]?.color}`}>
                                {ADMISSION_STATUS_LABELS[selectedAdmission.status]?.label}
                              </span>
                            </div>
                            <h4 className="text-lg font-extrabold text-slate-900">
                              Hồ Sơ: {selectedAdmission.studentInfo.fullName}
                            </h4>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedAdmission(null)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Modal Body - 4 Steps Inspection */}
                      <div className="p-6 space-y-6">
                        {/* 1. Student Info */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                            <span>1️⃣</span> Thông Tin Thí Sinh
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 block">Họ và tên:</span>
                              <strong className="text-slate-800 text-sm">{selectedAdmission.studentInfo.fullName}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Ngày sinh:</span>
                              <strong className="text-slate-800 text-sm">{selectedAdmission.studentInfo.dateOfBirth}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Giới tính:</span>
                              <strong className="text-slate-800 text-sm">{selectedAdmission.studentInfo.gender === 'nam' ? 'Nam' : 'Nữ'}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Trường đang học:</span>
                              <strong className="text-slate-800 text-sm">{selectedAdmission.studentInfo.currentSchool}</strong>
                            </div>
                          </div>
                        </div>

                        {/* 2. Parent Info */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                            <span>2️⃣</span> Thông Tin Phụ Huynh / Người Giám Hộ
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 block">Phụ huynh:</span>
                              <strong className="text-slate-800 text-sm">
                                {selectedAdmission.parentInfo.fullName} ({selectedAdmission.parentInfo.relationship})
                              </strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Số điện thoại:</span>
                              <strong className="text-slate-800 text-sm font-mono">{selectedAdmission.parentInfo.phone}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Email:</span>
                              <strong className="text-slate-800 text-sm">{selectedAdmission.parentInfo.email}</strong>
                            </div>
                            <div className="sm:col-span-3">
                              <span className="text-slate-400 block">Địa chỉ thường trú:</span>
                              <span className="text-slate-800 font-medium">{selectedAdmission.parentInfo.address}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Uploaded Documents */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                            <span>3️⃣</span> Tài Liệu & Giấy Tờ Đính Kèm ({selectedAdmission.documents.length})
                          </h5>
                          <div className="space-y-2.5">
                            {selectedAdmission.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-lg">📄</span>
                                  <div>
                                    <span className="font-semibold text-xs text-slate-800 block">{doc.name}</span>
                                    <span className="text-[11px] text-slate-400 font-mono">{doc.type}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedDocs = selectedAdmission.documents.map((d) =>
                                        d.id === doc.id ? { ...d, verified: !d.verified } : d
                                      );
                                      setSelectedAdmission({ ...selectedAdmission, documents: updatedDocs });
                                      setAdmissions((prev) =>
                                        prev.map((a) =>
                                          a.id === selectedAdmission.id ? { ...a, documents: updatedDocs } : a
                                        )
                                      );
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                                      doc.verified
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {doc.verified ? '✓ Đã Thẩm Định' : '⏳ Chưa Thẩm Định'}
                                  </button>
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded text-slate-400 hover:text-slate-700"
                                    title="Xem tệp"
                                  >
                                    ↗
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. Decision & Status Update Form */}
                        <div className="p-4 rounded-2xl border-2 border-emerald-500/20 bg-emerald-50/30 space-y-4">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <span>4️⃣</span> Kết Quả Xét Duyệt & Cập Nhật Quy Trình
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                Trạng thái phê duyệt:
                              </label>
                              <select
                                value={selectedAdmission.status}
                                onChange={(e) => {
                                  const val = e.target.value as AdmissionStatus;
                                  setSelectedAdmission({ ...selectedAdmission, status: val });
                                }}
                                className="w-full p-2 rounded-xl border border-slate-300 font-semibold bg-white text-xs"
                              >
                                <option value="HO_SO_MOI">Hồ Sơ Mới Nộp</option>
                                <option value="HEN_PHONG_VAN">Hẹn Phỏng Vấn / ĐGNL</option>
                                <option value="DA_TRUNG_TUYEN">Đã Trúng Tuyển</option>
                                <option value="HOAN_TAT_HOC_PHI">Đã Nhập Học (Hoàn Tất)</option>
                                <option value="TU_CHOI">Từ Chối / Rút Hồ Sơ</option>
                              </select>
                            </div>

                            <div>
                              <label className="font-bold text-slate-700 block mb-1">
                                Lịch hẹn phỏng vấn / Khảo sát ĐGNL:
                              </label>
                              <input
                                type="text"
                                value={selectedAdmission.interviewDate || ''}
                                onChange={(e) =>
                                  setSelectedAdmission({ ...selectedAdmission, interviewDate: e.target.value })
                                }
                                placeholder="Ví dụ: 15/09/2026 09:00"
                                className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-white"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="font-bold text-slate-700 block mb-1">
                                Nhận xét đánh giá năng lực & Phỏng vấn:
                              </label>
                              <input
                                type="text"
                                value={selectedAdmission.interviewNotes || ''}
                                onChange={(e) =>
                                  setSelectedAdmission({ ...selectedAdmission, interviewNotes: e.target.value })
                                }
                                placeholder="Ghi chú điểm test tư duy, năng lực ngoại ngữ, tâm lý..."
                                className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-white"
                              />
                            </div>

                            <div>
                              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer pt-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAdmission.feePaid}
                                  onChange={(e) =>
                                    setSelectedAdmission({ ...selectedAdmission, feePaid: e.target.checked })
                                  }
                                  className="w-4 h-4 text-emerald-600 rounded"
                                />
                                <span>Đã hoàn tất đóng học phí / Phí ghi danh</span>
                              </label>
                            </div>

                            {selectedAdmission.feePaid && (
                              <div>
                                <label className="font-bold text-slate-700 block mb-1">
                                  Số tiền học phí đã thu (VNĐ):
                                </label>
                                <input
                                  type="number"
                                  value={selectedAdmission.feeAmount || 0}
                                  onChange={(e) =>
                                    setSelectedAdmission({ ...selectedAdmission, feeAmount: Number(e.target.value) })
                                  }
                                  className="w-full p-2 rounded-xl border border-slate-300 text-xs bg-white font-mono"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 z-10">
                        <button
                          type="button"
                          onClick={() => setSelectedAdmission(null)}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                        >
                          Đóng
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAdmissions((prev) =>
                              prev.map((a) => (a.id === selectedAdmission.id ? selectedAdmission : a))
                            );
                            setSelectedAdmission(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                        >
                          💾 Lưu Cập Nhật Hồ Sơ
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* TAB: AI CHATBOT & KNOWLEDGE BASE */}
        {activeTab === 'chatbot' && (() => {
          const filteredKnowledge = knowledgeSources.filter((k) => {
            const matchesCategory = selectedKnowledgeCategory === 'all' || k.category === selectedKnowledgeCategory;
            const matchesSearch =
              !knowledgeSearch.trim() ||
              k.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
              k.content.toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
              k.tags.some((t) => t.toLowerCase().includes(knowledgeSearch.toLowerCase()));
            return matchesCategory && matchesSearch;
          });

          const totalTokens = knowledgeSources.reduce((acc, curr) => acc + curr.tokenCount, 0);

          return (
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>🤖</span> Trợ Lý AI Tuyển Sinh & Sổ Tay Tri Thức (Knowledge Base)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Mô hình RAG (Retrieval-Augmented Generation) tra cứu trực tiếp biểu phí, chương trình Cambridge và quy định 3 cơ sở Alpha School.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddKnowledgeModal(true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
                    >
                      <span>➕</span> Nạp Tri Thức Mới
                    </button>
                  </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Nguồn Tri Thức</span>
                    <div className="text-2xl font-black text-slate-900">{knowledgeSources.length}</div>
                    <span className="text-[11px] text-emerald-600 font-medium">Đã phân đoạn (Chunks)</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Dung Lượng Token</span>
                    <div className="text-2xl font-black text-blue-600">~{totalTokens.toLocaleString()}</div>
                    <span className="text-[11px] text-slate-500">Vector Embeddings Ready</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Độ Chuẩn Xác RAG</span>
                    <div className="text-2xl font-black text-emerald-600">98.4%</div>
                    <span className="text-[11px] text-emerald-700 font-semibold">Grounded & Trích Dẫn</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 block mb-1">Intent Hàng Đầu</span>
                    <div className="text-lg font-black text-amber-600 truncate">Học Phí (42%)</div>
                    <span className="text-[11px] text-slate-500">Tuyển sinh (33%)</span>
                  </div>
                </div>

                {/* Main Split Layout: Left Knowledge Manager, Right Live Console */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Knowledge Base Manager (7 Cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>📚</span> Danh Sách Khối Tri Thức Sổ Tay ({filteredKnowledge.length})
                        </h4>
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                          <input
                            type="text"
                            value={knowledgeSearch}
                            onChange={(e) => setKnowledgeSearch(e.target.value)}
                            placeholder="Tìm kiếm nội dung, từ khóa..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                          />
                          <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
                        </div>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedKnowledgeCategory('all')}
                          className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                            selectedKnowledgeCategory === 'all'
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Tất cả ({knowledgeSources.length})
                        </button>
                        {(Object.keys(KNOWLEDGE_CATEGORY_LABELS) as KnowledgeCategory[]).map((cat) => {
                          const conf = KNOWLEDGE_CATEGORY_LABELS[cat];
                          const count = knowledgeSources.filter((k) => k.category === cat).length;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedKnowledgeCategory(cat)}
                              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-1 ${
                                selectedKnowledgeCategory === cat
                                  ? 'bg-emerald-700 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <span>{conf.icon}</span> {conf.label} ({count})
                            </button>
                          );
                        })}
                      </div>

                      {/* Knowledge Cards List */}
                      <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                        {filteredKnowledge.map((item) => {
                          const catConf = KNOWLEDGE_CATEGORY_LABELS[item.category];
                          return (
                            <div
                              key={item.id}
                              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 space-y-2 transition-all hover:shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catConf.color}`}
                                    >
                                      {catConf.icon} {catConf.label}
                                    </span>
                                    {item.branchId ? (
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                                        📍 Cơ sở: {item.branchId}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-700">
                                        🌐 Toàn trường (Global)
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {item.tokenCount} tokens
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteKnowledgeChunk(item.id)}
                                  className="text-slate-400 hover:text-rose-600 text-xs font-bold p-1 rounded hover:bg-rose-50 transition-colors"
                                  title="Xóa tri thức này"
                                >
                                  ✕
                                </button>
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-line bg-white p-2.5 rounded-lg border border-slate-100 font-sans">
                                {item.content}
                              </p>

                              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                                {item.tags.map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-medium"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Test Chatbot Console (5 Cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[740px] overflow-hidden">
                      {/* Console Header */}
                      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow">
                            🤖
                          </div>
                          <div>
                            <h4 className="text-xs font-bold flex items-center gap-1.5">
                              <span>Alpha Admissions Bot</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            </h4>
                            <p className="text-[10px] text-slate-400">Live RAG Sandbox Engine</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTestChatMessages([
                              {
                                id: 'msg-welcome',
                                conversationId: 'conv-test-admin',
                                role: 'assistant',
                                content: 'Hội đồng Tuyển sinh đã khởi động lại phiên hỏi đáp thử nghiệm.',
                                createdAt: new Date().toISOString(),
                              },
                            ]);
                            setLastChatDebug(null);
                          }}
                          className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                        >
                          Làm mới
                        </button>
                      </div>

                      {/* Quick Prompt Pill Carousel */}
                      <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                        {[
                          'Học phí năm học 2026?',
                          'Chương trình Cambridge?',
                          'Địa chỉ cơ sở Biên Hòa?',
                          'Hồ sơ đăng ký gồm gì?',
                          'Học bổng Alpha Spark?',
                        ].map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => handleSendTestChat(prompt)}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 text-slate-600 rounded-lg whitespace-nowrap transition-all shadow-2xs font-medium"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>

                      {/* Chat Messages Body */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/50">
                        {testChatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs space-y-2 ${
                                msg.role === 'user'
                                  ? 'bg-slate-900 text-white rounded-tr-xs'
                                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                              }`}
                            >
                              <p className="whitespace-pre-line font-sans">{msg.content}</p>

                              {/* Citations Snippets */}
                              {msg.citations && msg.citations.length > 0 && (
                                <div className="pt-2 border-t border-slate-100 space-y-1">
                                  <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">
                                    📌 Nguồn Trích Dẫn ({msg.citations.length}):
                                  </span>
                                  {msg.citations.map((cite, cIdx) => (
                                    <div
                                      key={cIdx}
                                      className="p-1.5 rounded bg-emerald-50 text-[10px] text-emerald-900 border border-emerald-200/60"
                                    >
                                      <strong>{cite.title}:</strong> &ldquo;{cite.snippet}&rdquo;
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {testChatLoading && (
                          <div className="flex justify-start">
                            <div className="p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                              <span>AI đang tra cứu Sổ tay Alpha...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Debug Grounding Inspector Box */}
                      {lastChatDebug && (
                        <div className="p-2.5 bg-slate-900 text-white text-[11px] border-t border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-mono font-bold">
                              INTENT: {lastChatDebug.intent}
                            </span>
                            <span className="text-slate-400">
                              Độ tin cậy: <strong className="text-white">{Math.round(lastChatDebug.confidence * 100)}%</strong>
                            </span>
                          </div>
                          <span className="text-slate-400">
                            {lastChatDebug.citations.length} nguồn khớp
                          </span>
                        </div>
                      )}

                      {/* Chat Input Footer */}
                      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                        <input
                          type="text"
                          value={testChatInput}
                          onChange={(e) => setTestChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendTestChat()}
                          placeholder="Hỏi về học phí, cơ sở, Cambridge, tuyển sinh..."
                          className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendTestChat()}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <span>Gửi</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODAL: Thêm Khối Tri Thức Mới */}
                {showAddKnowledgeModal && (
                  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                          <span>➕</span> Nạp Tài Liệu Tri Thức Vào Sổ Tay Trường Học
                        </h4>
                        <button
                          type="button"
                          onClick={() => setShowAddKnowledgeModal(false)}
                          className="text-slate-400 hover:text-white text-lg font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="p-6 space-y-4 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Tiêu đề khối tri thức: <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newKbTitle}
                            onChange={(e) => setNewKbTitle(e.target.value)}
                            placeholder="Ví dụ: Chính sách miễn giảm học phí cho con em giảng viên"
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">
                              Danh mục chủ đề:
                            </label>
                            <select
                              value={newKbCategory}
                              onChange={(e) => setNewKbCategory(e.target.value as KnowledgeCategory)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                            >
                              {(Object.keys(KNOWLEDGE_CATEGORY_LABELS) as KnowledgeCategory[]).map((cat) => (
                                <option key={cat} value={cat}>
                                  {KNOWLEDGE_CATEGORY_LABELS[cat].icon} {KNOWLEDGE_CATEGORY_LABELS[cat].label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-1">
                              Phạm vi cơ sở:
                            </label>
                            <select
                              value={newKbBranch}
                              onChange={(e) => setNewKbBranch(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                            >
                              <option value="all">Toàn trường (Global)</option>
                              <option value="bien-hoa">Cơ sở Biên Hòa (Đồng Nai)</option>
                              <option value="b-002">Cơ sở TP. Thủ Đức (TP.HCM)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-bold text-slate-700">
                              Nội dung tài liệu / quy định chính thức: <span className="text-rose-500">*</span>
                            </label>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ~{Math.ceil(newKbContent.length / 4)} tokens
                            </span>
                          </div>
                          <textarea
                            rows={6}
                            value={newKbContent}
                            onChange={(e) => setNewKbContent(e.target.value)}
                            placeholder="Nhập nội dung quy định chi tiết để AI học và trích dẫn..."
                            className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed font-sans"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Từ khóa tags (phân cách bằng dấu phẩy):
                          </label>
                          <input
                            type="text"
                            value={newKbTags}
                            onChange={(e) => setNewKbTags(e.target.value)}
                            placeholder="Ví dụ: học phí, giảm trừ, giảng viên, ưu đãi"
                            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAddKnowledgeModal(false)}
                          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                        >
                          Hủy Bỏ
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveKnowledgeChunk}
                          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all"
                        >
                          💾 Lưu & Phân Đoạn Tri Thức
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* TAB 5: THEME CUSTOMIZER */}
        {activeTab === 'theme' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Theme Customizer (Design Tokens)</h3>
                  <p className="text-sm text-slate-500">
                    Tùy biến bộ màu sắc thương hiệu, font chữ và bo góc cho toàn trường hoặc từng cơ sở.
                  </p>
                </div>
                <button
                  onClick={() => {
                    addAuditLog({ action: 'UPDATE', entityType: 'THEME', entityTitle: 'Global Brand Tokens', details: `Primary: ${themeTokens.primaryColor}` });
                    showToast('Đã lưu và đồng bộ Design Tokens cho toàn hệ thống!');
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2"
                >
                  💾 Lưu & Áp Dụng Theme
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h4 className="font-bold text-slate-800 text-base border-b border-slate-100 pb-3">
                    Bộ Biến Số Nhận Diện Thương Hiệu
                  </h4>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Màu Chủ Đạo (Primary Brand Color)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={themeTokens.primaryColor}
                        onChange={(e) => setThemeTokens({ ...themeTokens, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeTokens.primaryColor}
                        onChange={(e) => setThemeTokens({ ...themeTokens, primaryColor: e.target.value })}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['#047857', '#1e3a8a', '#b91c1c', '#4f46e5', '#d97706'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setThemeTokens({ ...themeTokens, primaryColor: c })}
                          className="w-6 h-6 rounded-full border border-slate-300"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Màu Phụ Trợ (Secondary / Accent Color)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={themeTokens.accentColor}
                        onChange={(e) => setThemeTokens({ ...themeTokens, accentColor: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-slate-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={themeTokens.accentColor}
                        onChange={(e) => setThemeTokens({ ...themeTokens, accentColor: e.target.value })}
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Bo Góc Khối Giao Diện (Border Radius)
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['4px', '8px', '12px', '20px'].map((r) => (
                        <button
                          key={r}
                          onClick={() => setThemeTokens({ ...themeTokens, borderRadius: r })}
                          className={`py-2 px-3 border rounded-lg text-xs font-medium ${
                            themeTokens.borderRadius === r
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Font Chữ Tiêu Đề & Nội Dung
                    </label>
                    <select
                      value={themeTokens.fontFamily}
                      onChange={(e) => setThemeTokens({ ...themeTokens, fontFamily: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="Outfit, sans-serif">Outfit (Trẻ trung, hiện đại)</option>
                      <option value="Inter, sans-serif">Inter (Chuẩn quốc tế, tinh giản)</option>
                      <option value="Roboto, sans-serif">Roboto (Cổ điển, trung tính)</option>
                      <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans (Sang trọng)</option>
                    </select>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-base">Xem Trước Trực Quan (Live Preview)</h4>
                  <div
                    className="p-8 bg-white border border-slate-200 shadow-md space-y-6"
                    style={{
                      borderRadius: themeTokens.borderRadius,
                      fontFamily: themeTokens.fontFamily,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: themeTokens.primaryColor }}
                        >
                          A
                        </div>
                        <span className="font-bold text-slate-900">Alpha Bilingual School</span>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-bold text-white"
                        style={{ backgroundColor: themeTokens.accentColor }}
                      >
                        MÙA TUYỂN SINH
                      </span>
                    </div>

                    <div>
                      <h2
                        className="text-2xl font-bold tracking-tight"
                        style={{ color: themeTokens.primaryColor }}
                      >
                        Khát Vọng Vươn Tầm Quốc Tế
                      </h2>
                      <p className="text-slate-600 text-sm mt-1">
                        Mẫu xem trước nút bấm và các thành phần giao diện sẽ tự động áp dụng biến số của theme đã chọn.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        className="px-5 py-2.5 text-white text-sm font-semibold shadow"
                        style={{
                          backgroundColor: themeTokens.primaryColor,
                          borderRadius: themeTokens.borderRadius,
                        }}
                      >
                        Nút Bấm Chính
                      </button>
                      <button
                        className="px-5 py-2.5 border text-sm font-semibold"
                        style={{
                          borderColor: themeTokens.primaryColor,
                          color: themeTokens.primaryColor,
                          borderRadius: themeTokens.borderRadius,
                        }}
                      >
                        Nút Bấm Phụ
                      </button>
                    </div>
                  </div>

                  {/* Generated CSS Variables code */}
                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                    <div className="text-slate-400 mb-1">// CSS Variables Output</div>
                    <div>:root &#123;</div>
                    <div className="pl-4 text-emerald-400">--color-primary: {themeTokens.primaryColor};</div>
                    <div className="pl-4 text-amber-400">--color-accent: {themeTokens.accentColor};</div>
                    <div className="pl-4 text-blue-400">--border-radius: {themeTokens.borderRadius};</div>
                    <div className="pl-4 text-purple-400">--font-family: {themeTokens.fontFamily};</div>
                    <div>&#125;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: DYNAMIC FORM BUILDER */}
        {activeTab === 'forms' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Trình Thiết Kế Biểu Mẫu (Dynamic Form Builder)</h3>
                  <p className="text-sm text-slate-500">
                    Xây dựng form tùy biến cho từng chiến dịch tuyển sinh mà không cần can thiệp mã nguồn.
                  </p>
                </div>
                <button
                  onClick={() => {
                    addAuditLog({ action: 'UPDATE', entityType: 'FORM', entityTitle: 'Form Tuyển Sinh 2025', details: 'Lưu schema form' });
                    showToast('Đã lưu cấu hình Form Schema thành công!');
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  💾 Lưu Form Schema
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Selection & Field List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 text-sm mb-4">Các Trường Thông Tin Trong Form</h4>
                    <div className="space-y-3">
                      {formFields.map((f, i) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <div>
                              <span className="font-semibold text-sm text-slate-900">{f.label}</span>
                              <span className="text-xs text-slate-400 font-mono ml-2">({f.name} • {f.type})</span>
                              {f.required && (
                                <span className="text-[10px] text-red-600 font-bold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded ml-2">
                                  BẮT BUỘC
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveField(f.id)}
                            className="text-slate-400 hover:text-red-600 text-sm p-1"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Field Inline */}
                    <div className="mt-6 pt-4 border-t border-slate-200">
                      <h5 className="text-xs font-bold uppercase text-slate-600 mb-3 tracking-wider">
                        Thêm Trường Mới Vào Form
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <input
                          type="text"
                          placeholder="Tên trường (name)"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <input
                          type="text"
                          placeholder="Nhãn hiển thị (Label)"
                          value={newFieldLabel}
                          onChange={(e) => setNewFieldLabel(e.target.value)}
                          className="border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <select
                          value={newFieldType}
                          onChange={(e) => setNewFieldType(e.target.value as any)}
                          className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white"
                        >
                          <option value="text">Văn bản (Text)</option>
                          <option value="email">Email</option>
                          <option value="tel">Số điện thoại</option>
                          <option value="select">Hộp chọn (Select)</option>
                          <option value="textarea">Văn bản nhiều dòng</option>
                        </select>
                        <button
                          onClick={handleAddField}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          ➕ Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Live Preview */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Giao Diện Form Thực Tế</h4>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h5 className="font-bold text-slate-900 text-base">Đăng Ký Tư Vấn Tuyển Sinh 2025</h5>
                    {formFields.map((f) => (
                      <div key={f.id}>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {f.label} {f.required && <span className="text-red-500">*</span>}
                        </label>
                        {f.type === 'select' ? (
                          <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 text-slate-700">
                            {f.options?.map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : f.type === 'textarea' ? (
                          <textarea
                            rows={2}
                            placeholder={f.placeholder}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 text-slate-700"
                          />
                        ) : (
                          <input
                            type={f.type}
                            placeholder={f.placeholder}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 text-slate-700"
                          />
                        )}
                      </div>
                    ))}
                    <button className="w-full py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm">
                      Gửi Thông Tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: MEDIA ASSET HUB & RESPONSIVE IMAGE OPTIMIZATION */}
        {activeTab === 'media' && (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Top Controls & Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Thư Viện Tệp Tin Đa Phương Tiện (Media Asset Hub)</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Tối ưu hóa ảnh tự động WebP & 4 biến thể thích ứng (Thumbnail, Card, Hero) theo chuẩn Core Web Vitals.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddMediaModal(true)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition-all hover:shadow-md"
                  >
                    <span>📤</span>
                    <span>Tải Lên Media Mới</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
                  {(['all', 'image', 'document', 'video'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMediaCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        mediaCategoryFilter === cat
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {cat === 'all' && '🌐 Tất cả'}
                      {cat === 'image' && '🖼️ Hình ảnh'}
                      {cat === 'document' && '📄 Tài liệu'}
                      {cat === 'video' && '🎥 Video'}
                    </button>
                  ))}
                </div>

                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder="🔍 Tìm kiếm theo tên tệp..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-sm"
                  />
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mediaAssets
                  .filter((m) => mediaCategoryFilter === 'all' || m.category === mediaCategoryFilter || (m.type as any) === mediaCategoryFilter)
                  .filter((m) => !mediaSearch || m.title.toLowerCase().includes(mediaSearch.toLowerCase()) || m.url.toLowerCase().includes(mediaSearch.toLowerCase()))
                  .map((med) => (
                    <div
                      key={med.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
                    >
                      <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        {med.type === 'image' || med.category === 'image' ? (
                          <img
                            src={med.url}
                            alt={med.altText || med.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : med.type === 'video' || med.category === 'video' ? (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <span className="text-4xl">🎬</span>
                            <span className="text-xs font-semibold text-slate-500">MP4 Video Clip</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <span className="text-4xl">📑</span>
                            <span className="text-xs font-semibold text-slate-500">PDF Document</span>
                          </div>
                        )}
                        <span className="absolute top-2.5 right-2.5 bg-slate-900/75 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold backdrop-blur-md shadow-sm">
                          {med.tag}
                        </span>
                        {(med.type === 'image' || med.category === 'image') && (
                          <span className="absolute bottom-2.5 left-2.5 bg-emerald-700/85 text-white text-[9px] px-2 py-0.5 rounded font-mono font-bold backdrop-blur-sm">
                            4 Biến thể WebP
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm line-clamp-1" title={med.title}>
                            {med.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            {med.dimensions} • {med.size}
                          </p>
                          {med.altText && (
                            <p className="text-xs text-slate-500 mt-1 italic line-clamp-1" title={med.altText}>
                              Alt: {med.altText}
                            </p>
                          )}
                        </div>

                        {/* Responsive Variants Preview Links */}
                        {med.variants && (
                          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-700 block mb-1">Kích thước ảnh tối ưu:</span>
                            <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                              <button
                                onClick={() => {
                                  showToast('Đã sao chép URL Thumbnail (150px WebP)');
                                }}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded border border-slate-200"
                                title={med.variants.thumbnail}
                              >
                                Thumb 150px
                              </button>
                              <button
                                onClick={() => {
                                  showToast('Đã sao chép URL Mobile Card (480px WebP)');
                                }}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded border border-slate-200"
                                title={med.variants.card_small}
                              >
                                Card 480px
                              </button>
                              <button
                                onClick={() => {
                                  showToast('Đã sao chép URL Desktop Grid (800px WebP)');
                                }}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded border border-slate-200"
                                title={med.variants.card_large}
                              >
                                Grid 800px
                              </button>
                              <button
                                onClick={() => {
                                  showToast('Đã sao chép URL Banner Hero (1920px WebP)');
                                }}
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded border border-slate-200"
                                title={med.variants.hero_full}
                              >
                                Hero 1920px
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(med.url);
                              showToast(`Đã sao chép liên kết CDN: ${med.url}`);
                            }}
                            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                          >
                            <span>🔗</span>
                            <span>Sao chép CDN</span>
                          </button>
                          <button
                            onClick={() => {
                              setMediaAssets(mediaAssets.filter((m) => m.id !== med.id));
                              addAuditLog({
                                action: 'DELETE',
                                entityType: 'ARTICLE',
                                entityTitle: med.title,
                                details: `Xóa tệp media ${med.title}`,
                              });
                              showToast('Đã xóa tệp media khỏi thư viện');
                            }}
                            className="text-slate-400 hover:text-red-600 text-xs font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: WEBHOOKS MANAGEMENT & LIVE TEST CONSOLE */}
        {activeTab === 'webhooks' && (
          <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Quản Lý Webhooks & Phân Phối Dữ Liệu Tự Động</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Ký số điện tử HMAC SHA-256 qua tiêu đề <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-700">X-Webhook-Signature</code> đồng bộ với CRM bên ngoài.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddWebhookModal(true)}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition-all hover:shadow-md"
                >
                  <span>➕</span>
                  <span>Đăng Ký Webhook Mới</span>
                </button>
              </div>

              {/* Subscribed Webhooks List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span>📡</span>
                    <span>Danh Sách Webhook Subscriptions ({webhooks.length})</span>
                  </h4>
                  <span className="text-xs text-slate-400">Tất cả webhook đều được ký bảo mật SHA-256</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {webhooks.map((wh) => (
                    <div key={wh.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h5 className="font-bold text-slate-900 text-sm">{wh.name}</h5>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            {wh.isActive ? 'ĐANG HOẠT ĐỘNG' : 'TẠM DỪNG'}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-slate-500">{wh.url}</p>
                        <div className="flex items-center gap-3 pt-1 text-xs text-slate-400">
                          <span>Khóa Secret: <strong className="font-mono text-slate-700">{wh.secretMasked}</strong></span>
                          <span>•</span>
                          <span>Sự kiện: {wh.events.map((e) => (
                            <span key={e} className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono mr-1">
                              {e}
                            </span>
                          ))}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 hidden sm:block">{wh.lastDelivery}</span>
                        <button
                          onClick={() => {
                            setWebhooks(webhooks.filter((w) => w.id !== wh.id));
                            showToast('Đã hủy đăng ký webhook');
                          }}
                          className="px-3 py-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg text-xs font-semibold transition-all"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE WEBHOOK TEST CONSOLE */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <h4 className="font-bold text-lg text-emerald-400">Trình Giả Lập Kích Hoạt Webhook (Live Test Console)</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Mô phỏng phát sinh sự kiện tuyển sinh hoặc xuất bản trang và kiểm tra chữ ký HMAC-SHA256 tức thì.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={testWebhookEvent}
                      onChange={(e: any) => setTestWebhookEvent(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="lead.created">Sự kiện: lead.created (Hồ sơ mới)</option>
                      <option value="lead.status_updated">Sự kiện: lead.status_updated (Đổi trạng thái)</option>
                      <option value="page.published">Sự kiện: page.published (Xuất bản trang)</option>
                    </select>

                    <button
                      onClick={() => {
                        setIsDispatchingTest(true);
                        setTimeout(() => {
                          const mockSig = 'sha256=' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                          const result = {
                            event: testWebhookEvent,
                            timestamp: new Date().toISOString(),
                            signature: mockSig,
                            httpStatus: 200,
                            dispatchedTo: webhooks.map((w) => w.url),
                            payload: {
                              eventId: `evt-${Date.now()}`,
                              event: testWebhookEvent,
                              timestamp: new Date().toISOString(),
                              data:
                                testWebhookEvent === 'page.published'
                                  ? { pageId: 'page-home', title: 'Trang Chủ Alpha School', version: 2, author: 'Super Admin' }
                                  : {
                                      leadId: 'lead-test-01',
                                      parentName: 'Phụ Huynh Thử Nghiệm',
                                      studentName: 'Học Sinh Thử Nghiệm',
                                      grade: 'Lớp 1 (Cambridge)',
                                      branch: 'Cơ sở Biên Hòa',
                                      status: testWebhookEvent === 'lead.created' ? 'NEW' : 'CONTACTED',
                                    },
                            },
                          };
                          setTestDispatchResult(result);
                          setIsDispatchingTest(false);
                          showToast(`Đã gửi thử nghiệm ${testWebhookEvent}! Chữ ký HMAC-SHA256 hợp lệ.`);
                        }, 500);
                      }}
                      disabled={isDispatchingTest}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>⚡</span>
                      <span>{isDispatchingTest ? 'Đang gửi...' : 'Kích Hoạt Test Dispatch'}</span>
                    </button>
                  </div>
                </div>

                {/* Console Output Screen */}
                <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800/80">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                      <span className="ml-2 text-slate-400">Webhook Dispatch Terminal Output</span>
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold">HMAC-SHA256 SIGNED</span>
                  </div>

                  {testDispatchResult ? (
                    <div className="space-y-2 text-slate-300">
                      <div className="text-emerald-400 font-bold">
                        [SUCCESS] HTTP 200 OK — Dispatched Event: {testDispatchResult.event}
                      </div>
                      <div className="text-slate-400">
                        Header <span className="text-amber-300">X-Webhook-Signature</span>: <span className="text-emerald-300 font-bold">{testDispatchResult.signature}</span>
                      </div>
                      <div className="text-slate-400">
                        Header <span className="text-amber-300">Content-Type</span>: application/json; charset=utf-8
                      </div>
                      <div className="text-slate-400">
                        Dispatched Endpoints: {testDispatchResult.dispatchedTo.join(', ')}
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-900 text-slate-300 bg-slate-900/60 p-3 rounded-lg overflow-x-auto">
                        <pre className="text-emerald-200">{JSON.stringify(testDispatchResult.payload, null, 2)}</pre>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic py-4 text-center">
                      Nhấn vào nút &quot;Kích Hoạt Test Dispatch&quot; ở trên để mô phỏng phát tán webhook kèm chữ ký HMAC SHA-256 thời gian thực.
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery History Logs */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span>📜</span>
                  <span>Lịch Sử Phân Phối Gần Nhất (Delivery Logs)</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 font-mono">
                    <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Thời Gian</th>
                        <th className="px-4 py-3">Webhook Đích</th>
                        <th className="px-4 py-3">Sự Kiện</th>
                        <th className="px-4 py-3">Mã HTTP</th>
                        <th className="px-4 py-3">Chữ Ký HMAC</th>
                        <th className="px-4 py-3">Dữ Liệu Payload</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {webhookLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900 font-sans">{log.webhookName}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">
                              {log.event}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {log.statusCode} OK
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]" title={log.signature}>
                            {log.signature}
                          </td>
                          <td className="px-4 py-3 text-slate-400 truncate max-w-xs" title={log.payloadSnippet}>
                            {log.payloadSnippet}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PERFORMANCE & CACHE MANAGEMENT */}
        {activeTab === 'cache' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span>⚡</span>
                    <span>Hạ Tầng Hiệu Năng & Quản Trị Bộ Nhớ Đệm Đa Tầng</span>
                  </h3>
                  <p className="text-sm text-slate-500">
                    Tuân thủ mục 8.1 & 8.2 (docs/08-performance.md): Cloudflare Edge CDN, Next.js On-Demand ISR & Redis 7 Caching.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsRevalidating(true);
                      setTimeout(() => {
                        setIsRevalidating(false);
                        showToast('Đã làm mới dữ liệu thống kê bộ nhớ đệm!');
                      }, 400);
                    }}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2"
                  >
                    <span>🔄</span> Làm Mới Chỉ Số
                  </button>
                  <button
                    onClick={() => setShowPurgeModal(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-2"
                  >
                    <span>🗑️</span> Xóa Trắng Cache (Purge All)
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span>TỶ LỆ HIT CACHE</span>
                    <span className="text-emerald-600 font-bold text-base">⚡</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-600 font-mono">{cacheMetrics.hitRatio}%</span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Mục tiêu &gt;85%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Edge CDN & Redis giảm tải 88.5% truy vấn database</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span>LƯỢT HITS / MISSES</span>
                    <span className="text-blue-600 font-bold text-base">📊</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900 font-mono">{cacheMetrics.hits}</span>
                    <span className="text-xs text-slate-400">/ {cacheMetrics.misses} misses</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Tổng {cacheMetrics.hits + cacheMetrics.misses} lượt truy vấn được phân luồng</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span>KEYS ĐANG LƯU TRỮ</span>
                    <span className="text-amber-600 font-bold text-base">🔑</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900 font-mono">{cachedKeysList.length}</span>
                    <span className="text-xs text-slate-500">vùng nhớ ({cacheMetrics.memoryEstimate})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Tự động thu hồi bộ nhớ theo chính sách TTL</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
                    <span>TRẠNG THÁI HẠ TẦNG</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Cloudflare CDN:</span>
                      <span className="text-emerald-700 font-semibold font-mono">ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Redis Cluster:</span>
                      <span className="text-emerald-700 font-semibold font-mono">CONNECTED</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Độ trễ TTFB Edge trung bình: &lt;45ms</p>
                </div>
              </div>

              {/* Tag-Based On-Demand Invalidation Controller */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                      <span>🏷️</span>
                      <span>Làm Mới Bộ Nhớ Đệm Theo Thẻ (On-Demand Tag Revalidation)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Kích hoạt Next.js revalidateTag() và xóa cache Cloudflare tức thì mà không cần rebuild ứng dụng.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Chọn Thẻ Nội Dung:</span>
                    <select
                      value={selectedTagToRevalidate}
                      onChange={(e) => setSelectedTagToRevalidate(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="page:home">🏷️ page:home (Trang chủ chính)</option>
                      <option value="branch:bien-hoa">🏷️ branch:bien-hoa (Cơ sở Biên Hòa)</option>
                      <option value="branch:thu-duc">🏷️ branch:thu-duc (Cơ sở TP. Thủ Đức)</option>
                      <option value="page:tuyen-sinh">🏷️ page:tuyen-sinh (Cổng tuyển sinh)</option>
                      <option value="theme:tokens">🏷️ theme:tokens (Màu sắc & Typography)</option>
                      <option value="global-layout">🏷️ global-layout (Header/Footer toàn trường)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => {
                        setIsRevalidating(true);
                        setTimeout(() => {
                          const newLog = {
                            id: `rev-${Date.now()}`,
                            target: selectedTagToRevalidate,
                            type: 'TAG',
                            purgedCount: 1,
                            timestamp: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
                            triggeredBy: currentRole,
                          };
                          setRevalidationLogs([newLog, ...revalidationLogs]);
                          setCachedKeysList(cachedKeysList.filter((k) => !k.includes(selectedTagToRevalidate.split(':')[1])));
                          setIsRevalidating(false);
                          showToast(`Đã thu hồi bộ nhớ đệm cho thẻ [${selectedTagToRevalidate}] thành công!`);
                        }, 500);
                      }}
                      disabled={isRevalidating}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                    >
                      <span>⚡</span>
                      <span>{isRevalidating ? 'Đang revalidate...' : 'Revalidate Tag Này Ngay'}</span>
                    </button>
                  </div>
                </div>

                {/* Cached Keys List in Memory */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Các Vùng Nhớ Đệm Đang Nạp Trong Bộ Nhớ ({cachedKeysList.length}):
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {cachedKeysList.map((key) => (
                      <span
                        key={key}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{key}</span>
                      </span>
                    ))}
                    {cachedKeysList.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Toàn bộ cache đã được giải phóng (0 keys active).</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Revalidation History Log */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <span>📜</span>
                  <span>Nhật Ký Revalidation & Thu Hồi Bộ Nhớ Đệm</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 font-mono">
                    <thead className="bg-slate-50 text-[11px] uppercase font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Thời Gian</th>
                        <th className="px-4 py-3">Mục Tiêu (Target)</th>
                        <th className="px-4 py-3">Phương Thức</th>
                        <th className="px-4 py-3">Số Keys Đã Xóa</th>
                        <th className="px-4 py-3">Người Kích Hoạt</th>
                        <th className="px-4 py-3">Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {revalidationLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">
                              {log.target}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">
                              {log.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-700">
                            {log.purgedCount} keys
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-sans">
                            {log.triggeredBy}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              SUCCESS (STALE_PURGED)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: AUDIT LOGS (GIÁM SÁT HỆ THỐNG) */}
        {activeTab === 'audit' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Nhật Ký Kiểm Toán Toàn Hệ Thống (Audit Logs)</h3>
                  <p className="text-sm text-slate-500">
                    Mọi hành động tạo mới, cập nhật, xuất bản hoặc thay đổi trạng thái đều được ghi nhận phục vụ bảo mật & tuân thủ.
                  </p>
                </div>
                <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-mono font-semibold">
                  {auditLogs.length} bản ghi
                </span>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Thời Gian</th>
                      <th className="px-6 py-4">Người Thực Hiện</th>
                      <th className="px-6 py-4">Vai Trò (Role)</th>
                      <th className="px-6 py-4">Hành Động</th>
                      <th className="px-6 py-4">Thực Thể</th>
                      <th className="px-6 py-4">Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-xs">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900 font-sans">{log.userName}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {log.userRole}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.action === 'CREATE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.action === 'UPDATE' || log.action === 'STATUS_CHANGE'
                                ? 'bg-amber-100 text-amber-800'
                                : log.action === 'PUBLISH'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-sans font-medium text-slate-800">
                          {log.entityType}: {log.entityTitle}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-sans">{log.details || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: ANALYTICS & REPORTS */}
        {activeTab === 'analytics' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Báo Cáo Hiệu Suất Tuyển Sinh & Phễu Chuyển Đổi</h3>
                  <p className="text-sm text-slate-500">
                    Thống kê trực quan dòng dữ liệu phụ huynh từ Landing page, chiến dịch tuyển sinh và tỉ lệ nhập học.
                  </p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 px-3 py-1.5 rounded-lg">
                  Cập nhật thời gian thực
                </span>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Tổng Hồ Sơ Tuyển Sinh</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-slate-900">128</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">+24.5%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">So với cùng kỳ niên khóa 2024</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Tỷ Lệ Chuyển Đổi Nhập Học</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-emerald-700">35.8%</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">+4.2%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Vượt chỉ tiêu ban đầu (30%)</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Thời Gian Phản Hồi Tư Vấn</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-slate-900">18 phút</span>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Rất nhanh</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Cam kết dưới 2h làm việc</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Doanh Số Học Phí Dự Kiến</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-slate-900">14.6 Tỷ</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Niên khóa mới</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">Đã hoàn tất thanh toán đợt 1</p>
                </div>
              </div>

              {/* Conversion Funnel & Campus Share */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funnel */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                    Phễu Chuyển Đổi Tuyển Sinh (Admissions Pipeline)
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>1. Điền Form Nộp Hồ Sơ</span>
                        <span className="text-slate-600">128 hồ sơ (100%)</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full w-full"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>2. Chuyên Viên Đã Liên Hệ Tư Vấn</span>
                        <span className="text-slate-600">98 hồ sơ (76.5%)</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[76.5%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>3. Tham Gia Khảo Sát & Tham Quan</span>
                        <span className="text-slate-600">62 học sinh (48.4%)</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[48.4%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>4. Hoàn Tất Đóng Phí & Nhập Học</span>
                        <span className="text-emerald-700 font-bold">46 học sinh (35.9%)</span>
                      </div>
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-700 rounded-full w-[35.9%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campus Share */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                    Tỷ Trọng Hồ Sơ Theo Hệ Thống Cơ Sở
                  </h4>
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                        <span className="font-semibold text-slate-800">Cơ sở Biên Hòa (Đồng Nai)</span>
                      </div>
                      <span className="font-bold text-slate-900">58 hồ sơ (45.3%)</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                        <span className="font-semibold text-slate-800">Cơ sở TP. Thủ Đức (TP. HCM)</span>
                      </div>
                      <span className="font-bold text-slate-900">42 hồ sơ (32.8%)</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                        <span className="font-semibold text-slate-800">Cơ sở Bình Dương (Thủ Dầu Một)</span>
                      </div>
                      <span className="font-bold text-slate-900">28 hồ sơ (21.9%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: QUẢN LÝ MENU & ĐIỀU HƯỚNG */}
        {activeTab === 'menus' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Quản Lý Hệ Thống Điều Hướng & Menu (Navigation)</h3>
                  <p className="text-sm text-slate-500">
                    Cấu hình các liên kết điều hướng trên Header chính và Footer của toàn bộ hệ thống trường học.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-200 p-1 rounded-lg">
                    <button
                      onClick={() => setSelectedMenuLocation('header')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        selectedMenuLocation === 'header'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Header Navigation ({menuItems.filter(m => m.location === 'header').length})
                    </button>
                    <button
                      onClick={() => setSelectedMenuLocation('footer')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        selectedMenuLocation === 'footer'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Footer Links ({menuItems.filter(m => m.location === 'footer').length})
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAddMenuModal(true)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2"
                  >
                    ➕ Thêm Liên Kết Menu
                  </button>
                </div>
              </div>

              {/* Menu Items Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Thứ Tự</th>
                      <th className="px-6 py-4">Tên Hiển Thị (Title)</th>
                      <th className="px-6 py-4">Đường Dẫn (URL / Path)</th>
                      <th className="px-6 py-4">Cửa Sổ (Target)</th>
                      <th className="px-6 py-4">Trạng Thái</th>
                      <th className="px-6 py-4 text-right">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {menuItems
                      .filter(m => m.location === selectedMenuLocation)
                      .sort((a, b) => a.order - b.order)
                      .map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                                {idx + 1}
                              </span>
                              <div className="flex flex-col">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => handleMoveMenu(item.id, 'up')}
                                  className="text-[10px] text-slate-400 hover:text-slate-700 disabled:opacity-20 px-1"
                                >
                                  ▲
                                </button>
                                <button
                                  disabled={idx === menuItems.filter(m => m.location === selectedMenuLocation).length - 1}
                                  onClick={() => handleMoveMenu(item.id, 'down')}
                                  className="text-[10px] text-slate-400 hover:text-slate-700 disabled:opacity-20 px-1"
                                >
                                  ▼
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">{item.title}</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-700 bg-emerald-50/50 px-2 py-1 rounded inline-block my-2">
                            {item.url}
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500">
                            {item.target === '_blank' ? 'Cửa sổ mới (_blank)' : 'Hiện tại (_self)'}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleMenuStatus(item.id)}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                                item.isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {item.isActive ? '✓ Đang hiển thị' : '⊘ Tạm ẩn'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors text-sm"
                              title="Xóa liên kết"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: QUẢN LÝ BẢN DỊCH ĐA NGÔN NGỮ (i18n) */}
        {activeTab === 'i18n' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Quản Lý Từ Điển & Bản Dịch Đa Ngôn Ngữ (i18n)</h3>
                  <p className="text-sm text-slate-500">
                    Tùy biến các nhãn giao diện Tiếng Việt và Tiếng Anh trên toàn hệ thống mà không cần lập trình viên sửa code.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTranslationModal(true)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 self-start sm:self-auto"
                >
                  ➕ Thêm Khóa Dịch Mới
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 w-full relative">
                  <input
                    type="text"
                    placeholder="Tìm theo khóa hoặc nội dung bản dịch..."
                    value={translationSearch}
                    onChange={(e) => setTranslationSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'nav', label: 'Điều hướng (nav)' },
                    { id: 'admissions', label: 'Tuyển sinh' },
                    { id: 'common', label: 'Chung (common)' },
                    { id: 'search', label: 'Tìm kiếm' },
                    { id: 'footer', label: 'Chân trang' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTranslationCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                        translationCategory === cat.id
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Translation Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Mã Khóa (Key)</th>
                      <th className="px-6 py-4">Chuyên Mục</th>
                      <th className="px-6 py-4">🇻🇳 Bản Dịch Tiếng Việt</th>
                      <th className="px-6 py-4">🇬🇧 English Translation</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {translations
                      .filter((item) => {
                        const matchCat = translationCategory === 'all' || item.category === translationCategory;
                        const matchSearch =
                          !translationSearch.trim() ||
                          item.key.toLowerCase().includes(translationSearch.toLowerCase()) ||
                          item.vi.toLowerCase().includes(translationSearch.toLowerCase()) ||
                          item.en.toLowerCase().includes(translationSearch.toLowerCase());
                        return matchCat && matchSearch;
                      })
                      .map((item) => (
                        <tr key={item.key} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-emerald-800 font-bold">
                            {item.key}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-medium">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            <input
                              type="text"
                              value={item.vi}
                              onChange={(e) => handleUpdateTranslation(item.key, 'vi', e.target.value)}
                              className="w-full border border-transparent hover:border-slate-300 focus:border-emerald-600 focus:bg-white bg-transparent rounded px-2 py-1 text-sm transition-all focus:outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900">
                            <input
                              type="text"
                              value={item.en}
                              onChange={(e) => handleUpdateTranslation(item.key, 'en', e.target.value)}
                              className="w-full border border-transparent hover:border-slate-300 focus:border-emerald-600 focus:bg-white bg-transparent rounded px-2 py-1 text-sm transition-all focus:outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteTranslation(item.key)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors text-sm"
                              title="Xóa khóa dịch"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: QUẢN LÝ TÀI KHOẢN & MA TRẬN PHÂN QUYỀN (RBAC) */}
        {activeTab === 'rbac' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Quản Trị Người Dùng & Ma Trận Phân Quyền (RBAC)</h3>
                  <p className="text-sm text-slate-500">
                    Phân quyền dựa trên vai trò (Role-Based Access Control) và phạm vi cơ sở (Multi-Campus Scope).
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-200 p-1 rounded-lg">
                    <button
                      onClick={() => setRbacSubTab('users')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        rbacSubTab === 'users'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      👥 Tài Khoản ({userAccounts.length})
                    </button>
                    <button
                      onClick={() => setRbacSubTab('matrix')}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                        rbacSubTab === 'matrix'
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      🛡️ Ma Trận Quyền Hạn
                    </button>
                  </div>
                  {rbacSubTab === 'users' && (
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2"
                    >
                      ➕ Thêm Quản Trị Viên
                    </button>
                  )}
                </div>
              </div>

              {/* SUBTAB 1: USER ACCOUNTS */}
              {rbacSubTab === 'users' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Họ & Tên</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Vai Trò (Role)</th>
                        <th className="px-6 py-4">Phạm Vi Cơ Sở (Scope)</th>
                        <th className="px-6 py-4">Trạng Thái</th>
                        <th className="px-6 py-4">Đăng Nhập Gần Nhất</th>
                        <th className="px-6 py-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userAccounts.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {u.name.substring(0, 1)}
                            </span>
                            {u.name}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                u.role === 'SUPER_ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : u.role === 'CAMPUS_DIRECTOR'
                                  ? 'bg-blue-100 text-blue-800'
                                  : u.role === 'ADMISSIONS_OFFICER'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-emerald-800">{u.branchName}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleUserStatus(u.id)}
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
                                u.status === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {u.status === 'ACTIVE' ? '✓ Hoạt động' : '⊘ Tạm dừng'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">{u.lastLogin}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors text-sm"
                              title="Xóa tài khoản"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SUBTAB 2: ROLE PERMISSIONS MATRIX */}
              {rbacSubTab === 'matrix' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      Tích chọn hoặc bỏ chọn để cập nhật tức thì quyền hạn cho từng nhóm người dùng.
                    </span>
                    <span className="font-mono text-emerald-700 font-semibold">
                      Live RBAC Matrix Synced
                    </span>
                  </div>
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Quyền Hạn (Permission)</th>
                        <th className="px-6 py-4">Mã Quyền (Code)</th>
                        <th className="px-4 py-4 text-center">Super Admin</th>
                        <th className="px-4 py-4 text-center">Campus Director</th>
                        <th className="px-4 py-4 text-center">Admissions Officer</th>
                        <th className="px-4 py-4 text-center">Content Editor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {ALL_PERMISSIONS.map((perm) => (
                        <tr key={perm.code} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-6 py-3 font-semibold text-slate-800">
                            <div>{perm.name}</div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono">{perm.category}</span>
                          </td>
                          <td className="px-6 py-3 font-mono text-slate-500">{perm.code}</td>
                          {['SUPER_ADMIN', 'CAMPUS_DIRECTOR', 'ADMISSIONS_OFFICER', 'CONTENT_EDITOR'].map((roleKey) => {
                            const isChecked = (dynamicRolePermissions[roleKey] || []).includes(perm.code);
                            const isLockedSuperAdmin = roleKey === 'SUPER_ADMIN' && perm.code === 'system:manage';
                            return (
                              <td key={roleKey} className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  disabled={isLockedSuperAdmin}
                                  checked={isChecked}
                                  onChange={() => handleTogglePermission(roleKey, perm.code)}
                                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Thêm Cơ Sở Mới */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Cơ Sở Mới</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tên Cơ Sở</label>
                <input
                  type="text"
                  placeholder="Alpha School - Cơ sở Đà Nẵng"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Địa Chỉ</label>
                <input
                  type="text"
                  placeholder="Đường Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Hotline</label>
                <input
                  type="text"
                  placeholder="0236 789 9999"
                  value={newBranchPhone}
                  onChange={(e) => setNewBranchPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddBranchModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveBranch}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 shadow-sm"
              >
                Lưu Cơ Sở
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Viết Bài Mới */}
      {showAddArticleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Soạn Thảo Bài Viết Mới</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề tin tức, thông báo..."
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Chuyên Mục</label>
                <select
                  value={newArticleCategory}
                  onChange={(e) => setNewArticleCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Tin tức & Sự kiện">Tin tức & Sự kiện</option>
                  <option value="Thành tích học thuật">Thành tích học thuật</option>
                  <option value="Thông báo Tuyển sinh">Thông báo Tuyển sinh</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phạm Vi Hiển Thị</label>
                <select
                  value={newArticleBranch}
                  onChange={(e) => setNewArticleBranch(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="Toàn hệ thống">Toàn hệ thống (All Branches)</option>
                  <option value="Cơ sở Biên Hòa">Chỉ Cơ sở Biên Hòa</option>
                  <option value="Cơ sở TP. Thủ Đức">Chỉ Cơ sở TP. Thủ Đức</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddArticleModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveArticle}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 shadow-sm"
              >
                Xuất Bản Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm Menu Item Mới */}
      {showAddMenuModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Thêm Liên Kết Menu ({selectedMenuLocation === 'header' ? 'Header' : 'Footer'})
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Tên Hiển Thị (Anchor Text)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đội Ngũ Giảng Viên"
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Đường Dẫn (URL hoặc Route)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: /giang-vien hoặc https://..."
                  value={newMenuUrl}
                  onChange={(e) => setNewMenuUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Mở Trong (Target)</label>
                <select
                  value={newMenuTarget}
                  onChange={(e) => setNewMenuTarget(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="_self">Tab hiện tại (_self)</option>
                  <option value="_blank">Tab mới (_blank)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddMenuModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveMenuItem}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 shadow-sm"
              >
                Lưu Liên Kết
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm Bản Dịch Mới */}
      {showAddTranslationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Thêm Khóa Dịch Đa Ngôn Ngữ</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Mã Khóa (Key ID)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: nav.tuition hoặc admissions.fee"
                  value={newTransKey}
                  onChange={(e) => setNewTransKey(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Chuyên Mục</label>
                <select
                  value={newTransCategory}
                  onChange={(e) => setNewTransCategory(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="nav">Điều hướng (nav)</option>
                  <option value="admissions">Tuyển sinh (admissions)</option>
                  <option value="common">Chung (common)</option>
                  <option value="search">Tìm kiếm (search)</option>
                  <option value="footer">Chân trang (footer)</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">🇻🇳 Nội Dung Tiếng Việt</label>
                <input
                  type="text"
                  placeholder="Nhập chuỗi tiếng Việt..."
                  value={newTransVi}
                  onChange={(e) => setNewTransVi(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">🇬🇧 English Content</label>
                <input
                  type="text"
                  placeholder="Enter English string..."
                  value={newTransEn}
                  onChange={(e) => setNewTransEn(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddTranslationModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveTranslation}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 shadow-sm"
              >
                Lưu Khóa Dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm Quản Trị Viên Mới */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Tạo Tài Khoản Quản Trị Viên Mới</h3>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Văn Nam"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Địa Chỉ Email</label>
                <input
                  type="email"
                  placeholder="nam.hoang@school.edu.vn"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Vai Trò (Role)</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="CAMPUS_DIRECTOR">🏫 Giám Đốc Cơ Sở (Campus Director)</option>
                  <option value="ADMISSIONS_OFFICER">🎯 Chuyên Viên Tuyển Sinh (Admissions Officer)</option>
                  <option value="CONTENT_EDITOR">✍️ Biên Tập Viên Nội Dung (Content Editor)</option>
                  <option value="SUPER_ADMIN">👑 Quản Trị Cấp Cao (Super Admin)</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Phạm Vi Cơ Sở (Campus Scope)</label>
                <select
                  value={newUserBranch}
                  onChange={(e) => setNewUserBranch(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="all">Toàn hệ thống (Global Scope)</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 shadow-sm"
              >
                Tạo Tài Khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: CHI TIẾT LEAD & CRM PIPELINE */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  {selectedLead.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedLead.parentName}</h3>
                <p className="text-xs text-slate-500">Đăng ký ngày: {selectedLead.date}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center font-bold"
              >
                &times;
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Lead Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Số điện thoại</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-semibold text-emerald-700 hover:underline">
                    📞 {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email</span>
                  <span className="font-semibold text-slate-800">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Học sinh ứng tuyển</span>
                  <span className="font-bold text-slate-900">{selectedLead.studentName}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Cấp lớp & Cơ sở</span>
                  <span className="font-semibold text-slate-800">{selectedLead.grade} • {selectedLead.branch}</span>
                </div>
              </div>

              {/* Status Workflow Selector */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                  Cập Nhật Trạng Thái Pipeline
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Mới', 'Đang tư vấn', 'Đã hẹn tham quan', 'Đã nhập học'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleChangeLeadStatus(selectedLead.id, st)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        selectedLead.status === st
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                  Nhật Ký Chăm Sóc & Lịch Sử Liên Hệ ({selectedLead.notes.length})
                </h4>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Nhập ghi chú mới (vd: Phụ huynh đồng ý tham quan thứ 7)..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLeadNote()}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <button
                    onClick={handleAddLeadNote}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shrink-0"
                  >
                    Ghi Chú
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedLead.notes.map((note, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span className="font-semibold text-slate-700">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LỊCH SỬ PHIÊN BẢN & ROLLBACK (PAGE REVISION HISTORY) */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shadow-sm">
                  📜
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Lịch Sử Phiên Bản & Rollback Trang</h3>
                  <p className="text-xs text-slate-500">
                    Mỗi lần bấm &ldquo;Xuất Bản&rdquo;, hệ thống tự động lưu snapshot blocks layout để khôi phục bất cứ lúc nào
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRevisionModal(false);
                  setInspectRevision(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {revisions.map((rev) => {
                const isCurrent =
                  blocks.length === rev.blocksSnapshot.length &&
                  blocks.every((b, i) => b.id === rev.blocksSnapshot[i]?.id);
                const isInspecting = inspectRevision?.id === rev.id;

                return (
                  <div
                    key={rev.id}
                    className={`border rounded-xl p-4 transition-all ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isCurrent
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-white'
                            }`}
                          >
                            v{rev.version}
                          </span>
                          {isCurrent && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              ● Đang áp dụng hiện tại
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-medium">
                            🕒 {rev.createdAt}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          {rev.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>Tác giả: <strong className="text-slate-700">{rev.author}</strong></span>
                          <span>•</span>
                          <span>Snapshot: <strong className="text-slate-700">{rev.blocksSnapshot.length} blocks</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                        <button
                          onClick={() => setInspectRevision(isInspecting ? null : rev)}
                          className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-100 transition-colors"
                        >
                          {isInspecting ? 'Ẩn chi tiết' : '🔍 Xem blocks'}
                        </button>
                        {!isCurrent && (
                          <button
                            onClick={() => handleRollbackRevision(rev)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1"
                          >
                            <span>↺</span> Khôi phục
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Block inspection accordion */}
                    {isInspecting && (
                      <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 rounded-lg p-3 space-y-2 text-xs">
                        <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                          Danh sách blocks trong snapshot phiên bản v{rev.version}:
                        </p>
                        <div className="space-y-1.5">
                          {rev.blocksSnapshot.map((b, idx) => (
                            <div
                              key={b.id || idx}
                              className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-slate-400 text-[10px]">#{idx + 1}</span>
                                <span className="font-semibold text-slate-800">{b.name}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                  {b.type}
                                </span>
                              </div>
                              <span className="text-slate-500 text-[11px] truncate max-w-[220px]">
                                {b.config.title || b.config.subtitle || 'Không có tiêu đề'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Tổng cộng <strong>{revisions.length}</strong> phiên bản snapshot trong lịch sử
              </span>
              <button
                onClick={() => {
                  setShowRevisionModal(false);
                  setInspectRevision(null);
                }}
                className="px-5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: THÊM TỆP MEDIA MỚI */}
      {showAddMediaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg">📤 Tải Lên Tệp Media Mới</h3>
              <button
                onClick={() => setShowAddMediaModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề / Tên mô tả *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Phòng Thí Nghiệm Hóa Sinh 2026"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đường dẫn CDN / URL File *</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/... hoặc /files/..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phân loại *</label>
                  <select
                    value={newMediaCategory}
                    onChange={(e: any) => setNewMediaCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                  >
                    <option value="image">🖼️ Hình ảnh (Image)</option>
                    <option value="document">📄 Tài liệu (Document)</option>
                    <option value="video">🎥 Video (Video clip)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tag Nhãn</label>
                  <input
                    type="text"
                    placeholder="Banner / Cơ sở / Học thuật"
                    value={newMediaTag}
                    onChange={(e) => setNewMediaTag(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thẻ Alt (Mô tả SEO / Trợ năng)</label>
                <input
                  type="text"
                  placeholder="Mô tả nội dung bức ảnh cho SEO & người khiếm thị"
                  value={newMediaAlt}
                  onChange={(e) => setNewMediaAlt(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddMediaModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!newMediaTitle || !newMediaUrl) {
                    showToast('Vui lòng nhập đầy đủ tiêu đề và URL');
                    return;
                  }
                  const newItem: any = {
                    id: `med-${Date.now()}`,
                    title: newMediaTitle,
                    type: newMediaCategory,
                    category: newMediaCategory,
                    size: '1.5 MB',
                    dimensions: newMediaCategory === 'image' ? '1920x1080' : 'N/A',
                    url: newMediaUrl,
                    tag: newMediaTag || 'Media',
                    altText: newMediaAlt || newMediaTitle,
                  };
                  if (newMediaCategory === 'image') {
                    newItem.variants = {
                      thumbnail: `${newMediaUrl}?w=150&q=80&format=webp`,
                      card_small: `${newMediaUrl}?w=480&q=80&format=webp`,
                      card_large: `${newMediaUrl}?w=800&q=85&format=webp`,
                      hero_full: `${newMediaUrl}?w=1920&q=90&format=webp`,
                    };
                  }
                  setMediaAssets([newItem, ...mediaAssets]);
                  setShowAddMediaModal(false);
                  setNewMediaTitle('');
                  setNewMediaUrl('');
                  setNewMediaAlt('');
                  addAuditLog({
                    action: 'CREATE',
                    entityType: 'ARTICLE',
                    entityTitle: newMediaTitle,
                    details: `Tải lên tệp media mới: ${newMediaTitle}`,
                  });
                  showToast('Đã tải lên và sinh 4 biến thể ảnh tối ưu WebP thành công!');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Lưu Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ĐĂNG KÝ WEBHOOK MỚI */}
      {showAddWebhookModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-lg">➕ Đăng Ký Webhook Mới</h3>
              <button
                onClick={() => setShowAddWebhookModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Webhook / Hệ Thống Đích *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: CRM HubSpot Admissions Lead Receiver"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Endpoint URL (HTTPS) *</label>
                <input
                  type="url"
                  placeholder="https://crm.yourcompany.com/webhook"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khóa Bí Mật Ký Số (Secret Key) *</label>
                <input
                  type="password"
                  placeholder="whsec_xxxxxxxxxxxxxxxxxxxxxx"
                  value={newWebhookSecret}
                  onChange={(e) => setNewWebhookSecret(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Dùng để tính toán HMAC-SHA256 xác thực chống giả mạo payload</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Đăng Ký Các Sự Kiện</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'lead.created', label: 'lead.created (Khi có phụ huynh nộp hồ sơ mới)' },
                    { id: 'lead.status_updated', label: 'lead.status_updated (Khi trạng thái tư vấn thay đổi)' },
                    { id: 'page.published', label: 'page.published (Khi trang chủ được xuất bản mới)' },
                  ].map((evt) => (
                    <label key={evt.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newWebhookEvents.includes(evt.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhookEvents([...newWebhookEvents, evt.id]);
                          } else {
                            setNewWebhookEvents(newWebhookEvents.filter((x) => x !== evt.id));
                          }
                        }}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{evt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddWebhookModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!newWebhookName || !newWebhookUrl || !newWebhookSecret) {
                    showToast('Vui lòng nhập đầy đủ Tên, URL và Khóa Secret');
                    return;
                  }
                  const newWh = {
                    id: `wh-${Date.now()}`,
                    name: newWebhookName,
                    url: newWebhookUrl,
                    secretMasked: 'whsec_••••••••••••' + newWebhookSecret.slice(-4),
                    events: newWebhookEvents.length > 0 ? newWebhookEvents : ['lead.created'],
                    isActive: true,
                    lastDelivery: 'Chưa gửi dữ liệu',
                    createdAt: new Date().toLocaleDateString('vi-VN'),
                  };
                  setWebhooks([...webhooks, newWh]);
                  setShowAddWebhookModal(false);
                  setNewWebhookName('');
                  setNewWebhookUrl('');
                  setNewWebhookSecret('');
                  addAuditLog({
                    action: 'CREATE',
                    entityType: 'ARTICLE',
                    entityTitle: newWebhookName,
                    details: `Đăng ký webhook mới: ${newWebhookName} trỏ tới ${newWebhookUrl}`,
                  });
                  showToast('Đăng ký Webhook thành công!');
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN PURGE ALL CACHE */}
      {showPurgeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-3xl mb-2">
              ⚠️
            </div>
            <h3 className="text-xl font-bold text-slate-900">Xác Nhận Xóa Trắng Toàn Bộ Bộ Nhớ Đệm?</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hành động này sẽ giải phóng toàn bộ dữ liệu đang lưu trong bộ nhớ đệm trên **Cloudflare Edge CDN**, **Next.js Data Cache** và **Redis Cluster**. Mọi truy vấn kế tiếp sẽ truy xuất trực tiếp vào CSDL để tái nạp dữ liệu tươi mới.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setCachedKeysList([]);
                  setCacheMetrics((prev) => ({ ...prev, totalKeys: 0, memoryEstimate: '0 KB' }));
                  const purgeLog = {
                    id: `rev-${Date.now()}`,
                    target: '*',
                    type: 'ALL',
                    purgedCount: cachedKeysList.length,
                    timestamp: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
                    triggeredBy: `${currentRole} (Purge All)`,
                  };
                  setRevalidationLogs([purgeLog, ...revalidationLogs]);
                  setShowPurgeModal(false);
                  showToast('Đã xóa trắng toàn bộ bộ nhớ đệm (Purge All) thành công!');
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Đồng Ý Xóa Trắng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
