import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import PublicHeader from '../../components/layout/PublicHeader';

const Academics = () => {

  const academicLevels = [
    {
      title: 'Primary Education',
      subtitle: 'Classes LKG to VIII (Foundational, Primary & Middle School)',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Secondary & Higher Secondary',
      subtitle: 'Classes IX to XII (High School, Science & Commerce Streams)',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Sports & Co-Curricular',
      subtitle: 'Holistic Development & Physical Education',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Top Bar - Reused from Landing Page */}
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

      {/* Hero Image Section */}
      <div className="relative h-[250px] bg-slate-900 flex flex-col justify-end p-10" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative z-10 text-white font-bold text-4xl md:text-5xl">Academics</h1>
      </div>

      {/* Breadcrumb */}
      <div className="px-10 py-4 text-sm bg-white shadow-sm">
        <Link to="/" className="text-slate-500 hover:text-[#28a745]">Home</Link> <span className="mx-2 text-slate-400">&gt;</span> <span className="text-[#28a745] font-semibold">Academics</span>
      </div>

      {/* Main Content Area - Grid of Academic Levels */}
      <main className="flex-1 max-w-[1600px] mx-auto py-16 px-6 md:px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f2a4a] uppercase tracking-wide">
            Our Academic Programs
          </h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">
            Providing high-quality education and comprehensive development for every child from early years to senior level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {academicLevels.map((level, idx) => (
            <div 
              key={idx} 
              className="group relative h-[500px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-full"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${level.image}')` }}
              />
              
              {/* Dark Overlay (Ensures high text contrast) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 group-hover:via-black/75 group-hover:from-black/100 transition-colors duration-300" />
              
              {/* Text Container at bottom */}
              <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 pt-4 text-center">
                <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-snug drop-shadow-md group-hover:text-green-400 transition-colors duration-300 break-words tracking-tight">
                  {level.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-3 opacity-90 font-medium leading-relaxed">
                  {level.subtitle}
                </p>
                <div className="mt-6">
                  <span className="inline-block text-white text-xs font-bold uppercase tracking-wider bg-[#28a745] hover:bg-[#218838] px-5 py-2.5 rounded-full transition-colors">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2538] text-slate-300 pt-16 pb-8 px-10">
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
              Coimbatore: 641109, Tamil Nadu.
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

export default Academics;
