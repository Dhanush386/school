import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OnlinePayment = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleViewFees = (e) => {
    e.preventDefault();
    if (username && password) {
      setShowDetails(true);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center py-10 px-4">
      {/* Top Logo - Using standard text as placeholder for image logo, but matching styling */}
      <div className="w-full max-w-4xl mb-2 flex justify-start">
        <img src="/logo.jpeg" alt="Logo" className="h-12 w-12 object-contain" />
      </div>

      {/* Main Box */}
      <div className="w-full max-w-4xl border border-black p-0 mb-2 shadow-sm bg-white">
        
        {/* Blue Pill Title */}
        <div className="flex justify-center -mt-6 mb-6">
          <div className="bg-[#0033cc] text-white px-6 py-2 rounded-xl font-bold text-xl md:text-2xl shadow-md border-2 border-white">
            Online Fee Payment
          </div>
        </div>

        {/* Form Container */}
        <div className="px-6 md:px-12 py-4">
          <form className="flex flex-col md:flex-row items-end gap-6 mb-6" onSubmit={handleViewFees}>
            <div className="flex flex-col w-full md:w-64">
              <label className="text-sm font-bold text-slate-800 mb-1">User Name</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-blue-200 bg-[#eef2ff] px-3 py-2 text-sm focus:outline-none focus:border-[#0033cc] text-slate-700 h-10"
                placeholder=""
              />
            </div>
            
            <div className="flex flex-col w-full md:w-64">
              <label className="text-sm font-bold text-slate-800 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-blue-200 bg-[#eef2ff] px-3 py-2 text-sm focus:outline-none focus:border-[#0033cc] text-slate-700 h-10"
                placeholder=""
              />
            </div>

            <div className="flex gap-4">
              <button 
                type="submit"
                className="bg-[#f27b21] hover:bg-[#d96614] text-white font-bold py-2 px-6 rounded-md shadow h-10 text-sm whitespace-nowrap"
              >
                View Fees
              </button>
              
              <Link 
                to="/"
                className="bg-[#0033cc] hover:bg-[#002299] text-white font-bold py-2 px-6 rounded-md shadow h-10 text-sm whitespace-nowrap flex items-center justify-center"
              >
                Home Page
              </Link>
            </div>
          </form>

          <p className="text-red-600 font-bold text-sm mb-6">
            Type your User Name,Password and Click View Fees
          </p>

          {/* Divider */}
          {showDetails && <div className="border-t border-black mb-6 w-full"></div>}

          {/* Student Details Section */}
          {showDetails && (
            <div className="flex flex-col md:flex-row gap-10 items-start pb-8">
              {/* Photo placeholder */}
              <div className="w-32 h-40 bg-gray-200 shrink-0 ml-4 border flex items-center justify-center overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${username}&background=random&size=150`} alt="Student" className="w-full h-full object-cover" />
              </div>

              {/* Info Grid */}
              <div className="flex-1 text-sm text-slate-800 flex flex-col gap-4">
                <div className="flex">
                  <div className="w-32 font-bold">Institution</div>
                  <div>: Vidhya Vikas Matric Hr. Sec. School</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-bold">Student Name</div>
                  <div>: {username.toUpperCase() || 'DHANUSH V'}</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-bold">Department</div>
                  <div>: Computer Science</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-bold">Course</div>
                  <div>: Matriculation</div>
                </div>
                <div className="flex">
                  <div className="w-32 font-bold">Batch</div>
                  <div>: 2026-2027</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Area Below Form */}
      {showDetails && (
        <div className="w-full max-w-4xl flex justify-between items-center px-4 mt-2">
          <div className="text-red-700 text-sm">
            No pending fees available to the student
          </div>
          <button className="bg-[#f27b21] hover:bg-[#d96614] text-white font-bold py-2 px-6 rounded-md shadow text-sm">
            Check Your Payment History
          </button>
        </div>
      )}



      <style jsx>{`
        .clip-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};

export default OnlinePayment;
