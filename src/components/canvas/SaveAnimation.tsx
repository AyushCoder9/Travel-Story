import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";

interface SaveAnimationProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function SaveAnimation({ onComplete, onCancel }: SaveAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("Saving your story...");
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; opacity: number; scale: number; color: string }>
  >([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Start simple progress animation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setText("Journal saved successfully!");
        setShowSuccess(true);

        // Add particles for success effect
        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
        const newParticles = Array.from({ length: 40 }).map(() => ({
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          opacity: 1,
          scale: Math.random() * 0.6 + 0.4,
          color: colors[Math.floor(Math.random() * colors.length)],
        }));
        setParticles(newParticles);

        // Animate particles fading and shrinking
        const fadeDuration = 1500;
        const fadeStart = Date.now();

        const fadeInterval = setInterval(() => {
          const elapsed = Date.now() - fadeStart;
          const progressFade = Math.min(elapsed / fadeDuration, 1);

          setParticles((prev) =>
            prev
              .map((p) => ({
                ...p,
                opacity: Math.max(0, 1 - progressFade),
                scale: Math.max(0, p.scale * (1 - progressFade)),
                x: p.x * (1 + progressFade * 0.5),
                y: p.y * (1 + progressFade * 0.5),
              }))
              .filter((p) => p.opacity > 0)
          );

          if (progressFade === 1) {
            clearInterval(fadeInterval);
          }
        }, 50);

        // Call onComplete after delay
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 40);

    return () => {
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center relative">
        <div
          className={`text-2xl font-bold mb-6 transition-all duration-300 ${
            showSuccess ? "text-green-500" : ""
          }`}
        >
          {showSuccess ? (
            <div className="flex items-center justify-center">
              <div className="mr-2 bg-green-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              {text}
            </div>
          ) : (
            text
          )}
        </div>

        <div className="relative h-4 w-full bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: showSuccess
                ? "linear-gradient(to right, #10b981, #3b82f6)"
                : undefined,
            }}
          />
          <div className="absolute top-0 left-0 w-full text-center text-xs text-white font-bold leading-4">
            {progress}%
          </div>
        </div>

        {/* Success particles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: particle.color,
                transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale})`,
                opacity: particle.opacity,
                transition: "opacity 1.5s ease, transform 1.5s ease",
              }}
            />
          ))}
        </div>

        {progress < 100 && (
          <Button variant="outline" className="mt-4" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

interface SaveButtonProps {
  onSave: () => void;
}

export function SaveButton({ onSave }: SaveButtonProps) {
  return (
    <Button className="flex items-center gap-2" onClick={onSave}>
      <Save className="h-4 w-4" /> Save Story
    </Button>
  );
}
