export default function SkeletonChart() {
  return (
    <div className="w-full max-w-full min-h-[400px] bg-[var(--color-input-bg)] rounded-xl p-6 flex flex-col items-center justify-center animate-pulse space-y-6">
      {/* Title placeholder */}
      <div className="h-8 w-48 bg-[var(--color-bg-main)] rounded"></div>

      {/* Large rectangle mimicking chart area */}
      <div className="w-full h-[320px] bg-[var(--color-bg-main)] rounded-lg"></div>

      {/* Controls placeholders */}
      <div className="flex gap-4 w-full justify-center">
        <div className="h-10 w-32 bg-[var(--color-bg-main)] rounded"></div>
        <div className="h-10 w-24 bg-[var(--color-bg-main)] rounded"></div>
      </div>
    </div>
  );
}
