import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileVideo, FileText, Download, X } from "lucide-react";
import { useCanvas } from "@/context/CanvasContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { TravelVideoComposition } from "@/lib/remotion/TravelVideoComposition";
import { toast } from "sonner";

interface ExportOptionsProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  mode: "pdf" | "video";
  onClose: () => void;
}

export function ExportOptions({ canvasRef, mode, onClose }: ExportOptionsProps) {
  const { elements } = useCanvas();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showVideoPreview, setShowVideoPreview] = useState(mode === "video");

  const handlePdfExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);
    setExportProgress(10);

    try {
      // Use html2canvas to capture the canvas as an image
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, // Higher quality
      });

      setExportProgress(70);

      const imgData = canvas.toDataURL("image/png");

      // Calculate PDF dimensions to match the canvas aspect ratio
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = pdfWidth / canvasAspectRatio;

      // Create PDF
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      setExportProgress(90);

      // Download the PDF
      pdf.save("travelstory-journal.pdf");

      setExportProgress(100);

      // Show success message
      toast.success("PDF exported successfully!");

      // Reset after a delay
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setIsExporting(false);
      setExportProgress(0);
      toast.error("Error exporting PDF. Please try again.");
    }
  };

  const handleVideoExport = () => {
    setIsExporting(true);

    // Simulating video export process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setExportProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        toast.success("Video generated successfully!");
        setIsExporting(false);

        // Download video (in a real implementation, this would be a link to the actual video)
        const videoBlob = new Blob(['Mock video data'], { type: 'video/mp4' });
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'travelstory-video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, 200);
  };

  // For Remotion, we need to define a composition with our elements
  const videoProps = {
    elements,
    fps: 30,
    durationInSeconds: 8,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          {mode === "pdf" ? "Export PDF" : "Generate Video"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {mode === "pdf" ? (
            <>
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-medium">PDF Preview</h3>
                  </div>
                </div>
                <div className="p-6 flex justify-center">
                  <div className="w-full max-w-md aspect-[3/4] bg-white border shadow-sm rounded overflow-hidden">
                    {canvasRef.current && (
                      <div className="w-full h-full flex items-center justify-center transform scale-[0.8]">
                        <div className="shadow-lg rounded overflow-hidden">
                          {/* This is a preview of the canvas content */}
                          <div style={{ transform: "scale(0.4)", transformOrigin: "top left" }}>
                            <div className="relative" style={{ width: `${canvasRef.current.clientWidth}px`, height: `${canvasRef.current.clientHeight}px` }}>
                              {elements.map(el => (
                                <div key={el.id} className="absolute" style={{
                                  left: `${el.x}px`,
                                  top: `${el.y}px`,
                                  width: `${el.width}px`,
                                  height: `${el.height}px`,
                                  transform: `rotate(${el.rotation}deg)`,
                                }}>
                                  {el.type === 'image' || el.type === 'sticker' ? (
                                    <img src={el.content} alt="" className="w-full h-full object-contain" />
                                  ) : (
                                    <div style={{
                                      fontSize: `${el.fontSize}px`,
                                      fontFamily: el.fontFamily,
                                      color: el.fontColor
                                    }}>{el.content}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">PDF Options</h3>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span className="text-sm">Page Size</span>
                  <span className="text-sm font-medium">A4 (Automatic orientation)</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span className="text-sm">Quality</span>
                  <span className="text-sm font-medium">High</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg overflow-hidden border">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center">
                    <FileVideo className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="font-medium">Video Preview</h3>
                  </div>
                </div>
                <div className="aspect-video bg-black">
                  <div className="w-full h-full">
                    <TravelVideoComposition
                      elements={videoProps.elements}
                      fps={videoProps.fps}
                      durationInSeconds={videoProps.durationInSeconds}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Video Options</h3>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span className="text-sm">Duration</span>
                  <span className="text-sm font-medium">{videoProps.durationInSeconds} seconds</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span className="text-sm">Format</span>
                  <span className="text-sm font-medium">MP4 (H.264)</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span className="text-sm">Resolution</span>
                  <span className="text-sm font-medium">720p HD</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6 border-t">
        {isExporting && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Exporting...</span>
              <span className="text-sm font-medium">{exportProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <Button
          className="w-full"
          disabled={isExporting}
          onClick={mode === "pdf" ? handlePdfExport : handleVideoExport}
        >
          {isExporting ? (
            <span className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {mode === "pdf" ? "Exporting PDF..." : "Generating Video..."}
            </span>
          ) : (
            <span className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              {mode === "pdf" ? "Download PDF" : "Download Video"}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
