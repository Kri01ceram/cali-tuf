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

  const baseClassName = "relative w-full overflow-hidden bg-white";

  return (
    <div className={className ? `${baseClassName} ${className}` : baseClassName}>
      <div
        aria-hidden="true"
        className="absolute -left-[28rem] -top-[28rem] h-[900px] w-[900px] rounded-full bg-[#2ea3f2] sm:-left-[32rem] sm:-top-[32rem] sm:h-[1080px] sm:w-[1080px]"
      />

      <div className="absolute -left-[24rem] top-[calc(100%-48rem)] h-[48rem] w-[48rem] overflow-hidden rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.18)] sm:-left-[27rem] sm:top-[calc(100%-56rem)] sm:h-[56rem] sm:w-[56rem]">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority={priority}
          unoptimized
          sizes="768px"
          className="object-cover"
        />
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
