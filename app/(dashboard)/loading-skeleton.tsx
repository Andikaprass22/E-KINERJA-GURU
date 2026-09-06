import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingSkeleton() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden w-full">
      {/* Sidebar skeleton */}
      <div className="hidden lg:flex w-64 border-r border-slate-200 bg-white flex-col">
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="p-3 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <header className="h-16 shrink-0 bg-white/80 border-b border-transparent flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
