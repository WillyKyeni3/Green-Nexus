// client/src/app/landingpage/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LeafIcon, ArrowRightIcon } from 'lucide-react';
import Button from './components/common/Button';

const LandingPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render the full content after client hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-soft-beige flex flex-col">
        <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="GreenNexus Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="ml-2 text-xl font-bold text-primary-dark">
              GreenNexus
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-primary-dark hover:text-primary font-medium"
            >
              Login
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-beige flex flex-col">
      {/* Navigation */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center">
          <img
            src="/Logo.ico"
            alt="GreenNexus Logo"
            className="h-12 w-12 object-contain"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-gray-700 hover:text-primary font-medium"
          >
            Login
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Embrace <span className="text-green-500">Sustainable</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Explore eco-friendly products, track your impact and join
                challenges to make a difference for the planet
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition-colors">
                    Get Started <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Content - Image with Metrics */}
            <div className="relative">
              <img
                src="/heroimage.jpeg"
                alt="Sustainability metrics"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Metric Card 1 - Top Left */}
              <div className="absolute top-4 left-4 bg-green-100/95 backdrop-blur-sm rounded-xl p-4 shadow-lg w-48">
                <div className="text-3xl font-bold text-gray-900 mb-1">85%</div>
                <div className="text-sm text-gray-700 mb-3">Waste diversion rate</div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              {/* Metric Card 2 - Middle Right */}
              <div className="absolute top-1/3 right-4 bg-green-100/95 backdrop-blur-sm rounded-xl p-4 shadow-lg w-48">
                <div className="text-3xl font-bold text-gray-900 mb-1">62%</div>
                <div className="text-sm text-gray-700 mb-3">Sustainable transport goal</div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>

              {/* Metric Card 3 - Bottom Left */}
              <div className="absolute bottom-8 left-4 bg-green-100/95 backdrop-blur-sm rounded-xl p-4 shadow-lg w-48">
                <div className="text-3xl font-bold text-gray-900 mb-1">78%</div>
                <div className="text-sm text-gray-700 mb-3">Monthly carbon target</div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-16 px-6 md:px-12 bg-soft-beige">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 - Activity Tracking */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                {/* Icon Container - ADD YOUR ICON PATH HERE */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/eye.ico"
                    alt="Activity Tracking"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-4">
                  Activity Tracking
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Users log activities e.g transport & purchases for carbon footprint calculations
                </p>
              </div>

              {/* Feature 2 - Waste Analysis */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                {/* Icon Container - ADD YOUR ICON PATH HERE */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/recycle.ico"
                    alt="Waste Analysis"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-4">
                  Waste Analysis
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  upload image for recycling guidance whether it can be recycled or not.
                </p>
              </div>

              {/* Feature 3 - Marketplace */}
              <div className="bg-white rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                {/* Icon Container - ADD YOUR ICON PATH HERE */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/marketplace.ico"
                    alt="Marketplace"
                    className="h-16 w-16 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-4">
                  Marketplace
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Browse eco friendly products with Ai delivering nudge.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src="/leaflogo.png"
              alt="GreenNexus Logo"
              className="h-12 w-12 gap-20"
            />
            <span className="ml-2 font-bold">GreenNexus</span>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} GreenNexus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;