import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdArrowBackIos, MdArrowForwardIos, MdPerson } from 'react-icons/md';
import { FaGraduationCap, FaWhatsapp } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import PublicHeader from '../../components/layout/PublicHeader';

// Lazy-load the heavy 3D canvas so it doesn't block the initial render
const HeroScene = lazy(() => import('../../components/3d/HeroScene'));

const HeroTypewriter = () => {
  const [cycle, setCycle] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(0);
        setCycle(c => c + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div key={cycle} className="relative z-10 px-10 md:px-20 max-w-5xl">
      <h2 className="text-white text-3xl md:text-5xl font-semibold mb-4 tracking-wide drop-shadow-lg min-h-[48px] md:min-h-[60px]">
        {step >= 0 && (
          <TypeAnimation
            sequence={['The Best School', () => setStep(1)]}
            wrapper="span"
            speed={60}
            cursor={step === 0}
          />
        )}
      </h2>

      <div className="text-white font-serif font-bold text-5xl md:text-7xl inline-block drop-shadow-xl mb-1 min-h-[88px] md:min-h-[104px]">
        {step >= 1 && (
          <TypeAnimation
            sequence={['Vidhya Vikas', () => setStep(2)]}
            wrapper="span"
            speed={50}
            cursor={step === 1}
          />
        )}
      </div>

      <br />

      <div className="text-white font-bold text-lg md:text-xl inline-block drop-shadow-md mt-1 min-h-[52px]">
        {step >= 2 && (
          <TypeAnimation
            sequence={['Empowering Minds, Inspiring Futures', () => setStep(3)]}
            wrapper="span"
            speed={60}
            cursor={step === 2}
          />
        )}
      </div>

      {step >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex gap-4 flex-wrap"
        >
          <Link
            to="/login"
            className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full shadow-xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
          >
            Login to Portal
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 bg-white/20 backdrop-blur text-white font-bold rounded-full border border-white/40 hover:bg-white/30 transition-all hover:scale-105 active:scale-95"
          >
            Learn More
          </Link>
        </motion.div>
      )}
    </div>
  );
};

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

        <div className="hidden xl:flex items-center h-full">
          <Link to="/login" className="bg-[#28a745] hover:bg-[#218838] text-white font-bold px-6 py-3 h-full flex items-center transition-colors">
            VVMS LOGIN
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <PublicHeader />

      {/* Hero Section with 3D Canvas */}
      <div className="relative flex-1 overflow-hidden flex flex-col justify-center min-h-[600px]">

        {/* 3D Canvas — fills entire hero */}
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200" />
          }
        >
          <HeroScene />
        </Suspense>

        {/* Light sky overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/30 to-transparent pointer-events-none" />

        {/* Left/Right Carousel Controls */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-20">
          <MdArrowBackIos className="text-5xl" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-20">
          <MdArrowForwardIos className="text-5xl" />
        </button>

        {/* Hero Content — sits on top of 3D scene */}
        <div className="relative z-10">
          <HeroTypewriter />
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

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/60 text-xs"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll Down</span>
          <span className="text-lg">↓</span>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
