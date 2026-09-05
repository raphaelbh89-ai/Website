export type AdmissionStatus =
  | 'HO_SO_MOI'
  | 'HEN_PHONG_VAN'
  | 'DA_TRUNG_TUYEN'
  | 'HOAN_TAT_HOC_PHI'
  | 'TU_CHOI';

export type StudentGradeLevel = 'mam_non' | 'tieu_hoc' | 'thcs' | 'thpt';

export interface AdmissionStudentInfo {
  fullName: string;
  dateOfBirth: string;
  gender: 'nam' | 'nu';
  currentSchool: string;
}

export interface AdmissionParentInfo {
  fullName: string;
  relationship: 'Bố' | 'Mẹ' | 'Người giám hộ';
  phone: string;
  email: string;
  address: string;
}

export interface AdmissionDocumentItem {
  id: string;
  name: string;
  type: 'birth_certificate' | 'transcript' | 'health_record' | 'certificate';
  url: string;
  verified: boolean;
}

export interface AdmissionApplication {
  id: string;
  code: string; // ví dụ: HS-2026-0001
  branchId: string;
  branchName: string;
  programType: 'cambridge_bilingual' | 'high_quality' | 'stem_integrated';
  programName: string;
  gradeLevel: StudentGradeLevel;
  gradeTarget: string; // ví dụ: Lớp 1, Lớp 6, Lớp 10
  studentInfo: AdmissionStudentInfo;
  parentInfo: AdmissionParentInfo;
  documents: AdmissionDocumentItem[];
  status: AdmissionStatus;
  interviewDate?: string | null;
  interviewNotes?: string | null;
  feePaid: boolean;
  feeAmount?: number;
  notes?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface AdmissionMetrics {
  total: number;
  byStatus: Record<AdmissionStatus, number>;
  interviewRate: number; // Tỷ lệ hẹn phỏng vấn (%)
  acceptanceRate: number; // Tỷ lệ trúng tuyển (%)
  conversionRate: number; // Tỷ lệ nhập học hoàn tất (%)
}

/**
 * Tự động tạo mã hồ sơ tuyển sinh điện tử chuẩn định dạng
 */
export function generateApplicationCode(seq: number, year: number = 2026): string {
  return `HS-${year}-${String(seq).padStart(4, '0')}`;
}

/**
 * Tính toán các chỉ số KPI chuyển đổi của quy trình tuyển sinh
 */
export function calculateAdmissionMetrics(applications: AdmissionApplication[]): AdmissionMetrics {
  const total = applications.length;
  const byStatus: Record<AdmissionStatus, number> = {
    HO_SO_MOI: 0,
    HEN_PHONG_VAN: 0,
    DA_TRUNG_TUYEN: 0,
    HOAN_TAT_HOC_PHI: 0,
    TU_CHOI: 0,
  };

  for (const app of applications) {
    if (byStatus[app.status] !== undefined) {
      byStatus[app.status]++;
    }
  }

  if (total === 0) {
    return {
      total: 0,
      byStatus,
      interviewRate: 0,
      acceptanceRate: 0,
      conversionRate: 0,
    };
  }

  // Phỏng vấn = HEN_PHONG_VAN + DA_TRUNG_TUYEN + HOAN_TAT_HOC_PHI
  const interviewed = byStatus.HEN_PHONG_VAN + byStatus.DA_TRUNG_TUYEN + byStatus.HOAN_TAT_HOC_PHI;
  // Trúng tuyển = DA_TRUNG_TUYEN + HOAN_TAT_HOC_PHI
  const accepted = byStatus.DA_TRUNG_TUYEN + byStatus.HOAN_TAT_HOC_PHI;
  // Nhập học hoàn tất = HOAN_TAT_HOC_PHI
  const enrolled = byStatus.HOAN_TAT_HOC_PHI;

  return {
    total,
    byStatus,
    interviewRate: Math.round((interviewed / total) * 1000) / 10,
    acceptanceRate: Math.round((accepted / total) * 1000) / 10,
    conversionRate: Math.round((enrolled / total) * 1000) / 10,
  };
}

/**
 * Tên nhãn tiếng Việt cho từng trạng thái hồ sơ tuyển sinh
 */
export const ADMISSION_STATUS_LABELS: Record<AdmissionStatus, { label: string; color: string; bg: string; border: string }> = {
  HO_SO_MOI: {
    label: 'Hồ Sơ Mới Nộp',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  HEN_PHONG_VAN: {
    label: 'Hẹn Phỏng Vấn / ĐGNL',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  DA_TRUNG_TUYEN: {
    label: 'Đã Trúng Tuyển',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  HOAN_TAT_HOC_PHI: {
    label: 'Đã Nhập Học (Hoàn Tất)',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  TU_CHOI: {
    label: 'Từ Chối / Rút Hồ Sơ',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
};
