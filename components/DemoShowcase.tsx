export default function DemoShowcase() {
  return (
    <section className="px-6 py-40">

    {/* HEADER */}
    <div className="mx-auto max-w-7xl mb-20">
  <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
    See what your website could look like.
  </h2>

  <p className="mt-4 text-lg text-gray-600 max-w-2xl">
    Clean, modern websites designed to make your business stand out and convert visitors into clients.
  </p>
</div>

    {/* GRID */}
    <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">

      {/* BIG IMAGE */}
      <div className="relative md:col-span-2 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition ">
        <img
          src="/barber-demo.png"
          className="w-full h-[400px] object-cover transition duration-700 ease-out hover:scale-105 hover:brightness-95"
        />
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-md text-sm font-semibold shadow-sm">
          Barber Shop Website
        </div>
      </div>

      {/* SIDE STACK */}
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-xl shadow-sm">
          <img
            src="/medspa-demo.png"
            className="w-full h-[190px] object-cover transition duration-700 ease-out hover:scale-105"
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-sm">
          <img
            src="/barber-demo.png"
            className="w-full h-[190px] object-cover transition duration-700 ease-out hover:scale-105"
          />
        </div>
      </div>

    </div>

  </section>
);
}
