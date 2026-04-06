import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DemoShowcase from "@/components/DemoShowcase";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Hero />
      <DemoShowcase />
      <Pricing />
      <Footer />
    </main>
  );
}
