import { useState, useRef } from "react";
import { CanvasProvider } from "@/context/CanvasContext";
import { Canvas } from "@/components/canvas/Canvas";
import { Toolbar } from "@/components/canvas/Toolbar";
import { SaveButton, SaveAnimation } from "@/components/canvas/SaveAnimation";
import { ExportOptions } from "@/components/export/ExportOptions";
import { Toaster } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Download, FileVideo, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

function App() {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exportMode, setExportMode] = useState<"pdf" | "video" | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSave = () => {
    setIsSaving(true);
  };

  const handleSaveComplete = () => {
    setIsSaving(false);
    setSaved(true);
  };

  const handleSaveCancel = () => {
    setIsSaving(false);
  };

  const handleExportClick = (mode: "pdf" | "video") => {
    setExportMode(mode);
  };

  const handleExportClose = () => {
    setExportMode(null);
  };

  return (
    <CanvasProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">TravelStory</h1>
            <div className="flex items-center space-x-4">
              {!saved ? (
                <SaveButton onSave={handleSave} />
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setSaved(false)}
                  >
                    Edit Story
                  </Button>

                  {/* PDF Export Button */}
                  <Sheet
                    open={exportMode === "pdf"}
                    onOpenChange={(open) => !open && setExportMode(null)}
                  >
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => handleExportClick("pdf")}
                      >
                        <FileText className="h-4 w-4" /> Export PDF
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[400px] sm:w-[540px] p-0"
                    >
                      <ExportOptions
                        canvasRef={canvasRef}
                        mode="pdf"
                        onClose={handleExportClose}
                      />
                    </SheetContent>
                  </Sheet>

                  {/* Video Export Button */}
                  <Sheet
                    open={exportMode === "video"}
                    onOpenChange={(open) => !open && setExportMode(null)}
                  >
                    <SheetTrigger asChild>
                      <Button
                        className="flex items-center gap-2"
                        onClick={() => handleExportClick("video")}
                      >
                        <FileVideo className="h-4 w-4" /> Generate Video
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[400px] sm:w-[540px] p-0"
                    >
                      <ExportOptions
                        canvasRef={canvasRef}
                        mode="video"
                        onClose={handleExportClose}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-6">
              <Toolbar />
              <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex justify-center items-center p-4">
                <div ref={canvasRef}>
                  <Canvas width={800} height={600} />
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              TravelStory - Create beautiful travel journals
            </p>
          </div>
        </footer>

        {isSaving && (
          <SaveAnimation
            onComplete={handleSaveComplete}
            onCancel={handleSaveCancel}
          />
        )}

        <Toaster position="top-right" />
      </div>
    </CanvasProvider>
  );
}

export default App;
