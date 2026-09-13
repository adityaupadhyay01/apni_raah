import logoSrc from "../../assets/logo.png";

/**
 * Logo — the ApniRaah compass mark.
 *
 * The source artwork is the full lockup (compass + wordmark on a cream
 * background). The wordmark is rendered as real text next to this mark, so
 * here we crop to just the compass using a fixed window over the image.
 */

// compass bounds inside the 1254px square artwork, as fractions
const CROP_LEFT = 0.231;
const CROP_TOP = 0.112;
const CROP_SIZE = 0.53;

const SCALE = 1 / CROP_SIZE;

export default function Logo({ size = 40, className = "" }) {
  return (
    <span
      className={`relative block shrink-0 overflow-hidden rounded-[14px] bg-canvas ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        draggable="false"
        style={{
          position: "absolute",
          width: size * SCALE,
          maxWidth: "none",
          left: -size * SCALE * CROP_LEFT,
          top: -size * SCALE * CROP_TOP,
        }}
      />
    </span>
  );
}

/**
 * BrandLockup — mark + wordmark, used in headers and the sidebar.
 */
export function BrandLockup({
  size = 40,
  tagline,
  compactTagline = false,
  onClick,
  className = "",
}) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={`flex items-center gap-2.5 text-left ${className}`}
    >
      <Logo size={size} />
      <span>
        <span className="block text-[1.05rem] font-bold leading-none tracking-tight">
          ApniRaah
        </span>
        {tagline && (
          <span
            className={`${
              compactTagline ? "hidden sm:block" : "block"
            } text-[0.62rem] font-bold tracking-[0.14em] uppercase text-ink-faint mt-1`}
          >
            {tagline}
          </span>
        )}
      </span>
    </Tag>
  );
}
