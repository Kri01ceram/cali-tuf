import Image from "next/image";

export type HeroImageProps = {
  imageUrl: string;
  alt?: string;
  date?: Date;
  monthYearText?: string;
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
  className,
  priority,
}: HeroImageProps) {
  const resolvedDate = date ?? new Date();
  const label = monthYearText ?? formatMonthYear(resolvedDate);
  const month = formatMonth(resolvedDate).toUpperCase();
  const year = String(resolvedDate.getFullYear());

  const baseClassName =
    "relative w-full overflow-hidden bg-zinc-200";

  return (
    <div className={className ? `${baseClassName} ${className}` : baseClassName}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority={priority}
        unoptimized
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-48 w-48 bg-[#2ea3f2] [clip-path:polygon(0%_52%,0%_100%,56%_100%)] sm:h-56 sm:w-56"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-56 w-64 bg-[#2ea3f2] [clip-path:polygon(28%_0%,100%_36%,100%_100%,0%_100%)] sm:h-64 sm:w-72"
      />

      <div aria-hidden="true" className="absolute bottom-0 left-1/2 h-24 w-40 -translate-x-1/2 bg-white [clip-path:polygon(50%_0%,0%_100%,100%_100%)]" />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 w-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,70 C240,25 360,25 600,108 C840,25 960,25 1200,70 L1200,120 L0,120 Z"
          fill="#ffffff"
        />
      </svg>

      <div className="absolute bottom-7 right-7 text-right">
        <p className="text-sm font-semibold tracking-wide text-white/90 sm:text-base">
          {year}
        </p>
        <p className="text-lg font-bold tracking-tight text-white drop-shadow-sm sm:text-2xl">
          {month}
        </p>
        <p className="sr-only">{label}</p>
      </div>
    </div>
  );
}
