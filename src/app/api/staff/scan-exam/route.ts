import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helpers";
import { ExamQuestion } from "@/components/exam/exam-data";

export const maxDuration = 60; // Hỗ trợ thời gian xử lý file lớn lên đến 60 giây

interface DatalabMarkerResponse {
  request_check_url?: string;
  request_id?: string;
  markdown?: string;
  text?: string;
  status?: string;
  error?: string;
}

const SYSTEM_PROMPT = `
Bạn là chuyên gia thẩm định và số hóa đề thi hàng đầu của Bộ Giáo dục và Đào tạo Việt Nam (chuẩn cấu trúc GDPT 2018 / 2025).
Nhiệm vụ của bạn:
1. Đọc và phân tích kỹ lưỡng nội dung đề thi được cung cấp (văn bản OCR hoặc hình ảnh/tài liệu).
2. TỰ ĐỘNG PHỤC HỒI & BÙ KHUYẾT CÂU CHỮ BỊ MẤT:
   - Do quá trình scan hoặc OCR ảnh chụp bị mờ, nhiều câu có thể bị đứt đoạn, mất dấu, mất từ (ví dụ: "hàm số đồng b... ", "điểm cực đ... ", "f'(x) = x^2 - ...").
   - Dựa vào logic học thuật (Toán học, Vật lý, Hóa học, Sinh học, Ngữ văn, Lịch sử, Địa lý, Tiếng Anh,...) và ngữ cảnh để PHỤC HỒI HOÀN CHỈNH câu từ.
   - Giữ nguyên công thức toán học dưới dạng LaTeX chuẩn: $...$ (nội dòng) hoặc $$...$$ (khối).
3. PHÂN LOẠI CHUẨN XÁC VÀO CÁC ĐỊNH DẠNG ĐỀ THI CỦA BỘ GD&ĐT:
   - Dạng 1 ("single_choice" - Phần I): Trắc nghiệm nhiều lựa chọn. Thường có 4 đáp án A, B, C, D. Điểm mặc định 0.25đ.
     Mỗi lựa chọn là 1 object { "id": "A"|"B"|"C"|"D", "text": "Nội dung" }.
   - Dạng 2 ("true_false" - Phần II): Trắc nghiệm Đúng / Sai. Mỗi câu gồm 4 khẳng định a), b), c), d). Điểm mặc định 1.0đ.
     Mỗi khẳng định là 1 object { "id": "a"|"b"|"c"|"d", "content": "Khẳng định...", "isCorrect": boolean, "explanation": "..." }.
   - Dạng 3 ("short_answer" - Phần III): Trắc nghiệm trả lời ngắn / Điền số. Đáp án đúng là 1 giá trị số cụ thể (VD: "20.5", "-3", "12") hoặc cụm từ ngắn. Điểm mặc định 0.5đ.
   - Dạng 4 ("essay" - Tự luận / Ngữ văn):
     Đặc biệt quan trọng với môn Ngữ văn (Phần I Đọc hiểu 5 câu, Phần II Viết 2 câu) và tự luận các môn.
     Bao gồm:
     + sampleEssayAnswer: Hướng dẫn giải / dàn ý trả lời súc tích dạng 2-3 gạch đầu dòng (KHÔNG viết cả bài văn dài để tối ưu tốc độ).
     + rubricCriteria: 2-4 tiêu chí barem điểm cụ thể kèm điểm (VD: ["Xác định đúng ngôi kể (0.5đ)"]).
4. TỰ ĐỘNG TÌM HOẶC SUY LUẬN ĐÁP ÁN:
   - Nếu trong tài liệu có bảng đáp án, hãy trích xuất chính xác vào từng câu.
   - Nếu chưa có sẵn đáp án, hãy giải và điền đáp án chuẩn xác nhất kèm giải thích ngắn gọn (explanation).
5. ĐỊNH DẠNG ĐẦU RA:
   - Trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm backticks markdown hay văn bản thừa ngoài JSON).
   - Cấu trúc JSON bắt buộc:
{
  "examTitle": "Tên đề thi nếu có (ví dụ: Đề thi tốt nghiệp THPT 2025 – Môn Ngữ văn)",
  "subject": "Toán học" | "Vật lý" | "Hóa học" | "Sinh học" | "Tiếng Anh" | "Ngữ văn" | "Lịch sử" | "Địa lý" | "Khác",
  "questions": [
    {
      "questionNumber": 1,
      "type": "single_choice" | "true_false" | "short_answer" | "essay",
      "part": "Phần I" | "Phần II" | "Phần III" | "Phần IV",
      "section": "Đọc hiểu" | "Nghị luận xã hội" | "Nghị luận văn học" | "Trắc nghiệm",
      "instruction": "Hướng dẫn câu hỏi",
      "content": "Nội dung câu hỏi đã được sửa lỗi chính tả và phục hồi...",
      "options": [{ "id": "A", "text": "..." }],
      "trueFalseItems": [{ "id": "a", "content": "...", "isCorrect": true }],
      "correctAnswer": "A",
      "explanation": "Giải thích ngắn gọn...",
      "sampleEssayAnswer": "Dàn ý súc tích...",
      "rubricCriteria": ["Tiêu chí 1 (0.5đ)"],
      "points": 0.25
    }
  ]
}
`;

/**
 * PHASE 2: Hàm bóc tách JSON an toàn, tự động sửa lỗi ký tự thoát LaTeX
 * Giữ nguyên các escape chuẩn của JSON (\" \\ \/ \n \r \t \b),
 * nhưng chuyển các lệnh LaTeX phổ biến (\frac, \sqrt, \alpha, \beta, \theta, \tan, \cos, \int, v.v.)
 * thành \\frac, \\sqrt... để không làm sập JSON.parse().
 */
export function safeParseExamJson<T = any>(raw: string): T {
  // 1. Xóa bọc markdown code fences nếu có
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (initialErr) {
    console.warn("[SafeParseExamJson] Initial parse failed, attempting LaTeX escape recovery...");
    try {
      // 2. Sửa lỗi ký tự thoát LaTeX (\frac, \sqrt, \tan, \beta...) làm gãy JSON.parse
      const fixedLatexEscapes = cleaned.replace(
        /\\(?!["\\/]|u[0-9a-fA-F]{4}|[nrtbf]\b)(?=[a-zA-Z{}_^])/g,
        "\\\\"
      );
      return JSON.parse(fixedLatexEscapes) as T;
    } catch (secondErr: any) {
      console.error("[SafeParseExamJson] Fatal parse error:", secondErr.message);
      throw new Error(`Định dạng dữ liệu đề thi trả về không hợp lệ: ${secondErr.message}`);
    }
  }
}

/**
 * PHASE 3: Gọi Datalab Marker API có Timeout cứng 20s và kết hợp client AbortSignal
 */
async function extractWithDatalab(file: File, clientSignal?: AbortSignal): Promise<string> {
  const apiKey = process.env.DATALAB_API_KEY;
  if (!apiKey) {
    throw new Error("Chưa cấu hình DATALAB_API_KEY trong hệ thống.");
  }

  // Kết hợp tín hiệu hủy từ người dùng và timeout cứng 20 giây cho Datalab
  const timeoutSignal = AbortSignal.timeout(20000);
  const datalabSignal = clientSignal
    ? AbortSignal.any([clientSignal, timeoutSignal])
    : timeoutSignal;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("output_format", "markdown");
  formData.append("force_ocr", "true");

  const res = await fetch("https://www.datalab.to/api/v1/convert", {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
    },
    body: formData,
    signal: datalabSignal,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Datalab API lỗi (${res.status}): ${errText}`);
  }

  let result: DatalabMarkerResponse = await res.json();

  // Nếu Datalab xử lý bất đồng bộ qua queue polling
  if (result.request_check_url) {
    let attempts = 0;
    while (attempts < 15) {
      if (clientSignal?.aborted) throw new DOMException("Aborted", "AbortError");
      await new Promise((r) => setTimeout(r, 1200));

      const pollTimeout = AbortSignal.timeout(6000);
      const pollSignal = clientSignal
        ? AbortSignal.any([clientSignal, pollTimeout])
        : pollTimeout;

      const checkRes = await fetch(result.request_check_url, {
        headers: { "X-API-Key": apiKey },
        signal: pollSignal,
      });

      if (checkRes.ok) {
        const checkData: DatalabMarkerResponse = await checkRes.json();
        if (checkData.status === "complete") {
          result = checkData;
          break;
        }
        if (checkData.status === "failed") {
          throw new Error(checkData.error || "Datalab OCR xử lý tệp thất bại.");
        }
      }
      attempts++;
    }
  }

  return result.markdown || result.text || "";
}

/**
 * PHASE 3: Gọi Gemini AI an toàn, hỗ trợ ngắt kết nối xuyên suốt & parse LaTeX chống gãy
 */
async function runGeminiProcess(contents: any[], clientSignal?: AbortSignal): Promise<any> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("Chưa cấu hình GEMINI_API_KEY trong hệ thống.");
  }

  // Phân luồng AI: CHỈ sử dụng Gemini 3.5 (Flash Lite & Flash) cho việc scan đề thi
  // Tuyệt đối không sử dụng Gemini 3.8 để tránh bị dính giới hạn 20 requests/ngày của Free Tier
  const candidateModels = [
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    if (clientSignal?.aborted) throw new DOMException("Aborted", "AbortError");
    try {
      console.log(`[ScanExam] Trying Gemini model: ${model}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

      const modelTimeout = AbortSignal.timeout(45000); // 45s timeout per model để đủ thời gian bóc tách toàn bộ 40-50 câu
      const combinedSignal = clientSignal
        ? AbortSignal.any([clientSignal, modelTimeout])
        : modelTimeout;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2, // Giữ độ chính xác cao cho câu hỏi và đáp án
          },
        }),
        signal: combinedSignal,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.warn(`[ScanExam] Model ${model} returned error:`, errJson.error?.message || res.status);
        lastError = errJson.error?.message || `HTTP ${res.status}`;
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("Không nhận được phản hồi nội dung từ AI");
      }

      console.log(`[ScanExam] Successfully generated with model: ${model}`);
      return safeParseExamJson(rawText);
    } catch (err: any) {
      if (err?.name === "AbortError" && clientSignal?.aborted) {
        throw err;
      }
      console.warn(`[ScanExam] Model ${model} catch error:`, err.message);
      lastError = err.message || err;
    }
  }

  throw new Error(`Xử lý AI thất bại: ${lastError}`);
}

export async function POST(req: NextRequest) {
  try {
    let rawText = "";
    let files: File[] = [];
    let preferredEngine = "auto";
    let targetSubject = "Toán học";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const jsonBody = await req.json().catch(() => ({}));
      rawText = jsonBody.rawText || "";
      preferredEngine = jsonBody.engine || "auto";
      targetSubject = jsonBody.subject || "Toán học";
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      rawText = (formData.get("rawText") as string) || "";
      preferredEngine = (formData.get("engine") as string) || "auto";
      targetSubject = (formData.get("subject") as string) || "Toán học";

      // Hỗ trợ tải nhiều file (ví dụ trang đề bài + trang bảng đáp án)
      const allFiles = formData.getAll("file") as File[];
      files = allFiles.filter((f) => f && f.size > 0);
    }

    if (!rawText && files.length === 0) {
      return NextResponse.json({ error: "Vui lòng tải lên tệp đề thi hoặc dán nội dung văn bản thô." }, { status: 400 });
    }

    // Kiểm tra quyền (không bắt buộc chặn cứng trong dev)
    try {
      const user = await getAuthenticatedUser(req);
      if (!user && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Vui lòng đăng nhập với quyền Staff/Admin để scan đề thi." }, { status: 401 });
      }
    } catch {
      // Bỏ qua lỗi auth trong dev
    }

    let extractedText = rawText;
    let engineUsed = "text_direct";

    // 2. Xử lý tệp (nếu có)
    if (files.length > 0) {
      const hasDatalabKey = Boolean(process.env.DATALAB_API_KEY);

      if (preferredEngine !== "gemini" && hasDatalabKey) {
        // Ưu tiên chạy qua Datalab trước
        try {
          const parts: string[] = [];
          for (let i = 0; i < files.length; i++) {
            if (req.signal.aborted) {
              return new Response(JSON.stringify({ success: false, aborted: true }), { status: 499 });
            }
            const f = files[i];
            const text = await extractWithDatalab(f, req.signal);
            parts.push(`### TÀI LIỆU TRANG ${i + 1} (${f.name}):\n${text}`);
          }
          extractedText = parts.join("\n\n---\n\n");
          engineUsed = "datalab_ocr + gemini_ai";
        } catch (datalabErr: any) {
          if (req.signal.aborted) {
            return new Response(JSON.stringify({ success: false, aborted: true }), { status: 499 });
          }
          console.warn("[ScanExam] Datalab fallback to Gemini Multimodal:", datalabErr.message);
          // Tự động fallback sang Gemini Multimodal Direct nếu Datalab lỗi
          engineUsed = "gemini_multimodal_direct";
        }
      } else {
        engineUsed = "gemini_multimodal_direct";
      }
    }

    if (req.signal.aborted) {
      return new Response(JSON.stringify({ success: false, aborted: true }), { status: 499 });
    }

    // 3. Chuẩn bị payload gửi cho Gemini kèm chỉ dẫn môn học và bóc tách đáp án
    const contents: any[] = [];
    let subjectInstruction = `
MÔN THI ĐƯỢC CHỈ ĐỊNH: ${targetSubject}
YÊU CẦU ĐẶC BIỆT:
1. Đọc và phân loại đề thi theo đúng đặc thù và cấu trúc ma trận của môn ${targetSubject}.
2. TỰ ĐỘNG BÓC TÁCH VÀ ĐIỀN ĐÁP ÁN:
   - Nếu trong tài liệu có BẢNG ĐÁP ÁN (ví dụ bảng đáp án trắc nghiệm ở cuối đề, dạng lưới hoặc dạng danh sách 1.A, 2.B, 3.C...), hãy TRÍCH XUẤT ĐẦY ĐỦ và gán chính xác vào trường "correctAnswer" của từng câu tương ứng.
   - Đối với câu hỏi Đúng/Sai (Phần II): Hãy gán chuẩn xác "isCorrect": true hoặc false cho từng ý a), b), c), d).
   - Đối với câu Điền số (Phần III): Hãy ghi kết quả số chuẩn vào "correctAnswer".
   - Nếu tài liệu KHÔNG KÈM bảng đáp án: Bạn hãy TỰ ĐỘNG GIẢI CHI TIẾT TỪNG CÂU và điền đáp án chuẩn xác nhất. Lời giải thích ("explanation") viết NGẮN GỌN súc tích (1-2 câu trọng tâm hoặc công thức chính), KHÔNG viết bài văn giải dài dòng cho cả 50 câu để tăng tốc độ và tránh tràn token.
3. TỰ ĐỘNG PHỤC HỒI CHỮ MỜ & CÔNG THỨC TOÁN LATEX:
   - Khôi phục mọi câu chữ bị mờ, mất dấu hoặc đứt đoạn.
   - Giữ nguyên công thức toán chuẩn LaTeX ($...$ hoặc $$...$$).
`;

    if (targetSubject === "Ngữ văn") {
      subjectInstruction = `
MÔN THI ĐƯỢC CHỈ ĐỊNH: Ngữ văn (Bộ GD&ĐT chuẩn GDPT 2018 / 2025)
YÊU CẦU ĐẶC BIỆT CHO MÔN NGỮ VĂN:
1. Cấu trúc chuẩn gồm 2 phần với tổng cộng 7 câu hỏi tự luận ("type": "essay"):
   - PHẦN I: ĐỌC HIỂU (4,0 điểm) - Bóc tách đầy đủ 5 câu hỏi từ Câu 1 đến Câu 5.
     + Câu 1 (0.5đ): Nhận biết (ngôi kể, thể thơ, PTBĐ,...). "part": "Phần I", "section": "Đọc hiểu".
     + Câu 2 (0.5đ): Nhận biết (chi tiết, hình ảnh xuất hiện trong ngữ liệu). "part": "Phần I", "section": "Đọc hiểu".
     + Câu 3 (1.0đ): Thông hiểu (biện pháp tu từ, ý nghĩa câu văn). "part": "Phần I", "section": "Đọc hiểu".
     + Câu 4 (1.0đ): Vận dụng (vai trò chi tiết, tác dụng nghệ thuật). "part": "Phần I", "section": "Đọc hiểu".
     + Câu 5 (1.0đ): Vận dụng liên hệ / so sánh 2 ngữ liệu hoặc rút ra bài học. "part": "Phần I", "section": "Đọc hiểu".
   - PHẦN II: VIẾT (6,0 điểm) - Gồm 2 câu:
     + Câu 6 (hoặc Câu 1 Phần Viết) (2.0đ): Viết đoạn văn nghị luận xã hội (khoảng 200 chữ). "part": "Phần II", "section": "Viết đoạn văn (NLXH)".
     + Câu 7 (hoặc Câu 2 Phần Viết) (4.0đ): Viết bài văn nghị luận (khoảng 600 chữ). "part": "Phần II", "section": "Viết bài văn (NLVH)".
2. TỐC ĐỘ & GỢI Ý ĐÁP ÁN:
   - Đối với từng câu, viết "sampleEssayAnswer" dưới dạng DÀN Ý SÚC TÍCH (2-3 gạch đầu dòng ngắn gọn, KHÔNG viết bài văn dài hàng nghìn chữ).
   - Viết "rubricCriteria" gồm 2-4 tiêu chí barem điểm cụ thể kèm điểm số (VD: ["Xác định đúng ngôi kể (0.5đ)"]).
3. Đảm bảo toàn bộ 7 câu hỏi đều được bóc tách và phân loại thành công!
`;
    }

    if (files.length > 0 && engineUsed === "gemini_multimodal_direct") {
      const parts: any[] = [
        { text: SYSTEM_PROMPT },
        { text: subjectInstruction },
      ];

      for (const f of files) {
        const arrayBuffer = await f.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = f.type || "application/pdf";
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        });
      }

      parts.push({
        text: "Hãy phân tích toàn bộ các hình ảnh/tệp đính kèm ở trên, bóc tách đề bài và bảng đáp án, phục hồi câu chữ mờ và xuất ra JSON câu hỏi hoàn chỉnh.",
      });

      contents.push({ parts });
    } else {
      contents.push({
        parts: [
          { text: SYSTEM_PROMPT },
          { text: subjectInstruction },
          {
            text: `Dưới đây là văn bản đề thi thô được bóc tách từ tài liệu (gồm đề bài và có thể có bảng đáp án ở cuối):\n\n---\n${extractedText}\n---`,
          },
        ],
      });
    }

    // 4. Thực thi phân tích và cấu trúc hóa bằng Gemini
    const aiResult = await runGeminiProcess(contents, req.signal);

    const questions: ExamQuestion[] = (aiResult.questions || []).map((q: any, idx: number) => {
      // Đảm bảo dữ liệu đầy đủ trường theo chuẩn ExamQuestion
      const type = q.type || "single_choice";
      let defaultPart = "Phần I";
      let defaultInstruction = "Phần I: Chọn một đáp án đúng (A, B, C hoặc D)";
      let defaultPoints = 0.25;

      if (type === "true_false") {
        defaultPart = "Phần II";
        defaultInstruction = "Phần II: Trong mỗi ý a), b), c), d), chọn Đúng hoặc Sai";
        defaultPoints = 1.0;
      } else if (type === "short_answer") {
        defaultPart = "Phần III";
        defaultInstruction = "Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)";
        defaultPoints = 0.5;
      } else if (type === "essay") {
        defaultPart = idx >= 5 ? "Phần II" : "Phần I";
        defaultInstruction = idx >= 5
          ? (idx === 5 ? "Phần II: Viết đoạn văn nghị luận (2.0 điểm)" : "Phần II: Viết bài văn nghị luận (4.0 điểm)")
          : "Phần I: Đọc hiểu văn bản (4.0 điểm)";
        defaultPoints = idx < 2 ? 0.5 : (idx < 5 ? 1.0 : (idx === 5 ? 2.0 : 4.0));
      }

      return {
        id: `scanned-${Date.now()}-${idx + 1}`,
        questionNumber: idx + 1,
        type: type,
        part: q.part || defaultPart,
        section: q.section || (type === "essay" ? (idx >= 5 ? "Phần Viết" : "Đọc hiểu") : "Trắc nghiệm"),
        instruction: q.instruction || defaultInstruction,
        content: q.content || "",
        options: q.options || [],
        trueFalseItems: q.trueFalseItems || [],
        correctAnswer: q.correctAnswer || "",
        explanation: q.explanation || "",
        sampleEssayAnswer: q.sampleEssayAnswer || "",
        rubricCriteria: q.rubricCriteria || [],
        points: q.points !== undefined && !isNaN(Number(q.points)) ? Number(q.points) : defaultPoints,
      };
    });

    return NextResponse.json({
      success: true,
      examTitle: aiResult.examTitle || "",
      subject: aiResult.subject || "",
      questions,
      engineUsed,
      totalQuestions: questions.length,
      rawExtractedLength: extractedText.length,
    });
  } catch (error: any) {
    console.error("[ScanExam Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Đã xảy ra lỗi trong quá trình quét và phục hồi đề thi.",
      },
      { status: 500 }
    );
  }
}
