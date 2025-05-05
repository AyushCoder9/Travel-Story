import { createContext, useContext, useState, ReactNode } from "react";

// Define types for our canvas elements
export type ElementType = "image" | "text" | "sticker";

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  zIndex: number;
}

export type ThemeType =
  | "default"
  | "beach"
  | "mountains"
  | "cityscape"
  | "sunset"
  | "forest"
  | "desert"
  | "tropical"
  | "arctic";

interface CanvasContextType {
  elements: CanvasElement[];
  selectedElement: string | null;
  theme: ThemeType;
  addElement: (element: Omit<CanvasElement, "id" | "zIndex">) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  setTheme: (theme: ThemeType) => void;
  moveElementToFront: (id: string) => void;
  moveElementToBack: (id: string) => void;
  clearCanvas: () => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeType>("default");

  const addElement = (element: Omit<CanvasElement, "id" | "zIndex">) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
    const zIndex = elements.length;
    setElements([...elements, { ...element, id, zIndex }]);
    selectElement(id);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(
      elements.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      )
    );
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((element) => element.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const selectElement = (id: string | null) => {
    setSelectedElement(id);
  };

  const moveElementToFront = (id: string) => {
    const maxZIndex = Math.max(...elements.map((el) => el.zIndex), 0);
    setElements(
      elements.map((element) =>
        element.id === id ? { ...element, zIndex: maxZIndex + 1 } : element
      )
    );
  };

  const moveElementToBack = (id: string) => {
    const minZIndex = Math.min(...elements.map((el) => el.zIndex), 0);
    setElements(
      elements.map((element) =>
        element.id === id ? { ...element, zIndex: minZIndex - 1 } : element
      )
    );
  };

  const clearCanvas = () => {
    setElements([]);
    setSelectedElement(null);
  };

  return (
    <CanvasContext.Provider
      value={{
        elements,
        selectedElement,
        theme,
        addElement,
        updateElement,
        removeElement,
        selectElement,
        setTheme,
        moveElementToFront,
        moveElementToBack,
        clearCanvas,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}
