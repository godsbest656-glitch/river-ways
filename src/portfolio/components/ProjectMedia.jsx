import { useEffect, useState } from "react";

export function ProjectMedia({ media, className = "", loading = "lazy" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [media?.src]);

  if (!media) return null;
  const classes = ["rw-project-media", className].filter(Boolean).join(" ");
  const hidden = media.decorative === true;
  const fallback = media.fallback || "Preview unavailable.";
  const focalPoint = media.focalPoint
    ? (media.focalPoint.x * 100) + "% " + (media.focalPoint.y * 100) + "%"
    : "50% 50%";

  if (failed) {
    return (
      <div className={classes + " rw-project-media-fallback"} role={hidden ? undefined : "img"} aria-label={hidden ? undefined : media.alt} aria-hidden={hidden || undefined}>
        <span>{fallback}</span>
      </div>
    );
  }

  if (media.kind === "image") {
    const srcSet = media.responsive?.srcSet?.map((entry) => entry.url + " " + entry.width + "w").join(", ");
    return (
      <div className={classes}>
        <img
          src={media.src}
          alt={hidden ? "" : media.alt}
          width={media.width}
          height={media.height}
          loading={loading}
          decoding="async"
          srcSet={srcSet || undefined}
          sizes={media.responsive?.sizes || undefined}
          style={{ objectPosition: focalPoint }}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <div className={classes}>
        <video
          aria-label={hidden ? undefined : media.alt}
          aria-hidden={hidden || undefined}
          controls
          preload="none"
          poster={media.poster}
          onError={() => setFailed(true)}
        >
          <source src={media.src} />
          {fallback}
        </video>
      </div>
    );
  }

  return (
    <div className={classes + " rw-project-media-fallback"} role={hidden ? undefined : "img"} aria-label={hidden ? undefined : media.alt} aria-hidden={hidden || undefined}>
      <span>{fallback}</span>
    </div>
  );
}
