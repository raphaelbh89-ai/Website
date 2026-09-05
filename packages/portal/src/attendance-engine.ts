import { AttendanceRecord, AttendanceStatus } from './schema';

export interface AttendanceStatistics {
  totalDays: number;
  presentDays: number;
  excusedAbsences: number;
  unexcusedAbsences: number;
  lateArrivals: number;
  attendanceRate: number; // Phần trăm chuyên cần (0 - 100%)
  evaluation: 'XUAT_SAC' | 'TOT' | 'CAN_LƯU_Y';
}

/**
 * Tính toán thống kê điểm danh và tỷ lệ chuyên cần cho học sinh
 */
export function calculateAttendanceStats(records: AttendanceRecord[]): AttendanceStatistics {
  const totalDays = records.length;
  if (totalDays === 0) {
    return {
      totalDays: 0,
      presentDays: 0,
      excusedAbsences: 0,
      unexcusedAbsences: 0,
      lateArrivals: 0,
      attendanceRate: 100,
      evaluation: 'XUAT_SAC',
    };
  }

  let presentDays = 0;
  let excusedAbsences = 0;
  let unexcusedAbsences = 0;
  let lateArrivals = 0;

  for (const record of records) {
    switch (record.status) {
      case 'CO_MAT':
        presentDays++;
        break;
      case 'VANG_CO_PHEP':
        excusedAbsences++;
        break;
      case 'VANG_KHONG_PHEP':
        unexcusedAbsences++;
        break;
      case 'DI_MUON':
        lateArrivals++;
        break;
    }
  }

  // Tỷ lệ chuyên cần: (Có mặt + Đi muộn) / Tổng số ngày * 100%
  const attendanceRate = Math.round(((presentDays + lateArrivals) / totalDays) * 1000) / 10;

  let evaluation: 'XUAT_SAC' | 'TOT' | 'CAN_LƯU_Y' = 'TOT';
  if (attendanceRate >= 98 && unexcusedAbsences === 0) {
    evaluation = 'XUAT_SAC';
  } else if (attendanceRate < 90 || unexcusedAbsences >= 3) {
    evaluation = 'CAN_LƯU_Y';
  }

  return {
    totalDays,
    presentDays,
    excusedAbsences,
    unexcusedAbsences,
    lateArrivals,
    attendanceRate,
    evaluation,
  };
}

/**
 * Lọc hồ sơ điểm danh theo tháng (định dạng 'YYYY-MM')
 */
export function filterAttendanceByMonth(
  records: AttendanceRecord[],
  yearMonth: string
): AttendanceRecord[] {
  return records.filter((r) => r.date.startsWith(yearMonth));
}
