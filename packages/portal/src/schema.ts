import { z } from 'zod';

export const AttendanceStatusSchema = z.enum([
  'CO_MAT',
  'VANG_CO_PHEP',
  'VANG_KHONG_PHEP',
  'DI_MUON',
]);

export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, { label: string; badgeColor: string; icon: string }> = {
  CO_MAT: { label: 'Có mặt', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅' },
  VANG_CO_PHEP: { label: 'Vắng có phép', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200', icon: '📝' },
  VANG_KHONG_PHEP: { label: 'Vắng không phép', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200', icon: '❌' },
  DI_MUON: { label: 'Đi muộn', badgeColor: 'bg-orange-50 text-orange-700 border-orange-200', icon: '⏰' },
};

export const StudentProfileSchema = z.object({
  id: z.string(),
  studentCode: z.string(), // ví dụ: 'AS-2026-0881'
  fullName: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(['nam', 'nu']),
  avatarUrl: z.string().optional(),
  grade: z.string(), // ví dụ: 'Khối 6'
  className: z.string(), // ví dụ: '6A1 - Cambridge'
  branchId: z.string(),
  branchName: z.string(),
  enrollmentDate: z.string(),
  status: z.enum(['ACTIVE', 'LEAVE', 'GRADUATED']).default('ACTIVE'),
  academicAdvisor: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
  }),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;

export const ParentRelationshipSchema = z.enum(['bo', 'me', 'giam_ho']);
export type ParentRelationship = z.infer<typeof ParentRelationshipSchema>;

export const ParentStudentRelationSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  parentName: z.string(),
  parentPhone: z.string(),
  parentEmail: z.string(),
  studentId: z.string(),
  relationship: ParentRelationshipSchema,
  isPrimaryContact: z.boolean().default(true),
});

export type ParentStudentRelation = z.infer<typeof ParentStudentRelationSchema>;

export const AttendanceRecordSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  date: z.string(), // YYYY-MM-DD
  status: AttendanceStatusSchema,
  timeIn: z.string().optional(), // '07:45'
  timeOut: z.string().optional(), // '16:30'
  note: z.string().optional(),
});

export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;

export const SubjectScoreSchema = z.object({
  subjectCode: z.string(),
  subjectName: z.string(),
  credit: z.number().default(1),
  oralScore: z.number().min(0).max(10), // Miệng (hs 1)
  test15m: z.number().min(0).max(10), // 15 phút (hs 1)
  test45m: z.number().min(0).max(10), // 1 tiết (hs 2)
  semesterExam: z.number().min(0).max(10), // Cuối kỳ (hs 3)
  finalScore: z.number().min(0).max(10), // Tổng kết môn
  letterGrade: z.string(), // 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D'
  teacherComment: z.string().default('Tiếp thu tốt, tích cực phát biểu'),
});

export type SubjectScore = z.infer<typeof SubjectScoreSchema>;

export const AcademicReportCardSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  semester: z.enum(['HK1', 'HK2', 'CA_NAM']),
  academicYear: z.string(), // '2025-2026'
  gpa: z.number().min(0).max(10),
  conduct: z.enum(['TOT', 'KHA', 'TRUNG_BINH']),
  ranking: z.number(),
  totalStudentsInClass: z.number(),
  subjects: z.array(SubjectScoreSchema),
  homeroomTeacherComment: z.string(),
});

export type AcademicReportCard = z.infer<typeof AcademicReportCardSchema>;

export const TimetableSlotSchema = z.object({
  id: z.string(),
  className: z.string(),
  dayOfWeek: z.number().min(2).max(6), // 2 = Thứ 2, 6 = Thứ 6
  period: z.number().min(1).max(8), // Tiết 1 đến Tiết 8
  startTime: z.string(),
  endTime: z.string(),
  subjectName: z.string(),
  teacherName: z.string(),
  room: z.string(),
});

export type TimetableSlot = z.infer<typeof TimetableSlotSchema>;

export const SchoolNoticeSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(['academic', 'tuition', 'event', 'safety', 'general']),
  publishedAt: z.string(),
  content: z.string(),
  branchId: z.string().nullable().optional(), // null = thông báo toàn trường
  isUrgent: z.boolean().default(false),
  attachments: z.array(z.string()).optional(),
});

export type SchoolNotice = z.infer<typeof SchoolNoticeSchema>;
