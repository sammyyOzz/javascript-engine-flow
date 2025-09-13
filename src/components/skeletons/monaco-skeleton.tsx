import { Skeleton } from "@/components/ui/skeleton";

export function MonacoSkeleton() {
  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
      {/* Top bar */}
      {/* <div className="flex items-center gap-2 p-2 border-b border-gray-700">
        <Skeleton className="w-16 h-5 rounded" />
        <Skeleton className="w-24 h-5 rounded" />
        <Skeleton className="w-12 h-5 rounded" />
      </div> */}

      {/* Code lines */}
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-[90%]" />
        {/* <Skeleton className="h-4 w-[80%]" /> */}
        <Skeleton className="h-4 w-[85%]" />
        {/* <Skeleton className="h-4 w-[60%]" /> */}
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[90%]" />
        {/* <Skeleton className="h-4 w-[85%]" /> */}
        <Skeleton className="h-4 w-[80%]" />
        {/* <Skeleton className="h-4 w-[70%]" /> */}
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
}
