import Image from "next/image";
import { GraduationCap, Mail, MessageCircle, Send, Sprout, User } from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

function TextInput({
  id,
  type = "text",
  placeholder,
  icon,
  className = "",
}: {
  id: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={id} className={`relative block ${className}`}>
      <span className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-[#12653e]">
        {icon}
      </span>
      <input
        id={id}
        name={id}
        type={type}
        suppressHydrationWarning
        aria-label={placeholder}
        placeholder={placeholder}
        className="h-[54px] w-full rounded-[17px] border-[2px] border-[#c7e9c1] bg-[#fffef4]/88 pl-[52px] pr-4 text-[15px] font-bold text-[#123421] outline-none transition placeholder:text-[#80907f] focus:border-[#0aa36c] focus:bg-white focus:ring-4 focus:ring-[#0aa36c]/10"
      />
    </label>
  );
}

export default function ConsultationFormSection() {
  return (
    <section className={`${beVietnam.className} bg-[#f8faf8] px-4 py-10`}>
      <div className="relative mx-auto h-[734px] w-[1468px] max-w-full overflow-hidden rounded-[36px]">
        <Image
          src="/form-tu-van.png"
          alt="EduMi luôn sẵn sàng hỗ trợ bạn"
          width={1774}
          height={887}
          className="h-full w-full select-none object-cover"
        />

        <form
          action="#"
          className="absolute right-[76px] top-[108px] z-10 w-[572px] rounded-[32px] border-[2px] border-[#aee9c2] bg-[#fffdf1]/88 px-8 py-7 shadow-[0_20px_55px_rgba(20,95,54,0.12)] backdrop-blur-[2px]"
        >
          <div className="mb-5">
            <div className="inline-flex h-[38px] items-center gap-3 rounded-full bg-[#bde99f]/95 px-6 text-[15px] font-extrabold uppercase tracking-[0.02em] text-[#073f1b] shadow-[0_10px_20px_rgba(23,85,38,0.1)]">
              <Sprout className="h-5 w-5 fill-[#0f6837] text-[#0f6837]" />
              Để lại thông tin
            </div>
            <h2 className="font-baloo mt-4 text-[48px] font-extrabold leading-[0.96] tracking-[-0.045em] text-[#0b4520]">
              Nhận tư vấn từ <span className="text-[#4a9631]">EduMi</span>
            </h2>
            <p className="mt-2 text-[17px] font-semibold leading-[1.35] text-[#123421]">
              Đội ngũ EduMi sẽ liên hệ và hỗ trợ bạn trong thời gian sớm nhất.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextInput id="fullName" placeholder="Họ và tên của bạn *" icon={<User className="h-5 w-5" />} />
            <TextInput id="email" type="email" placeholder="Email *" icon={<Mail className="h-5 w-5" />} />
            <TextInput
              id="className"
              placeholder="Lớp học hiện tại *"
              icon={<GraduationCap className="h-5 w-5" />}
              className="col-span-2"
            />

            <label htmlFor="consultingTopic" className="relative col-span-2 block">
              <span className="pointer-events-none absolute left-5 top-[19px] z-10 text-[#12653e]">
                <MessageCircle className="h-5 w-5" />
              </span>
              <textarea
                id="consultingTopic"
                name="consultingTopic"
                suppressHydrationWarning
                aria-label="Bạn muốn được tư vấn về điều gì?"
                placeholder="Bạn muốn được tư vấn về điều gì? (Không bắt buộc)"
                rows={3}
                className="h-[104px] w-full resize-none rounded-[17px] border-[2px] border-[#c7e9c1] bg-[#fffef4]/88 pb-4 pl-[52px] pr-4 pt-4 text-[15px] font-bold leading-[1.45] text-[#123421] outline-none transition placeholder:text-[#80907f] focus:border-[#0aa36c] focus:bg-white focus:ring-4 focus:ring-[#0aa36c]/10"
              />
            </label>
          </div>

          <button
            type="submit"
            suppressHydrationWarning
            className="mx-auto mt-5 flex h-[60px] w-[370px] items-center justify-center gap-4 rounded-full border-[4px] border-[#11130f] bg-[#ffd743] text-[21px] font-extrabold tracking-[-0.03em] text-[#11130f] shadow-[0_7px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
          >
            Gửi thông tin ngay
            <Send className="h-6 w-6 stroke-[3]" />
          </button>
        </form>
      </div>
    </section>
  );
}