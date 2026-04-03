export default function DemoShowcase() {
  return (
    <section className="px-6 pb-32">
      <div className="mx-auto max-w-7xl grid gap-6 md:grid-cols-3">
        
        <div className="overflow-hidden rounded-xl">
          <img src="/barber-demo.png" className="w-full object-cover" />
        </div>

        <div className="overflow-hidden rounded-xl">
          <img src="/medspa-demo.png" className="w-full object-cover" />
        </div>

      </div>
    </section>
  );
}