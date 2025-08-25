import React, { useState, useEffect } from 'react';
import AffiliatePortalSidebar from './AffiliatePortalSidebar'; // ✅ Correct import
import DashboardBoxes from './DashboardBoxes';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
        <div className="grid grid-cols-1 gap-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-3xl font-extrabold text-gray-800">AFFILIATE DASHBOARD</h2>
              
            </div>
              <DashboardBoxes />
            </div>
    </div>
  );
}