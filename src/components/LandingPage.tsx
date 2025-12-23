"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// Animated floating node for background
function FloatingNode({
  size,
  left,
  top,
  delay,
  reverse = false,
}: {
  size: number;
  left: string;
  top: string;
  delay: number;
  reverse?: boolean;
}) {
  return (
    <div
      className={`absolute rounded-full bg-primary/10 backdrop-blur-sm ${reverse ? "animate-float-reverse" : "animate-float"}`}
      style={{
        width: size,
        height: size,
        left,
        top,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// Connection line between nodes
function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  delay,
}: {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  delay: number;
}) {
  return (
    <svg
      className="absolute w-full h-full pointer-events-none overflow-visible"
      style={{ left: 0, top: 0 }}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="5,5"
        className="text-primary/20"
        style={{
          animationDelay: `${delay}s`,
        }}
      />
    </svg>
  );
}

// Step card for How it Works section
function StepCard({
  icon,
  title,
  description,
  step,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
  delay: number;
}) {
  return (
    <div
      className={`reveal reveal-delay-${step} group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Step number */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
        {step}
      </div>

      {/* Icon */}
      <div className="w-16 h-16 mb-6 rounded-xl bg-primary/10 flex items-center justify-center text-3xl group-hover:animate-bounce-subtle">
        {icon}
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const howItWorksRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background nodes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingNode size={60} left="10%" top="20%" delay={0} />
          <FloatingNode size={40} left="80%" top="15%" delay={0.5} reverse />
          <FloatingNode size={80} left="70%" top="60%" delay={1} />
          <FloatingNode size={30} left="20%" top="70%" delay={1.5} reverse />
          <FloatingNode size={50} left="85%" top="80%" delay={2} />
          <FloatingNode size={45} left="5%" top="50%" delay={0.8} reverse />
          <FloatingNode size={35} left="50%" top="85%" delay={1.2} />
          <FloatingNode size={70} left="30%" top="10%" delay={0.3} reverse />

          {/* Connection lines */}
          <ConnectionLine x1="15%" y1="25%" x2="75%" y2="20%" delay={0} />
          <ConnectionLine x1="25%" y1="75%" x2="70%" y2="65%" delay={0.5} />
          <ConnectionLine x1="82%" y1="18%" x2="85%" y2="85%" delay={1} />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary animate-fade-up">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            AI-Powered Knowledge Management
          </div>

          {/* Main heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient">
              Your Second Brain,
            </span>
            <br />
            <span className="text-foreground">Supercharged by AI</span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Connect your thoughts. Discover hidden patterns.
            <br className="hidden sm:block" />
            Let AI reveal the connections you never knew existed.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/login"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              Start Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-medium rounded-xl hover:bg-muted/50 transition-all duration-300"
            >
              Learn More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-muted/30 to-background"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How it{" "}
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="reveal reveal-delay-1 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your scattered notes into an interconnected knowledge graph in three simple
              steps.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line between cards (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2" />

            <StepCard
              step={1}
              icon="📝"
              title="Add Notes"
              description="Write anything that comes to mind. Ideas, thoughts, learnings—capture them all without worrying about organization."
              delay={0}
            />

            <StepCard
              step={2}
              icon="🤖"
              title="AI Connects"
              description="Our AI analyzes your notes and automatically discovers meaningful connections between them."
              delay={0.1}
            />

            <StepCard
              step={3}
              icon="🕸️"
              title="Explore Graph"
              description="Visualize your knowledge as an interactive graph. Discover patterns and insights you never knew existed."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingNode size={100} left="5%" top="30%" delay={0} />
          <FloatingNode size={60} left="90%" top="50%" delay={1} reverse />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="reveal text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to build your{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Second Brain
            </span>
            ?
          </h2>

          <p className="reveal reveal-delay-1 text-lg text-muted-foreground mb-10">
            Start organizing your thoughts today. It's free to get started.
          </p>

          <Link
            href="/login"
            className="reveal reveal-delay-2 group relative inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-semibold text-lg rounded-xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
          >
            Get Started Free
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Second Brain Lite
            </span>
          </div>

          <p className="text-sm text-muted-foreground">Made with ❤️ for knowledge seekers</p>
        </div>
      </footer>
    </main>
  );
}
