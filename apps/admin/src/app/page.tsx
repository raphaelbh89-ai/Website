'use client';

import React, { useState } from 'react';
import { BlockRegistry } from '@school-cms/cms';
import '@school-cms/blocks';

interface BlockItem {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
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
  entityType: 'PAGE' | 'ARTICLE' | 'BRANCH' | 'LEAD' | 'THEME' | 'FORM';
  entityTitle: string;
  details?: string;
}

export default function AdminDashboard() {
  // Current user role switcher for testing RBAC
  const [currentRole, setCurrentRole] = useState<'SUPER_ADMIN' | 'CAMPUS_DIRECTOR' | 'ADMISSIONS_OFFICER'>('SUPER_ADMIN');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'pages' | 'branches' | 'articles' | 'leads' | 'theme' | 'forms' | 'media' | 'audit'>('pages');

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

  // Media Library state
  const [mediaAssets, setMediaAssets] = useState([
    { id: 'med-1', title: 'Banner Mùa Tuyển Sinh', type: 'image', size: '1.2 MB', dimensions: '1920x1080', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1', tag: 'Banner' },
    { id: 'med-2', title: 'Khuôn viên Cơ sở Biên Hòa', type: 'image', size: '2.4 MB', dimensions: '2400x1600', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b', tag: 'Cơ sở' },
    { id: 'med-3', title: 'Phòng Thí Nghiệm STEM Robotics', type: 'image', size: '1.8 MB', dimensions: '2000x1333', url: 'https://images.unsplash.com/photo-1562774053-701939374585', tag: 'Cơ sở' },
    { id: 'med-4', title: 'Cẩm Nang Tuyển Sinh 2025.pdf', type: 'document', size: '4.5 MB', dimensions: 'PDF File', url: '/files/cam-nang-tuyen-sinh-2025.pdf', tag: 'Tài liệu' },
  ]);

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
    setIsPublished(true);
    addAuditLog({ action: 'PUBLISH', entityType: 'PAGE', entityTitle: 'Trang Chủ Alpha School', details: 'Xuất bản và đẩy Edge Cache' });
    showToast('Xuất bản thành công! Nội dung đã sẵn sàng trên toàn hệ thống.');
    setTimeout(() => setIsPublished(false), 3000);
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
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'media' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🖼️</span> Thư viện Media ({mediaAssets.length})
          </button>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-4 pb-1">
            Bảo mật & Giám sát
          </div>
          <button
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'audit' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🛡️</span> Nhật ký Audit Logs ({auditLogs.length})
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
              {activeTab === 'theme' && 'Tùy Biến Giao Diện Đa Cơ Sở (Theme Customizer)'}
              {activeTab === 'forms' && 'Trình Thiết Kế Biểu Mẫu Động (Dynamic Form Builder)'}
              {activeTab === 'media' && 'Thư Viện Tệp Tin Đa Phương Tiện (Media Asset Hub)'}
              {activeTab === 'audit' && 'Nhật Ký Kiểm Toán & Giám Sát Hệ Thống (Audit Logs)'}
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
              <button
                onClick={handlePublish}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
              >
                🚀 Xuất Bản (Publish)
              </button>
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
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-4">
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
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">CRM Tuyển Sinh & Quản Lý Khách Hàng Tiềm Năng</h3>
                  <p className="text-sm text-slate-500">
                    Bấm vào từng hồ sơ để cập nhật quy trình tư vấn, lịch hẹn tham quan và ghi chú tương tác.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addAuditLog({ action: 'EXPORT', entityType: 'LEAD', entityTitle: 'Danh sách Leads Tuyển sinh', details: 'Xuất file Excel' });
                      showToast('Đang xuất tệp Excel danh sách hồ sơ tuyển sinh...');
                    }}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-2"
                  >
                    📥 Xuất Excel
                  </button>
                </div>
              </div>

              {/* Status Pipeline Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Hồ Sơ Mới', count: leads.filter(l => l.status === 'Mới').length, color: 'bg-blue-50 border-blue-200 text-blue-800' },
                  { label: 'Đang Tư Vấn', count: leads.filter(l => l.status === 'Đang tư vấn').length, color: 'bg-amber-50 border-amber-200 text-amber-800' },
                  { label: 'Đã Hẹn Tham Quan', count: leads.filter(l => l.status === 'Đã hẹn tham quan').length, color: 'bg-purple-50 border-purple-200 text-purple-800' },
                  { label: 'Đã Nhập Học', count: leads.filter(l => l.status === 'Đã nhập học').length, color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                ].map((s, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${s.color} flex justify-between items-center shadow-sm`}>
                    <span className="text-sm font-semibold">{s.label}</span>
                    <span className="text-2xl font-black">{s.count}</span>
                  </div>
                ))}
              </div>

              {/* Leads Table */}
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
            </div>
          </div>
        )}

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

        {/* TAB 7: MEDIA ASSET HUB */}
        {activeTab === 'media' && (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Thư Viện Media Đa Phương Tiện</h3>
                  <p className="text-sm text-slate-500">Tải lên, quản lý và tối ưu hóa hình ảnh, video và tài liệu trường học.</p>
                </div>
                <button
                  onClick={() => showToast('Mô phỏng: Đã chọn tệp tải lên và nén tự động WebP')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2"
                >
                  📤 Tải Tệp Lên
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {mediaAssets.map((med) => (
                  <div key={med.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                    <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {med.type === 'image' ? (
                        <img src={med.url} alt={med.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-4xl text-slate-400">📄</div>
                      )}
                      <span className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] px-2 py-0.5 rounded font-semibold backdrop-blur-sm">
                        {med.tag}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm truncate" title={med.title}>
                          {med.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {med.dimensions} • {med.size}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => showToast(`Đã sao chép liên kết: ${med.url}`)}
                          className="text-xs font-semibold text-emerald-700 hover:underline"
                        >
                          Sao chép URL
                        </button>
                        <button
                          onClick={() => {
                            setMediaAssets(mediaAssets.filter(m => m.id !== med.id));
                            showToast('Đã xóa tệp media');
                          }}
                          className="text-slate-400 hover:text-red-600 text-xs"
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
    </div>
  );
}
