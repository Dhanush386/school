import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const OnlinePayment = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'processing', 'success'
  const [transactionId, setTransactionId] = useState('');

  const mockFees = [
    { id: 1, category: 'Term 1 Tuition Fee', term: 'June to Sep 2026', due: '30-Jun-2026', amount: 12500 },
    { id: 2, category: 'Transport Fee', term: 'June 2026', due: '15-Jun-2026', amount: 1200 },
  ];

  const [selectedFees, setSelectedFees] = useState(mockFees.map(f => f.id));

  const totalAmount = mockFees
    .filter(f => selectedFees.includes(f.id))
    .reduce((sum, f) => sum + f.amount, 0);

  const toggleFee = (id) => {
    if (selectedFees.includes(id)) {
      setSelectedFees(selectedFees.filter(fid => fid !== id));
    } else {
      setSelectedFees([...selectedFees, id]);
    }
  };

  const handleViewFees = (e) => {
    e.preventDefault();
    if (username && password) {
      setShowDetails(true);
    }
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (totalAmount <= 0) return;
    
    setPaymentStatus('processing');
    
    try {
      // 1. Create order on backend
      const { data: orderData } = await axiosInstance.post('/payment/create-order', {
        amount: totalAmount,
        studentId: username || 'anonymous',
        studentName: username || 'Unknown Student',
        feeDetails: mockFees.filter(f => selectedFees.includes(f.id))
      });

      if (!orderData.success) {
        throw new Error('Failed to create order');
      }

      // 1.5. If the backend is using fake keys (mock mode), bypass the real Razorpay widget
      // because Razorpay's script will throw an error with a fake key.
      if (orderData.isMock) {
        setTimeout(() => {
          setTransactionId('TXN' + Math.floor(1000000000 + Math.random() * 9000000000));
          setPaymentStatus('success');
        }, 2000);
        return;
      }

      // 2. Open Razorpay Checkout (Real Keys Required)
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Vidhya Vikas Matric Hr. Sec. School',
        description: 'Fee Payment',
        image: '/logo.jpeg',
        order_id: orderData.orderId,
        handler: async function (response) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await axiosInstance.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              setTransactionId(response.razorpay_payment_id);
              setPaymentStatus('success');
            } else {
              alert('Payment Verification Failed!');
              setPaymentStatus('idle');
            }
          } catch (verifyErr) {
            console.error('Verify Error:', verifyErr);
            alert('Payment verified but error connecting to server.');
            setPaymentStatus('idle');
          }
        },
        prefill: {
          name: username || 'Student',
          email: 'student@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#0033cc'
        },
        modal: {
          ondismiss: function() {
            setPaymentStatus('idle');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error('Payment Failed:', response.error);
        alert(response.error.description);
        setPaymentStatus('idle');
      });
      rzp.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment gateway.');
      setPaymentStatus('idle');
    }
  };

  const handleCloseModal = () => {
    setPaymentStatus('idle');
    // Reset selections and total after "successful" mock payment
    setSelectedFees([]);
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
                  <th className="border border-slate-300 px-4 py-2 w-10 text-center">
                    <input 
                      type="checkbox" 
                      className="cursor-pointer h-4 w-4"
                      checked={selectedFees.length === mockFees.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedFees(mockFees.map(f => f.id));
                        else setSelectedFees([]);
                      }}
                    />
                  </th>
                  <th className="border border-slate-300 px-4 py-2">S.No</th>
                  <th className="border border-slate-300 px-4 py-2">Fee Category</th>
                  <th className="border border-slate-300 px-4 py-2">Term / Month</th>
                  <th className="border border-slate-300 px-4 py-2">Due Date</th>
                  <th className="border border-slate-300 px-4 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {mockFees.map((fee, index) => (
                  <tr key={fee.id}>
                    <td className="border border-slate-300 px-4 py-2 text-center">
                      <input 
                        type="checkbox" 
                        className="cursor-pointer h-4 w-4"
                        checked={selectedFees.includes(fee.id)}
                        onChange={() => toggleFee(fee.id)}
                      />
                    </td>
                    <td className="border border-slate-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-slate-300 px-4 py-2 font-medium">{fee.category}</td>
                    <td className="border border-slate-300 px-4 py-2">{fee.term}</td>
                    <td className="border border-slate-300 px-4 py-2 text-red-600 font-medium">{fee.due}</td>
                    <td className="border border-slate-300 px-4 py-2 text-right font-medium">
                      {fee.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan="5" className="border border-slate-300 px-4 py-2 text-right text-slate-800">Total Payable Amount</td>
                  <td className="border border-slate-300 px-4 py-2 text-right text-[#0033cc] text-lg">
                    ₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2.5 px-6 rounded-md shadow-sm text-sm transition-colors w-full sm:w-auto">
              Check Payment History
            </button>
            <button 
              onClick={handlePayment}
              disabled={selectedFees.length === 0}
              className={`${selectedFees.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#28a745] hover:bg-[#218838]'} text-white font-bold py-2.5 px-10 rounded-md shadow-md text-base transition-colors flex items-center gap-2 w-full sm:w-auto justify-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Pay Now (₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
            </button>
          </div>
        </div>
      )}



      {/* Payment Processing/Success Modal */}
      {paymentStatus !== 'idle' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            {paymentStatus === 'processing' ? (
              <div className="p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-[#0033cc] rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Payment...</h3>
                <p className="text-slate-500 text-sm">Please do not refresh or close this window.</p>
                <div className="mt-6 bg-slate-50 px-6 py-3 rounded-xl border border-slate-200">
                  <span className="text-slate-600 text-sm font-medium mr-2">Amount:</span>
                  <span className="text-xl font-bold text-[#0033cc]">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
                <p className="text-slate-500 mb-6">Your fee payment has been successfully recorded.</p>
                
                <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Amount Paid:</span>
                    <span className="text-slate-900 font-bold text-base">₹ {totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Transaction ID:</span>
                    <span className="text-slate-900 font-mono font-medium">{transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Date:</span>
                    <span className="text-slate-900 font-medium">{new Date().toLocaleString()}</span>
                  </div>
                </div>

                <div className="w-full flex gap-3">
                  <button 
                    onClick={() => alert('Downloading receipt...')}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    Download Receipt
                  </button>
                  <button 
                    onClick={handleCloseModal}
                    className="flex-1 bg-[#0033cc] hover:bg-[#002299] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
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
