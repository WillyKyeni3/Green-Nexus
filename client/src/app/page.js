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
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/Logo.ico"
            alt="GreenNexus Logo"
            className="h-12 w-12 object-contain"
          />
          {/* <span className="ml-2 text-xl font-bold text-primary-dark">
            GreenNexus
          </span> */}
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Embrace <span className="text-primary">Sustainable</span>
              </h1>
              <p className="mt-4 text-lg text-gray-700">
                Explore eco-friendly products, track your impact and join
                challenges to make a difference for the planet
              </p>
              <div className="mt-8">
                <Link href="/login">
                  <Button className="flex items-center">
                    Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="/heroimage.jpeg"
                alt="Sustainability metrics"
                className="w-full h-auto rounded-lg"
              />
              {/* Metrics overlays - these position the metrics cards as shown in the image */}
              <div className="absolute top-8 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-xs text-gray-700">
                  Waste diversion rate
                </div>
              </div>
              <div className="absolute top-1/3 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-2xl font-bold text-primary">62%</div>
                <div className="text-xs text-gray-700">
                  Sustainable transport goal
                </div>
              </div>
              <div className="absolute top-2/3 left-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                <div className="text-2xl font-bold text-primary">78%</div>
                <div className="text-xs text-gray-700">
                  Monthly carbon target
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-12 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-soft-beige rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-dark mb-2">
                  Track Impact
                </h3>
                <p className="text-gray-600">
                  Monitor your carbon footprint and see how your actions affect
                  the environment
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-soft-beige rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 10C21 14.9706 16.9706 19 12 19C7.02944 19 3 14.9706 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 19V23"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17 21H7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 7L9.5 10.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 7L14.5 9.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 7V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-dark mb-2">
                  Reduce Waste
                </h3>
                <p className="text-gray-600">
                  Learn how to recycle properly and minimize waste in your daily
                  life
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-soft-beige rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.5 20.5L4.5 16.5H19.5L20.5 20.5H3.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 16.5V3.5C6 3.5 9 2 12 2C15 2 18 3.5 18 3.5V16.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 6.5V12.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M15 9.5H9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-dark mb-2">
                  Eco Shopping
                </h3>
                <p className="text-gray-600">
                  Discover sustainable products that are better for you and the
                  environment
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
            {/* <LeafIcon className="h-6 w-6" /> */}
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