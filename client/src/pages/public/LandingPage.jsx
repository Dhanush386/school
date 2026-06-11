import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdNotificationsActive, MdArrowBackIos, MdArrowForwardIos, MdPerson } from 'react-icons/md';
import { FaGraduationCap, FaWhatsapp } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

import PublicHeader from '../../components/layout/PublicHeader';

const HeroTypewriter = () => {
  const [cycle, setCycle] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        setStep(0);
        setCycle(c => c + 1);
      }, 3000); // Wait 3 seconds after finishing before restarting
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div key={cycle} className="relative z-10 px-10 md:px-20 max-w-5xl">
      <h2 className="text-white text-3xl md:text-5xl font-semibold mb-4 tracking-wide shadow-black drop-shadow-md min-h-[48px] md:min-h-[60px]">
        {step >= 0 && (
          <TypeAnimation
            sequence={['The Best School', () => setStep(1)]}
            wrapper="span"
            speed={60}
            cursor={step === 0}
          />
        )}
      </h2>
      
      <div className="text-white font-serif font-bold text-5xl md:text-7xl inline-block shadow-black drop-shadow-lg mb-1 min-h-[88px] md:min-h-[104px]">
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
      
      <div className="text-white font-bold text-lg md:text-xl inline-block shadow-black drop-shadow-md mt-1 min-h-[52px]">
        {step >= 2 && (
          <TypeAnimation
            sequence={['Empowering Minds, Inspiring Futures', () => setStep(3)]}
            wrapper="span"
            speed={60}
            cursor={step === 2}
          />
        )}
      </div>
    </div>
  );
};

const carouselImages = [
  '/hero-image/slide1.jpeg',
  '/hero-image/slide2.jpeg',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

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

      {/* Hero Section */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden flex flex-col justify-center min-h-[600px]">
        {/* Carousel Background Images */}
        {carouselImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
            style={{
              backgroundImage: `url('${src}')`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          />
        ))}

        {/* Overlay gradient to ensure text readability */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Left/Right Carousel Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-20"
        >
          <MdArrowBackIos className="text-5xl" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-20"
        >
          <MdArrowForwardIos className="text-5xl" />
        </button>

        {/* Hero Content */}
        <HeroTypewriter />

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
