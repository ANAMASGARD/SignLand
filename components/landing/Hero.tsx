'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { HeroScene } from './HeroScene';
import { GlassButton } from '../ui/GlassButton';

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const robotContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state - robot starts from center
      gsap.set(robotContainerRef.current, {
        x: '30vw',
        scale: 0.9,
        opacity: 0,
      });

      gsap.set([textRef.current, navRef.current], {
        opacity: 0,
        y: 20,
      });

      if (ctaRef.current) {
        gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      }

      // Animation sequence
      tl
        // Robot fades in
        .to(robotContainerRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
        })
        // Robot bounces
        .to(robotContainerRef.current, {
          y: -25,
          duration: 0.25,
          ease: 'power2.out',
        })
        .to(robotContainerRef.current, {
          y: 0,
          duration: 0.35,
          ease: 'bounce.out',
        })
        // Robot slides to left
        .to(robotContainerRef.current, {
          x: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        }, '-=0.1')
        // Text and nav fade in
        .to([textRef.current, navRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
        }, '-=0.4')
        // CTA button
        .to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
        }, '-=0.2');

      // Continuous gentle floating
      gsap.to(robotContainerRef.current, {
        y: '+=10',
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E8E4F3 0%, #D4C5F9 50%, #C5B8E8 100%)',
      }}
    >
      {/* Navigation */}
      <nav
        ref={navRef}
        className="absolute top-0 left-0 right-0 z-20 px-8 md:px-12 py-6"
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🗣️</span>
            <span
              className="text-xl font-semibold text-gray-800"
              style={{ fontFamily: 'var(--font-sf)' }}
            >
              SignLand
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#how" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" style={{ fontFamily: 'var(--font-sf)' }}>
              How it works
            </Link>
            <Link href="#demo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors" style={{ fontFamily: 'var(--font-sf)' }}>
              Demo
            </Link>
            <Link
              href="/sign-in"
              className="px-5 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-all"
              style={{ fontFamily: 'var(--font-sf)' }}
            >
              Sign in
            </Link>
            <GlassButton href="/sign-up" size="sm">
              Get Started
            </GlassButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full h-full flex flex-col lg:flex-row items-center px-8 lg:px-16">

          {/* Left: 3D Robot - Same as before */}
          <div
            ref={robotContainerRef}
            className="w-full lg:w-[55%] h-[45vh] lg:h-[70vh] relative flex items-center justify-center"
            style={{ marginTop: '2rem' }}
          >
            <div className="w-full h-full max-w-[700px] max-h-[700px]">
              <HeroScene />
            </div>
          </div>

          {/* Right: Glass UI Text Content - Matching reference screenshot */}
          <div
            ref={textRef}
            className="w-full lg:w-[45%] flex flex-col justify-center lg:pl-8"
          >
            {/* Main heading - White text with glass effect like reference */}
            <h1
              className="leading-[1.0] tracking-tight mb-8"
              style={{
                fontFamily: 'var(--font-sf)',
                fontSize: 'clamp(40px, 5vw, 72px)',
                fontWeight: '300',
                color: 'rgba(255, 255, 255, 0.9)',
                textShadow: '0 4px 30px rgba(0,0,0,0.1)',
                letterSpacing: '-0.02em',
              }}
            >
              Real-Time<br />
              Sign Language
            </h1>

            {/* Feature pills with glass morphism - exactly like reference */}
            <div className="flex flex-col gap-4 mb-10">
              {[
                { label: 'High Quality Recognition' },
                { label: 'Proprietary Technology' },
                { label: 'AI-Powered System' },
                { label: 'Advanced Software' },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3"
                >
                  {/* Glass circle icon */}
                  <span
                    className="w-7 h-7 flex items-center justify-center rounded-full text-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    ✧
                  </span>
                  <span
                    className="text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: 'var(--font-sf)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '0 1px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Glass CTA Button - Interactive with Aceternity-style effects */}
            <div ref={ctaRef} style={{ opacity: 0 }}>
              <GlassButton href="/translate" size="lg">
                Start Experience
              </GlassButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
