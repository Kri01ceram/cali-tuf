import Image from "next/image";

export type HeroImageProps = {
  imageUrl: string;
  alt?: string;
  date?: Date;
  monthYearText?: string;
  quote?: string;
  className?: string;
  priority?: boolean;
};

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);
}

export default function HeroImage({
  imageUrl,
  alt = "",
  date,
  monthYearText,
  quote,
  className,
  priority,
}: HeroImageProps) {
  const resolvedDate = date ?? new Date();
  const label = monthYearText ?? formatMonthYear(resolvedDate);
  const month = formatMonth(resolvedDate).toUpperCase();
  const year = String(resolvedDate.getFullYear());
  const showQuote = Boolean(quote && quote.trim().length > 0);

  const heroCircleClassName = showQuote
    ? "absolute -left-[18rem] top-[calc(100%-36rem)] h-[36rem] w-[36rem] overflow-hidden rounded-full bg-[#2ea3f2] shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:-left-[24rem] sm:top-[calc(100%-48rem)] sm:h-[48rem] sm:w-[48rem] lg:-left-[27rem] lg:top-[calc(100%-56rem)] lg:h-[56rem] lg:w-[56rem]"
    : "absolute -left-[18rem] top-[calc(100%-36rem)] h-[36rem] w-[36rem] overflow-hidden rounded-full bg-[#2ea3f2] shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:-left-[24rem] sm:top-[calc(100%-48rem)] sm:h-[48rem] sm:w-[48rem] lg:-left-[27rem] lg:top-[calc(100%-56rem)] lg:h-[56rem] lg:w-[56rem]";

  const baseClassName = "relative w-full overflow-hidden bg-white";
  const ringColor = { r: 46, g: 163, b: 242 };
  const backgroundRings = [
    { size: 520, left: -280, top: -280, alpha: 0.34 },
    { size: 680, left: -360, top: -360, alpha: 0.22 },
    { size: 860, left: -460, top: -450, alpha: 0.16 },
    { size: 1060, left: -560, top: -540, alpha: 0.12 },
    { size: 1320, left: -690, top: -660, alpha: 0.09 },
    { size: 1640, left: -840, top: -820, alpha: 0.07 },
  ];

  return (
    <div className={className ? `${baseClassName} ${className}` : baseClassName}>
      <div aria-hidden="true" className="absolute inset-0">
        {backgroundRings.map((ring, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              left: ring.left,
              top: ring.top,
              width: ring.size,
              height: ring.size,
              backgroundImage: `radial-gradient(circle, rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, ${ring.alpha}) 0%, rgba(${ringColor.r}, ${ringColor.g}, ${ringColor.b}, 0) 70%)`,
            }}
          />
        ))}
      </div>

      {showQuote ? (
        <div className="pointer-events-none absolute left-4 top-7 z-20 w-[min(22rem,calc(100vw-2rem))] sm:left-10 sm:top-12 sm:w-auto sm:max-w-[20rem]">
          <p className="break-words text-pretty text-left text-lg font-semibold leading-snug text-white sm:text-3xl sm:leading-tight">
            <span className="opacity-90">“</span>
            {quote}
            <span className="opacity-90">”</span>
          </p>
        </div>
      ) : null}

      <div className={heroCircleClassName}>
        {showQuote ? null : (
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            unoptimized
            sizes="768px"
            className="object-cover"
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent" />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-6 right-6 grid h-[104px] w-[104px] place-items-center rounded-full bg-white shadow-[0_14px_34px_rgba(0,0,0,0.14)] ring-1 ring-black/[.06] sm:bottom-7 sm:right-7 sm:h-[120px] sm:w-[120px]"
      >
        <div className="text-center leading-none">
          <p className="text-xs font-semibold tracking-wide text-[#2ea3f2] sm:text-sm">
            {month}
          </p>
          <p className="mt-1 text-base font-bold tracking-tight text-foreground sm:text-lg">
            {year}
          </p>
        </div>
      </div>

      <p className="sr-only">{label}</p>
    </div>
  );
}
