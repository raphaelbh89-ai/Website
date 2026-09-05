import { z } from 'zod';
import { AdmissionApplication, generateApplicationCode } from '@school-cms/shared';

export const AdmissionStep1StudentSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên học sinh phải có ít nhất 2 ký tự'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/, 'Ngày sinh không đúng định dạng (YYYY-MM-DD hoặc DD/MM/YYYY)'),
  gender: z.enum(['nam', 'nu'], { errorMap: () => ({ message: 'Vui lòng chọn giới tính' }) }),
  currentSchool: z.string().min(2, 'Vui lòng nhập trường học hiện tại'),
});

export const AdmissionStep2ParentSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phụ huynh phải có ít nhất 2 ký tự'),
  relationship: z.enum(['Bố', 'Mẹ', 'Người giám hộ'], { errorMap: () => ({ message: 'Vui lòng chọn mối quan hệ' }) }),
  phone: z.string().regex(/^[0-9+ \-.()]{8,20}$/, 'Số điện thoại phụ huynh không hợp lệ'),
  email: z.string().email('Địa chỉ email không đúng định dạng'),
  address: z.string().min(5, 'Vui lòng cung cấp địa chỉ liên hệ chi tiết'),
});

export const AdmissionStep3DocumentSchema = z.object({
  documents: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['birth_certificate', 'transcript', 'health_record', 'certificate']),
      url: z.string().url('Đường dẫn tài liệu không hợp lệ'),
      verified: z.boolean().default(false),
    })
  ).min(1, 'Hồ sơ tuyển sinh yêu cầu ít nhất 1 tài liệu đính kèm (Giấy khai sinh hoặc Học bạ)'),
});

export const AdmissionStep4ProgramSchema = z.object({
  branchId: z.string().min(1, 'Vui lòng chọn cơ sở đào tạo dự tuyển'),
  branchName: z.string().min(1, 'Tên cơ sở không được để trống'),
  programType: z.enum(['cambridge_bilingual', 'high_quality', 'stem_integrated'], {
    errorMap: () => ({ message: 'Vui lòng chọn hệ đào tạo' }),
  }),
  programName: z.string().min(1, 'Tên chương trình không được để trống'),
  gradeLevel: z.enum(['mam_non', 'tieu_hoc', 'thcs', 'thpt'], {
    errorMap: () => ({ message: 'Vui lòng chọn khối học' }),
  }),
  gradeTarget: z.string().min(1, 'Vui lòng chọn lớp học đăng ký dự tuyển'),
  notes: z.string().optional(),
});

export const CompleteAdmissionFormSchema = z.object({
  studentInfo: AdmissionStep1StudentSchema,
  parentInfo: AdmissionStep2ParentSchema,
  documents: AdmissionStep3DocumentSchema.shape.documents,
  programInfo: AdmissionStep4ProgramSchema,
});

export type AdmissionStep1Data = z.infer<typeof AdmissionStep1StudentSchema>;
export type AdmissionStep2Data = z.infer<typeof AdmissionStep2ParentSchema>;
export type AdmissionStep3Data = z.infer<typeof AdmissionStep3DocumentSchema>;
export type AdmissionStep4Data = z.infer<typeof AdmissionStep4ProgramSchema>;
export type CompleteAdmissionFormData = z.infer<typeof CompleteAdmissionFormSchema>;

/**
 * Kiểm định hợp lệ dữ liệu theo từng bước trong Form Wizard tuyển sinh
 */
export function validateAdmissionStep(stepIndex: number, data: any) {
  switch (stepIndex) {
    case 1:
      return AdmissionStep1StudentSchema.safeParse(data);
    case 2:
      return AdmissionStep2ParentSchema.safeParse(data);
    case 3:
      return AdmissionStep3DocumentSchema.safeParse(data);
    case 4:
      return AdmissionStep4ProgramSchema.safeParse(data);
    default:
      throw new Error(`Bước không hợp lệ: ${stepIndex}`);
  }
}

/**
 * Thẩm định toàn bộ hồ sơ tuyển sinh trước khi lưu vào CSDL
 */
export function validateCompleteAdmission(data: any) {
  return CompleteAdmissionFormSchema.safeParse(data);
}

/**
 * Khởi tạo hồ sơ tuyển sinh hoàn chỉnh từ dữ liệu Form
 */
export function createAdmissionApplication(
  data: CompleteAdmissionFormData,
  sequenceNumber: number
): AdmissionApplication {
  const now = new Date().toISOString();
  return {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    code: generateApplicationCode(sequenceNumber),
    branchId: data.programInfo.branchId,
    branchName: data.programInfo.branchName,
    programType: data.programInfo.programType,
    programName: data.programInfo.programName,
    gradeLevel: data.programInfo.gradeLevel,
    gradeTarget: data.programInfo.gradeTarget,
    studentInfo: data.studentInfo,
    parentInfo: data.parentInfo,
    documents: data.documents,
    status: 'HO_SO_MOI',
    feePaid: false,
    notes: data.programInfo.notes,
    submittedAt: now,
    updatedAt: now,
  };
}
