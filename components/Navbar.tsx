export default function Navbar() {
    return (
      <header className="border-b border-gray-200 px-6 py-4">
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
            <a href="#">Services</a>
            <a href="#">Portfolio</a>
            <a href="#">Pricing</a>
          </nav>
  
          {/* CTA BUTTON */}
          <a className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-500">
            Get started
          </a>
  
        </div>
      </header>
    );
  }