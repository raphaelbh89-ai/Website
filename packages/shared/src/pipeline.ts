export type LeadPipelineStatus = 'Mới' | 'Đang tư vấn' | 'Đã hẹn tham quan' | 'Đã nhập học' | 'Spam';

export interface PipelineLeadItem {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  studentName: string;
  grade: string;
  branch: string;
  branchId?: string;
  date: string;
  status: LeadPipelineStatus;
  notes: Array<{ text: string; author: string; date: string }>;
}

export interface PipelineStageConfig {
  key: LeadPipelineStatus;
  label: string;
  badgeColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    key: 'Mới',
    label: 'Hồ Sơ Mới',
    badgeColor: 'bg-blue-100 text-blue-800',
    bgColor: 'bg-blue-50/50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: '📥',
  },
  {
    key: 'Đang tư vấn',
    label: 'Đang Tư Vấn',
    badgeColor: 'bg-amber-100 text-amber-800',
    bgColor: 'bg-amber-50/50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    icon: '💬',
  },
  {
    key: 'Đã hẹn tham quan',
    label: 'Đã Hẹn Tham Quan',
    badgeColor: 'bg-purple-100 text-purple-800',
    bgColor: 'bg-purple-50/50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    icon: '🏫',
  },
  {
    key: 'Đã nhập học',
    label: 'Đã Nhập Học',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    bgColor: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    icon: '🎉',
  },
];

/**
 * Returns the next logical status in the admissions pipeline
 */
export function getNextPipelineStatus(current: LeadPipelineStatus): LeadPipelineStatus | null {
  switch (current) {
    case 'Mới':
      return 'Đang tư vấn';
    case 'Đang tư vấn':
      return 'Đã hẹn tham quan';
    case 'Đã hẹn tham quan':
      return 'Đã nhập học';
    default:
      return null;
  }
}

/**
 * Groups leads into pipeline stages
 */
export function groupLeadsByPipelineStage(leads: PipelineLeadItem[]): Record<LeadPipelineStatus, PipelineLeadItem[]> {
  const initial: Record<LeadPipelineStatus, PipelineLeadItem[]> = {
    'Mới': [],
    'Đang tư vấn': [],
    'Đã hẹn tham quan': [],
    'Đã nhập học': [],
    'Spam': [],
  };

  return leads.reduce((acc, lead) => {
    const status = lead.status || 'Mới';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(lead);
    return acc;
  }, initial);
}

/**
 * Calculates conversion metrics for admissions leads
 */
export function calculatePipelineMetrics(leads: PipelineLeadItem[]) {
  const total = leads.filter((l) => l.status !== 'Spam').length;
  const enrolled = leads.filter((l) => l.status === 'Đã nhập học').length;
  const inProgress = leads.filter((l) => l.status === 'Đang tư vấn' || l.status === 'Đã hẹn tham quan').length;
  const newLeads = leads.filter((l) => l.status === 'Mới').length;
  const conversionRate = total > 0 ? Math.round((enrolled / total) * 1000) / 10 : 0;

  return {
    total,
    enrolled,
    inProgress,
    newLeads,
    conversionRate, // e.g. 25.5 (%)
  };
}
