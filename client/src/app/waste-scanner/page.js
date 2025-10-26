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

};