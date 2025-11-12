
import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import DesignStudio from './components/DesignStudio';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const handleImageUpload = (imageDataUrl: string) => {
    setOriginalImage(imageDataUrl);
  };

  const handleReset = () => {
    setOriginalImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            AI Interior Design Consultant
          </h1>
          {originalImage && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Over
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <DesignStudio originalImage={originalImage} />
        )}
      </main>
    </div>
  );
};

export default App;
