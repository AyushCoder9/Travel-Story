import { useRef, useState } from "react";
import Draggable from "react-draggable";
import { CanvasElement as CanvasElementType, useCanvas } from "@/context/CanvasContext";
import { cn } from "@/lib/utils";
import { Trash2, Rotate3D, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  id?: string;
}

const CanvasElement = ({ element, isSelected, id }: CanvasElementProps) => {
  const { updateElement, selectElement, moveElementToFront, removeElement } = useCanvas();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  const [startRotation, setStartRotation] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(element.content);

  const handleDragStart = () => {
    if (!isSelected) {
      selectElement(element.id);
    }
    moveElementToFront(element.id);
    setDragging(true);
  };

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    updateElement(element.id, { x: data.x, y: data.y });
    setDragging(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      selectElement(element.id);
    }
    setResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ width: element.width, height: element.height });
  };

  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSelected) {
      selectElement(element.id);
    }
    setRotating(true);
    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate the angle between the center and mouse position
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setStartRotation(angle - (element.rotation * Math.PI / 180));
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizing) {
      const deltaWidth = e.clientX - startPos.x;
      const deltaHeight = e.clientY - startPos.y;

      updateElement(element.id, {
        width: Math.max(30, startSize.width + deltaWidth),
        height: Math.max(30, startSize.height + deltaHeight),
      });
    } else if (rotating) {
      const rect = nodeRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate the current angle
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const rotation = ((angle - startRotation) * 180 / Math.PI) % 360;

        updateElement(element.id, { rotation });
      }
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
    setRotating(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Add and remove mouse event listeners
  const addMouseListeners = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (resizing || rotating) {
    addMouseListeners();
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'text') {
      setEditText(element.content);
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(e.target.value);
  };

  const handleTextEditComplete = () => {
    updateElement(element.id, { content: editText });
    setIsEditing(false);
  };

  const renderElementContent = () => {
    switch (element.type) {
      case "text":
        return isEditing ? (
          <div className="w-full h-full flex flex-col">
            <textarea
              value={editText}
              onChange={handleTextChange}
              onBlur={handleTextEditComplete}
              autoFocus
              className="w-full h-full resize-none p-1 border-none focus:outline-none focus:ring-0 bg-transparent"
              style={{
                fontSize: `${element.fontSize || 16}px`,
                fontFamily: element.fontFamily || 'sans-serif',
                color: element.fontColor || 'black',
              }}
            />
          </div>
        ) : (
          <div
            className="w-full h-full overflow-hidden"
            style={{
              fontSize: `${element.fontSize || 16}px`,
              fontFamily: element.fontFamily || 'sans-serif',
              color: element.fontColor || 'black',
            }}
          >
            {element.content}
          </div>
        );
      case "image":
        return (
          <img
            src={element.content}
            alt="Canvas image"
            className="w-full h-full object-contain"
          />
        );
      case "sticker":
        return (
          <img
            src={element.content}
            alt="Sticker"
            className="w-full h-full object-contain"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: element.x, y: element.y }}
      onStart={handleDragStart}
      onStop={handleDragStop}
      bounds="parent"
      // Only allow dragging while mouse is pressed
      cancel={isEditing ? "textarea" : ""}
    >
      <div
        ref={nodeRef}
        id={id}
        className={cn(
          "absolute cursor-move transition-shadow duration-200",
          isSelected && "shadow-lg outline outline-2 outline-blue-500",
          dragging && "opacity-90 shadow-xl"
        )}
        style={{
          width: `${element.width}px`,
          height: `${element.height}px`,
          transform: `rotate(${element.rotation}deg)`,
          zIndex: element.zIndex,
        }}
        onClick={() => selectElement(element.id)}
      >
        {renderElementContent()}

        {isSelected && (
          <>
            {/* Action buttons */}
            <div className="absolute -top-10 right-0 flex space-x-1">
              {element.type === 'text' && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white hover:bg-gray-100"
                  onClick={handleEdit}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-gray-100"
                onClick={handleRotateStart}
              >
                <Rotate3D className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-white hover:bg-red-100"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize rounded-full"
              onMouseDown={handleResizeStart}
              style={{ transform: "translate(50%, 50%)" }}
            />
          </>
        )}
      </div>
    </Draggable>
  );
};

export default CanvasElement;
