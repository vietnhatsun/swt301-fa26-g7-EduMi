"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Plus,
  Image as ImageIcon,
  Mic,
  MicOff,
  Bot,
  User,
  PanelLeftClose,
  PanelLeft,
  Pin,
  Clock,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  ArrowRight,
  BookOpen,
  Calculator,
  Compass,
  FileText,
  Flame,
  ChevronDown,
  Layers,
  ArrowUp,
  Bookmark,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Search,
  ExternalLink,
  Info,
  HelpCircle,
  Lightbulb,
  Leaf,
  Sprout,
  CheckCircle2,
  Paperclip,
  Crown,
} from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Định nghĩa giao diện tin nhắn
interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  mode?: string;
  imageAttachment?: string;
  sections?: {
    type: "step" | "formula" | "tip" | "practice";
    title?: string;
    content: string;
  }[];
}

// Định nghĩa phiên trò chuyện
interface ChatSession {
  id: string;
  title: string;
  dateGroup: "Hôm nay" | "Hôm qua" | "7 ngày trước";
  isPinned?: boolean;
  topic?: string;
  messages: ChatMessage[];
}

// Dữ liệu mẫu các phiên trò chuyện gần đây chuẩn EduMi
const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: "session-1",
    title: "Giải câu 45 Đề Toán THPTQG: Tích phân hàm ẩn",
    dateGroup: "Hôm nay",
    isPinned: true,
    topic: "Toán 12",
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Cho hàm số f(x) liên tục trên R thỏa mãn f(x) + 2f(-x) = 3x^2 - 2x. Tính tích phân I từ -1 đến 1 của f(x)dx.",
        timestamp: "10:30",
      },
      {
        id: "m2",
        sender: "assistant",
        text: "Chào Sun! Đây là dạng toán Tích phân đổi biến đối xứng (hàm chẵn - hàm lẻ) rất hay gặp trong đề thi tốt nghiệp THPT.",
        timestamp: "10:30",
        sections: [
          {
            type: "step",
            title: "Bước 1: Thiết lập hệ phương trình hàm",
            content:
              "Từ giả thiết (1): f(x) + 2f(-x) = 3x² - 2x\nThay x bởi -x vào (1), ta được (2): f(-x) + 2f(x) = 3(-x)² - 2(-x) = 3x² + 2x",
          },
          {
            type: "step",
            title: "Bước 2: Tìm biểu thức tường minh của f(x)",
            content:
              "Nhân 2 vào phương trình (2) rồi trừ đi phương trình (1):\n2[2f(x) + f(-x)] - [f(x) + 2f(-x)] = 2(3x² + 2x) - (3x² - 2x)\n<=> 3f(x) = 3x² + 6x  =>  f(x) = x² + 2x",
          },
          {
            type: "step",
            title: "Bước 3: Tính giá trị tích phân I",
            content:
              "I = ∫[-1 đến 1] (x² + 2x) dx\n= [x³/3 + x²] từ -1 đến 1\n= (1/3 + 1) - (-1/3 + 1) = 2/3.",
          },
          {
            type: "tip",
            title: "💡 Mẹo bấm máy Casio 580VNX",
            content:
              "Cộng (1) và (2): 3[f(x) + f(-x)] = 6x² => f(x) + f(-x) = 2x². Lấy tích phân 2 vế trên [-1, 1], vì ∫ f(-x)dx = ∫ f(x)dx nên 2I = ∫[-1..1] 2x² dx = 4/3 => I = 2/3 trong 5 giây!",
          },
        ],
      },
    ],
  },
  {
    id: "session-2",
    title: "10 Cụm Phrasal Verbs hay bẫy trong Đọc hiểu",
    dateGroup: "Hôm nay",
    isPinned: false,
    topic: "Tiếng Anh",
    messages: [],
  },
  {
    id: "session-3",
    title: "Chiến thuật xử lý 150 câu bài thi ĐGNL HSA",
    dateGroup: "Hôm qua",
    isPinned: true,
    topic: "Luyện thi ĐGNL",
    messages: [],
  },
  {
    id: "session-4",
    title: "Dàn ý mở bài gián tiếp: Tác phẩm Đất Nước",
    dateGroup: "7 ngày trước",
    isPinned: false,
    topic: "Ngữ văn 12",
    messages: [],
  },
];

// Danh sách các chuyên gia AI chuyên biệt
const AI_SPECIALISTS = [
  {
    id: "scanner",
    name: "AI Exam Scanner",
    desc: "Bóc tách câu hỏi bẫy & lỗi sai trong 1.5s",
    icon: Sparkles,
    badge: "1.5s ⚡",
    prompt:
      "Hãy giúp mình bóc tách câu hỏi bẫy này và chỉ ra lý do vì sao học sinh hay bị lừa ở các phương án nhiễu:",
  },
  {
    id: "casio",
    name: "Thủ thuật Casio 580VNX",
    desc: "Mẹo bấm máy tính Table, Vector & Oxyz",
    icon: Calculator,
    badge: "Toán 12 🧮",
    prompt:
      "Hướng dẫn mình mẹo bấm máy tính Casio 580VNX để giải nhanh dạng toán này mà không bị bẫy tham số:",
  },
  {
    id: "dgnl",
    name: "Luyện thi ĐGNL (HSA / VNU)",
    desc: "Tư duy định lượng & suy luận logic",
    icon: Compass,
    badge: "HSA 850+ 🎯",
    prompt:
      "Cho mình lời khuyên và chiến lược phân bổ thời gian để xử lý bài toán tư duy định lượng kỳ thi ĐGNL:",
  },
  {
    id: "literature",
    name: "Cố vấn Ngữ văn 12",
    desc: "Công thức mở bài - kết bài gián tiếp 8.5+",
    icon: BookOpen,
    badge: "Văn 8.5+ ✍️",
    prompt:
      "Viết giúp mình 2 đoạn mở bài gián tiếp bằng nhận định lý luận văn học và dẫn chứng thời sự cho đề bài sau:",
  },
];

// Các thẻ gợi ý câu hỏi nhanh (Quick Action Options phong cách ChatGPT)
const QUICK_PROMPT_PILLS = [
  {
    id: "qp-1",
    label: "Bóc tách câu hỏi bẫy đề thi",
    icon: Sparkles,
    prompt:
      "Mình có một câu hỏi trắc nghiệm hay bị nhầm lẫn phương án nhiễu. Bạn hãy phân tích bẫy đề bài và cách loại trừ đáp án giúp mình nhé!",
  },
  {
    id: "qp-2",
    label: "Thủ thuật Casio 580VNX giải nhanh",
    icon: Calculator,
    prompt:
      "Hướng dẫn mình các lệnh bấm máy tính Casio 580VNX (Menu 8 Table và Menu 5 Vector) để giải nhanh câu hình học không gian Oxyz.",
  },
  {
    id: "qp-3",
    label: "Công thức Mở bài - Kết bài Văn 8.5+",
    icon: FileText,
    prompt:
      "Chia sẻ cho mình công thức mở bài gián tiếp đi từ lý luận văn học áp dụng cho các tác phẩm thơ ca hiện đại lớp 12.",
  },
  {
    id: "qp-4",
    label: "Chiến thuật Skimming & Scanning Tiếng Anh",
    icon: Compass,
    prompt:
      "Cho mình các mẹo Skimming & Scanning để xử lý bài đọc hiểu dài 400 từ môn Tiếng Anh THPT trong vòng 7 phút.",
  },
];

export default function AssistantPage() {
  const [sessions, setSessions] = useState<ChatSession[]>(INITIAL_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>("session-1");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isDeepThink, setIsDeepThink] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chat" | "work">("chat");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("Capy Mentor 2026");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState<string>("");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy phiên trò chuyện hiện tại
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentSession?.messages, isGenerating]);

  // Tạo cuộc trò chuyện mới
  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: "Cuộc trò chuyện mới",
      dateGroup: "Hôm nay",
      isPinned: false,
      messages: [],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSessionId);
  };

  // Gửi tin nhắn
  const handleSendMessage = (textToSend?: string) => {
    const msgText = (textToSend || inputMessage).trim();
    if (!msgText || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Cập nhật tin nhắn người dùng
    const updatedSessions = sessions.map((s) => {
      if (s.id === activeSessionId) {
        const isFirstMessage = s.messages.length === 0;
        return {
          ...s,
          title: isFirstMessage ? msgText.slice(0, 32) + "..." : s.title,
          messages: [...s.messages, userMsg],
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    setInputMessage("");
    setIsGenerating(true);

    // Giả lập câu trả lời thông minh từ Capy AI theo phong cách EduMi
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: `Chào bạn! Capy AI đã nhận được câu hỏi: "${msgText}". Dưới đây là phân tích chi tiết chuẩn kiến thức ma trận thi 2026 từ EduMi:`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sections: [
          {
            type: "step",
            title: "1. Nhận diện bẫy tư duy & Bản chất câu hỏi",
            content:
              "Đề bài thường phân hóa học sinh ở bước xác định điều kiện ẩn hoặc biến đổi công thức. Đừng vội tính toán ngay, hãy gạch chân từ khóa chính và loại bỏ các phương án nhiễu có dấu hiệu mâu thuẫn.",
          },
          {
            type: "step",
            title: "2. Quy trình lập luận từng bước (Step-by-step)",
            content:
              "• Bước 1: Chuẩn hóa giả thiết về dạng đơn giản nhất.\n• Bước 2: Áp dụng phương pháp đặc trưng (Đổi biến, tọa độ hóa Oxyz, hoặc liên kết ngữ cảnh).\n• Bước 3: So chiếu với 4 đáp án A, B, C, D để kết luận chính xác.",
          },
          {
            type: "tip",
            title: "💡 Lời khuyên phòng thi từ EduMi",
            content:
              "Dành tối đa 90 giây cho câu hỏi mức độ Vận dụng. Nếu gặp bế tắc, hãy dùng máy tính kiểm tra giá trị đặc biệt hoặc tạm thời chuyển câu tiếp theo để bảo toàn nhịp sinh học.",
          },
          {
            type: "practice",
            title: "🎯 Câu hỏi tương tự để bạn tự rèn luyện",
            content:
              "Bạn có muốn mình tạo thêm 1 câu hỏi tương tự cùng mức độ 8.5+ để bạn thử sức ngay không? Hãy gõ 'Tiếp tục' nhé!",
          },
        ],
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMsg] } : s
        )
      );
      setIsGenerating(false);
    }, 1200);
  };

  // Sao chép nội dung tin nhắn
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Giả lập ghi âm giọng nói
  const handleToggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setInputMessage("Chỉ cho mình mẹo giải bài toán hàm số đồng biến nghịch biến trên R");
        setIsListening(false);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  // Giả lập tải ảnh đề thi (AI Exam Scanner)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputMessage(`[Đã tải lên ảnh đề thi: ${file.name}] - Nhờ Capy AI giải chi tiết và tìm lỗi bẫy giúp mình nhé!`);
    }
  };

  // Lọc lịch sử theo tìm kiếm
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  const isChatEmpty = currentSession.messages.length === 0;

  return (
    <div
      className={`${beVietnam.className} flex h-screen w-full overflow-hidden bg-[#7f9b5d] text-[#10213a] selection:bg-emerald-200 selection:text-emerald-950`}
    >
      
      {/* ════════════════════════════════════════════════════════════════════════
          1. SIDEBAR TRÁI (Chuẩn Bố Cục ChatGPT & Tông Màu EduMi Trắng - Xanh)
          ════════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`${
          isSidebarOpen ? "w-64 sm:w-72" : "w-0 -translate-x-full"
        } transition-all duration-300 ease-in-out flex flex-col bg-white border-r border-[#e2e9e2] shadow-[0_12px_34px_rgba(25,60,35,0.12)] z-30 relative shrink-0 overflow-hidden`}
      >
        {/* Sidebar Header Bar */}
        <div className="h-14 px-3.5 border-b border-[#eef2ee] flex items-center justify-between bg-white shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-[#00a66f] flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-sm tracking-tight text-[#092235] group-hover:text-[#00a66f] transition-colors">
                  EduMi AI
                </span>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#00a66f] font-black border border-emerald-300/40">
                  v2.6
                </span>
              </div>
              <span className="text-[10px] text-[#64728a] font-semibold block mt-0.5">
                Trợ lý học tập thông minh
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-[#64728a] hover:text-[#092235] flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng thanh bên"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Nút Cuộc trò chuyện mới (Tương tự ChatGPT) */}
        <div className="p-3 pb-2 bg-white shrink-0">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full h-10 flex items-center justify-between px-3.5 rounded-xl bg-[#00a66f] hover:bg-[#008b5f] text-white font-extrabold text-xs sm:text-[13px] shadow-sm shadow-emerald-700/20 transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Trò chuyện mới</span>
            </span>
            <span className="text-[10px] bg-black/15 px-2 py-0.5 rounded-md text-white font-mono">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Thanh tìm kiếm lịch sử đàm thoại */}
        <div className="px-3 pb-2 bg-white shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#7a8795] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchHistoryQuery}
              onChange={(e) => setSearchHistoryQuery(e.target.value)}
              placeholder="Tìm kiếm đoạn chat..."
              className="w-full h-8 pl-8 pr-3 bg-[#f5f8f5] border border-[#e2e9e2] rounded-xl text-xs text-[#10213a] placeholder-[#7a8795] focus:outline-none focus:border-[#00a66f] focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Danh sách cuộn: Chuyên gia học tập & Lịch sử trò chuyện */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4 bg-white scrollbar-thin scrollbar-thumb-emerald-200">
          
          {/* Nhóm: Chuyên gia học tập (Specialists) */}
          <div>
            <div className="text-[10.5px] font-black uppercase tracking-wider text-[#00a66f] px-2 mb-1 flex items-center justify-between">
              <span>Chuyên gia học tập</span>
              <Sparkles className="w-3 h-3 text-[#00a66f]" />
            </div>
            <div className="space-y-0.5">
              {AI_SPECIALISTS.map((spec) => {
                const Icon = spec.icon;
                return (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => handleSendMessage(spec.prompt)}
                    className="w-full h-11 text-left px-2.5 rounded-xl hover:bg-[#f2f7f2] border border-transparent hover:border-emerald-200 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#00a66f] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#10213a] group-hover:text-[#00a66f] truncate leading-tight">
                          {spec.name}
                        </p>
                        <p className="text-[10px] text-[#64728a] truncate font-medium">
                          {spec.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#00a66f] shrink-0 border border-emerald-200">
                      {spec.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nhóm: Đã ghim (Pinned Chats) */}
          <div>
            <div className="text-[10.5px] font-black uppercase tracking-wider text-[#64728a] px-2 mb-1 flex items-center justify-between">
              <span>Đã ghim</span>
              <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />
            </div>
            <div className="space-y-0.5">
              {sessions
                .filter((s) => s.isPinned)
                .map((s) => {
                  const isActive = s.id === activeSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`group/item w-full h-8 flex items-center justify-between px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-50 text-[#00a66f] border border-emerald-200 shadow-2xs"
                          : "hover:bg-slate-100 text-[#23324a] hover:text-[#092235] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        <Pin className="w-3 h-3 text-amber-500 shrink-0 fill-amber-500" />
                        <span className="truncate">{s.title}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Nhóm: Cuộc trò chuyện gần đây (Recent Chats) */}
          <div>
            <div className="text-[10.5px] font-black uppercase tracking-wider text-[#64728a] px-2 mb-1 flex items-center justify-between">
              <span>Gần đây</span>
              <Clock className="w-3 h-3 text-[#7a8795]" />
            </div>

            <div className="space-y-0.5">
              {filteredSessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`group/item w-full h-8 flex items-center justify-between px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-50 text-[#00a66f] border border-emerald-200 shadow-2xs font-bold"
                        : "hover:bg-slate-100 text-[#23324a] hover:text-[#092235] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 group-hover/item:bg-[#00a66f]" />
                      <span className="truncate">{s.title}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSessions(sessions.filter((item) => item.id !== s.id));
                      }}
                      className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                      title="Xóa đoạn chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Khối Profile & Nút Nâng Cấp Dưới Cùng (Chuẩn ChatGPT Bố Cục Đều Đẹp) */}
        <div className="p-3 border-t border-[#eef2ee] bg-[#f8faf8] shrink-0 space-y-2">
          {/* Thông tin học sinh */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full bg-emerald-100 text-[#00a66f] flex items-center justify-center font-black text-xs border border-emerald-300">
                <span>SL</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00a66f] border-2 border-white" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#10213a] leading-tight">Sun le</p>
                <p className="text-[10px] text-[#64728a] font-medium leading-none mt-0.5">EduMi Free Plan</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>14d</span>
            </div>
          </div>

          {/* Nút Nhận ưu đãi / Nâng cấp (Full Width Đều Đẹp) */}
          <Link
            href="/premium"
            className="w-full h-8 flex items-center justify-center gap-1.5 rounded-xl bg-[#f6be3d] hover:bg-[#eab335] text-[#10213a] font-black text-xs transition-all shadow-2xs hover:shadow-sm"
          >
            <Crown className="w-3.5 h-3.5 text-[#10213a]" />
            <span>Nhận ưu đãi Capy Pro</span>
          </Link>
        </div>

      </aside>

      {/* ════════════════════════════════════════════════════════════════════════
          2. KHU VỰC TRÒ CHUYỆN CHÍNH (Nền Xanh Cốm #7f9b5d với Grid Trắng Đều Đặn)
          ════════════════════════════════════════════════════════════════════════ */}
      <main
        className="flex-1 flex flex-col h-full overflow-hidden relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      >
        {/* Decorative Leaves ở 4 góc cân đối */}
        <Leaf className="absolute left-8 top-16 h-8 w-8 rotate-[-20deg] text-white/45 pointer-events-none hidden lg:block" />
        <Leaf className="absolute right-8 top-16 h-8 w-8 rotate-[35deg] text-white/45 pointer-events-none hidden lg:block" />
        <Sprout className="absolute left-8 bottom-16 h-7 w-7 text-white/45 pointer-events-none hidden lg:block" />
        <Sprout className="absolute right-8 bottom-16 h-7 w-7 text-white/45 pointer-events-none hidden lg:block" />

        {/* ── Top Navigation Bar (Chuẩn Capsule Cân Đối) ── */}
        <header className="h-14 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
          
          {/* Bên trái: Toggle Sidebar & Model Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="h-9 px-3 rounded-full bg-white hover:bg-slate-50 text-[#10213a] shadow-sm border border-[#e2e9e2] flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                title="Mở thanh bên"
              >
                <PanelLeft className="w-3.5 h-3.5 text-[#00a66f]" />
                <span className="hidden sm:inline">Lịch sử</span>
              </button>
            )}

            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="h-9 flex items-center gap-2 px-3.5 rounded-full bg-white hover:bg-slate-50 border border-[#e2e9e2] shadow-sm text-xs font-extrabold text-[#10213a] transition-all cursor-pointer hover:border-emerald-400"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00a66f]" />
                <span>{selectedModel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-[#e2e9e2] shadow-[0_12px_34px_rgba(25,60,35,0.18)] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {[
                    {
                      name: "Capy Mentor 2026",
                      desc: "Gia sư sư phạm toàn diện tất cả các môn",
                      tag: "Khuyên dùng",
                    },
                    {
                      name: "AI Exam Scanner 1.5s",
                      desc: "Bóc tách câu hỏi bẫy & đối chiếu đáp án",
                      tag: "Siêu tốc",
                    },
                    {
                      name: "Deep Reasoning 9+",
                      desc: "Suy luận từng bước cho câu hỏi vận dụng cao",
                      tag: "Chuyên sâu",
                    },
                  ].map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m.name);
                        setIsModelDropdownOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 transition-colors flex flex-col cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black text-[#10213a]">{m.name}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#00a66f] font-black border border-emerald-300">
                          {m.tag}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-[#64728a] font-medium">{m.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Ở giữa: Toggle Segmented Control (Trò chuyện / Công việc kiểu ChatGPT) */}
          <div className="hidden md:flex items-center p-1 rounded-full bg-black/15 backdrop-blur-xs border border-white/20">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`h-7 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-white text-[#10213a] shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Trò chuyện
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("work")}
              className={`h-7 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "work"
                  ? "bg-white text-[#10213a] shadow-xs"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Luyện đề 9+
            </button>
          </div>

          {/* Bên phải: Nút Về Trang Chủ & Phòng thi */}
          <div className="flex items-center gap-2">
            <Link
              href="/exam"
              className="h-9 px-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#10213a] text-xs font-bold border border-[#e2e9e2] shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#00a66f]" />
              <span className="hidden sm:inline">Phòng thi</span>
            </Link>

            <Link
              href="/"
              className="h-9 px-3.5 rounded-full bg-white hover:bg-slate-50 text-[#10213a] text-xs font-bold border border-[#e2e9e2] shadow-sm transition-all"
            >
              Trang chủ
            </Link>
          </div>

        </header>

        {/* ── Khu Vực Nội Dung: Căn Giữa Cân Đối (Center Stage) ── */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 scrollbar-thin scrollbar-thumb-white/40"
        >
          {isChatEmpty ? (
            /* ══ BỐ CỤC CHÀO MỪNG CHUẨN CHATGPT (Căn Giữa Toàn Màn Hình) ══ */
            <div className="min-h-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-6 sm:py-8 animate-in fade-in duration-300">
              
              {/* Mascot Capy 3D Pop-up Nhỏ Gọn Cân Xứng */}
              <div className="relative mb-3 group">
                <div className="absolute -inset-3 bg-white/20 rounded-full blur-xl pointer-events-none" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_15px_25px_rgba(25,60,35,0.25)]">
                  <Image
                    src="/stickers/laptop-capybara.png"
                    alt="Capy AI Assistant"
                    fill
                    priority
                    sizes="112px"
                    className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Dòng chào mừng kiểu ChatGPT (Font Chữ Trắng To Rõ) */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-6 drop-shadow-sm">
                Rất vui được gặp bạn, Sun.
              </h1>

              {/* Khung Nhập Liệu Trực Tiếp Ở Trung Tâm (Như ChatGPT) */}
              <div className="w-full mb-6">
                <div className="relative rounded-full sm:rounded-[32px] bg-white border-2 border-white shadow-[0_14px_38px_rgba(25,60,35,0.22)] p-2 pl-4 sm:pl-5 pr-2 flex items-center gap-2 transition-all">
                  
                  {/* Nút Tải Ảnh / Đính Kèm (+) */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 rounded-full bg-[#f2f7f2] hover:bg-emerald-100 text-[#00a66f] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    title="Tải ảnh đề thi để AI Scanner bóc tách"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Ô Nhập Input */}
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Hỏi Capy AI bất cứ điều gì về Toán, Văn, Anh, ĐGNL 2026..."
                    className="flex-1 bg-transparent border-0 text-[#10213a] placeholder-[#7a8795] text-xs sm:text-sm font-semibold focus:outline-none py-1"
                  />

                  {/* Nút Suy Luận (Deep Think) Pill */}
                  <button
                    type="button"
                    onClick={() => setIsDeepThink(!isDeepThink)}
                    className={`h-8 px-2.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                      isDeepThink
                        ? "bg-[#00a66f] text-white shadow-2xs"
                        : "bg-slate-100 hover:bg-emerald-50 text-[#00a66f]"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Suy luận</span>
                  </button>

                  {/* Nút Micro */}
                  <button
                    type="button"
                    onClick={handleToggleMic}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      isListening
                        ? "bg-rose-500 text-white animate-pulse"
                        : "bg-[#f2f7f2] hover:bg-emerald-100 text-[#00a66f]"
                    }`}
                    title={isListening ? "Đang lắng nghe..." : "Ghi âm giọng nói"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Nút Gửi tròn */}
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      inputMessage.trim()
                        ? "bg-[#00a66f] hover:bg-[#008b5f] text-white shadow-md scale-105 active:scale-95"
                        : "bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                    }`}
                    title="Gửi câu hỏi"
                  >
                    <ArrowUp className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Danh Sách Các Lựa Chọn Nhanh (Dưới Khung Input, Đều Đẹp) */}
              <div className="w-full flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5">
                {QUICK_PROMPT_PILLS.map((pill) => {
                  const Icon = pill.icon;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => handleSendMessage(pill.prompt)}
                      className="h-10 px-4 rounded-full bg-white hover:bg-emerald-50/80 border border-white hover:border-emerald-300 shadow-[0_4px_16px_rgba(25,60,35,0.08)] text-[#10213a] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#00a66f] shrink-0" />
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* ══ LUỒNG TIN NHẮN KHI ĐANG HỘI THOẠI ══ */
            <div className="max-w-2xl mx-auto space-y-5 pb-4">
              {currentSession.messages.map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    {isUser ? (
                      <div className="w-8 h-8 rounded-full bg-white border border-[#e2e9e2] shadow-sm flex items-center justify-center text-[#10213a] shrink-0 font-extrabold text-xs">
                        <User className="w-4 h-4 text-[#00a66f]" />
                      </div>
                    ) : (
                      <div className="relative w-8 h-8 rounded-full bg-white border border-[#e2e9e2] shadow-sm flex items-center justify-center shrink-0">
                        <Image
                          src="/stickers/mastery-capybara.png"
                          alt="Capy AI"
                          width={28}
                          height={28}
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Bong bóng tin nhắn */}
                    <div
                      className={`relative max-w-[85%] sm:max-w-[80%] rounded-[24px] p-4 sm:p-5 shadow-[0_8px_24px_rgba(25,60,35,0.1)] text-xs sm:text-sm leading-relaxed space-y-3 ${
                        isUser
                          ? "bg-[#14301d] text-white rounded-tr-xs font-medium"
                          : "bg-white text-[#10213a] rounded-tl-xs border border-white"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                      {/* Các bước giải chi tiết */}
                      {msg.sections && (
                        <div className="space-y-2.5 pt-1">
                          {msg.sections.map((sec, sIdx) => {
                            if (sec.type === "tip") {
                              return (
                                <div
                                  key={sIdx}
                                  className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs space-y-1 font-semibold"
                                >
                                  {sec.title && (
                                    <p className="font-black text-amber-800">{sec.title}</p>
                                  )}
                                  <p className="whitespace-pre-line leading-relaxed font-normal">
                                    {sec.content}
                                  </p>
                                </div>
                              );
                            }

                            if (sec.type === "practice") {
                              return (
                                <div
                                  key={sIdx}
                                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1 font-semibold"
                                >
                                  {sec.title && (
                                    <p className="font-black text-[#00a66f]">{sec.title}</p>
                                  )}
                                  <p className="whitespace-pre-line leading-relaxed font-normal">
                                    {sec.content}
                                  </p>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={sIdx}
                                className="p-3.5 rounded-xl bg-[#f8faf8] border border-[#e2e9e2] text-[#10213a] text-xs space-y-1"
                              >
                                {sec.title && (
                                  <h5 className="font-black text-[#00a66f] text-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a66f]" />
                                    {sec.title}
                                  </h5>
                                )}
                                <p className="whitespace-pre-line text-[#23324a] leading-relaxed font-medium">
                                  {sec.content}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Nút hành động của AI */}
                      {!isUser && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#64728a]">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="hover:text-[#00a66f] flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer font-bold"
                              title="Sao chép"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-[#00a66f]" />
                                  <span className="text-[#00a66f]">Đã chép</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Sao chép</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => alert("Đã lưu vào Sổ tay AI Note!")}
                              className="hover:text-amber-600 flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer font-bold"
                              title="Lưu note"
                            >
                              <Bookmark className="w-3 h-3" />
                              <span>Lưu Note</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="p-1 hover:text-[#00a66f] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Hữu ích"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              className="p-1 hover:text-rose-500 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Chưa đúng"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Đang suy luận */}
              {isGenerating && (
                <div className="flex items-start gap-3 animate-in fade-in duration-200">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#e2e9e2] shadow-sm flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#00a66f] animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-white shadow-sm flex items-center gap-2 text-xs text-[#00a66f] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#00a66f] animate-pulse" />
                    <span>Capy AI đang suy luận ma trận đề thi...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Khung Nhập Tin Nhắn Ở Dưới Cùng (Chỉ Hiện Khi Đang Hội Thoại) ── */}
        {!isChatEmpty && (
          <div className="p-3 sm:p-4 shrink-0 z-20">
            <div className="max-w-2xl mx-auto">
              <div className="relative rounded-full sm:rounded-[32px] bg-white border-2 border-white shadow-[0_12px_36px_rgba(25,60,35,0.2)] p-2 pl-4 sm:pl-5 pr-2 flex items-center gap-2">
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-full bg-[#f2f7f2] hover:bg-emerald-100 text-[#00a66f] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                  title="Đính kèm ảnh đề thi"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Gửi câu hỏi tiếp theo cho Capy AI..."
                  className="flex-1 bg-transparent border-0 text-[#10213a] placeholder-[#7a8795] text-xs sm:text-sm font-semibold focus:outline-none py-1"
                />

                <button
                  type="button"
                  onClick={() => setIsDeepThink(!isDeepThink)}
                  className={`h-8 px-2.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                    isDeepThink
                      ? "bg-[#00a66f] text-white"
                      : "bg-slate-100 hover:bg-emerald-50 text-[#00a66f]"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Suy luận</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleMic}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-[#f2f7f2] hover:bg-emerald-100 text-[#00a66f]"
                  }`}
                  title={isListening ? "Đang lắng nghe..." : "Ghi âm"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isGenerating}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    inputMessage.trim() && !isGenerating
                      ? "bg-[#00a66f] hover:bg-[#008b5f] text-white shadow-md scale-105 active:scale-95"
                      : "bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <ArrowUp className="w-4 h-4 stroke-[3]" />
                </button>

              </div>

              <p className="text-[10.5px] text-center text-white/90 font-bold mt-2 drop-shadow-xs">
                Capy AI được huấn luyện theo chuẩn cấu trúc ma trận đề thi Bộ GD&amp;ĐT 2026.
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
