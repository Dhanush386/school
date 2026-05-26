import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

import PublicHeader from '../../components/layout/PublicHeader';

const Administration = () => {

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
      <PublicHeader />

      {/* Hero Image Section */}
      <div className="relative h-[250px] bg-slate-900 flex flex-col justify-end p-10" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative z-10 text-white font-bold text-4xl md:text-5xl">Administration</h1>
      </div>

      {/* Breadcrumb */}
      <div className="px-10 py-4 text-sm bg-white shadow-sm border-b border-slate-100">
        <Link to="/" className="text-slate-500 hover:text-[#28a745]">Home</Link> <span className="mx-2 text-slate-400">&gt;</span> <span className="text-[#28a745] font-semibold">Administration</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto py-16 px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Management Team Image */}
          <div className="flex-1 w-full max-w-xl">
            <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Management & Joyful Learning" 
              className="rounded-3xl shadow-xl w-full object-cover h-[400px] border border-slate-200"
            />
          </div>

          {/* Management Team Text */}
          <div className="flex-1 text-slate-700">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f2a4a] mb-8 leading-tight tracking-tight">
              Management team
            </h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-justify">
              <p>
                The management team at Vidhya Vikas School represents the cornerstone of our success, driven by a shared passion for nurturing young minds and fostering holistic development. With a commitment to excellence in education, they bring together years of experience and expertise to ensure that every child receives a world-class learning experience. Their vision is to create an environment where children feel valued, inspired, and empowered to explore their full potential.
              </p>
              <p>
                Under their dedicated leadership, Vidhya Vikas School has become a trusted name in education, known for its emphasis on academic excellence, personal growth, and ethical values. The management continuously works to innovate and implement the best educational practices, ensuring that every child's learning journey is engaging, enriching, and fulfilling.
              </p>
            </div>
          </div>
        </div>

        {/* Secondary Text Paragraphs */}
        <div className="mt-12 space-y-6 text-slate-700 text-base md:text-lg leading-relaxed text-justify max-w-6xl">
          <p>
            A key priority for the management is maintaining a safe, secure, and nurturing environment where children can thrive. They oversee every aspect of school operations, from teacher training and curriculum design to infrastructure and safety measures, ensuring that the school consistently meets the highest standards of quality and care.
          </p>
          <p>
            At Vidhya Vikas School, the management team believes in building strong partnerships with parents and the community, recognizing their vital role in a child's development. Their unwavering dedication to creating a supportive and inclusive educational environment has been instrumental in shaping confident, compassionate, and capable individuals who contribute meaningfully to society.
          </p>
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

export default Administration;
