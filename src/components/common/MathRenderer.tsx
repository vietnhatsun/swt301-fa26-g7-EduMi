"use client";

import React, { memo, useMemo } from "react";
import katex from "katex";

export interface MathRendererProps {
  /** Nội dung văn bản có thể chứa LaTeX $...$ hoặc $$...$$ */
  text?: string | null;
  /** Class tùy chỉnh cho thẻ bao ngoài */
  className?: string;
  /** Ép buộc toàn bộ hiển thị dạng inline (không dùng block div) */
  inlineOnly?: boolean;
}

interface MathSegment {
  type: "text" | "inline" | "block";
  content: string;
  html?: string;
}

/**
 * Kiểm tra xem chuỗi văn bản có chứa ký hiệu toán học LaTeX ($...$) hay không
 */
export function hasMathFormula(text?: string | null): boolean {
  if (!text) return false;
  return text.includes("$");
}

/**
 * Phân tích chuỗi văn bản hỗn hợp thành các mẩu: Text thuần, Inline Math, Block Math
 */
export function parseMathSegments(text: string, inlineOnly = false): MathSegment[] {
  if (!text) return [];

  // Regex phát hiện $$...$$ (block) hoặc $...$ (inline)
  // Bỏ qua ký tự dollar được escape (\$...)
  const regex = /(\$\$[\s\S]+?\$\$|\$(?:\\\$|[^\$\n])+?\$)/g;

  const segments: MathSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Đoạn text thuần trước ký hiệu toán
    if (matchStart > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, matchStart),
      });
    }

    const rawMatch = match[0];
    const isBlock = !inlineOnly && rawMatch.startsWith("$$") && rawMatch.endsWith("$$");
    const isInline = rawMatch.startsWith("$") && rawMatch.endsWith("$");

    if (isBlock) {
      const mathExpr = rawMatch.slice(2, -2).trim();
      try {
        const html = katex.renderToString(mathExpr, {
          displayMode: true,
          throwOnError: false,
          output: "htmlAndMathml",
        });
        segments.push({ type: "block", content: mathExpr, html });
      } catch {
        segments.push({ type: "text", content: rawMatch });
      }
    } else if (isInline) {
      const mathExpr = rawMatch.slice(1, -1).trim();
      try {
        const html = katex.renderToString(mathExpr, {
          displayMode: false,
          throwOnError: false,
          output: "htmlAndMathml",
        });
        segments.push({ type: "inline", content: mathExpr, html });
      } catch {
        segments.push({ type: "text", content: rawMatch });
      }
    } else {
      segments.push({ type: "text", content: rawMatch });
    }

    lastIndex = matchEnd;
  }

  // Đoạn text thuần còn lại ở cuối chuỗi
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return segments;
}

/**
 * Component hiển thị văn bản có chứa công thức Toán/Lý/Hóa LaTeX
 * Tự động chuyển đổi các biểu thức $...$ hoặc $$...$$ thành ký hiệu toán học sắc nét qua KaTeX.
 */
function MathRendererComponent({
  text,
  className = "",
  inlineOnly = false,
}: MathRendererProps) {
  if (!text) return null;

  // Tối ưu hóa hiệu năng: nếu chuỗi không chứa ký hiệu $ thì render trực tiếp dạng text
  if (!hasMathFormula(text)) {
    return <span className={className}>{text}</span>;
  }

  // Phân tích và render qua KaTeX
  const segments = useMemo(() => parseMathSegments(text, inlineOnly), [text, inlineOnly]);

  return (
    <span className={`inline-math-container leading-relaxed ${className}`.trim()}>
      {segments.map((seg, idx) => {
        if (seg.type === "block" && seg.html) {
          return (
            <span
              key={`math-block-${idx}`}
              className="my-2.5 block max-w-full overflow-x-auto py-1 text-center"
              dangerouslySetInnerHTML={{ __html: seg.html }}
            />
          );
        }

        if (seg.type === "inline" && seg.html) {
          return (
            <span
              key={`math-inline-${idx}`}
              className="inline-block max-w-full overflow-x-auto align-baseline px-0.5"
              dangerouslySetInnerHTML={{ __html: seg.html }}
            />
          );
        }

        return <React.Fragment key={`math-text-${idx}`}>{seg.content}</React.Fragment>;
      })}
    </span>
  );
}

export const MathRenderer = memo(MathRendererComponent);
export default MathRenderer;
