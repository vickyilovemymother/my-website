import React, { useState, useEffect, useCallback } from "react";
import SpotlightNavbar from "@/components/ui/spotlight-navbar";
import VirtualTryOnScrollSection from "@/components/VirtualTryOnScrollSection";
import SystemArchitectureMap from "@/components/SystemArchitectureMap";
import CoolSlideGallery, { CoolSlideGallerySlide } from "@/components/lightswind/cool-slide-gallery";
import AntigravityBackground from "@/components/lightswind-pro/antigravity-background";
import MeteorImpactBorder from "@/components/lightswind-pro/meteor-impact-border";
import MeshComparisonSlider from "@/components/MeshComparisonSlider";

import {
  Compass,
  ArrowLeft,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Box,
  ExternalLink,
} from "lucide-react";

// --- Curated Visual Archive Spotlight Slides (Portraits & Landscapes without text/black background) ---
const archiveSpotlightSlides: CoolSlideGallerySlide[] = [
  {
    src: "assets/images/portfolio/spotlight/Slide_5_1_Jacket_Combo.png",
    alt: "High-Fidelity Tailored Jacket Combo",
  },
  {
    src: "assets/images/portfolio/spotlight/Slide_5_1_Jacket_Combo_1.png",
    alt: "Structured Outerwear Study",
  },
  {
    src: "assets/images/portfolio/spotlight/Combo_2_FV2_Standing_01.png",
    alt: "Athleisure Silhouette Drape",
  },
  {
    src: "assets/images/portfolio/spotlight/Combo_4_0.png",
    alt: "Volumetric Cloth Simulation",
  },
  {
    src: "assets/images/portfolio/spotlight/Combo_5_0.png",
    alt: "Precision Garment Tailoring",
  },
  {
    src: "assets/images/portfolio/spotlight/Combo_5_2_V1.png",
    alt: "Digital Fashion Ensemble Study",
  },
  {
    src: "assets/images/portfolio/spotlight/Combo_6_0.png",
    alt: "Multi-Angle Garment Drape",
  },
  {
    src: "assets/images/portfolio/spotlight/Slide_14_Combo_SP_03.png",
    alt: "Studio Lighting & Drape Composite",
  },
];

// --- Complete Media Gallery Collection (Portraits & Landscapes with Automatic Preview) ---
export interface GalleryMedia {
  id: string;
  type: "image" | "video";
  src: string;
  category: "fashion" | "commercial" | "videos" | "automation";
  orientation: "portrait" | "landscape";
}

const fullGalleryMedia: GalleryMedia[] = [
  // Block 1
  { id: "df-1", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i001.png", category: "fashion", orientation: "portrait" },
  { id: "com-1", type: "image", src: "assets/images/portfolio/gallery/commercial/vgc_i001.png", category: "commercial", orientation: "landscape" },
  { id: "vid-1", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v001.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-1", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i001.png", category: "automation", orientation: "portrait" },

  // Block 2
  { id: "vid-2", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v002.mp4", category: "videos", orientation: "portrait" },
  { id: "df-2", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i002.png", category: "fashion", orientation: "portrait" },
  { id: "com-v1", type: "video", src: "assets/images/portfolio/gallery/commercial/vgc_v001.mp4", category: "commercial", orientation: "landscape" },
  { id: "ai-2", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i002.png", category: "automation", orientation: "portrait" },

  // Block 3
  { id: "vid-3", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v003.mp4", category: "videos", orientation: "portrait" },
  { id: "df-3", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i003.png", category: "fashion", orientation: "portrait" },
  { id: "com-2", type: "image", src: "assets/images/portfolio/gallery/commercial/vgc_i002.png", category: "commercial", orientation: "landscape" },
  { id: "ai-3", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i003.png", category: "automation", orientation: "portrait" },

  // Block 4
  { id: "vid-4", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v004.mp4", category: "videos", orientation: "portrait" },
  { id: "df-4", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i004.png", category: "fashion", orientation: "portrait" },
  { id: "com-3", type: "image", src: "assets/images/portfolio/gallery/commercial/vgc_i003.png", category: "commercial", orientation: "landscape" },
  { id: "ai-4", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i004.png", category: "automation", orientation: "portrait" },

  // Block 5
  { id: "vid-5", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v005.mp4", category: "videos", orientation: "portrait" },
  { id: "df-5", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i005.png", category: "fashion", orientation: "portrait" },
  { id: "com-4", type: "image", src: "assets/images/portfolio/gallery/commercial/vgc_i004.png", category: "commercial", orientation: "landscape" },
  { id: "ai-5", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i005.png", category: "automation", orientation: "portrait" },

  // Block 6
  { id: "vid-6", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v006.mp4", category: "videos", orientation: "portrait" },
  { id: "df-6", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i006.png", category: "fashion", orientation: "portrait" },
  { id: "com-5", type: "image", src: "assets/images/portfolio/gallery/commercial/vgc_i005.png", category: "commercial", orientation: "landscape" },
  { id: "ai-6", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i006.png", category: "automation", orientation: "portrait" },

  // Block 7
  { id: "vid-7", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v007.mp4", category: "videos", orientation: "portrait" },
  { id: "df-7", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i007.png", category: "fashion", orientation: "portrait" },
  { id: "com-6", type: "image", src: "assets/images/portfolio/gallery/commercial/vgc_i006.png", category: "commercial", orientation: "landscape" },
  { id: "ai-7", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i007.png", category: "automation", orientation: "portrait" },

  // Block 8
  { id: "vid-8", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v008.mp4", category: "videos", orientation: "portrait" },
  { id: "df-8", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i008.png", category: "fashion", orientation: "portrait" },
  { id: "com-7", type: "image", src: "assets/images/portfolio/gallery/commercial/vgc_i007.png", category: "commercial", orientation: "landscape" },
  { id: "ai-8", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i008.png", category: "automation", orientation: "portrait" },

  // Block 9
  { id: "vid-9", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v009.mp4", category: "videos", orientation: "portrait" },
  { id: "df-9", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i009.png", category: "fashion", orientation: "portrait" },
  { id: "vid-10", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v010.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-9", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i009.png", category: "automation", orientation: "portrait" },

  // Block 10
  { id: "vid-11", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v011.mp4", category: "videos", orientation: "portrait" },
  { id: "df-10", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i010.png", category: "fashion", orientation: "portrait" },
  { id: "vid-12", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v012.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-10", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i010.png", category: "automation", orientation: "portrait" },

  // Block 11
  { id: "vid-13", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v013.mp4", category: "videos", orientation: "portrait" },
  { id: "df-11", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i011.png", category: "fashion", orientation: "portrait" },
  { id: "vid-14", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v014.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-11", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i011.png", category: "automation", orientation: "portrait" },

  // Block 12
  { id: "vid-15", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v015.mp4", category: "videos", orientation: "portrait" },
  { id: "df-12", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i012.png", category: "fashion", orientation: "portrait" },
  { id: "vid-16", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v016.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-12", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i012.png", category: "automation", orientation: "portrait" },

  // Block 13
  { id: "vid-17", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v017.mp4", category: "videos", orientation: "portrait" },
  { id: "df-13", type: "image", src: "assets/images/portfolio/gallery/digital_fashion/vgdf_i013.png", category: "fashion", orientation: "portrait" },
  { id: "vid-18", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v018.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-13", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i013.png", category: "automation", orientation: "portrait" },

  // Block 14
  { id: "vid-19", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v019.mp4", category: "videos", orientation: "portrait" },
  { id: "vid-20", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v020.mp4", category: "videos", orientation: "portrait" },
  { id: "vid-21", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v021.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-14", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i014.png", category: "automation", orientation: "portrait" },

  // Block 15
  { id: "vid-22", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v022.mp4", category: "videos", orientation: "portrait" },
  { id: "vid-23", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v023.mp4", category: "videos", orientation: "portrait" },
  { id: "vid-24", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v024.mp4", category: "videos", orientation: "portrait" },
  { id: "ai-15", type: "image", src: "assets/images/portfolio/gallery/ai_automation/aia_i015.png", category: "automation", orientation: "portrait" },

  // Block 16 (remaining videos)
  { id: "vid-25", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v025.mp4", category: "videos", orientation: "portrait" },
  { id: "vid-26", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v026.mp4", category: "videos", orientation: "portrait" },
  { id: "vid-27", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v027.mp4", category: "videos", orientation: "portrait" },
  { id: "vid-28", type: "video", src: "assets/images/portfolio/gallery/digital_fashion_videos/vgdfv_v028.mp4", category: "videos", orientation: "portrait" },
];

export function PortfolioApp() {
  const [activeTab, setActiveTab] = useState<"all" | "fashion" | "commercial" | "videos" | "automation">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const navLinks = [
    { label: "Scrollytelling", href: "#scrollytelling" },
    { label: "Ecosystem", href: "#ecosystem", badge: "9 Nodes" },
    { label: "Curated Spotlight", href: "#spotlight" },
    { label: "Pipeline Execution", href: "#pipeline" },
    { label: "Media Archive", href: "#media-archive" },
  ];

  const filteredMedia = activeTab === "all"
    ? fullGalleryMedia
    : fullGalleryMedia.filter((item) => item.category === activeTab);

  const currentLightboxMedia = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  const handleNextLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredMedia.length);
    }
  }, [lightboxIndex, filteredMedia.length]);

  const handlePrevLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredMedia.length) % filteredMedia.length);
    }
  }, [lightboxIndex, filteredMedia.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") handleNextLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
      if (e.key === "Escape") setLightboxIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handleNextLightbox, handlePrevLightbox]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      
      {/* ── Spotlight Navigation Bar ────────────────────────────────────────── */}
      <SpotlightNavbar
        items={navLinks}
        currentPage="portfolio"
      />

      {/* ── Antigravity Floating Particles Background ─────────────────────── */}
      <AntigravityBackground
        particleCount={35}
        particleColor="rgba(160, 165, 175, 0.45)"
        lineColor="rgba(225, 230, 238, 0.3)"
        speed={0.35}
      />

      {/* ── PAGE HEADER / HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Visual Archive &amp; System Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Portfolio &amp; Systems.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            High-fidelity 3D garment physics, real-time WebGL configurators, automated photoshoot pipelines, and verified production architectures.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="index.html"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-neutral-900 border border-neutral-200 text-xs font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to The Architect
            </a>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export Portfolio PDF
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: SCROLLYTELLING – ARCHITECTURE ────────────────────────── */}
      <section id="scrollytelling" className="relative border-t border-neutral-200/80">
        <VirtualTryOnScrollSection />
      </section>

      {/* ── SECTION 2: ECOSYSTEM (SYSTEM ARCHITECTURE MAP) ──────────────────── */}
      <section id="ecosystem" className="py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-neutral-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full">
            02 / Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            System Architecture Map
          </h2>
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
            Hover over any domain node on the left to inspect the live operational blueprint, verified toolchains, and delivery frameworks on the right.
          </p>
        </div>

        <SystemArchitectureMap />
      </section>

      {/* ── SECTION 3: CURATED SPOTLIGHT (NO TEXT, NO BLACK BACKGROUND) ─────── */}
      <section id="spotlight" className="py-24 px-4 md:px-8 bg-neutral-50/70 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-full">
              03 / Curated Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Curated Visual Spotlight
            </h2>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
              Precision 3D garment tailoring, studio lighting, and cloth tension simulations rendered with complete aspect ratio preservation.
            </p>
          </div>

          <CoolSlideGallery
            slides={archiveSpotlightSlides}
            cardWidth={380}
            cardHeight={480}
            autoplay={true}
            autoplayDelay={4}
            showTitle={false}
          />
        </div>
      </section>

      {/* ── SECTION 4: PIPELINE EXECUTION (TOPOLOGY TO PHOTOREALISM) ───────── */}
      <section id="pipeline" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full">
            04 / Pipeline Execution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Topology to Photorealism.
          </h2>
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
            From dense quad simulation wireframes in CLO3D to real-time Draco-compressed WebGL models and calibrated PBR shader composites.
          </p>
        </div>

        {/* Mesh Comparison Slider (Aligned on initial load & interactive) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600">
              Interactive Mesh QC Inspection
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">
              Wireframe Topology vs. 4K PBR Composite
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Drag the interactive divider to inspect uniform edge flow, zero non-manifold edges, and procedural micro-surface normal displacement.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-xs font-bold text-neutral-900">01. Uniform Quad Decimation</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Decimated from 2M simulation vertices down to 50k runtime budget without losing fold silhouettes.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="text-xs font-bold text-neutral-900">02. Procedural Seam &amp; Normal Baking</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Weft, warp, and stitch displacement baked into compressed GPU texture channels for 60fps rendering.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <MeshComparisonSlider />
          </div>
        </div>

        {/* Configurator Spotlight Banner wrapped in MeteorImpactBorder */}
        <MeteorImpactBorder
          duration={8}
          borderRadius="1.5rem"
          meteorColor="rgba(37, 99, 235, 0.7)"
          className="w-full shadow-sm"
        >
          <div className="p-6 md:p-8 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                Interactive Web3D Customizer Engine
              </div>
              <h4 className="text-lg md:text-xl font-bold text-neutral-900">
                VP 3D Garment Configurator Engine
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Modular real-time WebGL engine engineered with Three.js, Draco mesh compression, dynamic male/female mannequin toggling, and instant material switching.
              </p>
            </div>

            <a
              href="https://fashion-configurator.vickylive.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-sm"
            >
              <Box className="w-4 h-4" />
              <span>Launch 3D Configurator</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </MeteorImpactBorder>
      </section>

      {/* ── SECTION 5: MEDIA ARCHIVE (FULL PRODUCTION GALLERY) ──────────────── */}
      <section id="media-archive" className="py-24 px-4 md:px-8 bg-neutral-50/70 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-full">
                05 / Media Archive
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                Full Production Gallery
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Authentic visual archive adapting dynamically to portraits and landscapes without black backgrounds.
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Works" },
                { id: "fashion", label: "Digital Fashion" },
                { id: "commercial", label: "Commercial" },
                { id: "videos", label: "Motion Videos" },
                { id: "automation", label: "AI & Automation" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                    activeTab === tab.id
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry Layout: Dynamic frames based on portraits & landscapes, NO text below, NO black backgrounds */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
            {filteredMedia.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="break-inside-avoid mb-6 group relative rounded-2xl overflow-hidden bg-white/70 border border-neutral-200/90 hover:border-neutral-400 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                {/* Media frame adapts naturally to image/video dimensions; underlying clean background is visible */}
                <div className="relative w-full p-2 flex items-center justify-center">
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-auto block rounded-xl object-contain group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt="Portfolio Visual"
                      loading="lazy"
                      className="w-full h-auto block rounded-xl object-contain drop-shadow-xs group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX MODAL (PREV / NEXT / LIGHT BACKGROUND / TRANSPARENCY SUPPORT) */}
      {currentLightboxMedia && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevLightbox();
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-lg transition-all hover:scale-110"
            title="Previous (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextLightbox();
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/90 hover:bg-white text-neutral-900 shadow-lg transition-all hover:scale-110"
            title="Next (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container with soft light background (avoid black backgrounds) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-neutral-200/90"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Presentation Area: Clean, soft neutral light backdrop allowing transparent PNGs to look crisp */}
            <div className="relative flex-1 flex items-center justify-center bg-neutral-50/70 min-h-[50vh] max-h-[78vh] p-4 md:p-8 overflow-hidden">
              {currentLightboxMedia.type === "video" ? (
                <video
                  key={currentLightboxMedia.src}
                  src={currentLightboxMedia.src}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-sm"
                />
              ) : (
                <img
                  key={currentLightboxMedia.src}
                  src={currentLightboxMedia.src}
                  alt="Full resolution view"
                  className="max-h-[72vh] max-w-full object-contain rounded-xl drop-shadow-md"
                />
              )}
            </div>

            {/* Clean Modal Bottom Bar */}
            <div className="px-6 py-3.5 bg-white border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500">
                {lightboxIndex! + 1} of {filteredMedia.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLightbox}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={handleNextLightbox}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="py-20 px-4 md:px-8 border-t border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <img
            src="assets/images/global/LogoVickyLive_01.png"
            alt="Logo"
            className="w-8 h-8 object-contain mb-3"
          />
          <h3 className="text-lg font-bold text-neutral-900">
            Vigneshwaran Pugazhenthi
          </h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-md">
            Principal R&amp;D Technologist &bull; Avataar.ai &bull; Integrity People Trust
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <a href="index.html" className="text-neutral-700 hover:text-neutral-900">
              The Architect (Main Page)
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#scrollytelling" className="text-neutral-700 hover:text-neutral-900">
              Scrollytelling
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#ecosystem" className="text-neutral-700 hover:text-neutral-900">
              Ecosystem
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#spotlight" className="text-neutral-700 hover:text-neutral-900">
              Curated Spotlight
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#pipeline" className="text-neutral-700 hover:text-neutral-900">
              Pipeline Execution
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#media-archive" className="text-neutral-700 hover:text-neutral-900">
              Media Archive
            </a>
          </div>

          <div className="mt-10 pt-6 border-t border-neutral-100 w-full text-center text-xs text-neutral-400 font-mono">
            &copy; {new Date().getFullYear()} Vigneshwaran Pugazhenthi. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default PortfolioApp;
