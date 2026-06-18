export function BrandMark({
  compact = false,
  inverse = false,
  titleVariant = "public",
}: {
  compact?: boolean;
  inverse?: boolean;
  titleVariant?: "public" | "admin";
}) {
  const titleSrc =
    titleVariant === "admin"
      ? "/brand/admin_logo_title.svg"
      : "/brand/logo_title.svg";
  const titleClasses = inverse && titleVariant !== "admin"
    ? "rounded-md bg-bone/95 px-2 py-1 shadow-sm"
    : "";

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img
        src="/brand/logo_shape.svg"
        alt=""
        aria-hidden="true"
        className="h-8 w-auto shrink-0 md:h-9"
      />
      {!compact && (
        <span
          className={`inline-flex h-5 w-[7.8rem] shrink-0 items-center sm:h-6 sm:w-[9.4rem] md:h-7 md:w-[10.8rem] ${titleClasses}`}
        >
          <img
            src={titleSrc}
            alt="White House"
            className="h-full w-full object-contain"
          />
        </span>
      )}
    </div>
  );
}
