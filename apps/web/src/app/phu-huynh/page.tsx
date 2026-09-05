'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  StudentProfile,
  ParentStudentRelation,
  AttendanceRecord,
  AcademicReportCard,
  TimetableSlot,
  SchoolNotice,
  INITIAL_STUDENTS,
  INITIAL_PARENT_RELATIONS,
  INITIAL_ATTENDANCES,
  INITIAL_REPORT_CARDS,
  INITIAL_TIMETABLES,
  INITIAL_NOTICES,
  calculateAttendanceStats,
  getAcademicStanding,
  getConductLabel,
  ATTENDANCE_STATUS_LABELS,
  getStudentsByParent,
} from '@school-cms/portal';

export default function ParentPortalPage() {
  // Demo Login State
  const [parentPhoneInput, setParentPhoneInput] = useState('0909 123 456');
  const [activeParent, setActiveParent] = useState<{
    id: string;
    name: string;
    phone: string;
    email: string;
  }>({
    id: 'usr-parent-01',
    name: 'Nguyễn Văn Hùng',
    phone: '0909 123 456',
    email: 'hung.nguyen@gmail.com',
  });

  // Children of the current parent
  const [availableStudents, setAvailableStudents] = useState<StudentProfile[]>(
    getStudentsByParent('0909 123 456', INITIAL_STUDENTS, INITIAL_PARENT_RELATIONS)
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-001');

  // Active tab in portal
  const [portalTab, setPortalTab] = useState<'academic' | 'attendance' | 'timetable' | 'notices'>('academic');
  const [attendanceMonth, setAttendanceMonth] = useState<string>('2026-09');

  // Selected student data
  const currentStudent = availableStudents.find((s) => s.id === selectedStudentId) || availableStudents[0] || INITIAL_STUDENTS[0];
  const currentReportCard = INITIAL_REPORT_CARDS.find((r) => r.studentId === currentStudent.id);
  const currentAttendances = INITIAL_ATTENDANCES.filter(
    (a) => a.studentId === currentStudent.id && a.date.startsWith(attendanceMonth)
  );
  const currentStats = calculateAttendanceStats(currentAttendances);
  const currentTimetable = INITIAL_TIMETABLES.filter((t) => t.className === currentStudent.className);
  const currentNotices = INITIAL_NOTICES.filter(
    (n) => !n.branchId || n.branchId === currentStudent.branchId
  );

  // Handle switching parent account
  const handleSwitchAccount = (phone: string, name: string) => {
    setParentPhoneInput(phone);
    setActiveParent({
      id: `usr-parent-${phone}`,
      name,
      phone,
      email: `${phone.replace(/\s+/g, '')}@alphaschool.parent`,
    });
    const children = getStudentsByParent(phone, INITIAL_STUDENTS, INITIAL_PARENT_RELATIONS);
    setAvailableStudents(children);
    if (children.length > 0) {
      setSelectedStudentId(children[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Brand Banner */}
      <header className="bg-emerald-800 text-white border-b border-emerald-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-2xl">🏫</span>
              <div>
                <span className="font-black text-lg tracking-tight block leading-none">ALPHA SCHOOL</span>
                <span className="text-[10px] text-emerald-200 tracking-widest uppercase font-semibold">Cổng Thông Tin Phụ Huynh</span>
              </div>
            </Link>
            <span className="hidden sm:inline-block w-px h-6 bg-emerald-600/60 mx-2"></span>
            <span className="hidden sm:inline-block text-xs text-emerald-100 font-medium bg-emerald-700/50 px-2.5 py-1 rounded-full border border-emerald-600/40">
              Sổ Liên Lạc Điện Tử 2026 - 2027
            </span>
          </div>

          {/* Parent Session Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto text-xs">
            <div className="bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/50 flex items-center gap-2">
              <span className="text-sm">👤</span>
              <div>
                <span className="font-bold text-white block">{activeParent.name}</span>
                <span className="text-[10px] text-emerald-300 font-mono">{activeParent.phone}</span>
              </div>
            </div>

            {/* Fast Demo Account Switcher */}
            <div className="flex gap-1">
              <button
                onClick={() => handleSwitchAccount('0909 123 456', 'Nguyễn Văn Hùng')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeParent.phone === '0909 123 456'
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'bg-emerald-700/60 text-emerald-200 hover:bg-emerald-700'
                }`}
                title="Tài khoản gia đình có 2 con (Khối 6 & Khối 10)"
              >
                Gia Đình 2 Con
              </button>
              <button
                onClick={() => handleSwitchAccount('0918 888 999', 'Trần Quốc Tuấn')}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeParent.phone === '0918 888 999'
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'bg-emerald-700/60 text-emerald-200 hover:bg-emerald-700'
                }`}
                title="Tài khoản học sinh Khối 2"
              >
                Học Sinh Lớp 2
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Child Selection Header (Multi-child Switcher) */}
        {availableStudents.length > 1 && (
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">
              Chọn Con Đang Theo Học:
            </span>
            <div className="flex gap-2 overflow-x-auto">
              {availableStudents.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedStudentId(child.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    child.id === currentStudent.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>🎒</span>
                  <span>{child.fullName}</span>
                  <span className="text-[10px] opacity-80 font-normal font-mono">({child.className})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Student Dossier Overview Hero */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              {currentStudent.avatarUrl ? (
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {currentStudent.fullName.slice(-2)}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{currentStudent.fullName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {currentStudent.studentCode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {currentStudent.className}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {currentStudent.branchName} • Ngày sinh: {currentStudent.dateOfBirth} • Niên khóa: 2026 - 2027
                </p>
                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-4 pt-1">
                  <span>
                    <strong className="text-slate-900">GVCN:</strong> {currentStudent.academicAdvisor.name}
                  </span>
                  <span>
                    <strong className="text-slate-900">Hotline:</strong>{' '}
                    <a href={`tel:${currentStudent.academicAdvisor.phone}`} className="text-emerald-700 font-bold hover:underline">
                      {currentStudent.academicAdvisor.phone}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick KPI Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase block">Chuyên Cần</span>
                <span className="text-xl font-black text-teal-700">{currentStats.attendanceRate}%</span>
                <span className="text-[10px] text-teal-600 block font-medium">Xuất sắc</span>
              </div>
              <div className="border-x border-slate-200 px-3">
                <span className="text-[11px] text-slate-500 font-bold uppercase block">GPA HK1</span>
                <span className="text-xl font-black text-amber-700">{currentReportCard?.gpa || '--'}</span>
                <span className="text-[10px] text-amber-600 block font-medium">
                  {currentReportCard ? getAcademicStanding(currentReportCard.gpa).label : '--'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase block">Hạng Lớp</span>
                <span className="text-xl font-black text-slate-900">
                  {currentReportCard ? `#${currentReportCard.ranking}` : '--'}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  / {currentReportCard?.totalStudentsInClass || '--'} em
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 rounded-2xl shadow-sm text-sm font-bold gap-6 overflow-x-auto">
          <button
            onClick={() => setPortalTab('academic')}
            className={`py-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              portalTab === 'academic'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📊</span> Bảng Điểm & Học Lực
          </button>
          <button
            onClick={() => setPortalTab('attendance')}
            className={`py-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              portalTab === 'attendance'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>✅</span> Điểm Danh & Chuyên Cần
          </button>
          <button
            onClick={() => setPortalTab('timetable')}
            className={`py-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              portalTab === 'timetable'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📅</span> Thời Khóa Biểu Tuần
          </button>
          <button
            onClick={() => setPortalTab('notices')}
            className={`py-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
              portalTab === 'notices'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📢</span> Thông Báo Học Đường ({currentNotices.length})
          </button>
        </div>

        {/* TAB 1: ACADEMIC REPORT CARD */}
        {portalTab === 'academic' && (
          <div className="space-y-6">
            {currentReportCard ? (
              <>
                {/* GPA & Conduct Summary Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        Phiếu Điểm Học Kỳ 1 • 2025 - 2026
                      </span>
                      <h2 className="text-xl font-black text-slate-900 mt-1">Kết Quả Học Tập Chi Tiết</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>🖨️</span> In Phiếu Điểm
                      </button>
                      <Link
                        href="/tuyen-sinh/thanh-toan/TXN-2026-0001"
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
                      >
                        <span>💳</span> Đóng Học Phí Kỳ Tới
                      </Link>
                    </div>
                  </div>

                  {/* Subject Scores Table */}
                  <div className="mt-4 overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3.5">Môn Học</th>
                          <th className="p-3.5 text-center">Tín Chỉ</th>
                          <th className="p-3.5 text-center">Miệng (x1)</th>
                          <th className="p-3.5 text-center">15 Phút (x1)</th>
                          <th className="p-3.5 text-center">1 Tiết (x2)</th>
                          <th className="p-3.5 text-center">Cuối Kỳ (x3)</th>
                          <th className="p-3.5 text-center font-black">Tổng Kết</th>
                          <th className="p-3.5 text-center">Thang Chữ</th>
                          <th className="p-3.5">Nhận Xét Của Giáo Viên Bộ Môn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentReportCard.subjects.map((s) => (
                          <tr key={s.subjectCode} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900">{s.subjectName}</td>
                            <td className="p-3.5 text-center text-slate-500">{s.credit}</td>
                            <td className="p-3.5 text-center font-mono">{s.oralScore}</td>
                            <td className="p-3.5 text-center font-mono">{s.test15m}</td>
                            <td className="p-3.5 text-center font-mono">{s.test45m}</td>
                            <td className="p-3.5 text-center font-mono">{s.semesterExam}</td>
                            <td className="p-3.5 text-center font-mono font-black text-emerald-700 text-sm">
                              {s.finalScore}
                            </td>
                            <td className="p-3.5 text-center font-bold text-blue-700">{s.letterGrade}</td>
                            <td className="p-3.5 text-slate-600 italic">{s.teacherComment}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Teacher Feedback Callout */}
                  <div className="mt-6 bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                    <span className="font-bold block mb-1 text-sm">📝 Lời Nhận Xét Của Giáo Viên Chủ Nhiệm:</span>
                    <p className="italic text-slate-700 leading-relaxed">"{currentReportCard.homeroomTeacherComment}"</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
                Chưa có dữ liệu bảng điểm cho học sinh này trong kỳ học hiện tại.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {portalTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Nhật Ký Điểm Danh & Chuyên Cần</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Theo dõi lịch vào lớp, giờ tan học và các ngày nghỉ có phép</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500 font-medium">Tháng:</span>
                  <select
                    value={attendanceMonth}
                    onChange={(e) => setAttendanceMonth(e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                  >
                    <option value="2026-09">Tháng 09/2026</option>
                    <option value="2026-10">Tháng 10/2026</option>
                  </select>
                </div>
              </div>

              {/* Monthly Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Tổng Số Ngày</span>
                  <span className="text-2xl font-black text-slate-900">{currentStats.totalDays}</span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-emerald-700 block">Có Mặt Đầy Đủ</span>
                  <span className="text-2xl font-black text-emerald-800">{currentStats.presentDays}</span>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <span className="text-xs text-amber-700 block">Vắng Có Phép</span>
                  <span className="text-2xl font-black text-amber-800">{currentStats.excusedAbsences}</span>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <span className="text-xs text-orange-700 block">Đi Muộn</span>
                  <span className="text-2xl font-black text-orange-800">{currentStats.lateArrivals}</span>
                </div>
              </div>

              {/* Attendance Records Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Ngày</th>
                      <th className="p-3.5">Trạng Thái</th>
                      <th className="p-3.5">Giờ Điểm Danh Đến</th>
                      <th className="p-3.5">Giờ Tan Học</th>
                      <th className="p-3.5">Ghi Chú Của Nhà Trường</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentAttendances.map((a) => {
                      const labelConfig = ATTENDANCE_STATUS_LABELS[a.status];
                      return (
                        <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 font-bold font-mono text-slate-900">{a.date}</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${labelConfig.badgeColor}`}>
                              <span>{labelConfig.icon}</span> {labelConfig.label}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-700">{a.timeIn || '--:--'}</td>
                          <td className="p-3.5 font-mono text-slate-700">{a.timeOut || '--:--'}</td>
                          <td className="p-3.5 text-slate-600 italic">{a.note || 'Bình thường'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMETABLE */}
        {portalTab === 'timetable' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Thời Khóa Biểu Tuần Học</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Lớp: {currentStudent.className} • Năm học 2026 - 2027</p>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Học sinh có mặt tại lớp trước <strong className="text-slate-900">07:40 sáng</strong>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="p-3.5">Thứ</th>
                      <th className="p-3.5 text-center">Tiết</th>
                      <th className="p-3.5">Thời Gian</th>
                      <th className="p-3.5">Môn Học</th>
                      <th className="p-3.5">Giáo Viên Giảng Dạy</th>
                      <th className="p-3.5">Phòng Học</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentTimetable.map((slot) => (
                      <tr key={slot.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-emerald-800">Thứ {slot.dayOfWeek}</td>
                        <td className="p-3.5 text-center font-bold">Tiết {slot.period}</td>
                        <td className="p-3.5 font-mono text-slate-500">{slot.startTime} - {slot.endTime}</td>
                        <td className="p-3.5 font-black text-slate-900">{slot.subjectName}</td>
                        <td className="p-3.5 text-slate-700">{slot.teacherName}</td>
                        <td className="p-3.5 font-semibold text-slate-600">{slot.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCHOOL NOTICES */}
        {portalTab === 'notices' && (
          <div className="space-y-4">
            {currentNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {notice.isUrgent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        ⚡ KHẨN
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {notice.category === 'academic' ? 'Học Tập & Lịch Thi' : notice.category === 'safety' ? 'Y Tế & An Toàn' : 'Thông Báo Chung'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{notice.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(notice.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-400">
        <p>© 2026 Alpha School Vietnam. Cổng thông tin phụ huynh và Sổ liên lạc điện tử số hóa chuẩn quốc tế.</p>
      </footer>
    </div>
  );
}
