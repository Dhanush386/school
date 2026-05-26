import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdPerson } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

import PublicHeader from '../../components/layout/PublicHeader';

const AboutUs = () => {
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

        
      </div>

      {/* Main Header */}
      <PublicHeader />

      {/* Hero Image Section */}
      <div className="relative h-[300px] bg-slate-900 flex flex-col justify-end p-10" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="relative z-10 text-white font-bold text-4xl md:text-5xl">About Us</h1>
      </div>

      {/* Breadcrumb */}
      <div className="px-10 py-4 text-sm bg-white shadow-sm">
        <span className="text-slate-500">Home</span> <span className="mx-2 text-slate-400">&gt;</span> <span className="text-[#28a745] font-semibold">About Us</span>
      </div>

      {/* Main Content Area */}
      <div className="px-10 py-12 max-w-5xl mx-auto flex flex-col gap-10">
        
        <div className="bg-white p-10 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-3xl font-bold text-[#0f2a4a] mb-8 text-center uppercase">Vidhya Vikas School</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed text-justify text-lg">
            <p>
              Welcome to Vidhya Vikas School, where education meets excellence and every child's potential is nurtured with care and dedication. As a pioneering institution in early and primary education, we are committed to shaping young minds, fostering creativity, and empowering children to become confident, capable individuals. Our holistic approach to education ensures that every child's unique abilities are recognized and nurtured, preparing them for a bright and promising future.
            </p>
            
            <p>
              At Vidhya Vikas School, we understand that each child is unique, with distinct learning styles and developmental needs. Our carefully curated curriculum blends traditional values with modern teaching methodologies, creating a well-rounded educational experience that focuses on academic, social, emotional, and creative growth. From the foundational years through primary education, we emphasize personalized attention and interactive learning to ensure that every child receives the support they need to excel.
            </p>
            
            <p>
              Our team of experienced educators is dedicated to creating a nurturing and stimulating environment where children feel encouraged to explore, question, and learn. We believe in the power of experiential learning, which combines structured lessons with hands-on activities, fostering critical thinking, problem-solving skills, and a lifelong love for learning. Our state-of-the-art facilities, well-equipped classrooms, and vibrant play areas provide the perfect setting for children to discover and develop their talents while building meaningful connections with their peers.
            </p>
            
            <p>
              At Vidhya Vikas School, we value the vital role of parents in a child's educational journey. Through open communication and collaboration, we strive to build a strong partnership with families, ensuring that every child's growth and progress are supported both at school and at home. Join us at Vidhya Vikas School, and together, let's create a nurturing foundation where your child can dream, achieve, and thrive in a world of endless possibilities.
            </p>
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

export default AboutUs;
