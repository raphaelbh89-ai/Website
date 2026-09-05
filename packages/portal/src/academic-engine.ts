import { SubjectScore } from './schema';

/**
 * Tính điểm trung bình môn theo chuẩn Thông tư Bộ GD&ĐT:
 * Công thức: (Miệng * 1 + 15 phút * 1 + 45 phút * 2 + Cuối kỳ * 3) / 7
 */
export function calculateSubjectFinalScore(
  oral: number,
  t15: number,
  t45: number,
  exam: number
): number {
  const rawScore = (oral * 1 + t15 * 1 + t45 * 2 + exam * 3) / 7;
  return Math.round(rawScore * 10) / 10;
}

/**
 * Chuyển đổi điểm thang 10 sang Thang chữ quốc tế (Letter Grade)
 */
export function getLetterGrade(score: number): string {
  if (score >= 9.0) return 'A+';
  if (score >= 8.0) return 'A';
  if (score >= 7.0) return 'B+';
  if (score >= 6.5) return 'B';
  if (score >= 5.0) return 'C';
  return 'D';
}

/**
 * Tính điểm trung bình chung học kỳ (GPA) theo danh sách môn học
 */
export function calculateGpa(subjects: SubjectScore[]): number {
  if (subjects.length === 0) return 0;
  let totalWeightedScore = 0;
  let totalCredits = 0;

  for (const s of subjects) {
    const credit = s.credit || 1;
    totalWeightedScore += s.finalScore * credit;
    totalCredits += credit;
  }

  if (totalCredits === 0) return 0;
  return Math.round((totalWeightedScore / totalCredits) * 10) / 10;
}

/**
 * Xếp loại danh hiệu học tập theo GPA
 */
export function getAcademicStanding(gpa: number): {
  standing: 'XUAT_SAC' | 'GIOI' | 'KHA' | 'TRUNG_BINH' | 'YEU';
  label: string;
  badgeColor: string;
} {
  if (gpa >= 9.0) {
    return { standing: 'XUAT_SAC', label: 'Học sinh Xuất sắc', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' };
  }
  if (gpa >= 8.0) {
    return { standing: 'GIOI', label: 'Học sinh Giỏi', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
  }
  if (gpa >= 6.5) {
    return { standing: 'KHA', label: 'Học sinh Khá', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' };
  }
  if (gpa >= 5.0) {
    return { standing: 'TRUNG_BINH', label: 'Học sinh Trung bình', badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
  }
  return { standing: 'YEU', label: 'Học sinh Cần Cố Gắng', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300' };
}

/**
 * Xếp loại Hạnh kiểm học sinh
 */
export function getConductLabel(conduct: 'TOT' | 'KHA' | 'TRUNG_BINH'): {
  label: string;
  badgeColor: string;
} {
  switch (conduct) {
    case 'TOT':
      return { label: 'Tốt', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'KHA':
      return { label: 'Khá', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'TRUNG_BINH':
      return { label: 'Trung bình', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' };
  }
}
