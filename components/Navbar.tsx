export default function Navbar() {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* LOGO */}
          <div className="relative leading-none">
  <div className="text-4xl font-semibold tracking-tight">
    Clearpath
  </div>

  <div className="absolute left-[95px] top-[32px] text-[15px] font-bold text-blue-700 tracking-wide">
    Systems
  </div>
</div>
  
          {/* NAV LINKS */}
          <nav className="hidden gap-8 text-sm text-gray-600 md:flex">
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#pricing">Pricing</a>
          </nav>
  
          {/* CTA BUTTON */}
          <a href="#pricing" className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-500">
            Get started
          </a>
  
        </div>
      </header>
    );
  }