import logo from "@/assets/noury-logo.png";

export function Logo({
  size = "lg",
  tagline = true,
  tone = "dark",
}: {
  size?: "sm" | "lg";
  tagline?: boolean;
  tone?: "dark" | "light";
}) {
  const imgH = size === "lg" ? "h-8 sm:h-10 md:h-14" : "h-8";
  const textSize = size === "lg" ? "text-2xl sm:text-3xl md:text-5xl" : "text-xl";
  const filter = tone === "light" ? { filter: "brightness(0) invert(1)" } : undefined;

  return (
    <div className="flex flex-col items-center leading-none">
      <div className="flex items-center gap-2 md:gap-3">
        <img src={logo} alt="" aria-hidden className={`${imgH} w-auto object-contain`} style={filter} />
        <span className={`font-serif font-medium ${textSize}`}>Noury</span>
      </div>
      {tagline && (
        <span className="mt-1.5 md:mt-2 whitespace-nowrap text-[0.45rem] sm:text-[0.55rem] md:text-[0.6rem] tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase opacity-80">
          Your Style, Your Story
        </span>
      )}
    </div>
  );
}
