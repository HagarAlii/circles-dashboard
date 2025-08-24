export function SkeletonCard() {
  return (
    <div className="bg-[var(--color-input-bg)] rounded-xl p-4 flex animate-pulse space-x-4">
      <div className="h-12 w-12 rounded-full bg-[var(--color-bg-main)]"></div>
      <div className="flex flex-col flex-grow space-y-2">
        <div className="h-5 w-32 bg-[var(--color-bg-main)] rounded"></div>
        <div className="h-4 w-48 bg-[var(--color-bg-main)] rounded"></div>
        <div className="flex space-x-4">
          <div className="h-4 w-16 bg-[var(--color-bg-main)] rounded"></div>
          <div className="h-4 w-20 bg-[var(--color-bg-main)] rounded"></div>
        </div>
      </div>
      <div className="flex space-x-6 min-w-[120px]">
        <div className="h-6 w-6 bg-[var(--color-bg-main)] rounded"></div>
        <div className="h-6 w-6 bg-[var(--color-bg-main)] rounded"></div>
        <div className="h-6 w-6 bg-[var(--color-bg-main)] rounded"></div>
      </div>
    </div>
  );
}
