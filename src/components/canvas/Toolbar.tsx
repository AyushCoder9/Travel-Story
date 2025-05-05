import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Image,
  Type,
  Sticker,
  PlusCircle,
  Square,
  Circle,
  Triangle,
  Heart,
  Palette,
  Download,
  Save,
  Trash2,
  RotateCcw,
  Layers,
  Star,
  Cloud,
  Flower
} from "lucide-react";
import { useCanvas, ThemeType } from "@/context/CanvasContext";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="w-8 h-8 rounded-md cursor-pointer border border-gray-300"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2">
          <HexColorPicker color={color} onChange={onChange} />
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button size="sm" onClick={() => {
              onChange(color);
              setIsOpen(false);
            }}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const themeOptions: { label: string; value: ThemeType }[] = [
  { label: "Default", value: "default" },
  { label: "Beach", value: "beach" },
  { label: "Mountains", value: "mountains" },
  { label: "Cityscape", value: "cityscape" },
  { label: "Sunset", value: "sunset" },
  { label: "Forest", value: "forest" },
  { label: "Desert", value: "desert" },
  { label: "Tropical", value: "tropical" },
  { label: "Arctic", value: "arctic" }
];

export function Toolbar() {
  const { addElement, clearCanvas, theme, setTheme } = useCanvas();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textOptions, setTextOptions] = useState({
    content: "Your text here",
    fontSize: 24,
    fontFamily: "Arial",
    fontColor: "#000000",
  });

  const handleAddText = () => {
    addElement({
      type: "text",
      content: textOptions.content,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      fontSize: textOptions.fontSize,
      fontFamily: textOptions.fontFamily,
      fontColor: textOptions.fontColor,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // Create an image to get dimensions
          const img = new window.Image();
          img.onload = () => {
            // Calculate proportional dimensions (max 400px wide or tall)
            const maxDimension = 400;
            const width = img.width > img.height
              ? maxDimension
              : (img.width / img.height) * maxDimension;
            const height = img.height > img.width
              ? maxDimension
              : (img.height / img.width) * maxDimension;

            addElement({
              type: "image",
              content: event.target?.result as string,
              x: 100,
              y: 100,
              width,
              height,
              rotation: 0,
            });
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);

      // Clear the input for future uploads
      e.target.value = "";
    }
  };

  const handleAddSticker = (stickerUrl: string) => {
    addElement({
      type: "sticker",
      content: stickerUrl,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      rotation: 0,
    });
  };

  // Our travel-themed stickers
  const stickers = [
    { path: "/stickers/airplane.svg", name: "Airplane" },
    { path: "/stickers/beach.svg", name: "Beach" },
    { path: "/stickers/camera.svg", name: "Camera" },
    { path: "/stickers/map.svg", name: "Map" },
    { path: "/stickers/mountain.svg", name: "Mountain" },
    { path: "/stickers/palm-tree.svg", name: "Palm Tree" },
    { path: "/stickers/passport.svg", name: "Passport" },
    { path: "/stickers/sun.svg", name: "Sun" },
    { path: "/stickers/compass.svg", name: "Compass" },
    { path: "/stickers/luggage.svg", name: "Luggage" },
    { path: "/stickers/landmark.svg", name: "Landmark" },
    { path: "/stickers/globe.svg", name: "Globe" }
  ];

  // Shape stickers
  const stickerShapes = [
    { icon: <Square className="h-8 w-8 text-blue-500" />, color: "blue" },
    { icon: <Circle className="h-8 w-8 text-red-500" />, color: "red" },
    { icon: <Triangle className="h-8 w-8 text-green-500" />, color: "green" },
    { icon: <Heart className="h-8 w-8 text-pink-500" />, color: "pink" },
    { icon: <Star className="h-8 w-8 text-yellow-500" />, color: "yellow" },
    { icon: <Cloud className="h-8 w-8 text-gray-500" />, color: "gray" },
    { icon: <Flower className="h-8 w-8 text-purple-500" />, color: "purple" }
  ];

  return (
    <Card className="w-80 h-full overflow-auto">
      <Tabs defaultValue="text">
        <TabsList className="w-full">
          <TabsTrigger value="text" className="flex-1"><Type className="mr-2 h-4 w-4" /> Text</TabsTrigger>
          <TabsTrigger value="image" className="flex-1"><Image className="mr-2 h-4 w-4" /> Image</TabsTrigger>
          <TabsTrigger value="sticker" className="flex-1"><Sticker className="mr-2 h-4 w-4" /> Stickers</TabsTrigger>
          <TabsTrigger value="theme" className="flex-1"><Palette className="mr-2 h-4 w-4" /> Theme</TabsTrigger>
        </TabsList>

        <CardContent className="p-4">
          <TabsContent value="text" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Text Content</label>
              <Input
                value={textOptions.content}
                onChange={(e) => setTextOptions({ ...textOptions, content: e.target.value })}
                placeholder="Enter your text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Font Size: {textOptions.fontSize}px</label>
              <Slider
                value={[textOptions.fontSize]}
                min={8}
                max={72}
                step={1}
                onValueChange={(value) => setTextOptions({ ...textOptions, fontSize: value[0] })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Font Family</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={textOptions.fontFamily}
                onChange={(e) => setTextOptions({ ...textOptions, fontFamily: e.target.value })}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <ColorPicker
                color={textOptions.fontColor}
                onChange={(color) => setTextOptions({ ...textOptions, fontColor: color })}
              />
            </div>

            <Button onClick={handleAddText} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Text
            </Button>
          </TabsContent>

          <TabsContent value="image">
            <div className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Upload an image to add to your travel story
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sticker">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Travel Stickers</h3>
                <div className="grid grid-cols-4 gap-2">
                  {stickers.map((sticker, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleAddSticker(sticker.path)}
                      title={sticker.name}
                    >
                      <img src={sticker.path} alt={sticker.name} className="h-8 w-8" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-medium mb-2">Shape Stickers</h3>
                <div className="grid grid-cols-4 gap-2">
                  {stickerShapes.map((sticker, index) => (
                    <div
                      key={`shape-${index}`}
                      className="flex items-center justify-center p-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleAddSticker(`data:image/svg+xml,${encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${sticker.color}" stroke="none"><rect x="0" y="0" width="24" height="24" rx="4" fill="${sticker.color}" /></svg>`
                      )}`)}
                    >
                      {sticker.icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Canvas Background</h3>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`p-2 rounded-md cursor-pointer border-2 transition-all ${
                      theme === option.value
                        ? "border-primary ring-2 ring-primary ring-opacity-50"
                        : "border-transparent"
                    }`}
                    onClick={() => setTheme(option.value)}
                  >
                    <div
                      className={`h-16 w-full rounded-md mb-2 ${
                        option.value === "default"
                          ? "bg-white border border-gray-200"
                          : option.value === "beach"
                          ? "bg-gradient-to-b from-sky-300 to-yellow-100"
                          : option.value === "mountains"
                          ? "bg-gradient-to-b from-slate-800 via-purple-900 to-slate-700"
                          : option.value === "cityscape"
                          ? "bg-gradient-to-b from-gray-900 to-gray-600"
                          : option.value === "sunset"
                          ? "bg-gradient-to-b from-orange-500 via-pink-500 to-purple-700"
                          : option.value === "forest"
                          ? "bg-gradient-to-b from-emerald-800 via-green-700 to-green-400"
                          : option.value === "desert"
                          ? "bg-gradient-to-b from-amber-500 via-yellow-600 to-yellow-200"
                          : option.value === "tropical"
                          ? "bg-gradient-to-b from-teal-400 via-cyan-500 to-blue-300"
                          : "bg-gradient-to-b from-blue-100 via-blue-200 to-white"
                      }`}
                    />
                    <p className="text-center text-xs font-medium">{option.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={clearCanvas}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Canvas
          </Button>
        </div>
      </div>
    </Card>
  );
}
