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
        <div className="w-full max-w-4xl px-4 mt-4 pb-10">
          <h3 className="text-lg font-bold text-[#0033cc] mb-4">Pending Fee Details</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-sm text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border border-slate-300 px-4 py-2">S.No</th>
                  <th className="border border-slate-300 px-4 py-2">Fee Category</th>
                  <th className="border border-slate-300 px-4 py-2">Term / Month</th>
                  <th className="border border-slate-300 px-4 py-2">Due Date</th>
                  <th className="border border-slate-300 px-4 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">1</td>
                  <td className="border border-slate-300 px-4 py-2 font-medium">Term 1 Tuition Fee</td>
                  <td className="border border-slate-300 px-4 py-2">June to Sep 2026</td>
                  <td className="border border-slate-300 px-4 py-2 text-red-600 font-medium">30-Jun-2026</td>
                  <td className="border border-slate-300 px-4 py-2 text-right font-medium">12,500.00</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">2</td>
                  <td className="border border-slate-300 px-4 py-2 font-medium">Transport Fee</td>
                  <td className="border border-slate-300 px-4 py-2">June 2026</td>
                  <td className="border border-slate-300 px-4 py-2 text-red-600 font-medium">15-Jun-2026</td>
                  <td className="border border-slate-300 px-4 py-2 text-right font-medium">1,200.00</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td colSpan="4" className="border border-slate-300 px-4 py-2 text-right text-slate-800">Total Payable Amount</td>
                  <td className="border border-slate-300 px-4 py-2 text-right text-[#0033cc] text-lg">₹ 13,700.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-6 rounded-md shadow-sm text-sm transition-colors w-full sm:w-auto">
              Check Payment History
            </button>
            <button 
              onClick={() => alert('Redirecting to secure payment gateway...')}
              className="bg-[#28a745] hover:bg-[#218838] text-white font-bold py-2.5 px-10 rounded-md shadow-md text-base transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Pay Now (₹ 13,700)
            </button>
          </div>
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
