
import React, { useState } from 'react';
import type { DesignStyle } from '../types';

interface StyleCarouselProps {
  styles: DesignStyle[];
  onStyleSelect: (style: DesignStyle) => void;
  disabled: boolean;
}

const StyleCarousel: React.FC<StyleCarouselProps> = ({ styles, onStyleSelect, disabled }) => {
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    
    const handleSelect = (style: DesignStyle) => {
        setSelectedStyle(style.id);
        onStyleSelect(style);
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Choose a Style</h3>
            <div className="flex space-x-3 overflow-x-auto pb-3">
                {styles.map(style => (
                    <button
                        key={style.id}
                        onClick={() => handleSelect(style)}
                        disabled={disabled}
                        className={`
                            px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all
                            ${selectedStyle === style.id 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {style.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default StyleCarousel;
