import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdNotificationsActive, MdPerson } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

const VisionMission = () => {
  const [vvmsMenuOpen, setVvmsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
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
      <header className="bg-white text-[#0f2a4a] py-4 px-6 shadow-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="Vidhya Vikas Logo" className="h-12 w-12 object-contain rounded-full" />
          <div className="flex flex-col uppercase">
            <span className="font-bold text-3xl leading-none">Vidhya Vikas</span>
            <span className="font-semibold text-xs leading-tight tracking-wide">Matric Hr. Sec School</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 font-bold text-sm tracking-wide">
          <Link to="/" className="hover:text-[#28a745] transition-colors pb-1">HOME</Link>
          <div className="relative">
            <button 
              onClick={() => setVvmsMenuOpen(!vvmsMenuOpen)}
              className={`hover:text-[#28a745] transition-colors pb-1 flex items-center ${vvmsMenuOpen ? 'text-[#28a745] border-b-2 border-[#28a745]' : ''}`}
            >
              VVMS
            </button>
            {vvmsMenuOpen && (
              <div className="absolute top-full left-0 mt-5 w-64 bg-gray-100 shadow-xl flex flex-col py-2 z-50 text-sm">
                <Link to="/about-us" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">About Us</Link>
                <Link to="/vision-mission" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Vision, Mission & Quality Policy</Link>
                <Link to="/administration" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Administration</Link>
                <Link to="/facilities" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Facilities</Link>
                <a href="#" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Admission</a>
                <a href="#" className="px-6 py-3 text-slate-700 hover:bg-gray-200 transition-colors font-normal border-l-4 border-transparent hover:border-[#28a745]">Organogram</a>
              </div>
            )}
          </div>
          <Link to="/academics" className="hover:text-[#28a745] transition-colors pb-1">ACADEMICS</Link>
          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">LIFE @ VVMS</a>
          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">VVMS-TBI</a>
          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">PLACEMENTS</a>
          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">STUDENTS' SPACE</a>
          <a href="#" className="hover:text-[#28a745] transition-colors pb-1">CONTACT US</a>
        </nav>
      </header>

      {/* Hero Image Section */}
      <div className="relative h-[250px] bg-slate-900 flex flex-col justify-end p-10" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative z-10 text-white font-bold text-4xl md:text-5xl">Vision & Mission</h1>
      </div>

      {/* Breadcrumb */}
      <div className="px-10 py-4 text-sm bg-white shadow-sm border-b border-slate-100">
        <span className="text-slate-500">Home</span> <span className="mx-2 text-slate-400">&gt;</span> <span className="text-[#28a745] font-semibold">Vision & Mission</span>
      </div>

      {/* Main Content Area */}
      <div className="py-16 max-w-6xl mx-auto flex flex-col gap-12 px-6">
        
        {/* Vision Section */}
        <div className="flex flex-col md:flex-row bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <span className="inline-block bg-[#ff9800] text-white font-bold px-6 py-2 rounded-lg w-max mb-6">Vision</span>
            <p className="text-slate-600 leading-relaxed text-justify md:text-lg">
              Our vision is to nurture every child into a confident, compassionate, and empowered individual who makes meaningful contributions to society. We strive to create an environment where students are equipped with the knowledge, values, and skills necessary to excel academically, socially, and personally, fostering a lifelong love for learning and a sense of purpose in their lives.
            </p>
          </div>
          <div className="flex-1 min-h-[300px]" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></div>
        </div>

        {/* Mission Section */}
        <div className="flex flex-col md:flex-row-reverse bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <span className="inline-block bg-[#3498db] text-white font-bold px-6 py-2 rounded-lg w-max mb-6">Mission</span>
            <p className="text-slate-600 leading-relaxed text-justify md:text-lg">
              Our mission at Vidhya Vikas School is to provide a nurturing and dynamic educational environment where every child can realize their full potential. We are dedicated to fostering intellectual curiosity, emotional resilience, and ethical values through a balanced and child-centric curriculum. By integrating innovative teaching methods with a focus on holistic development, we aim to empower students to thrive academically, socially, and personally, creating confident individuals who positively contribute to society and the world.
            </p>
          </div>
          <div className="flex-1 min-h-[300px]" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></div>
        </div>

        {/* Aim Section */}
        <div className="flex flex-col md:flex-row bg-slate-50/50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <span className="inline-block bg-[#2ecc71] text-white font-bold px-6 py-2 rounded-lg w-max mb-6">Aim</span>
            <p className="text-slate-600 leading-relaxed text-justify md:text-lg">
              At Vidhya Vikas School, our aim is to lay a strong foundation for every child's personality and overall development. Recognizing that over 80% of brain development occurs before the age of 8, we dedicate ourselves to creating a nurturing and stimulating environment that fosters holistic growth during these critical years. We are committed to shaping resilient, well-rounded individuals who are prepared to benefit themselves, society, and the nation through their achievements and values.
            </p>
          </div>
          <div className="flex-1 min-h-[300px]" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-[#1a2538] text-slate-300 pt-16 pb-8 px-10 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10 pb-10 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-6 text-white">
              <img src="/logo.jpeg" alt="Vidhya Vikas Logo" className="h-10 w-10 object-contain rounded-full bg-white p-0.5" />
              <div className="flex flex-col uppercase">
                <span className="font-bold text-xl leading-none">Vidhya Vikas</span>
                <span className="text-[10px] leading-tight">Matric Hr. Sec School</span>
              </div>
            </div>
            <p className="text-sm mb-4 text-slate-400">
              Narasipuram (P.O),<br/>
              Thondamuthur(via),<br/>
              Vellimalaipattinam,<br/>
              Coimbatore: 641109,Tamil Nadu.
            </p>
            <p className="text-sm text-white font-semibold mb-2">+91 9788944296</p>
            <p className="text-sm text-white mb-6">dhanush.v.ciet@gmail.com</p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 border-b border-[#28a745] inline-block pb-1">Main Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about-us" className="hover:text-white">About us</Link></li>
              <li><a href="#" className="hover:text-white">Statutory Bodies</a></li>
              <li><a href="#" className="hover:text-white">Non-Statutory Bodies</a></li>
              <li><a href="#" className="hover:text-white">Office of the CoE</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 border-b border-[#28a745] inline-block pb-1">Useful Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/vision-mission" className="hover:text-white">Vision & Mission</Link></li>
              <li><Link to="/administration" className="hover:text-white">Management</Link></li>
              <li><Link to="/facilities" className="hover:text-white">Facilities</Link></li>
              <li><a href="#" className="hover:text-white">Events</a></li>
              <li><a href="#" className="hover:text-white">Activities</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 border-b border-[#28a745] inline-block pb-1">Contact Details</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span>📞</span>
                <span>+91 9513969319 / +91 9513933913</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <a href="mailto:vidhyavikas18@gmail.com" className="hover:text-white transition-colors">vidhyavikas18@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>No. 5, Bettahalli Road, Veerasagara Village, Auttur Post, Yelahanka Hobli, Bangalore - 560064.</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>Copyright All Right Reserved 2024, Vidhya Vikas</p>
          <p>Privacy Policy | Terms & Conditions</p>
        </div>
      </footer>
      
      {/* Bottom Right Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-50 pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <div className="w-12 h-12 bg-[#0f2a4a] text-[#3498db] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-900 transition-colors border-2 border-[#3498db]">
            <MdPerson className="text-2xl" />
          </div>
          <div className="w-12 h-12 bg-transparent text-[#25D366] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
            <FaWhatsapp className="text-5xl" />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default VisionMission;
