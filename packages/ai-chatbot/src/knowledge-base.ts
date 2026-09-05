import { KnowledgeSource } from './schema';

export const INITIAL_KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: 'kb-hoc-phi-2026',
    title: 'Biểu phí & Chính sách tài chính năm học 2026 - 2027',
    category: 'hoc_phi',
    branchId: null,
    content: `Biểu phí chuẩn hóa cho năm học 2026 - 2027 tại Hệ thống Trường Liên cấp Alpha School:
1. Học phí Tiểu học (Lớp 1 - 5): 8.500.000 VNĐ / tháng (hoặc 80.000.000 VNĐ / năm học).
2. Học phí THCS (Lớp 6 - 9): 11.200.000 VNĐ / tháng (hoặc 106.000.000 VNĐ / năm học).
3. Học phí THPT (Lớp 10 - 12): 14.500.000 VNĐ / tháng (hoặc 138.000.000 VNĐ / năm học).
Chính sách ưu đãi và giảm trừ:
- Ưu đãi đóng sớm: Giảm 10% học phí khi hoàn tất học phí cả năm học trước ngày 30/06/2026.
- Ưu đãi gia đình: Giảm 5% cho con thứ hai và 10% cho con thứ ba cùng theo học trong hệ thống.
- Phí bán trú: 2.200.000 VNĐ / tháng (đã bao gồm bữa trưa và xế dinh dưỡng tiêu chuẩn Nhật Bản).
- Phí xe đưa đón (School Bus GPS): 1.500.000 - 2.800.000 VNĐ / tháng tùy cự ly bán kính.`,
    tokenCount: 285,
    tags: ['học phí', 'biểu phí', 'tiền học', 'học phí lớp 1', 'chi phí', 'ưu đãi', 'đóng sớm', 'bán trú', 'xe đưa đón'],
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'kb-cambridge-curriculum',
    title: 'Khung chương trình song ngữ quốc tế Cambridge International',
    category: 'chuong_trinh_cambridge',
    branchId: null,
    content: `Chương trình Song ngữ Quốc tế Cambridge tại Alpha School được ủy quyền chính thức bởi Cambridge Assessment International Education (Mã trường Quốc tế: VN892):
- Thời lượng tiếng Anh: Chiếm từ 45% đến 55% tổng thời lượng giảng dạy, 100% giáo viên bản ngữ có chứng chỉ sư phạm CELTA / PGCE.
- Khung lộ trình đào tạo:
  + Cấp Tiểu học: Cambridge Primary (English, Mathematics, Science, Global Perspectives). Thi lấy chứng chỉ Cambridge Primary Checkpoint vào cuối lớp 5.
  + Cấp THCS: Cambridge Lower Secondary. Đánh giá cuối cấp qua kỳ thi Lower Secondary Checkpoint chuẩn hóa toàn cầu.
  + Cấp THPT: Chứng chỉ Trung học Quốc tế IGCSE (lớp 9-10) và Bằng Tú tài Nâng cao Cambridge International AS/A Level (lớp 11-12), mở cửa vào các đại học danh tiếng top 1% thế giới (Oxford, Cambridge, Harvard, MIT, RMIT, VinUni).
- Tích hợp liên môn STEM & Robotics thực hành tại Trung tâm Sáng chế Alpha Innovation Lab.`,
    tokenCount: 290,
    tags: ['cambridge', 'song ngữ', 'tiếng anh', 'giáo trình', 'a level', 'igcse', 'checkpoint', 'stem', 'quốc tế'],
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'kb-admissions-process',
    title: 'Quy trình tuyển sinh & Lịch đánh giá năng lực 4 bước năm 2026',
    category: 'tuyen_sinh',
    branchId: null,
    content: `Quy trình nộp hồ sơ và xét tuyển đầu vào 4 bước chuẩn hóa tại Alpha School:
Bước 1: Nộp hồ sơ trực tuyến qua cổng điện tử website (Mã hồ sơ tự động cấp dạng HS-2026-XXXX).
Bước 2: Ban tuyển sinh thẩm định thông tin và gửi thông báo Lịch hẹn Phỏng vấn / Khảo sát năng lực trong vòng 24 giờ.
Bước 3: Học sinh tham gia ngày hội đánh giá năng lực tư duy, kiểm tra trình độ tiếng Anh Cambridge và phỏng vấn cùng Ban Giám hiệu.
Bước 4: Nhận Thông báo Trúng tuyển chính thức và làm thủ tục hoàn tất học phí, nhập học.
Hồ sơ yêu cầu tải lên gồm:
- Bản scan Giấy khai sinh hợp lệ.
- Học bạ / Bảng điểm 2 năm học gần nhất (đối với học sinh lớp 2 trở lên).
- Giấy khám sức khỏe định kỳ và phiếu tiêm chủng.
Lịch tuyển sinh năm 2026: Đợt 1 từ ngày 15/03/2026 đến 30/05/2026; Đợt 2 từ 01/06/2026 đến 15/08/2026.`,
    tokenCount: 275,
    tags: ['tuyển sinh', 'hồ sơ', 'quy trình', 'đăng ký', 'nhập học', 'khảo sát năng lực', 'phỏng vấn', 'giấy tờ'],
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'kb-campuses-facilities',
    title: 'Hệ thống 3 Cơ sở & Cơ sở vật chất chuẩn quốc tế',
    category: 'co_so_vat_chat',
    branchId: null,
    content: `Alpha School sở hữu 3 cơ sở hiện đại được xây dựng theo tiêu chuẩn kiến trúc sinh thái xanh:
1. Cơ sở 1 - Alpha Cầu Giấy (Hà Nội):
   - Địa chỉ: Lô D2, Khu đô thị mới Cầu Giấy, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội.
   - Diện tích: 15.000m², gồm 60 phòng học thông minh trang bị bảng tương tác Promethean, thư viện 20.000 đầu sách.
2. Cơ sở 2 - Alpha Quận 2 (TP. Hồ Chí Minh):
   - Địa chỉ: 88 Đường Song Hành, Phường An Phú, TP. Thủ Đức (Quận 2 cũ), TP. Hồ Chí Minh.
   - Diện tích: 18.000m², khu liên hợp thể thao FIFA 2 sao, bể bơi bốn mùa nước mặn khử khuẩn muối khoáng.
3. Cơ sở 3 - Alpha Biên Hòa (Đồng Nai):
   - Địa chỉ: 125 Đường Nguyễn Ái Quốc, Phường Tân Tiến, TP. Biên Hòa, Tỉnh Đồng Nai.
   - Diện tích: 12.000m², trung tâm Nghệ thuật & Sân khấu đa năng 800 chỗ, phòng thí nghiệm STEAM chuẩn quốc tế.
Tất cả các cơ sở đều có hệ thống camera an ninh AI nhận diện khuôn mặt và xe bus định vị GPS đưa đón tận nhà.`,
    tokenCount: 310,
    tags: ['cơ sở', 'địa chỉ', 'hà nội', 'hồ chí minh', 'thủ đức', 'biên hòa', 'cơ sở vật chất', 'phòng lab', 'bể bơi', 'sân bóng'],
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'kb-campus-bien-hoa-special',
    title: 'Đặc thù & Tiện ích riêng tại Cơ sở Biên Hòa (Đồng Nai)',
    category: 'co_so_vat_chat',
    branchId: 'bien-hoa',
    content: `Cơ sở Alpha School Biên Hòa tọa lạc tại 125 Nguyễn Ái Quốc, Phường Tân Tiến, TP. Biên Hòa:
- Quy mô tiếp nhận: 1.200 học sinh từ lớp 1 đến lớp 12.
- Chính sách ưu đãi đặc biệt: Giảm thêm 5% học phí toàn năm cho học sinh thường trú tại tỉnh Đồng Nai và Bình Dương trong năm học 2026 - 2027.
- Hệ thống xe đưa đón riêng: Bao phủ 12 tuyến đường chính tại TP. Biên Hòa, Trảng Bom, Vĩnh Cửu, Long Thành.
- Hotline tuyển sinh riêng cơ sở Biên Hòa: 0251 388 9999 / 0918 892 892.`,
    tokenCount: 190,
    tags: ['biên hòa', 'đồng nai', 'cơ sở biên hòa', 'xe bus biên hòa', 'hotline biên hòa', 'ưu đãi biên hòa'],
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'kb-scholarship-spark',
    title: 'Quỹ Học bổng Tài năng "Alpha Spark 2026" (20% - 100% Học phí)',
    category: 'hoc_bong',
    branchId: null,
    content: `Quỹ học bổng thường niên "Alpha Spark" nhằm vinh danh và khuyến khích các tài năng trẻ xuất sắc:
- Các mức học bổng:
  + Học bổng Kim Cương: 100% học phí suốt toàn cấp học.
  + Học bổng Vàng: 70% học phí.
  + Học bổng Bạc: 50% học phí.
  + Học bổng Khuyến khích: 20% - 30% học phí.
- Đối tượng xét tuyển:
  + Học sinh đạt giải Học sinh Giỏi cấp Tỉnh / Thành phố / Quốc gia môn Toán, Khoa học, Tiếng Anh.
  + Học sinh đạt giải thưởng Nghệ thuật, Thể thao cấp Quốc tế hoặc Huy chương Quốc gia.
  + Học sinh có chứng chỉ IELTS từ 6.5+ (đối với lớp 10) hoặc điểm SAT từ 1350+.
- Quy trình ứng tuyển: Nộp bài luận cá nhân (Personal Statement), bảng điểm 2 năm gần nhất và tham gia vòng phỏng vấn chuyên sâu với Hội đồng Học thuật.`,
    tokenCount: 260,
    tags: ['học bổng', 'alpha spark', 'tài năng', 'miễn phí', 'giảm học phí', 'ielts', 'học sinh giỏi', 'xét tuyển'],
    updatedAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'kb-boarding-nutrition-bus',
    title: 'Dịch vụ Bán trú dinh dưỡng, Đời sống học đường & Xe Bus',
    category: 'noi_quy',
    branchId: null,
    content: `Chế độ chăm sóc bán trú và dịch vụ học đường tại Alpha School:
- Bữa ăn học đường: Thực đơn 4 tuần không trùng lặp do chuyên gia Viện Dinh Dưỡng Quốc gia tư vấn, nguyên liệu hữu cơ 100% truy xuất nguồn gốc. Mỗi ngày học sinh được phục vụ bữa trưa nóng sốt, tráng miệng và bữa xế chiều.
- Giờ giấc học tập: Đón học sinh từ 07:15, giờ học chính thức 08:00 - 16:30 từ Thứ Hai đến Thứ Sáu. Nhà trường tổ chức các câu lạc bộ ngoại khóa sau giờ học đến 17:30.
- Xe đưa đón School Bus: 100% xe có dây an toàn, tài xế và giám thị quản lý nhiệt huyết. Phụ huynh theo dõi hành trình xe theo thời gian thực (GPS) trên ứng dụng di động Alpha Parent Portal.`,
    tokenCount: 235,
    tags: ['bán trú', 'ăn trưa', 'dinh dưỡng', 'giờ học', 'xe bus', 'ngoại khóa', 'thực đơn', 'an toàn'],
    updatedAt: '2026-09-01T08:00:00Z',
  },
];
