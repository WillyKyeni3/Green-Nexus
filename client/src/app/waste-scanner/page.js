'use client';
import { useState, useRef } from 'react';
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result);
        setResults(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!image) return;
    setIsAnalyzing(true);
    // Simulate analysis with a timeout
    setTimeout(() => {
      // Mock results - in a real app, this would come from an API
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
};


    return (
        <div>
        <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-dark mb-2">
          Waste Scanner
        </h1>
        <p className="text-gray-600">
          Upload a photo of your waste item to get recycling information and
          disposal tips.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-primary-dark">
              Upload Image
            </h3>
            <p className="text-sm text-gray-600">
              Take a clear photo of the item you want to analyze.
            </p>
          </div>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-primary bg-primary-light/50' : 'border-neutral-gray'} ${image ? 'bg-primary-light/20' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {image ? (
              <div className="space-y-4">
                <div className="relative max-h-64 overflow-hidden rounded-lg mx-auto">
                  <img
                    src={image}
                    alt="Uploaded waste"
                    className="mx-auto max-h-64 object-contain"
                  />
                  </div>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <XIcon size={16} className="mr-1" />
                    Remove
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
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
                <p className="text-gray-600 mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                



        </div>
    );