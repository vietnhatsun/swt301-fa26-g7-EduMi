"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";

type PreviewMaterial = {
  id: string;
  title: string;
  subject: string;
  fileType: "PDF" | "DOCX";
  fileName: string;
  status: string;
  allowDownload: boolean;
};

type PreviewResponse = {
  success: boolean;
  downloadUrl: string;
  material: PreviewMaterial;
};

export default function MaterialPreviewPage() {
  const [data, setData] = useState<PreviewResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadPreview = async () => {
      const materialId = new URLSearchParams(window.location.search).get("id") || "";
      if (!materialId) {
        if (isActive) {
          setError("Thiếu mã tài liệu.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(`/api/materials/view?id=${encodeURIComponent(materialId)}`);
        const body = await res.json();
        if (!res.ok || !body.success) {
          throw new Error(body.error || "Không thể mở tài liệu.");
        }
        if (isActive) setData(body as PreviewResponse);
      } catch (err) {
        if (isActive) setError(err instanceof Error ? err.message : "Không thể mở tài liệu.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadPreview();

    return () => {
      isActive = false;
    };
  }, []);

  const isPdf = data?.material.fileType === "PDF" || data?.material.fileName.toLowerCase().endsWith(".pdf");
  const officeViewerUrl = useMemo(() => {
    if (!data?.downloadUrl || isPdf) return "";
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.downloadUrl)}`;
  }, [data?.downloadUrl, isPdf]);

  const handleDownload = () => {
    if (!data?.downloadUrl) return;
    window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[#f5faf7] px-4 py-6 text-slate-950 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
          <Link href="/profile" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:border-emerald-200 hover:text-emerald-700" aria-label="Quay lại">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <button type="button" onClick={handleDownload} disabled={!data?.downloadUrl} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
            <Download className="h-4 w-4" /> Tải về
          </button>
        </header>

        <section className="min-h-[calc(100vh-124px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex min-h-[calc(100vh-124px)] flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-9 w-9 animate-spin text-emerald-600" />
              <p className="text-sm font-bold">Đang mở tài liệu...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[calc(100vh-124px)] flex-col items-center justify-center gap-3 px-6 text-center">
              <FileText className="h-12 w-12 text-rose-400" />
              <h2 className="text-2xl font-black text-slate-950">Không thể xem tài liệu</h2>
              <p className="max-w-md text-sm font-semibold leading-6 text-slate-500">{error}</p>
            </div>
          ) : isPdf ? (
            <iframe title={data?.material.title || "Tài liệu PDF"} src={data?.downloadUrl} className="h-[calc(100vh-124px)] w-full bg-slate-50" />
          ) : (
            <div className="relative h-[calc(100vh-124px)] bg-slate-50">
              <iframe title={data?.material.title || "Tài liệu DOCX"} src={officeViewerUrl} className="h-full w-full bg-white" />
              <div className="pointer-events-none absolute bottom-4 left-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2 text-center text-xs font-bold text-slate-500 shadow-sm backdrop-blur">
                Nếu DOCX chưa hiện, dùng nút Tải về ở phía trên.
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
