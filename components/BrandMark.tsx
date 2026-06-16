export function BrandMark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid h-8 w-8 place-items-center text-[0.62rem] font-black uppercase md:h-9 md:w-9 ${
          inverse ? "bg-bone text-ink" : "bg-ink text-bone"
        }`}
      >
        WH
      </span>
      {!compact && <span className="hidden font-display text-lg uppercase tracking-normal sm:inline md:text-xl">White House</span>}
    </div>
  );
}
