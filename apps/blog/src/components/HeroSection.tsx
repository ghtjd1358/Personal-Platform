import React, { useRef, useEffect, useState } from 'react';
import { ScrollIndicator } from './ScrollIndicator';

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
    <section className="hero blog-hero">
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
            Hello World!
          </h1>
          <p className="hero-desc">
            프론트엔드 개발 경험과 학습 내용을 정리합니다.
          </p>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export { HeroSection };
