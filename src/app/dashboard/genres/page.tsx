"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { fetchGenres } from "../../utils/api";

export default function GenresDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setIsLoading(true);
        const response: any = await fetchGenres();
        
        // Check if response has pagination structure as described
        if (response && response?.pagination && response.pagination.total_items !== undefined) {
          setTotalItems(response?.pagination.total_items);
        } else if (Array.isArray(response)) {
          // Fallback for array response
          setTotalItems(response.length);
        }
        
        setError(null);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        setError("Failed to load genres. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGenres();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white p-6 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 -mb-10 -ml-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Genres Management</h1>
                <p className="mt-2 opacity-80">Manage music genres</p>
              </div>
              
              {!isLoading && !error && (
                <div className="px-4 py-2 bg-white/10 rounded-lg">
                  <span className="text-sm font-medium">Total Genres: <span className="text-white font-bold">{totalItems}</span></span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 p-6">
          {error ? (
            <div className="text-center p-8">
              <div className="text-6xl text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Error Loading Genres</h2>
              <p className="text-gray-500 mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="h-12 w-12 border-4 border-t-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading genres...</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-6xl text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Genres Dashboard</h2>
                <p className="text-gray-500 mt-2">{totalItems} genres available in the system</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}