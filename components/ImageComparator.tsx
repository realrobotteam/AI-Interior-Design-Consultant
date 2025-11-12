
import React, { useState, useRef, useEffect } from 'react';

interface ImageComparatorProps {
  originalImage: string;
  generatedImage: string | null;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, generatedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset slider when generated image changes
    setSliderPosition(50);
  }, [generatedImage]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };
  
  const sliderStyle = {
    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
  };

  return (
    <div ref={containerRef} className="relative w-full h-full select-none overflow-hidden rounded-lg">
      <img
        src={originalImage}
        alt="Original Room"
        className="absolute top-0 left-0 w-full h-full object-cover"
        draggable="false"
      />
      {generatedImage && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={sliderStyle}
          >
            <img
              src={generatedImage}
              alt="Generated Design"
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
          <div
            className="absolute top-0 bottom-0 bg-blue-500 w-1"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)', cursor: 'ew-resize' }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full m-0 p-0 bg-transparent cursor-ew-resize appearance-none"
            style={{ zIndex: 10, background: 'transparent' }}
          />
        </>
      )}
      {!generatedImage && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <p className="text-white text-xl font-semibold">Select a style below to begin</p>
        </div>
      )}
    </div>
  );
};

export default ImageComparator;
