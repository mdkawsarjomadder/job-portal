import React from 'react';

const AboutTitle = () => {
  return (
    <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Subtle Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto text-center space-y-5">
        
        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold backdrop-blur-sm">
          <span>✨</span> Empowering Careers Worldwide
        </div>

        {/* Main Title / Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Connecting Extraordinary Talent with <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
            World-Class Companies
          </span>
        </h1>

        {/* Subtitle Description */}
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          We are on a mission to simplify job searching and hiring. Whether you are aiming for your next career breakthrough or scaling your dream team, we make it seamless and efficient.
        </p>

        {/* Highlight Stats Bar */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto border-t border-slate-800/80 mt-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">10K+</h3>
            <p className="text-xs text-slate-400 mt-1">Active Jobs</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">5K+</h3>
            <p className="text-xs text-slate-400 mt-1">Companies</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">98%</h3>
            <p className="text-xs text-slate-400 mt-1">Success Rate</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutTitle;