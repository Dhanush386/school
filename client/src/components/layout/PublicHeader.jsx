import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdMenu, MdClose, MdKeyboardArrowDown } from 'react-icons/md';

const PublicHeader = () => {
  const [vvmsMenuOpen, setVvmsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileVvmsOpen, setMobileVvmsOpen] = useState(false);
  const [studentsMenuOpen, setStudentsMenuOpen] = useState(false);
  const [mobileStudentsOpen, setMobileStudentsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const studentsDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setVvmsMenuOpen(false);
      }
      if (studentsDropdownRef.current && !studentsDropdownRef.current.contains(event.target)) {
        setStudentsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white text-[#0f2a4a] py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="Vidhya Vikas Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full" />
          <div className="flex flex-col uppercase">
            <span className="font-bold text-xl sm:text-2xl md:text-3xl leading-none">Vidhya Vikas</span>
            <span className="font-semibold text-[9px] sm:text-[10px] md:text-xs leading-tight tracking-wide">Matric Hr. Sec School</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 font-bold text-sm tracking-wide">
          <Link to="/" className="hover:text-[#28a745] transition-colors pb-1">HOME</Link>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setVvmsMenuOpen(!vvmsMenuOpen)}
              className={`hover:text-[#28a745] transition-colors pb-1 flex items-center gap-1 ${vvmsMenuOpen ? 'text-[#28a745] border-b-2 border-[#28a745]' : ''}`}
            >
              VVMS <MdKeyboardArrowDown />
            </button>
            {vvmsMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-100 shadow-xl flex flex-col py-2 z-50 text-sm">
                <Link to="/about-us" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">About Us</Link>
                <Link to="/vision-mission" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Vision, Mission & Quality Policy</Link>
                <Link to="/administration" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Administration</Link>
                <Link to="/facilities" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Facilities</Link>
                <a href="#" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Admission</a>
              </div>
            )}
          </div>
          
          <Link to="/academics" className="hover:text-[#28a745] transition-colors pb-1">ACADEMICS</Link>
          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">LIFE @ VVMS</a>
          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">VVMS-TBI</a>
          
          <div className="relative" ref={studentsDropdownRef}>
            <button 
              onClick={() => setStudentsMenuOpen(!studentsMenuOpen)}
              className={`hover:text-[#28a745] transition-colors pb-1 flex items-center gap-1 ${studentsMenuOpen ? 'text-[#28a745] border-b-2 border-[#28a745]' : ''}`}
            >
              STUDENTS' SPACE <MdKeyboardArrowDown />
            </button>
            {studentsMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-gray-100 shadow-xl flex flex-col py-2 z-50 text-sm">
                <Link to="/login" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">CMS Login</Link>
                <a href="#" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">AUERC</a>
                <Link to="/online-payment" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Online Payment</Link>
                <a href="#" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Examination</a>
                <a href="#" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Results</a>
              </div>
            )}
          </div>

          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">CONTACT US</a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button 
          className="xl:hidden text-3xl text-[#0f2a4a] hover:text-[#28a745] transition-colors p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <MdClose /> : <MdMenu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="xl:hidden absolute top-full left-0 w-full bg-white shadow-2xl flex flex-col font-bold text-sm tracking-wide z-50 max-h-[85vh] overflow-y-auto border-t border-gray-200">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 hover:text-[#28a745]">HOME</Link>
          
          <div className="flex flex-col border-b border-gray-100">
            <button 
              onClick={() => setMobileVvmsOpen(!mobileVvmsOpen)}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 hover:text-[#28a745] w-full text-left"
            >
              VVMS <MdKeyboardArrowDown className={`text-xl transition-transform ${mobileVvmsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileVvmsOpen && (
              <div className="flex flex-col bg-gray-50 text-slate-600 font-normal">
                <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">About Us</Link>
                <Link to="/vision-mission" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">Vision, Mission & Quality</Link>
                <Link to="/administration" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">Administration</Link>
                <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">Facilities</Link>
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">Admission</a>
              </div>
            )}
          </div>
          
          <Link to="/academics" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 hover:text-[#28a745]">ACADEMICS</Link>
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 hover:text-[#28a745]">LIFE @ VVMS</a>
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50 hover:text-[#28a745]">VVMS-TBI</a>
          
          <div className="flex flex-col border-b border-gray-100">
            <button 
              onClick={() => setMobileStudentsOpen(!mobileStudentsOpen)}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 hover:text-[#28a745] w-full text-left"
            >
              STUDENTS' SPACE <MdKeyboardArrowDown className={`text-xl transition-transform ${mobileStudentsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileStudentsOpen && (
              <div className="flex flex-col bg-gray-50 text-slate-600 font-normal">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">CMS Login</Link>
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">AUERC</a>
                <Link to="/online-payment" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">Online Payment</Link>
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">Examination</a>
                <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-10 py-3 border-b border-gray-100 hover:text-[#28a745]">Results</a>
              </div>
            )}
          </div>

          <a href="#" onClick={() => setMobileMenuOpen(false)} className="px-6 py-4 hover:bg-gray-50 hover:text-[#28a745]">CONTACT US</a>
        </nav>
      )}
    </header>
  );
};

export default PublicHeader;
