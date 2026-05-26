import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdNotificationsActive, MdArrowBackIos, MdArrowForwardIos, MdPerson } from 'react-icons/md';
import { FaGraduationCap, FaWhatsapp } from 'react-icons/fa';

import PublicHeader from '../../components/layout/PublicHeader';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-[#2a374a] text-slate-300 text-xs md:text-sm py-0 flex flex-col md:flex-row items-center justify-between pl-4 pr-0">
        <div className="flex items-center gap-6 py-2 md:py-0">
          <div className="flex items-center gap-2">
            <MdEmail className="text-lg" />
            <a href="mailto:dhanush.v.ciet@gmail.com" className="hover:text-white transition-colors">dhanush.v.ciet@gmail.com</a>
          </div>
          <div className="flex items-center gap-2">
            <MdPhone className="text-lg" />
            <a href="tel:+919788944296" className="hover:text-white transition-colors">+91 9788944296</a>
          </div>
        </div>

        <div className="flex items-center h-full">
          <Link to="/login" className="bg-[#28a745] hover:bg-[#218838] text-white font-bold px-6 py-3 h-full flex items-center transition-colors">
            VVMS LOGIN
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <PublicHeader />

      {/* Hero Section */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex flex-col justify-center min-h-[600px]" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Left/Right Carousel Controls */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
          <MdArrowBackIos className="text-5xl" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
          <MdArrowForwardIos className="text-5xl" />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 px-10 md:px-20 max-w-5xl">
          <h2 className="text-white text-3xl md:text-5xl font-semibold mb-4 tracking-wide shadow-black drop-shadow-md">
            The Best School
          </h2>
          
          <div className="bg-[#1a2538] text-white font-serif font-bold text-5xl md:text-7xl px-8 py-4 inline-block shadow-2xl mb-1">
            Vidhya Vikas
          </div>
          
          <br />
          
          <div className="bg-white text-black font-bold text-lg md:text-xl px-8 py-3 inline-block shadow-xl mt-1">
            Empowering Minds, Inspiring Futures
          </div>
        </div>

        {/* Bottom Right Floating Action Buttons */}
        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4 z-20">
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-[#0f2a4a] text-[#3498db] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-900 transition-colors border-2 border-[#3498db]">
              <MdPerson className="text-2xl" />
            </div>
            <div className="w-12 h-12 bg-transparent text-[#25D366] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
              <FaWhatsapp className="text-5xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
