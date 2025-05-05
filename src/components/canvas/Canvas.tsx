import { useRef, useEffect } from "react";
import { useCanvas, ThemeType } from "@/context/CanvasContext";
import CanvasElement from "./CanvasElement";

interface CanvasProps {
  width: number;
  height: number;
}

const themeBackgrounds: Record<ThemeType, string> = {
  default: "bg-white",
  beach: "bg-gradient-to-b from-sky-300 to-yellow-100",
  mountains: "bg-gradient-to-b from-slate-800 via-purple-900 to-slate-700",
  cityscape: "bg-gradient-to-b from-gray-900 to-gray-600",
  sunset: "bg-gradient-to-b from-orange-500 via-pink-500 to-purple-700",
  forest: "bg-gradient-to-b from-emerald-800 via-green-700 to-green-400",
  desert: "bg-gradient-to-b from-amber-500 via-yellow-600 to-yellow-200",
  tropical: "bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-300",
  arctic: "bg-gradient-to-b from-blue-100 via-blue-200 to-white"
};

export function Canvas({ width, height }: CanvasProps) {
  const { elements, selectedElement, theme } = useCanvas();
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Sort elements by z-index for proper stacking
  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  // Apply animation when theme changes
  useEffect(() => {
    if (canvasRef.current) {
      // Apply a subtle scale animation to the canvas when theme changes
      canvasRef.current.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      canvasRef.current.style.transform = "scale(0.98)";

      // Force reflow to ensure animation runs
      canvasRef.current.offsetHeight;

      // Return to normal scale
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.transform = "scale(1)";
        }
      }, 50);
    }
  }, [theme]);

  // Apply animation when elements are added
  useEffect(() => {
    if (elements.length > 0 && canvasRef.current) {
      const lastElement = document.getElementById(`canvas-element-${elements[elements.length - 1].id}`);
      if (lastElement && lastElement.style.opacity !== "1") {
        lastElement.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        lastElement.style.opacity = "0";
        lastElement.style.transform = "scale(0.9)";

        // Force reflow
        lastElement.offsetHeight;

        // Animate in
        lastElement.style.opacity = "1";
        lastElement.style.transform = "scale(1)";
      }
    }
  }, [elements.length]);

  return (
    <div
      ref={canvasContainerRef}
      className="relative"
    >
      {/* Canvas grid background */}
      <div className="absolute inset-0 bg-gray-50 bg-opacity-50" style={{
        backgroundImage: 'linear-gradient(rgba(100, 100, 100, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        zIndex: 0
      }} />

      {/* Main canvas */}
      <div
        ref={canvasRef}
        className={`relative overflow-hidden ${themeBackgrounds[theme]} shadow-lg rounded-lg`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transition: "background 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease",
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Page guidelines (only visible for default theme) */}
        {theme === 'default' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-[1px] border-dashed border-gray-300 opacity-30 m-auto" style={{ width: 'calc(100% - 40px)', height: 'calc(100% - 40px)', position: 'absolute', top: '20px', left: '20px' }}></div>
          </div>
        )}

        {/* Canvas elements */}
        {sortedElements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElement}
            id={`canvas-element-${element.id}`}
          />
        ))}
      </div>
    </div>
  );
}
