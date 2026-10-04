import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Be_Vietnam_Pro } from "next/font/google";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  display: "swap",
});

function FeatureButton({
  href,
  children,
  className,
  variant = "yellow",
}: {
  href: string;
  children: React.ReactNode;
  className: string;
  variant?: "yellow" | "green";
}) {
  return (
    <Link
      href={href}
      className={`${beVietnam.className} absolute z-10 flex items-center justify-center gap-4 rounded-full border-[4px] border-[#11130f] text-[22px] font-extrabold leading-none tracking-[-0.04em] shadow-[0_6px_0_rgba(0,0,0,0.08)] transition-transform duration-200 hover:-translate-y-0.5 ${
        variant === "green" ? "bg-[#1e7a3a] text-white" : "bg-[#ffd743] text-[#11130f]"
      } ${className}`}
    >
      {children}
      <ArrowRight className="h-[27px] w-[27px] stroke-[3.5]" />
    </Link>
  );
}

export default function HomeFeatureSection() {
  return (
    <section className="bg-[#f8faf8] py-8">
      <div className="relative mx-auto h-[1071px] w-[1468px] overflow-hidden">
        <Image
          src="/home-feature-new.png"
          alt="Cộng đồng học tập EduMi vui nhộn"
          width={1468}
          height={1071}
          priority
          className="h-full w-full select-none"
        />

        <FeatureButton href="/register" className="left-[128px] top-[437px] h-[66px] w-[304px]">
          Tham gia cộng đồng
        </FeatureButton>

        <FeatureButton href="/about" variant="green" className="left-[88px] top-[951px] h-[61px] w-[228px] gap-3 text-[21px]">
          Tìm hiểu thêm
        </FeatureButton>

        <FeatureButton href="/blog" className="left-[797px] top-[928px] h-[62px] w-[221px]">
          Đọc bài viết
        </FeatureButton>
      </div>
    </section>
  );
}