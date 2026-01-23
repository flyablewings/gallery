import Navbar from "@/components/Navbar";
import PortfolioSection from "@/components/PortfolioSection";
import PortraitSection from "@/components/PortraitSection";
import AboutPortrait from "@/components/AboutPortrait";
import prisma from "@/lib/prisma";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getProjects() {
  return await prisma.project.findMany({
    include: {
      images: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="flex-grow">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative px-6 md:px-12 overflow-hidden pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center relative z-10 gap-12 lg:gap-16">
          {/* Hero Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter leading-tight mb-6 md:mb-8">
              CAPTURING <br />
              <span className="text-accent">EUROPE'S</span> <br />
              VISION.
            </h1>
          <p className="max-w-xl text-base sm:text-lg md:text-xl text-foreground/70 mb-8 md:mb-10 leading-relaxed">
            A premium portfolio hub showcasing high-impact visual storytelling, architectural
            excellence, and modern design aesthetics. Redesigned for speed, clarity, and impact.
          </p>
          <a
            href="#portfolio"
            className="flex items-center gap-2 group text-base md:text-lg font-medium border-b-2 border-accent pb-1 transition-all hover:gap-4"
          >
            Explore Portfolio <ArrowRight className="text-accent" />
          </a>
        </div>

        {/* Portrait Section */}
        <PortraitSection />
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-1/2 -right-10 md:-right-20 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Portfolio Gallery Section */}
      <PortfolioSection projects={projects} />

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 lg:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <AboutPortrait />
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Redefining the Visual Narrative.</h2>
            <div className="space-y-4 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto lg:mx-0">
              <p>
                Model Europa is more than just a portfolio—it's a hub for visual excellence.
                With over a decade of experience in capturing architectural marvels and
                designing iconic brand identities, we push the boundaries of what's possible.
              </p>
              <p>
                This redesign focuses on what matters most: the work. Every element of this
                site has been optimized for speed and accessibility, ensuring that your
                first impression of our portfolio is as striking as the work itself.
              </p>
            </div>
            <div className="mt-8 md:mt-12 grid grid-cols-2 gap-6 md:gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <span className="block text-3xl sm:text-4xl font-bold text-accent">{projects.length}+</span>
                <span className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Projects</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl sm:text-4xl font-bold text-accent">12</span>
                <span className="text-xs sm:text-sm uppercase tracking-widest text-foreground/50">Awards</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 md:py-20 px-6 md:px-12 border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 mb-8 md:mb-12">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold tracking-tighter mb-3 md:mb-4">
                MODEL<span className="text-accent">EUROPA</span>
              </h2>
              <p className="text-foreground/50 max-w-xs text-sm sm:text-base">
                Pushing the boundaries of visual storytelling across the continent.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 w-full lg:w-auto">
              <div>
                <h4 className="font-bold mb-3 md:mb-4 text-sm sm:text-base">Connect</h4>
                <ul className="space-y-2 text-foreground/60">
                  <li><a href="#" className="hover:text-accent transition-colors text-sm sm:text-base">Instagram</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors text-sm sm:text-base">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors text-sm sm:text-base">Twitter</a></li>
                </ul>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <h4 className="font-bold mb-3 md:mb-4 text-sm sm:text-base">Inquiries</h4>
                <div className="text-foreground/60 text-sm sm:text-base">
                  <p>hello@modeleuropa.com</p>
                  <p>+44 (0) 20 7946 0123</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-foreground/5 pt-6 md:pt-8 text-xs sm:text-sm text-foreground/40 text-center">
            © 2026 Model Europa. All rights reserved. Designed for excellence.
          </div>
        </div>
      </footer>
    </main>
  );
}
