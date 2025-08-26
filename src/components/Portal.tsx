import React, { useState, useEffect } from 'react';
import AffiliatePortalSidebar from './AffiliatePortalSidebar'; // ✅ Correct import
import DashboardBoxes from './DashboardBoxes';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white p-8 font-sans">
        <div className="grid grid-cols-1 gap-8">
           <h2 className="px-4 text-3xl font-extrabold text-gray-800">AFFILIATE DASHBOARD</h2>
      
              <DashboardBoxes />
            </div>
    </div>
  );
}