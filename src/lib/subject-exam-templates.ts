import { ExamQuestion, ExamItem } from "@/components/exam/exam-data";

/**
 * Tự động sinh khung câu hỏi thông minh theo Danh mục kỳ thi và Môn học:
 * - "Kiểm tra Học kỳ": Tự động tạo 50 câu trắc nghiệm ABCD (0.2đ/câu = 10.0đ)
 * - "THPT Quốc Gia": Tự động tạo chuẩn cấu trúc Bộ GD&ĐT 2025 của môn đó (Toán 22 câu, Lý/Hóa/Sinh 28 câu, Sử/Địa 28 câu, Tiếng Anh 40 câu...)
 * - "ĐGNL ĐHQG" / "ĐGTD Bách Khoa": Tự động tạo 50 câu / 40 câu trắc nghiệm tư duy
 */
export function generateExamTemplateByCategoryAndSubject(
  subject: ExamItem["subject"] = "Toán học",
  category: ExamItem["category"] = "THPT Quốc Gia"
): ExamQuestion[] {
  const timestamp = Date.now();

  // =========================================================================
  // TRƯỜNG HỢP 1: KIỂM TRA HỌC KỲ (Tự động tạo 50 câu trắc nghiệm 4 phương án)
  // =========================================================================
  if (category === "Kiểm tra Học kỳ") {
    // Riêng môn Ngữ văn kiểm tra học kỳ thường gồm Đọc hiểu + Làm văn
    if (subject === "Ngữ văn") {
      return [
        {
          id: `hk-van-${timestamp}-1`,
          questionNumber: 1,
          type: "essay",
          part: "Phần I",
          section: "Đọc hiểu",
          instruction: "Phần I: Đọc hiểu văn bản (3.0 - 4.0 điểm)",
          content: "Đọc đoạn trích sau và trả lời các câu hỏi từ 1 đến 4:\n\n[Trích đoạn ngữ liệu kiểm tra học kỳ...]",
          sampleEssayAnswer: "Gợi ý trả lời các câu hỏi nhận biết, thông hiểu.",
          rubricCriteria: [
            "Xác định đúng phương thức biểu đạt / phong cách ngôn ngữ (0.5 điểm)",
            "Chỉ ra và nêu tác dụng của biện pháp nghệ thuật (0.75 điểm)",
            "Hiểu nội dung ý nghĩa câu văn / hình ảnh (0.75 điểm)",
            "Thông điệp bài học rút ra (1.0 điểm)",
          ],
          points: 3.0,
          explanation: "Phần Đọc hiểu đề kiểm tra học kỳ.",
        },
        {
          id: `hk-van-${timestamp}-2`,
          questionNumber: 2,
          type: "essay",
          part: "Phần II",
          section: "Nghị luận xã hội",
          instruction: "Phần II: Viết đoạn văn (2.0 điểm)",
          content: "Từ nội dung đoạn trích phần Đọc hiểu, hãy viết một đoạn văn (khoảng 200 chữ) chia sẻ suy nghĩ về một vấn đề đời sống.",
          sampleEssayAnswer: "Dàn ý đoạn văn 200 chữ: Mở đoạn, giải thích, phân tích dẫn chứng, bài học nhận thức.",
          rubricCriteria: [
            "Đảm bảo dung lượng khoảng 200 chữ (0.25 điểm)",
            "Xác định đúng vấn đề nghị luận (0.25 điểm)",
            "Lập luận thuyết phục, có dẫn chứng (1.0 điểm)",
            "Chính tả, ngữ pháp, sáng tạo (0.5 điểm)",
          ],
          points: 2.0,
          explanation: "Phần Nghị luận xã hội.",
        },
        {
          id: `hk-van-${timestamp}-3`,
          questionNumber: 3,
          type: "essay",
          part: "Phần III",
          section: "Nghị luận văn học",
          instruction: "Phần III: Viết bài văn hoàn chỉnh (5.0 điểm)",
          content: "Cảm nhận / phân tích một đoạn trích tác phẩm văn học trong chương trình học kỳ.",
          sampleEssayAnswer: "Dàn ý bài văn 3 phần Mở - Thân - Kết phân tích giá trị nội dung và nghệ thuật.",
          rubricCriteria: [
            "Bố cục bài văn 3 phần (0.5 điểm)",
            "Phân tích đúng và sâu sắc nội dung nghệ thuật (3.5 điểm)",
            "Đánh giá khái quát và liên hệ (0.5 điểm)",
            "Diễn đạt trong sáng, sáng tạo (0.5 điểm)",
          ],
          points: 5.0,
          explanation: "Phần Nghị luận văn học đề học kỳ.",
        },
      ];
    }

    // Tất cả các môn khác: Đúng chuẩn 50 CÂU TRẮC NGHIỆM ABCD (0.2đ / câu = 10.0đ)
    const list: ExamQuestion[] = [];
    for (let i = 1; i <= 50; i++) {
      list.push({
        id: `hk-${timestamp}-${i}`,
        questionNumber: i,
        type: "single_choice",
        part: "Trắc nghiệm",
        section: `Câu ${i}`,
        instruction: "Chọn một phương án đúng (A, B, C hoặc D)",
        content: `Câu ${i}: [Kiểm tra Học kỳ - ${subject}] Nhập nội dung câu hỏi ${i}...`,
        options: [
          { id: "A", text: "Phương án A" },
          { id: "B", text: "Phương án B" },
          { id: "C", text: "Phương án C" },
          { id: "D", text: "Phương án D" },
        ],
        correctAnswer: "A",
        explanation: `Lời giải chi tiết câu ${i}: Áp dụng kiến thức trọng tâm học kỳ môn ${subject}.`,
        points: 0.2,
      });
    }
    return list;
  }

  // =========================================================================
  // TRƯỜNG HỢP 2: THPT QUỐC GIA (Tự động tạo theo format Bộ GD&ĐT 2025 của môn)
  // =========================================================================
  if (category === "THPT Quốc Gia") {
    // 2.1. MÔN TOÁN HỌC THPT QUỐC GIA 2025 (22 câu = 10.0 điểm)
    if (subject === "Toán học") {
      const list: ExamQuestion[] = [];
      // Phần I: 12 câu trắc nghiệm ABCD (0.25đ x 12 = 3.0đ)
      for (let i = 1; i <= 12; i++) {
        list.push({
          id: `thpt-toan-p1-${timestamp}-${i}`,
          questionNumber: i,
          type: "single_choice",
          part: "Phần I",
          section: "Trắc nghiệm 4 lựa chọn",
          instruction: "Phần I: Thí sinh chọn một phương án đúng (A, B, C hoặc D)",
          content: `Câu ${i}: Cho hàm số hoặc biểu thức toán học... [Toán 12 - Câu ${i}]`,
          options: [
            { id: "A", text: "Phương án A" },
            { id: "B", text: "Phương án B" },
            { id: "C", text: "Phương án C" },
            { id: "D", text: "Phương án D" },
          ],
          correctAnswer: "A",
          explanation: "",
          points: 0.25,
        });
      }
      // Phần II: 4 câu Đúng/Sai 4 ý (1.0đ x 4 = 4.0đ)
      for (let i = 1; i <= 4; i++) {
        const qNum = 12 + i;
        list.push({
          id: `thpt-toan-p2-${timestamp}-${i}`,
          questionNumber: qNum,
          type: "true_false",
          part: "Phần II",
          section: "Trắc nghiệm Đúng / Sai",
          instruction: "Phần II: Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai",
          content: `Câu ${qNum}: Cho đồ thị hàm số (C) hoặc bài toán hình học không gian...`,
          trueFalseItems: [
            { id: "a", content: "Khẳng định a...", isCorrect: true, explanation: "" },
            { id: "b", content: "Khẳng định b...", isCorrect: false, explanation: "" },
            { id: "c", content: "Khẳng định c...", isCorrect: true, explanation: "" },
            { id: "d", content: "Khẳng định d...", isCorrect: true, explanation: "" },
          ],
          explanation: "Phân tích tính đúng/sai của từng mệnh đề theo định lý và bảng biến thiên.",
          points: 1.0,
        });
      }
      // Phần III: 6 câu điền số (0.5đ x 6 = 3.0đ)
      for (let i = 1; i <= 6; i++) {
        const qNum = 16 + i;
        list.push({
          id: `thpt-toan-p3-${timestamp}-${i}`,
          questionNumber: qNum,
          type: "short_answer",
          part: "Phần III",
          section: "Trả lời ngắn / Điền số",
          instruction: "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)",
          content: `Câu ${qNum}: Bài toán thực tế hoặc vận dụng cao... Tìm giá trị của x (điền số thập phân hoặc số nguyên).`,
          correctAnswer: "0",
          explanation: "Lời giải chi tiết các bước tính ra kết quả số.",
          points: 0.5,
        });
      }
      return list;
    }

    // 2.2. MÔN VẬT LÝ, HÓA HỌC, SINH HỌC THPT QUỐC GIA 2025 (28 câu = 10.0 điểm)
    if (subject === "Vật lý" || subject === "Hóa học" || subject === "Sinh học") {
      const list: ExamQuestion[] = [];
      // Phần I: 18 câu trắc nghiệm ABCD (0.25đ x 18 = 4.5đ)
      for (let i = 1; i <= 18; i++) {
        list.push({
          id: `thpt-khtn-p1-${timestamp}-${i}`,
          questionNumber: i,
          type: "single_choice",
          part: "Phần I",
          section: "Trắc nghiệm 4 lựa chọn",
          instruction: "Phần I: Chọn một phương án đúng (A, B, C hoặc D)",
          content: `Câu ${i}: [${subject}] Nhập câu hỏi lý thuyết hoặc bài tập cơ bản...`,
          options: [
            { id: "A", text: "Phương án A" },
            { id: "B", text: "Phương án B" },
            { id: "C", text: "Phương án C" },
            { id: "D", text: "Phương án D" },
          ],
          correctAnswer: "A",
          explanation: "",
          points: 0.25,
        });
      }
      // Phần II: 4 câu Đúng/Sai 4 ý (1.0đ x 4 = 4.0đ)
      for (let i = 1; i <= 4; i++) {
        const qNum = 18 + i;
        list.push({
          id: `thpt-khtn-p2-${timestamp}-${i}`,
          questionNumber: qNum,
          type: "true_false",
          part: "Phần II",
          section: "Trắc nghiệm Đúng / Sai",
          instruction: "Phần II: Trong mỗi ý a), b), c), d), chọn Đúng hoặc Sai",
          content: `Câu ${qNum}: [${subject}] Cho thí nghiệm hoặc sơ đồ biến thiên...`,
          trueFalseItems: [
            { id: "a", content: "Nhận định a...", isCorrect: true },
            { id: "b", content: "Nhận định b...", isCorrect: false },
            { id: "c", content: "Nhận định c...", isCorrect: true },
            { id: "d", content: "Nhận định d...", isCorrect: false },
          ],
          explanation: "Giải thích các ý đúng/sai theo bản chất hiện tượng khoa học.",
          points: 1.0,
        });
      }
      // Phần III: 6 câu điền số (0.25đ x 6 = 1.5đ)
      for (let i = 1; i <= 6; i++) {
        const qNum = 22 + i;
        list.push({
          id: `thpt-khtn-p3-${timestamp}-${i}`,
          questionNumber: qNum,
          type: "short_answer",
          part: "Phần III",
          section: "Trả lời ngắn",
          instruction: "Phần III: Điền kết quả số thực nghiệm",
          content: `Câu ${qNum}: [${subject}] Tính giá trị của đại lượng (viết kết quả số)...`,
          correctAnswer: "0",
          explanation: "",
          points: 0.25,
        });
      }
      return list;
    }

    // 2.3. MÔN LỊCH SỬ, ĐỊA LÝ THPT QUỐC GIA 2025 (28 câu = 10.0 điểm)
    if (subject === "Lịch sử" || subject === "Địa lý") {
      const list: ExamQuestion[] = [];
      // Phần I: 24 câu trắc nghiệm ABCD (0.25đ x 24 = 6.0đ)
      for (let i = 1; i <= 24; i++) {
        list.push({
          id: `thpt-khxh-p1-${timestamp}-${i}`,
          questionNumber: i,
          type: "single_choice",
          part: "Phần I",
          section: "Trắc nghiệm",
          instruction: "Phần I: Chọn một phương án đúng (A, B, C hoặc D)",
          content: `Câu ${i}: [${subject}] Nội dung sự kiện / phân tích số liệu...`,
          options: [
            { id: "A", text: "Phương án A" },
            { id: "B", text: "Phương án B" },
            { id: "C", text: "Phương án C" },
            { id: "D", text: "Phương án D" },
          ],
          correctAnswer: "A",
          explanation: "",
          points: 0.25,
        });
      }
      // Phần II: 4 câu Đúng/Sai 4 ý (1.0đ x 4 = 4.0đ)
      for (let i = 1; i <= 4; i++) {
        const qNum = 24 + i;
        list.push({
          id: `thpt-khxh-p2-${timestamp}-${i}`,
          questionNumber: qNum,
          type: "true_false",
          part: "Phần II",
          section: "Đúng / Sai",
          instruction: "Phần II: Xét tính đúng sai trong từng ý a), b), c), d)",
          content: `Câu ${qNum}: [${subject}] Đoạn tư liệu lịch sử hoặc bảng số liệu địa lý...`,
          trueFalseItems: [
            { id: "a", content: "Nhận định a...", isCorrect: true },
            { id: "b", content: "Nhận định b...", isCorrect: false },
            { id: "c", content: "Nhận định c...", isCorrect: true },
            { id: "d", content: "Nhận định d...", isCorrect: true },
          ],
          explanation: "",
          points: 1.0,
        });
      }
      return list;
    }

    // 2.4. MÔN TIẾNG ANH THPT QUỐC GIA 2025 (40 câu = 10.0 điểm)
    if (subject === "Tiếng Anh") {
      const list: ExamQuestion[] = [];
      for (let i = 1; i <= 40; i++) {
        let subSection = "Vocabulary & Grammar";
        if (i <= 4) subSection = "Phonetics (Pronunciation / Stress)";
        else if (i >= 18 && i <= 19) subSection = "Conversational Exchange";
        else if (i >= 20 && i <= 23) subSection = "Synonym & Antonym";
        else if (i >= 24 && i <= 28) subSection = "Cloze Reading";
        else if (i >= 29 && i <= 36) subSection = "Reading Comprehension";
        else if (i >= 37) subSection = "Sentence Transformation";

        list.push({
          id: `thpt-ta-${timestamp}-${i}`,
          questionNumber: i,
          type: "single_choice",
          part: "Phần I",
          section: subSection,
          instruction: `Mark the letter A, B, C, or D on your answer sheet (${subSection})`,
          content: `Question ${i}: [English THPT 2025 - ${subSection}] Read and choose the correct answer...`,
          options: [
            { id: "A", text: "Option A" },
            { id: "B", text: "Option B" },
            { id: "C", text: "Option C" },
            { id: "D", text: "Option D" },
          ],
          correctAnswer: "A",
          explanation: "",
          points: 0.25,
        });
      }
      return list;
    }

    // 2.5. MÔN NGỮ VĂN THPT QUỐC GIA 2025 (Cấu trúc 7 câu chuẩn Bộ GD&ĐT: 5 câu Đọc hiểu + 2 câu Viết = 10.0 điểm)
    if (subject === "Ngữ văn") {
      return [
        {
          id: `thpt-van-${timestamp}-1`,
          questionNumber: 1,
          type: "essay",
          part: "Phần I",
          section: "Đọc hiểu (Nhận biết)",
          instruction: "Phần I: Đọc hiểu văn bản (4.0 điểm)",
          content: "Câu 1: Xác định ngôi kể / thể loại / phương thức biểu đạt chính được sử dụng trong văn bản.",
          sampleEssayAnswer: "Ngôi kể: Ngôi thứ nhất (hoặc ngôi thứ ba) xưng tôi/chúng tôi.",
          rubricCriteria: ["Xác định chính xác ngôi kể / thể loại (0.5 điểm)"],
          points: 0.5,
          explanation: "Câu nhận biết trong phần Đọc hiểu ngữ liệu.",
        },
        {
          id: `thpt-van-${timestamp}-2`,
          questionNumber: 2,
          type: "essay",
          part: "Phần I",
          section: "Đọc hiểu (Nhận biết)",
          instruction: "Phần I: Đọc hiểu văn bản (4.0 điểm)",
          content: "Câu 2: Theo văn bản, tìm chi tiết / hình ảnh / sự việc được nhắc đến trong đoạn trích.",
          sampleEssayAnswer: "Chỉ ra đúng các chi tiết xuất hiện trực tiếp trong văn bản.",
          rubricCriteria: ["Nêu đúng các chi tiết/hình ảnh theo văn bản (0.5 điểm)"],
          points: 0.5,
          explanation: "Câu nhận biết trích xuất thông tin trực tiếp từ ngữ liệu.",
        },
        {
          id: `thpt-van-${timestamp}-3`,
          questionNumber: 3,
          type: "essay",
          part: "Phần I",
          section: "Đọc hiểu (Thông hiểu)",
          instruction: "Phần I: Đọc hiểu văn bản (4.0 điểm)",
          content: "Câu 3: Phân tích tác dụng của biện pháp tu từ / ý nghĩa của hình ảnh trong câu văn được chỉ định.",
          sampleEssayAnswer: "Chỉ ra biện pháp tu từ và phân tích tác dụng gợi hình, gợi cảm, nhấn mạnh nội dung tư tưởng.",
          rubricCriteria: [
            "Chỉ ra đúng biện pháp nghệ thuật (0.25 điểm)",
            "Phân tích hiệu quả biểu đạt và cảm xúc (0.75 điểm)",
          ],
          points: 1.0,
          explanation: "Câu thông hiểu nghệ thuật và nội dung ngữ liệu.",
        },
        {
          id: `thpt-van-${timestamp}-4`,
          questionNumber: 4,
          type: "essay",
          part: "Phần I",
          section: "Đọc hiểu (Vận dụng)",
          instruction: "Phần I: Đọc hiểu văn bản (4.0 điểm)",
          content: "Câu 4: Nêu vai trò / ý nghĩa của chi tiết nghệ thuật trong việc thể hiện chủ đề tư tưởng của văn bản.",
          sampleEssayAnswer: "Chi tiết thể hiện chiều sâu tâm lý nhân vật, làm nổi bật thông điệp về tình đồng đội, tình yêu quê hương đất nước.",
          rubricCriteria: [
            "Hiểu đúng hàm ý của chi tiết (0.5 điểm)",
            "Làm rõ mối liên hệ giữa chi tiết với chủ đề tác phẩm (0.5 điểm)",
          ],
          points: 1.0,
          explanation: "Câu vận dụng đánh giá chiều sâu ngữ liệu.",
        },
        {
          id: `thpt-van-${timestamp}-5`,
          questionNumber: 5,
          type: "essay",
          part: "Phần I",
          section: "Đọc hiểu (Vận dụng liên hệ)",
          instruction: "Phần I: Đọc hiểu văn bản (4.0 điểm)",
          content: "Câu 5: Chỉ ra điểm tương đồng / thông điệp ý nghĩa giữa hai ngữ liệu hoặc bài học rút ra cho bản thân.",
          sampleEssayAnswer: "Cả hai ngữ liệu đều ngợi ca tình yêu quê hương, sự gắn bó máu thịt với mảnh đất Tổ quốc.",
          rubricCriteria: [
            "Chỉ ra điểm chung về tư tưởng tình cảm (0.5 điểm)",
            "Bài học nhận thức và thái độ sống tích cực (0.5 điểm)",
          ],
          points: 1.0,
          explanation: "Câu vận dụng so sánh liên hệ định hướng GDPT 2018.",
        },
        {
          id: `thpt-van-${timestamp}-6`,
          questionNumber: 6,
          type: "essay",
          part: "Phần II",
          section: "Viết đoạn văn (NLXH)",
          instruction: "Phần II: Viết (6.0 điểm) - Câu 1: Viết đoạn văn (khoảng 200 chữ) (2.0 điểm)",
          content: "Câu 1 (2,0 điểm): Anh/Chị hãy viết đoạn văn nghị luận (khoảng 200 chữ) phân tích một khía cạnh tình cảm hoặc vấn đề xã hội rút ra từ phần Đọc hiểu.",
          sampleEssayAnswer: "Dàn ý đoạn văn 200 chữ:\n- Mở đoạn: Giới thiệu vấn đề nghị luận.\n- Thân đoạn: Phân tích, dẫn chứng thực tế, bàn luận mở rộng.\n- Kết đoạn: Khẳng định ý nghĩa và liên hệ hành động bản thân.",
          rubricCriteria: [
            "Đảm bảo hình thức đoạn văn khoảng 200 chữ (0.25 điểm)",
            "Xác định đúng vấn đề nghị luận (0.25 điểm)",
            "Triển khai lập luận thuyết phục, có dẫn chứng (1.0 điểm)",
            "Chính tả, dùng từ, diễn đạt sáng tạo (0.5 điểm)",
          ],
          points: 2.0,
          explanation: "Câu 1 phần Viết: Đoạn văn nghị luận xã hội 200 chữ.",
        },
        {
          id: `thpt-van-${timestamp}-7`,
          questionNumber: 7,
          type: "essay",
          part: "Phần II",
          section: "Viết bài văn (NLVH)",
          instruction: "Phần II: Viết (6.0 điểm) - Câu 2: Viết bài văn nghị luận (khoảng 600 chữ) (4.0 điểm)",
          content: "Câu 2 (4,0 điểm): Từ kết quả đọc hiểu văn bản và những hiểu biết về bối cảnh đời sống, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ) theo chủ đề được yêu cầu.",
          sampleEssayAnswer: "Dàn ý bài văn 600 chữ:\n- Mở bài: Dẫn dắt vấn đề và trích dẫn chủ đề.\n- Thân bài: Giải thích chủ đề; Phân tích luận điểm 1; Phân tích luận điểm 2; Dẫn chứng thực tế và văn học; Phản đề & mở rộng.\n- Kết bài: Đánh giá tổng quát, rút ra bài học cho tuổi trẻ.",
          rubricCriteria: [
            "Cấu trúc bài văn đầy đủ Mở - Thân - Kết (0.5 điểm)",
            "Xác định đúng vấn đề nghị luận (0.5 điểm)",
            "Hệ thống luận điểm chặt chẽ, dẫn chứng xác đáng (2.0 điểm)",
            "Đánh giá khái quát và liên hệ sâu sắc (0.5 điểm)",
            "Sáng tạo, hành văn truyền cảm, không sai ngữ pháp (0.5 điểm)",
          ],
          points: 4.0,
          explanation: "Câu 2 phần Viết: Bài văn nghị luận 600 chữ.",
        },
      ];
    }
  }

  // =========================================================================
  // TRƯỜNG HỢP 3: ĐGNL / ĐGTD (50 câu trắc nghiệm tổng hợp chuẩn)
  // =========================================================================
  const count = category === "ĐGTD Bách Khoa" ? 40 : 50;
  const pt = count === 40 ? 0.25 : 0.2;
  const list: ExamQuestion[] = [];
  for (let i = 1; i <= count; i++) {
    list.push({
      id: `dgnl-${timestamp}-${i}`,
      questionNumber: i,
      type: "single_choice",
      part: "Trắc nghiệm",
      section: `Phần ${i <= 20 ? "Tư duy ngôn ngữ" : "Tư duy logic & Khoa học"}`,
      instruction: "Chọn một phương án đúng (A, B, C hoặc D)",
      content: `Câu ${i}: [${category} - ${subject}] Nhập câu hỏi tư duy logic / xử lý số liệu ${i}...`,
      options: [
        { id: "A", text: "Phương án A" },
        { id: "B", text: "Phương án B" },
        { id: "C", text: "Phương án C" },
        { id: "D", text: "Phương án D" },
      ],
      correctAnswer: "A",
      explanation: "",
      points: pt,
    });
  }
  return list;
}

// Giữ lại alias để tương thích ngược
export const generateSubjectQuestionTemplate = (
  subject: ExamItem["subject"] = "Toán học",
  mode: "full_50" | "moet_standard" = "full_50"
) => {
  const cat: ExamItem["category"] = mode === "moet_standard" ? "THPT Quốc Gia" : "Kiểm tra Học kỳ";
  return generateExamTemplateByCategoryAndSubject(subject, cat);
};
