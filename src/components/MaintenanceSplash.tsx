// src/components/MaintenanceSplash.tsx

import React from 'react';
import { PDFMingleIcon } from './PDFMingleIcon';
import { Settings } from 'lucide-react';

export const MaintenanceSplash = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
      <div className="text-center space-y-6 max-w-lg mx-auto">
        <div className="flex justify-center items-center gap-4">
            <PDFMingleIcon className="h-12 w-12"/>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="text-blue-600">PDF</span>Mingle
            </h1>
        </div>

        <div className="relative flex justify-center items-center my-8">
            <Settings className="h-20 w-20 text-blue-500 animate-spin" style={{ animationDuration: '15s' }} />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900">
          We're Getting an Upgrade
        </h2>
        
        <p className="text-lg text-gray-600">
          PDFMingle is currently undergoing scheduled maintenance to improve your experience. We are working hard to make our tools even better and more reliable for you.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-800">
                We expect to be back online by: <br/>
                <span className="text-xl">August 29th, 2025</span>
            </p>
        </div>
        
        <p className="text-sm text-gray-500 pt-4">
          Thank you for your patience!
        </p>
      </div>
    </div>
  );
};
