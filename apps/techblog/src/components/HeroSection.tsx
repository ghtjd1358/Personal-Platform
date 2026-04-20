import React, { useRef, useEffect, useState } from 'react';

const ScrollIndicator: React.FC = () => (
  <div className="hero-scroll-indicator">
    <div className="scroll-mouse">
      <span className="scroll-wheel" />
    </div>
    <div className="scroll-arrow">
      <span />
    </div>
  </div>
);

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (isVisible && video) {
      video.load();
      video.play().catch(() => {});
    }
  }, [isVisible]);

  return (
    <section className="hero techblog-hero">
      <div className="hero-media">
        <video
          ref={videoRef}
          className="hero-media-content"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/cloude.webp"
          onLoadedData={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0.7, transition: 'opacity 0.5s ease' }}
        >
          {isVisible && <source src="/hero-video.mp4" type="video/mp4" />}
        </video>
        <div className="hero-overlay" />
      </div>

      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Job Tracker
          </h1>
          <p className="hero-desc">
            체계적인 취업 관리로 성공적인 커리어를 시작하세요.
          </p>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export { HeroSection };
