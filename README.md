# TravelStory

TravelStory is an interactive web application where users can create travel journals by placing images and text on a canvas. Once complete, users can save their work with a smooth animation and export it as a short animated video or downloadable PDF.

## Features

- **Interactive Canvas**: A full-screen white canvas where users can freely place elements
- **Drag-and-Drop Layout**: Move and position elements freely across the canvas
- **Text Blocks**: Add and customize text with different fonts, sizes, and colors
- **Image Upload**: Upload travel photos to add to your journal
- **Travel Stickers**: Add travel-themed decorative elements
- **Canvas Themes**: Choose from different background themes (Beach, Mountains, Cityscape)
- **Save Animation**: Smooth animation using anime.js when saving your journal
- **Export Options**:
  - Generate Travel Video: Create a short animation using Remotion.dev
  - Export as PDF: Save your journal as a PDF document

## Technology Stack

- React with TypeScript
- Vite for fast development
- anime.js for smooth animations
- Remotion.dev for video generation
- React-draggable for element positioning
- jsPDF and html2canvas for PDF export
- Tailwind CSS and shadcn/ui for styling
- React-colorful for color picking

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/travelstory.git
cd travelstory
```

2. Install dependencies
```bash
bun install
# or
npm install
```

3. Start the development server
```bash
bun run dev
# or
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Use the toolbar on the left to add text, images, or stickers to your canvas
2. Drag elements to position them on the canvas
3. Resize or rotate elements using the handles when an element is selected
4. Change the canvas theme using the Theme tab
5. Click "Save Story" to save your journal
6. After saving, choose to export as a PDF or generate a video

## Project Structure

```
src/
├── components/
│   ├── canvas/        # Canvas and element manipulation components
│   ├── export/        # PDF and video export functionality
│   └── ui/            # UI components from shadcn/ui
├── context/
│   └── CanvasContext.tsx  # State management for canvas elements
├── lib/
│   └── remotion/      # Remotion video composition
├── assets/
│   └── stickers/      # Travel-themed sticker SVGs
└── App.tsx            # Main application component
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [anime.js](https://animejs.com/) for animations
- [Remotion](https://www.remotion.dev/) for video generation
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Lucide](https://lucide.dev/) for icons
