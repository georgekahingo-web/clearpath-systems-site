export default function Hero() {
  return (
    <section className="px-6 py-32 md:py-40">
      <div className="mx-auto max-w-7xl">
        
        <p className="text-2xl fonmt-medium text-gray-1000 underline decoration-gray-400">
          A clear path from discovery to booking. 
        </p>

        <h1 className="mt-6 max-w-4xl text-6xl font-semibold leading-[1.05] tracking-tight md:text-[90px]">
          Websites without
          <br />
          compromise.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-600">
          We build websisites that get your services in front of the right people.
        </p>

        <div className="mt-8 flex gap-4">
          <a className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500">
            Get Started
          </a>

          <a className="rounded-md border border-gray-300 px-6 py-3 text-sm text-gray-800 hover:bg-gray-100">
            View Demo
          </a>
        </div>

      </div>
    </section>
  );
}