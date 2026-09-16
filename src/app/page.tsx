import { Header } from "@/components/common/Header";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center">
        <div className="max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            ✨ Architectural Foundation Initialized
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-200 bg-clip-text text-transparent">
            {siteConfig.name} Enterprise Architecture
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400">
            Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and Clean Code Architecture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left hover:border-blue-500 transition-colors">
              <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-1">src/app</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">App Router pages, layouts, and API routes.</p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left hover:border-blue-500 transition-colors">
              <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-1">src/server</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Server Actions, DB access & backend logic.</p>
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-left hover:border-blue-500 transition-colors">
              <h3 className="font-bold text-lg text-teal-600 dark:text-teal-400 mb-1">src/components</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reusable UI & common layout components.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
