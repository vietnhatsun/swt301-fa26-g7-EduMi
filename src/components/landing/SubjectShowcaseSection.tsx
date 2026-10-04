import Image from "next/image";

const subjectCards = [
  { label: "Toán học", left: 48, top: 7 },
  { label: "Vật lý", left: 392, top: 7 },
  { label: "Hóa học", left: 736, top: 7 },
  { label: "Sinh học", left: 1081, top: 7 },
  { label: "Ngữ văn", left: 48, top: 262 },
  { label: "Tiếng Anh", left: 392, top: 262 },
  { label: "Lịch sử", left: 736, top: 262 },
  { label: "Địa lý", left: 1081, top: 262 },
];

export default function SubjectShowcaseSection() {
  return (
    <section className="bg-[#f8faf8] px-4 pb-8 pt-[20px]">
      <div className="relative mx-auto h-[524px] w-[1468px] max-w-full overflow-hidden">
        <Image
          src="/subject-new.png"
          alt="Danh sách môn học EduMi"
          width={1774}
          height={633}
          priority
          className="pointer-events-none h-full w-full select-none object-cover"
        />

        {subjectCards.map((subject) => (
          <a
            key={subject.label}
            href="#"
            aria-label={`Xem tài liệu môn ${subject.label}`}
            className="absolute z-10 h-[238px] w-[335px] rounded-[16px] outline-none transition hover:bg-white/10 focus-visible:ring-4 focus-visible:ring-[#06a66b]/35"
            style={{ left: subject.left, top: subject.top }}
          >
            <span className="sr-only">{subject.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}