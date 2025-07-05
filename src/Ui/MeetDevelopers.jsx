// MeetDevelopers.jsx
import React from 'react';

const developers = [
  {
    name: 'Shreevathsa Bhat',
    image: '/shree.jpg',
    github: 'https://github.com/Shreevathsa05',
    email: 'bhatshreevathsa17@gmail.com',
    linkedIn: 'https://www.linkedin.com/in/shreevathsa-bhat-228157235/',
  },
];

export default function MeetDevelopers() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="backdrop-blur-md rounded-xl p-8 border shadow-lg mt-10 mb-10 w-[90vw] max-w-6xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          borderColor: "rgba(255,255,255,0.3)"
        }}>
        
        <h2 className="text-3xl font-bold text-center text-black mb-10">Meet the Developers</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
          {developers.map((dev) => (
            <div key={dev.name} className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg backdrop-blur-sm border"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.2)"
              }}>
              
              <div className="relative">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white/20"
                />
              </div>
              
              <h3 className="text-xl font-semibold text-black">{dev.name}</h3>
              
              <div className="flex flex-col space-y-2 w-full">
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  <span>🔗</span>
                  <span>GitHub</span>
                </a>
                
                <dev 
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <span>{dev.email}</span>
                </dev>
                
                <a 
                  href={dev.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition-colors duration-200"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}