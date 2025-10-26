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

        </div>
    );