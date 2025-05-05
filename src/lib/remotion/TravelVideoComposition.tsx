import { CanvasElement, ThemeType } from "@/context/CanvasContext";

interface VideoElementProps {
  element: CanvasElement;
}

interface TravelVideoCompositionProps {
  elements: CanvasElement[];
  fps: number;
  durationInSeconds: number;
}

const themeBackgrounds: Record<ThemeType, string> = {
  default: "#FFFFFF",
  beach: "linear-gradient(to bottom, #7dd3fc, #fef9c3)",
  mountains: "linear-gradient(to bottom, #1e293b, #581c87, #334155)",
  cityscape: "linear-gradient(to bottom, #111827, #4b5563)",
  sunset: "linear-gradient(to bottom, #f97316, #db2777, #7e22ce)",
  forest: "linear-gradient(to bottom, #15803d, #16a34a, #4ade80)",
  desert: "linear-gradient(to bottom, #f59e0b, #d97706, #fef3c7)",
  tropical: "linear-gradient(to bottom, #0891b2, #06b6d4, #67e8f9)",
  arctic: "linear-gradient(to bottom, #e0f2fe, #bae6fd, #ffffff)"
};

// A simplified version until we properly configure Remotion
export const TravelVideoComposition = ({
  elements,
  fps,
  durationInSeconds,
}: TravelVideoCompositionProps) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: themeBackgrounds.default,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h2 style={{ fontSize: "24px", color: "#333", marginBottom: "20px" }}>
          Video Preview
        </h2>
        <p style={{ fontSize: "16px", color: "#666" }}>
          Your travel story would be rendered as a video here.
          <br />
          Showing {elements.length} elements in a {durationInSeconds} second video at {fps}fps.
        </p>
      </div>
    </div>
  );
};
