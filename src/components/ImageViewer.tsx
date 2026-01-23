"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Download } from "lucide-react";
import Image from "next/image";

interface ImageData {
  id: string;
  url: string;
  originalName: string;
  filename: string;
  isPrimary: boolean;
  order: number;
}

interface ImageViewerProps {
  images: ImageData[];
  initialIndex: number;
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  initialIndex,
  projectTitle,
  isOpen,
  onClose
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex].url;
    link.download = images[currentIndex].originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Close overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Main content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close viewer"
        >
          <X size={24} />
        </button>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute top-4 right-16 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Download image"
        >
          <Download size={20} />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Image container */}
        <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
          <div className="relative w-full h-full animate-in zoom-in-95 duration-300">
            <Image
              src={currentImage.url}
              alt={`${projectTitle} - ${currentImage.originalName}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Image info and navigation dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          {/* Image counter */}
          <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation dots */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Image title overlay */}
        <div className="absolute bottom-6 left-6 z-20 bg-black/70 text-white px-4 py-2 rounded-lg max-w-xs">
          <div className="text-sm font-medium truncate">{projectTitle}</div>
          <div className="text-xs text-white/70 truncate">{currentImage.originalName}</div>
        </div>
      </div>
    </div>
  );
}