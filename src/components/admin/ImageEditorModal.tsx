import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, ZoomOut, RotateCw, Move, Check, X, 
  Maximize2, Crop, Sliders, Image as ImageIcon, Sparkles, RefreshCcw 
} from 'lucide-react';

interface ImageEditorModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  mode: 'avatar' | 'project';
  onClose: () => void;
  onSave: (editedImageUrl: string) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  isOpen,
  imageUrl,
  title = 'Edit & Resize Image',
  mode,
  onClose,
  onSave,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Aspect ratio options
  const defaultRatio = mode === 'avatar' ? '1:1' : '16:9';
  const [aspectRatio, setAspectRatio] = useState<string>(defaultRatio);
  
  // Output resolution size
  const [outputWidth, setOutputWidth] = useState<number>(mode === 'avatar' ? 600 : 1200);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset transforms whenever a new image is loaded
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setAspectRatio(mode === 'avatar' ? '1:1' : '16:9');
    }
  }, [isOpen, imageUrl, mode]);

  // Compute numeric aspect ratio
  const getRatioValue = (ratioStr: string): number => {
    switch (ratioStr) {
      case '1:1':
        return 1;
      case '16:9':
        return 16 / 9;
      case '4:3':
        return 4 / 3;
      case '3:4':
        return 3 / 4;
      case '3:2':
        return 3 / 2;
      case '2:3':
        return 2 / 3;
      default:
        return 1;
    }
  };

  // Render real-time preview canvas
  const drawPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratioVal = getRatioValue(aspectRatio);
    const canvasWidth = 400;
    const canvasHeight = Math.round(canvasWidth / ratioVal);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Background color
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.save();
    // Center transformation matrix
    ctx.translate(canvasWidth / 2 + pan.x, canvasHeight / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate drawn image dimensions to fit within container
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW = canvasWidth;
    let drawH = canvasWidth / imgAspect;

    if (drawH < canvasHeight) {
      drawH = canvasHeight;
      drawW = canvasHeight * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }, [aspectRatio, pan, rotation, zoom]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Mouse / Touch Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Export full-resolution edited image
  const handleApply = () => {
    const img = imageRef.current;
    if (!img) return;

    const ratioVal = getRatioValue(aspectRatio);
    const targetW = outputWidth;
    const targetH = Math.round(targetW / ratioVal);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = targetW;
    exportCanvas.height = targetH;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();
    // Scale pan according to output size relative to preview size (400px)
    const scaleFactor = targetW / 400;
    ctx.translate(targetW / 2 + pan.x * scaleFactor, targetH / 2 + pan.y * scaleFactor);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawW = 400;
    let drawH = 400 / imgAspect;

    if (drawH < 400 / ratioVal) {
      drawH = 400 / ratioVal;
      drawW = drawH * imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Export as optimized JPEG/PNG
    const finalDataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
    onSave(finalDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif-title">
                {title}
              </h3>
              <p className="text-[11px] text-stone-400">
                Adjust zoom, aspect ratio, position, and dimensions in real time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden original image loader */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Source to edit"
          className="hidden"
          onLoad={() => drawPreview()}
          crossOrigin="anonymous"
        />

        {/* Main Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Canvas Interactive Viewport */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div 
              className={`relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-500/40 bg-stone-950 flex items-center justify-center cursor-grab active:cursor-grabbing select-none shadow-inner max-w-full ${
                mode === 'avatar' && aspectRatio === '1:1' ? 'rounded-full max-w-[280px] max-h-[280px]' : ''
              }`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <canvas
                ref={previewCanvasRef}
                className="max-w-full h-auto block"
              />

              {/* Pan Overlay Hint */}
              <div className="absolute bottom-2 right-2 bg-stone-900/80 backdrop-blur-xs text-[10px] text-stone-300 px-2 py-0.5 rounded-md pointer-events-none flex items-center gap-1">
                <Move className="w-3 h-3 text-amber-400" />
                <span>Drag to position</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              {mode === 'avatar' 
                ? 'Preview shows how your photo will appear in the circular profile badge.' 
                : 'Preview shows how your project image will appear in the portfolio gallery.'}
            </p>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-4">
            
            {/* Zoom Slider and +/- buttons */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zoom Level</span>
                </span>
                <span className="font-mono text-amber-400">{Math.round(zoom * 100)}%</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.max(0.5, Number((prev - 0.1).toFixed(2))))}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => setZoom(prev => Math.min(3.0, Number((prev + 0.1).toFixed(2))))}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                    setRotation(0);
                  }}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
                  title="Reset Position"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800">
              <span className="text-xs text-stone-300 font-semibold block">Aspect Ratio</span>
              <div className="flex flex-wrap gap-2">
                {(mode === 'avatar' 
                  ? ['1:1', '4:3', '3:4'] 
                  : ['16:9', '4:3', '1:1', '3:2', '2:3']
                ).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      aspectRatio === r
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions: Rotate and Resolution output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-800">
              <div className="space-y-1.5">
                <span className="text-xs text-stone-300 font-semibold block">Rotate 90°</span>
                <button
                  type="button"
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rotate Clockwise ({rotation}°)</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-stone-300 font-semibold block">Target Output Resolution</span>
                <select
                  value={outputWidth}
                  onChange={(e) => setOutputWidth(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs text-stone-200"
                >
                  <option value={400}>400px (Compact Mobile)</option>
                  <option value={600}>600px (Standard Portrait)</option>
                  <option value={800}>800px (High Definition)</option>
                  <option value={1200}>1200px (Full HD Retina)</option>
                  <option value={1600}>1600px (Ultra Crisp)</option>
                </select>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-800 flex items-center justify-between bg-stone-950/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Update Portfolio in Real Time</span>
          </button>
        </div>

      </div>
    </div>
  );
};
