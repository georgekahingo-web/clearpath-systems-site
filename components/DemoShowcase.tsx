"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Category = "all" | "hvac" | "barber" | "medspa";

type Project = {
  id: string;
  category: Exclude<Category, "all">;
  image: string;
  outcomeLabel: string;
  alt: string;
};

const CALENDLY = "https://calendly.com/george-clearpath/30min";

const PROJECTS: Project[] = [
  {
    id: "hvac-featured",
    category: "hvac",
    image: "/images/hvac-demo.png",
    outcomeLabel: "HVAC → More service calls",
    alt: "HVAC website demo",
  },
  {
    id: "barber",
    category: "barber",
    image: "/images/barber-demo.png",
    outcomeLabel: "Barber Shop → More bookings",
    alt: "Barber shop website preview",
  },
  {
    id: "medspa",
    category: "medspa",
    image: "/medspa-demo.png",
    outcomeLabel: "Med Spa → Higher conversions",
    alt: "Med spa website preview",
  },
];

const FILTERS: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "hvac", label: "HVAC" },
  { id: "barber", label: "Barber" },
  { id: "medspa", label: "Med Spa" },
];

function PortfolioCard({
  project,
  heightClass,
}: {
  project: Project;
  heightClass: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-slate-200 shadow-xl ring-1 ring-slate-200/80 transition-shadow duration-300 hover:shadow-2xl ${heightClass}`}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 z-[1] bg-black/0 transition duration-300 group-hover:bg-black/40"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center gap-3 px-4 opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:opacity-100">
          <a
            href={project.image}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-105 hover:bg-slate-50"
          >
            View Demo
          </a>
          <a
            href={CALENDLY}
            className="rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-blue-500"
          >
            Get This Style
          </a>
        </div>
        <div className="absolute bottom-4 left-4 z-[3] max-w-[calc(100%-2rem)]">
          <p className="rounded-md bg-white/90 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
            {project.outcomeLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DemoShowcase() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");

  const filtered = useMemo(() => {
    if (activeFilter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

  const showFeaturedLayout = activeFilter === "all" && filtered.length === PROJECTS.length;

  return (
    <section
      id="portfolio"
      className="scroll-mt-24 border-y border-slate-200/60 bg-slate-50 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl md:leading-tight">
          See what your website could look like.
        </h2>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
          Real websites designed to convert visitors into paying clients.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeFilter === f.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200/80 hover:bg-slate-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {showFeaturedLayout ? (
            <div className="grid gap-6 md:grid-cols-3 md:items-start">
              <div className="relative min-h-[280px] md:col-span-2 md:min-h-0 md:h-[400px]">
                <PortfolioCard
                  project={PROJECTS[0]}
                  heightClass="h-full min-h-[280px] md:min-h-[400px]"
                />
              </div>
              <div className="flex flex-col gap-6">
                <div className="relative h-[190px]">
                  <PortfolioCard
                    project={PROJECTS[1]}
                    heightClass="h-full min-h-[190px]"
                  />
                </div>
                <div className="relative h-[190px]">
                  <PortfolioCard
                    project={PROJECTS[2]}
                    heightClass="h-full min-h-[190px]"
                  />
                </div>
              </div>
            </div>
          ) : filtered.length === 1 ? (
            <div className="mx-auto max-w-4xl">
              <div className="relative h-[min(400px,70vw)] min-h-[260px] md:h-[400px]">
                <PortfolioCard
                  project={filtered[0]}
                  heightClass="h-full min-h-[260px]"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((project) => (
                <div key={project.id} className="relative h-[300px] md:h-[360px]">
                  <PortfolioCard
                    project={project}
                    heightClass="h-full min-h-[300px]"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
