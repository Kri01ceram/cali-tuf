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
    "relative w-full overflow-hidden bg-zinc-200 dark:bg-zinc-900 h-56 sm:h-72 md:h-96";

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

      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-900/35 to-transparent" />
      <div className="absolute inset-0 bg-blue-600/10" />

      <div className="absolute bottom-4 right-4 text-right">
        <p className="text-lg font-semibold tracking-tight text-white drop-shadow-sm sm:text-xl md:text-2xl">
          {label}
        </p>
      </div>
    </div>
  );
}
