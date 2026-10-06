export function Logo({
  size = "lg",
  tagline = true,
  tone = "dark",
}: {
  size?: "sm" | "lg";
  tagline?: boolean;
  tone?: "dark" | "light";
}) {
  const textSize = size === "lg" ? "text-2xl sm:text-3xl md:text-5xl" : "text-xl";
  const color = tone === "light" ? "text-cream" : "text-mocha";

  return (
    <div className="flex flex-col items-center leading-none">
      <span className={`font-serif font-medium uppercase tracking-[0.18em] ${textSize} ${color}`}>
        Noury
      </span>
      {tagline && (
        <span className="mt-1.5 md:mt-2 whitespace-nowrap text-[0.45rem] sm:text-[0.55rem] md:text-[0.6rem] tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] uppercase opacity-80">
          Your Style, Your Story
        </span>
      )}
    </div>
  );
}
