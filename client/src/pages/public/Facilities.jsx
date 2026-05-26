import React from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdPerson, MdClass, MdToys, MdVideocam, MdSchool } from 'react-icons/md';
import { FaWhatsapp, FaChild, FaPuzzlePiece, FaUserFriends, FaGamepad } from 'react-icons/fa';

import PublicHeader from '../../components/layout/PublicHeader';

const Facilities = () => {

  const features = [
    {
      title: 'Best Teachers',
      icon: <MdSchool className="text-5xl text-[#e67e22]" />,
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Classrooms',
      icon: <MdClass className="text-5xl text-[#2ecc71]" />,
      bgColor: 'bg-green-50',
    },
    {
      title: 'Kids Zone',
      icon: <FaChild className="text-5xl text-[#3498db]" />,
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Educational Toys',
      icon: <MdToys className="text-5xl text-[#9b59b6]" />,
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Indoor Play area',
      icon: <FaGamepad className="text-5xl text-[#e74c3c]" />,
      bgColor: 'bg-red-50',
    },
    {
      title: 'Lots of Activities',
      icon: <FaPuzzlePiece className="text-5xl text-[#1abc9c]" />,
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Excellent Teachers',
      icon: <FaUserFriends className="text-5xl text-[#f1c40f]" />,
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'CCTV Surveillance',
      icon: <MdVideocam className="text-5xl text-[#34495e]" />,
      bgColor: 'bg-slate-100',
    },
  ];

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
        <h1 className="relative z-10 text-white font-bold text-4xl md:text-5xl">Facilities</h1>
      </div>

      {/* Breadcrumb */}
      <div className="px-10 py-4 text-sm bg-white shadow-sm border-b border-slate-100">
        <Link to="/" className="text-slate-500 hover:text-[#28a745]">Home</Link> <span className="mx-2 text-slate-400">&gt;</span> <span className="text-[#28a745] font-semibold">Facilities</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto py-16 px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Facilities Image */}
          <div className="flex-1 w-full max-w-xl">
            <img 
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="State of the art Classroom" 
              className="rounded-3xl shadow-xl w-full object-cover h-[400px] border border-slate-200"
            />
          </div>

          {/* Facilities text */}
          <div className="flex-1 text-slate-700">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f2a4a] mb-8 leading-tight tracking-tight">
              Facilities
            </h2>
            <div className="space-y-6 text-base md:text-lg leading-relaxed text-justify">
              <p>
                The school building is thoughtfully designed with excellent ventilation, creating cheerful and well-lit classrooms. Each classroom serves as a dynamic learning space, equipped with modern amenities and essential teaching aids such as toys, puzzles, and books to inspire curiosity and foster logical and analytical thinking in children.
              </p>
              <p>
                We are dedicated to providing your child with the highest standard of care in an environment tailored to their needs. Our state-of-the-art facilities are thoughtfully organized into age-appropriate zones, ensuring children at similar developmental stages can learn, play, and grow together.
              </p>
              <p>
                With a variety of engaging activities planned throughout the year, your child will enjoy a stimulating and enriching experience that keeps them excited and eager to learn every day!
              </p>
            </div>
          </div>
        </div>

        {/* Feature Icons Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feat, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`p-4 rounded-full ${feat.bgColor} mb-4 flex items-center justify-center`}>
                  {feat.icon}
                </div>
                <span className="font-bold text-[#0f2a4a] text-center text-sm md:text-base">
                  {feat.title}
                </span>
              </div>
            ))}
          </div>
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

export default Facilities;
