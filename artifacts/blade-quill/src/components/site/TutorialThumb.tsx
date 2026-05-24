import { CSSProperties } from "react";
import { ArtTile, ArtTilePalette } from "./ArtTile";

interface TutorialThumbProps {
  palette?: ArtTilePalette;
  title?: string;
  duration?: string;
  width?: number | string;
  height?: number | string;
  /** YouTube thumbnail URL or a real image — when provided, replaces the gradient placeholder. */
  src?: string;
  /** YouTube video id — if provided we'll use the i.ytimg.com hqdefault image. */
  youtubeId?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * YouTube-style thumbnail with centered play button and bottom-right
 * duration chip. Hover lifts the play button (the parent container
 * styles the hover effect via `.video-card:hover .play-btn`).
 */
export function TutorialThumb({
  palette = "twilight",
  title,
  duration = "14:22",
  width = "100%",
  height = 210,
  src,
  youtubeId,
  className,
  style,
}: TutorialThumbProps) {
  const imgSrc =
    src ?? (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "relative",
        borderRadius: 8,
        overflow: "hidden",
        ...style,
      }}
    >
      <ArtTile
        palette={palette}
        width="100%"
        height="100%"
        src={imgSrc}
        radius={8}
        style={{ borderRadius: 8 }}
      />
      <div
        className="play-btn"
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(251,246,236,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
          transition: "transform .25s var(--e-back), background .25s ease",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "18px solid var(--ink)",
            borderTop: "12px solid transparent",
            borderBottom: "12px solid transparent",
            marginLeft: 5,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          background: "rgba(31,26,20,0.85)",
          color: "var(--paper)",
          fontFamily: "var(--f-mono)",
          fontSize: 10,
          letterSpacing: "0.04em",
          padding: "3px 7px",
          borderRadius: 3,
        }}
      >
        {duration}
      </div>
      {title && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 14px 14px",
            background:
              "linear-gradient(0deg, rgba(31,26,20,0.85), transparent)",
            color: "var(--paper)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--f-sans)",
              fontWeight: 600,
              fontSize: 13,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
        </div>
      )}
    </div>
  );
}
