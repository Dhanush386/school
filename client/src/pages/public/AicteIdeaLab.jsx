import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md';
import { FaGraduationCap, FaWhatsapp, FaFacebook, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';

import PublicHeader from '../../components/layout/PublicHeader';

const AicteIdeaLab = () => {
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

      <PublicHeader />

      {/* Hero Image Section */}
      <div className="relative h-[400px] bg-slate-900 flex flex-col justify-end p-10" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative z-10 text-white font-bold text-4xl md:text-5xl">AICTE IDEA LAB</h1>
      </div>

      {/* Breadcrumb */}
      <div className="px-10 py-4 text-sm">
        <span className="text-slate-500">Home</span> <span className="mx-2 text-slate-400">&gt;</span> <span className="text-[#28a745] font-semibold">AICTE IDEA LAB</span>
      </div>

      {/* Main Content Area */}
      <div className="px-10 py-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#0f2a4a] mb-6">ABOUT THE LAB</h2>
          
          <h3 className="text-lg text-[#28a745] mb-2">Overview</h3>
          <div className="h-0.5 w-full bg-[#28a745] mb-6"></div>
          
          <p className="text-slate-600 leading-relaxed mb-10 text-justify">
            The AICTE-IDEA (Idea Development, Evaluation, and Application) Laboratory at Vidhya Vikas serves as a vibrant innovation hub designed to cultivate creativity, critical thinking and hands-on technical expertise among students, stakeholders and faculty members. Established under the visionary initiative of the All India Council for Technical Education (AICTE), the IDEA Lab promotes experiential learning, interdisciplinary collaboration and real-world problem-solving through cutting-edge tools and infrastructure. It is a cornerstone for nurturing future-ready engineers and entrepreneurs.
          </p>

          {/* Accordion list */}
          <div className="space-y-3 mb-10">
            {['Vision', 'Mission', 'Objectives', 'Tender Notice', 'Contact Us'].map((item) => (
              <div key={item} className="bg-slate-100 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-200 transition-colors">
                <span className="font-semibold text-[#28a745]">{item}</span>
                <span className="text-[#28a745] text-xl">+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students in lab" className="w-full h-48 object-cover rounded shadow-md" />
          
          {/* Contact Info Box */}
          <div className="bg-[#1a2538] text-white p-6 rounded shadow-lg">
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <p className="text-[#28a745] font-semibold mb-2">Vidhya Vikas Matric Hr. Sec School</p>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Narasipuram (PO), Thondamuthur (Via),<br/>
              Vellimalaipattinam, Coimbatore- 641109.
            </p>
            
            <div className="space-y-1 text-sm text-slate-300 mb-6">
              <p>+91 9788944296</p>
              <p>+91 9790038605</p>
              <p>+91 7418034596</p>
            </div>

            <p className="text-[#28a745] text-sm mb-6">Mon - Fri 9:00A.M. - 4:00P.M.</p>
            
            <h3 className="font-bold mb-3">Social Info</h3>
            <div className="flex gap-4 text-[#28a745] text-lg">
              <a href="#" className="hover:text-white"><FaFacebook /></a>
              <a href="#" className="hover:text-white"><FaLinkedin /></a>
              <a href="#" className="hover:text-white"><FaYoutube /></a>
              <a href="#" className="hover:text-white"><FaInstagram /></a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-[#28a745] hover:bg-[#218838] text-white py-3 font-semibold rounded text-sm transition-colors">Apply ↗</button>
            <button className="flex-1 bg-[#28a745] hover:bg-[#218838] text-white py-3 font-semibold rounded text-sm transition-colors">Download Brochure 📄</button>
          </div>
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
              <li><a href="#" className="hover:text-white">About us</a></li>
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

export default AicteIdeaLab;
