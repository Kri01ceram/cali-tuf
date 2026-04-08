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

export default function HeroImage({
  imageUrl,
  alt = "",
  date,
  monthYearText,
  className,
  priority,
}: HeroImageProps) {
  const label = monthYearText ?? formatMonthYear(date ?? new Date());

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
        className="absolute bottom-0 right-0 h-44 w-44 origin-bottom-right bg-[#2ea3f2]/90 [clip-path:polygon(30%_0%,100%_0%,100%_100%,0%_100%)] sm:h-52 sm:w-52"
      />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 w-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,64 C180,110 360,10 540,52 C720,96 900,26 1080,60 C1140,72 1170,82 1200,92 L1200,120 L0,120 Z"
          fill="#ffffff"
        />
      </svg>

      <div className="absolute bottom-4 right-4 text-right">
        <p className="text-lg font-semibold tracking-tight text-white drop-shadow-sm sm:text-xl md:text-2xl">
          {label}
        </p>
      </div>
    </div>
  );
}
