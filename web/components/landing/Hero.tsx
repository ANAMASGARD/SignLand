'use client';

import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { HeroScene } from './HeroScene';

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const robotContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
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
              style={{ fontFamily: 'var(--font-manrope)' }}
            >
              SignLand
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              How it works
            </Link>
            <Link href="#demo" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Demo
            </Link>
            <Link
              href="/sign-in"
              className="px-5 py-2 rounded-full text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full h-full flex flex-col lg:flex-row items-center px-8 lg:px-16">

          {/* Left: 3D Robot - Properly sized container with padding for full visibility */}
          <div
            ref={robotContainerRef}
            className="w-full lg:w-[55%] h-[45vh] lg:h-[70vh] relative flex items-center justify-center"
            style={{ marginTop: '2rem' }}
          >
            <div className="w-full h-full max-w-[700px] max-h-[700px]">
              <HeroScene />
            </div>
          </div>

          {/* Right: Minimal Text Content */}
          <div
            ref={textRef}
            className="w-full lg:w-[45%] flex flex-col justify-center lg:pl-8"
          >
            <h1
              className="text-gray-900 leading-[1.1] tracking-tight mb-4"
              style={{
                fontFamily: 'var(--font-manrope)',
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: '300',
              }}
            >
              Real-Time<br />
              <span className="font-semibold">Sign Language</span>
            </h1>

            <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-sm">
              AI-powered gesture recognition
            </p>

            {/* CTA Button */}
            <Link href="/translate">
              <button
                ref={ctaRef}
                className="group px-8 py-3 rounded-full font-medium text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <span className="flex items-center gap-2">
                  Start
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
