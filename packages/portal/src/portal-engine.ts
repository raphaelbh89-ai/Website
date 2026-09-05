import {
  StudentProfile,
  ParentStudentRelation,
  AttendanceRecord,
  AcademicReportCard,
  TimetableSlot,
  SchoolNotice,
} from './schema';
import { calculateAttendanceStats } from './attendance-engine';
import { calculateGpa, getAcademicStanding } from './academic-engine';

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'stu-001',
    studentCode: 'AS-2026-0881',
    fullName: 'Nguyễn Văn An',
    dateOfBirth: '2014-04-15',
    gender: 'nam',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    grade: 'Khối 6',
    className: '6A1 - Cambridge Song Ngữ',
    branchId: 'bien-hoa',
    branchName: 'Alpha School Biên Hòa',
    enrollmentDate: '2020-09-01',
    status: 'ACTIVE',
    academicAdvisor: {
      name: 'Cô Trần Thị Mai (GVCN)',
      phone: '0912 345 678',
      email: 'mai.tran@alphaschool.edu.vn',
    },
  },
  {
    id: 'stu-002',
    studentCode: 'AS-2026-0882',
    fullName: 'Nguyễn Thị Bình',
    dateOfBirth: '2010-11-20',
    gender: 'nu',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    grade: 'Khối 10',
    className: '10A2 - Quốc Tế IB',
    branchId: 'bien-hoa',
    branchName: 'Alpha School Biên Hòa',
    enrollmentDate: '2023-09-01',
    status: 'ACTIVE',
    academicAdvisor: {
      name: 'Thầy Lê Hoàng Nam (GVCN)',
      phone: '0988 765 432',
      email: 'nam.le@alphaschool.edu.vn',
    },
  },
  {
    id: 'stu-003',
    studentCode: 'AS-2026-0905',
    fullName: 'Trần Bảo Ngọc',
    dateOfBirth: '2019-02-18',
    gender: 'nu',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    grade: 'Khối 2',
    className: '2B3 - Song Ngữ Tăng Cường',
    branchId: 'thu-duc',
    branchName: 'Alpha School TP. Thủ Đức',
    enrollmentDate: '2024-09-01',
    status: 'ACTIVE',
    academicAdvisor: {
      name: 'Cô Vũ Minh Hằng',
      phone: '0903 112 233',
      email: 'hang.vu@alphaschool.edu.vn',
    },
  },
];

export const INITIAL_PARENT_RELATIONS: ParentStudentRelation[] = [
  {
    id: 'rel-001',
    parentId: 'usr-parent-01',
    parentName: 'Nguyễn Văn Hùng',
    parentPhone: '0909 123 456',
    parentEmail: 'hung.nguyen@gmail.com',
    studentId: 'stu-001',
    relationship: 'bo',
    isPrimaryContact: true,
  },
  {
    id: 'rel-002',
    parentId: 'usr-parent-01',
    parentName: 'Nguyễn Văn Hùng',
    parentPhone: '0909 123 456',
    parentEmail: 'hung.nguyen@gmail.com',
    studentId: 'stu-002',
    relationship: 'bo',
    isPrimaryContact: true,
  },
  {
    id: 'rel-003',
    parentId: 'usr-parent-02',
    parentName: 'Trần Quốc Tuấn',
    parentPhone: '0918 888 999',
    parentEmail: 'tuan.tran@gmail.com',
    studentId: 'stu-003',
    relationship: 'bo',
    isPrimaryContact: true,
  },
];

export const INITIAL_ATTENDANCES: AttendanceRecord[] = [
  // Tháng 9/2026 cho học sinh stu-001 (Nguyễn Văn An)
  { id: 'att-01', studentId: 'stu-001', date: '2026-09-01', status: 'CO_MAT', timeIn: '07:40', timeOut: '16:30' },
  { id: 'att-02', studentId: 'stu-001', date: '2026-09-02', status: 'CO_MAT', timeIn: '07:35', timeOut: '16:30' },
  { id: 'att-03', studentId: 'stu-001', date: '2026-09-03', status: 'CO_MAT', timeIn: '07:42', timeOut: '16:35' },
  { id: 'att-04', studentId: 'stu-001', date: '2026-09-04', status: 'DI_MUON', timeIn: '08:05', timeOut: '16:30', note: 'Kẹt xe cầu Hóa An' },
  { id: 'att-05', studentId: 'stu-001', date: '2026-09-05', status: 'CO_MAT', timeIn: '07:38', timeOut: '16:30' },
  { id: 'att-06', studentId: 'stu-001', date: '2026-09-08', status: 'CO_MAT', timeIn: '07:40', timeOut: '16:30' },
  { id: 'att-07', studentId: 'stu-001', date: '2026-09-09', status: 'VANG_CO_PHEP', note: 'Gia đình xin phép đi khám răng' },
  { id: 'att-08', studentId: 'stu-001', date: '2026-09-10', status: 'CO_MAT', timeIn: '07:35', timeOut: '16:30' },
  { id: 'att-09', studentId: 'stu-001', date: '2026-09-11', status: 'CO_MAT', timeIn: '07:44', timeOut: '16:30' },
  { id: 'att-10', studentId: 'stu-001', date: '2026-09-12', status: 'CO_MAT', timeIn: '07:36', timeOut: '16:30' },

  // Học sinh stu-002 (Nguyễn Thị Bình)
  { id: 'att-11', studentId: 'stu-002', date: '2026-09-01', status: 'CO_MAT', timeIn: '07:20', timeOut: '17:00' },
  { id: 'att-12', studentId: 'stu-002', date: '2026-09-02', status: 'CO_MAT', timeIn: '07:25', timeOut: '17:00' },
  { id: 'att-13', studentId: 'stu-002', date: '2026-09-03', status: 'CO_MAT', timeIn: '07:22', timeOut: '17:00' },
  { id: 'att-14', studentId: 'stu-002', date: '2026-09-04', status: 'CO_MAT', timeIn: '07:20', timeOut: '17:00' },
  { id: 'att-15', studentId: 'stu-002', date: '2026-09-05', status: 'CO_MAT', timeIn: '07:28', timeOut: '17:00' },
];

export const INITIAL_REPORT_CARDS: AcademicReportCard[] = [
  {
    id: 'rc-001',
    studentId: 'stu-001',
    semester: 'HK1',
    academicYear: '2025-2026',
    gpa: 8.8,
    conduct: 'TOT',
    ranking: 3,
    totalStudentsInClass: 32,
    homeroomTeacherComment: 'Em An chăm ngoan, có tư duy logic toán học xuất sắc và hòa đồng với bạn bè.',
    subjects: [
      {
        subjectCode: 'MATH',
        subjectName: 'Toán Học & Tư Duy',
        credit: 4,
        oralScore: 9.0,
        test15m: 9.5,
        test45m: 9.0,
        semesterExam: 9.0,
        finalScore: 9.1,
        letterGrade: 'A+',
        teacherComment: 'Tư duy logic nhạy bén, giải toán nâng cao rất tốt',
      },
      {
        subjectCode: 'ENG_CAM',
        subjectName: 'Tiếng Anh Cambridge ESL',
        credit: 4,
        oralScore: 9.5,
        test15m: 9.0,
        test45m: 8.5,
        semesterExam: 9.0,
        finalScore: 8.9,
        letterGrade: 'A',
        teacherComment: 'Kỹ năng thuyết trình và phát âm tự nhiên, vốn từ phong phú',
      },
      {
        subjectCode: 'LIT',
        subjectName: 'Ngữ Văn & Kỹ Năng Đọc',
        credit: 3,
        oralScore: 8.0,
        test15m: 8.5,
        test45m: 8.0,
        semesterExam: 8.5,
        finalScore: 8.3,
        letterGrade: 'A',
        teacherComment: 'Cảm thụ văn học tốt, bài viết có chiều sâu cảm xúc',
      },
      {
        subjectCode: 'SCI',
        subjectName: 'Khoa Học Tự Nhiên (STEM)',
        credit: 3,
        oralScore: 9.0,
        test15m: 9.0,
        test45m: 8.5,
        semesterExam: 9.0,
        finalScore: 8.9,
        letterGrade: 'A',
        teacherComment: 'Nhiệt tình tham gia các dự án thí nghiệm nhóm',
      },
      {
        subjectCode: 'ICT',
        subjectName: 'Tin Học & Lập Trình Python',
        credit: 2,
        oralScore: 10.0,
        test15m: 9.5,
        test45m: 9.0,
        semesterExam: 9.5,
        finalScore: 9.4,
        letterGrade: 'A+',
        teacherComment: 'Khả năng viết code thuật toán và tư duy máy tính nổi trội',
      },
    ],
  },
  {
    id: 'rc-002',
    studentId: 'stu-002',
    semester: 'HK1',
    academicYear: '2025-2026',
    gpa: 9.2,
    conduct: 'TOT',
    ranking: 1,
    totalStudentsInClass: 28,
    homeroomTeacherComment: 'Bình là lớp trưởng gương mẫu, học lực xuất sắc toàn diện và tích cực hoạt động ngoại khóa.',
    subjects: [
      {
        subjectCode: 'IB_MATH',
        subjectName: 'IB Mathematics: Analysis & Approaches',
        credit: 4,
        oralScore: 9.5,
        test15m: 9.5,
        test45m: 9.0,
        semesterExam: 9.5,
        finalScore: 9.3,
        letterGrade: 'A+',
        teacherComment: 'Nắm vững giải tích và thống kê toán ứng dụng',
      },
      {
        subjectCode: 'IB_ENG',
        subjectName: 'IB English Language & Literature',
        credit: 4,
        oralScore: 9.0,
        test15m: 9.0,
        test45m: 9.5,
        semesterExam: 9.0,
        finalScore: 9.1,
        letterGrade: 'A+',
        teacherComment: 'Kỹ năng phân tích văn bản học thuật xuất sắc',
      },
    ],
  },
];

export const INITIAL_TIMETABLES: TimetableSlot[] = [
  // Thứ 2
  { id: 'tt-01', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 2, period: 1, startTime: '07:45', endTime: '08:30', subjectName: 'Chào cờ & Sinh hoạt đầu tuần', teacherName: 'BGH & GVCN', room: 'Sân Đại Lễ' },
  { id: 'tt-02', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 2, period: 2, startTime: '08:35', endTime: '09:20', subjectName: 'Toán Học', teacherName: 'Thầy Hoàng Văn Đức', room: 'Phòng 301' },
  { id: 'tt-03', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 2, period: 3, startTime: '09:35', endTime: '10:20', subjectName: 'Tiếng Anh Cambridge', teacherName: 'Mr. David Smith', room: 'Phòng 301' },
  { id: 'tt-04', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 2, period: 4, startTime: '10:25', endTime: '11:10', subjectName: 'Khoa Học STEM', teacherName: 'Cô Lê Thu Hà', room: 'Lab STEM 2' },
  // Thứ 3
  { id: 'tt-05', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 3, period: 1, startTime: '07:45', endTime: '08:30', subjectName: 'Ngữ Văn', teacherName: 'Cô Trần Thị Mai', room: 'Phòng 301' },
  { id: 'tt-06', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 3, period: 2, startTime: '08:35', endTime: '09:20', subjectName: 'Ngữ Văn', teacherName: 'Cô Trần Thị Mai', room: 'Phòng 301' },
  { id: 'tt-07', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 3, period: 3, startTime: '09:35', endTime: '10:20', subjectName: 'Tin Học Python', teacherName: 'Thầy Nguyễn Quốc Cường', room: 'Lab IT 1' },
  { id: 'tt-08', className: '6A1 - Cambridge Song Ngữ', dayOfWeek: 3, period: 4, startTime: '10:25', endTime: '11:10', subjectName: 'Giáo Dục Thể Chất (Bơi Lội)', teacherName: 'Thầy Phạm Hùng', room: 'Hồ Bơi Alpha' },
];

export const INITIAL_NOTICES: SchoolNotice[] = [
  {
    id: 'not-001',
    title: 'Thông báo Họp Phụ Huynh Đầu Năm Học 2026-2027',
    category: 'academic',
    publishedAt: '2026-09-02T08:00:00Z',
    content: 'Ban Giám Hiệu Alpha School kính mời Quý Phụ Huynh tham dự buổi Gặp mặt định hướng đầu năm học vào lúc 08:30 sáng Chủ Nhật ngày 13/09/2026 tại Hội trường tầng 3.',
    branchId: null, // Toàn hệ thống
    isUrgent: true,
  },
  {
    id: 'not-002',
    title: 'Kế hoạch Khám Sức Khỏe Định Kỳ Năm Học 2026-2027',
    category: 'safety',
    publishedAt: '2026-09-04T10:00:00Z',
    content: 'Phòng Y tế nhà trường phối hợp cùng Bệnh viện Quốc tế tổ chức khám chuyên khoa mắt, răng hàm mặt và dinh dưỡng cho toàn thể học sinh khối 6 từ ngày 15/09/2026.',
    branchId: 'bien-hoa',
    isUrgent: false,
  },
  {
    id: 'not-003',
    title: 'Thông báo Lịch Thi Học Kỳ 1 & Kế Hoạch Ôn Tập Cambridge',
    category: 'academic',
    publishedAt: '2026-09-05T14:30:00Z',
    content: 'Kế hoạch kiểm tra học kỳ 1 sẽ diễn ra từ ngày 15/12 đến 22/12/2026. Phụ huynh vui lòng xem chi tiết thời khóa biểu ôn tập và dặn dò của giáo viên bộ môn.',
    branchId: null,
    isUrgent: false,
  },
];

/**
 * Tìm danh sách học sinh thuộc quyền giám hộ của phụ huynh (theo Phone hoặc Email hoặc ParentId)
 */
export function getStudentsByParent(
  identifier: string,
  students: StudentProfile[] = INITIAL_STUDENTS,
  relations: ParentStudentRelation[] = INITIAL_PARENT_RELATIONS
): StudentProfile[] {
  const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, '');
  const matchedRelations = relations.filter(
    (r) =>
      r.parentId.toLowerCase() === cleanId ||
      r.parentPhone.replace(/\s+/g, '') === cleanId ||
      r.parentEmail.toLowerCase() === cleanId
  );

  const studentIds = new Set(matchedRelations.map((r) => r.studentId));
  return students.filter((s) => studentIds.has(s.id));
}

/**
 * Kiểm tra xem phụ huynh có quyền truy cập thông tin của học sinh mục tiêu hay không (Parent Scoping Guard)
 */
export function canParentAccessStudent(
  parentIdOrPhone: string,
  targetStudentId: string,
  relations: ParentStudentRelation[] = INITIAL_PARENT_RELATIONS
): boolean {
  const cleanId = parentIdOrPhone.trim().toLowerCase().replace(/\s+/g, '');
  return relations.some(
    (r) =>
      (r.parentId.toLowerCase() === cleanId ||
        r.parentPhone.replace(/\s+/g, '') === cleanId ||
        r.parentEmail.toLowerCase() === cleanId) &&
      r.studentId === targetStudentId
  );
}

/**
 * Lấy báo cáo tổng hợp kết quả học tập & chuyên cần của học sinh
 */
export function getStudentAcademicSummary(
  studentId: string,
  students: StudentProfile[] = INITIAL_STUDENTS,
  reportCards: AcademicReportCard[] = INITIAL_REPORT_CARDS,
  attendances: AttendanceRecord[] = INITIAL_ATTENDANCES
) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return null;

  const studentAttendances = attendances.filter((a) => a.studentId === studentId);
  const attendanceStats = calculateAttendanceStats(studentAttendances);

  const studentReports = reportCards.filter((r) => r.studentId === studentId);
  const latestReport = studentReports[0] || null;
  const academicStanding = latestReport ? getAcademicStanding(latestReport.gpa) : null;

  return {
    student,
    attendanceStats,
    latestReport,
    academicStanding,
  };
}
