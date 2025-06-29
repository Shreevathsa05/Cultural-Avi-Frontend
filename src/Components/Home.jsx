import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // Load metadata to get duration before scroll animation
    const handleLoadedMetadata = () => {
      const duration = video.duration;

      // ScrollTrigger controlling video frames
      gsap.to(video, {
        currentTime: duration,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Fade in container and title
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      titleRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
    );

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const cards = [
    {
      title: 'Voice-to-Voice AI',
      desc: 'Engage in live voice conversations across Indian languages, powered by Gemini and Google TTS.',
      href: '/voice'
    },
    {
      title: 'Chat-to-Chat AI',
      desc: 'Seamless text chat powered by Gemini, infused with Indian cultural insights and context.',
      href: '/chat'
    }
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-black">
      {/* Video background controlled by scroll */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/background-video.mp4"
        muted
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        <h1
          ref={titleRef}
          className="text-5xl md:text-6xl font-bold text-white mb-12 text-center"
        >
          Celebrating Indian Culture with AI
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          {cards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 flex flex-col backdrop-blur-sm cursor-pointer transform transition-transform"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{item.title}</h2>
              <p className="flex-1 mb-6 text-gray-700">{item.desc}</p>
              <a
                href={item.href}
                className="mt-auto bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-full font-medium self-start"
              >
                {item.title.includes('Voice') ? 'Try Now' : 'Explore Chat'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
