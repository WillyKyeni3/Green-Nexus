'use client';
import React, { useState, useRef, useEffect } from 'react';
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
  const [originalFile, setOriginalFile] = useState(null); // Added to store the original file
  const [recentlyScanned, setRecentlyScanned] = useState([]);
  const [recentlyScannedLoading, setRecentlyScannedLoading] = useState(false);
  const [recentlyScannedError, setRecentlyScannedError] = useState(null);
  const fileInputRef = useRef(null);

  // Function to fetch recently scanned items
  const fetchRecentlyScanned = async () => {
    setRecentlyScannedLoading(true);
    setRecentlyScannedError(null);
    try {
      // Use the environment variable for the backend URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waste-scanner/recent`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Get the full response object

      // Check if the response format matches what the backend sends
      // Assuming backend returns { success: true, data: [...], count: ... }
      if (result.success && Array.isArray(result.data)) {
        // Access the 'data' array inside the result object
        setRecentlyScanned(result.data.slice(0, 6)); // Limit to 6 items
      } else {
        // Handle unexpected response format
        console.error("Unexpected response format:", result);
        setRecentlyScannedError("Received unexpected data format from server.");
      }
    } catch (error) {
      console.error('Error fetching recent scans:', error);
      setRecentlyScannedError('Failed to load recent scans.');
    } finally {
      setRecentlyScannedLoading(false);
    }
  };

  // Fetch recently scanned items on component mount
  useEffect(() => {
    fetchRecentlyScanned();
  }, []);

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
    if (file) {
      setOriginalFile(file); // Store the original file
      handleFile(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      setOriginalFile(file); // Store the original file
      handleFile(file);
    }
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
        setOriginalFile(file); // Store the original file
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!originalFile) {
      alert('No file selected for analysis');
      return;
    }
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', originalFile);

      // Use the environment variable for the backend URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/waste-scanner/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Handle potential JSON parse errors
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform the backend response to match your frontend format
      // The backend returns fields like waste_type, recyclability, recycling_instructions, etc.
      const transformedResults = {
        recyclable: data.data.recyclability === 'Recyclable' || data.data.recyclability === 'Conditionally recyclable',
        materialType: data.data.material_composition || 'Unknown',
        confidence: 0.95, // Placeholder confidence, could be improved later
        tips: data.data.recycling_instructions ? [data.data.recycling_instructions] : [],
        wasteType: data.data.waste_type || 'Unknown',
        environmentalImpact: data.data.environmental_impact || 'No information available',
        id: data.data.id, // Store the ID from the backend if needed
      };

      setResults(transformedResults);

      // Refresh the recently scanned list after a successful analysis
      // Add a small delay to allow the backend to process and store the new item
      setTimeout(() => {
        fetchRecentlyScanned();
      }, 1000); // 1 second delay

    } catch (error) {
      console.error('Analysis error:', error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setResults(null);
    setOriginalFile(null); // Reset the original file state
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper function to get recyclability status text and color
  // Now handles the string values returned by the backend
  const getRecyclabilityInfo = (recyclabilityString) => {
    if (recyclabilityString && recyclabilityString.toLowerCase().includes('recyclable')) {
      return { text: 'Recyclable', color: 'bg-primary-light text-primary' };
    } else if (recyclabilityString && recyclabilityString.toLowerCase().includes('non')) { // Covers "Non-recyclable"
      return { text: 'Not Recyclable', color: 'bg-red-100 text-red-600' };
    } else {
      return { text: recyclabilityString || 'Unknown', color: 'bg-gray-100 text-gray-600' };
    }
  };

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                      We&apos;ve identified this item as: <span className="font-medium">{results.wasteType} ({results.materialType})</span>
                    </p>

                    <div className="flex items-center">
                      <div className="w-full bg-neutral-gray rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${results.confidence * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-primary-dark mb-2">Environmental Impact</h4>
                <p className="text-gray-700">{results.environmentalImpact}</p>
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
                  <span className="text-xs text-gray-500">Powered by OpenAI</span>
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

      {/* Recently Scanned Items Card */}
      <div className="mt-8">
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-primary-dark">Recently Scanned Items</h3>
            <p className="text-sm text-gray-600">View your previous waste analysis results.</p>
          </div>

          {recentlyScannedLoading ? (
            <div className="flex justify-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-primary"
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
            </div>
          ) : recentlyScannedError ? (
            <div className="text-center py-4 text-red-500">
              {recentlyScannedError}
            </div>
          ) : recentlyScanned.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No scanned items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentlyScanned.map((item, index) => {
                const recyclabilityInfo = getRecyclabilityInfo(item.recyclability); // Now handles string values like "Recyclable", "Non-recyclable"
                return (
                  <div key={item.id || index} className="border border-neutral-gray rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Image - Currently, the backend doesn't return the full image URL */}
                    <div className="mb-3">
                      {/* The backend returns 'filepath' which is server-side. You might need to serve these images via a static route. */}
                      {/* For now, show a placeholder */}
                      <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md">
                        <ImageIcon size={32} className="text-gray-400" />
                      </div>
                      {/* Optional: If you serve images via a route like http://localhost:5000/uploads/<filename>, you could use: */}
                      {/* <img
                        src={`http://localhost:5000/uploads/${item.filename}`} // Adjust base URL and path as needed
                        alt={`Scanned item ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      /> */}
                    </div>

                    {/* Waste Type */}
                    <h4 className="font-medium text-gray-900 truncate" title={item.waste_type || 'Unknown'}>
                      {item.waste_type || 'Unknown Waste Type'}
                    </h4>

                    {/* Recyclability Status - Using the updated helper */}
                    <div className={`mt-1 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${recyclabilityInfo.color}`}>
                      {recyclabilityInfo.text}
                    </div>

                    {/* Material Type */}
                    <p className="text-sm text-gray-600 mt-1 truncate" title={item.material_composition || 'Unknown'}>
                      Material: {item.material_composition || 'Unknown'}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-500 mt-2">
                      Scanned: {formatDate(item.created_at)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WasteScannerPage;