'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PlaceResult } from '@/lib/types';
import { useBrandTakeover } from '@/src/brand/useBrandTakeover';

const AddressAutocomplete = dynamic(() => import('@/components/AddressAutocomplete'), { 
  ssr: false,
  loading: () => <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
});

export default function EmbedPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Brand takeover mode detection
  const b = useBrandTakeover();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAddressSelect = (place: { formattedAddress: string; placeId: string; lat: number; lng: number }) => {
    // Create a PlaceResult from the place object
    const placeResult: PlaceResult = {
      formattedAddress: place.formattedAddress,
      placeId: place.placeId,
      lat: place.lat,
      lng: place.lng,
      components: {}
    };
    setSelectedPlace(placeResult);
    setAddress(place.formattedAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) return;
    
    setIsLoading(true);
    try {
      // Generate report URL with parameters
      const reportUrl = `/report?address=${encodeURIComponent(selectedPlace.formattedAddress)}&lat=${selectedPlace.lat}&lng=${selectedPlace.lng}&placeId=${selectedPlace.placeId}`;
      
      // Open report in new tab
      window.open(reportUrl, '_blank');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {b.logo && (
              <img 
                src={b.logo} 
                alt={b.brand || 'Company'} 
                className="h-8 w-auto"
              />
            )}
            <h2 className="text-lg font-semibold text-gray-900">
              {b.brand || 'Solar Calculator'}
            </h2>
          </div>
          <div className="text-sm text-gray-500">
            Powered by <span style={{ color: b.primary }}>Sunspire</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Your Instant Solar Quote
          </h2>
          <p className="text-lg text-gray-600">
            Enter your address to see solar production, savings, and payback—instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="mb-6">
            <AddressAutocomplete
              onSelect={handleAddressSelect}
              placeholder="Enter your property address"
              className="w-full"
            />
          </div>
          
          <button
            type="submit"
            disabled={!selectedPlace || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: b.primary }}
          >
            {isLoading ? 'Generating Quote...' : 'Get My Solar Quote'}
          </button>
        </form>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">Get your solar quote in seconds</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">NREL Certified</h3>
            <p className="text-sm text-gray-600">Industry-standard calculations</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-600">Your data is protected</p>
          </div>
        </div>
      </div>

      {/* Minimal footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>
            Powered by <span style={{ color: b.primary }}>Sunspire</span> • 
            <a href="/privacy" className="ml-1 hover:text-gray-700">Privacy</a> • 
            <a href="/terms" className="ml-1 hover:text-gray-700">Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}
