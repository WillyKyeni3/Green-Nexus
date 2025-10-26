'use client';
import React, { useState, useRef } from 'react';
import {
  UploadIcon,
  ImageIcon,
  CheckIcon,
  XIcon,
  AlertTriangleIcon,
  InfoIcon,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const WasteScannerPage = () => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target?.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setImage(ev.target.result);
        setResults(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!image) return;
    setIsAnalyzing(true);
    // Simulate analysis with a timeout (replace with real API call)
    setTimeout(() => {
      setResults({
        recyclable: true,
        materialType: 'Plastic (PET)',
        confidence: 0.92,
        tips: [
          'Rinse container before recycling',
          'Remove cap and place in separate recycling bin',
          'Check local guidelines for PET recycling',
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark mb-2">Waste Scanner</h1>
        <p className="text-gray-600">
          Upload a photo of your waste item to get recycling information and disposal tips.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-primary-dark">Upload Image</h3>
            <p className="text-sm text-gray-600">Take a clear photo of the item you want to analyze.</p>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-primary bg-primary-light/50' : 'border-neutral-gray'} ${image ? 'bg-primary-light/20' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            {image ? (
              <div className="space-y-4">
                <div className="relative max-h-64 overflow-hidden rounded-lg mx-auto">
                  <img src={image} alt="Uploaded waste" className="mx-auto max-h-64 object-contain" />
                </div>

                <div className="flex justify-center space-x-3">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <XIcon size={16} className="mr-1" />
                    Remove
                  </Button>

                  <Button size="sm" onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>Analyze</>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
                    <ImageIcon size={32} className="text-primary" />
                  </div>
                </div>

                <p className="text-gray-600 mb-4">Drag and drop your image here, or click to browse</p>

                <div className="flex items-center mt-1 justify-center space-x-3">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <UploadIcon size={16} className="mr-2" />
                    Upload Image
                  </Button>
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              </div>
            )}
          </div>
        </Card>

        <Card>
          {results ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-primary-dark">Analysis Results</h3>

                <div className="mt-3 flex items-center">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${results.recyclable ? 'bg-primary-light text-primary' : 'bg-red-100 text-red-600'}`}>
                    {results.recyclable ? (
                      <>
                        <CheckIcon size={16} className="mr-1" />
                        Recyclable
                      </>
                    ) : (
                      <>
                        <XIcon size={16} className="mr-1" />
                        Not Recyclable
                      </>
                    )}
                  </div>

                  <div className="ml-2 text-sm text-gray-500">{Math.round(results.confidence * 100)}% confidence</div>
                </div>
              </div>

              <div className="bg-primary-light/30 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center mr-3 mt-0.5">
                    <InfoIcon size={18} className="text-primary-dark" />
                  </div>

                  <div>
                    <h4 className="font-medium text-primary-dark mb-1">Material Identification</h4>
                    <p className="text-gray-700 mb-2">
                      We&apos;ve identified this item as: <span className="font-medium">{results.materialType}</span>
                    </p>

                    <div className="flex items-center">
                      <div className="w-full bg-neutral-gray rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${results.confidence * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-primary-dark mb-3">Disposal Tips</h4>
                <ul className="space-y-2">
                  {results.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center mr-2 mt-0.5">
                        <CheckIcon size={12} className="text-primary" />
                      </div>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-gray flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded bg-neutral-gray flex items-center justify-center mr-2">
                    <span className="text-xs font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-500">Powered by Hugging Face</span>
                </div>

                <Button variant="outline" size="sm" onClick={handleReset}>
                  Scan Another Item
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-8">
              <div className="mb-4 w-16 h-16 rounded-full bg-neutral-gray/50 flex items-center justify-center">
                <AlertTriangleIcon size={32} className="text-gray-400" />
              </div>

              <h3 className="text-lg font-medium text-gray-700 mb-2">No Analysis Yet</h3>
              <p className="text-gray-600 text-center max-w-xs mb-6">
                Upload an image and click &quot;Analyze&quot; to get recycling information and disposal tips.
              </p>

              {image && (
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WasteScannerPage;
