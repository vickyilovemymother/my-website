import React, { useState } from "react";
import FlipWords from "@/components/lightswind-pro/flip-words";
import SpotlightNavbar from "@/components/ui/spotlight-navbar";
import ChainCarousel from "@/components/lightswind/chain-carousel";
import MeteorImpactBorder from "@/components/lightswind-pro/meteor-impact-border";
import AntigravityBackground from "@/components/lightswind-pro/antigravity-background";

import {
  Sparkles,
  Layers,
  Box,
  Compass,
  ArrowRight,
  ExternalLink,
  Download,
  Film,
  Camera,
  Cpu,
  Workflow,
  CheckCircle,
  Shirt,
  Brain,
  Bot,
  Palette,
  Glasses,
  Scale,
  Users,
  Boxes,
  Copy,
  Check,
  MapPin,
  Send,
  X,
  Maximize2,
} from "lucide-react";

interface CaseStudy {
  id: string;
  category: "all" | "photoshoot" | "ar-vr" | "automation";
  client: string;
  tag: string;
  title: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  tech: string[];
  image: string;
  blueprintTitle: string;
  externalLink?: { label: string; href: string };
  archiveLink?: string;
}

const caseStudiesData: CaseStudy[] = [
  {
    id: "cs-1",
    category: "photoshoot",
    client: "Avataar.ai · Enterprise R&D",
    tag: "Production Pipeline",
    title: "Virtual Photoshoot Transformation Pipeline",
    summary:
      "Replacing legacy physical garment photoshoots with an automated 3D virtual render framework to deliver high-resolution commercial imagery across global fashion catalogs.",
    challenge:
      "Physical photoshoot logistics require substantial sample transportation, studio lighting calibration, model scheduling, and manual touch-ups with high turnaround latency.",
    approach:
      "Architected an automated multi-angle virtual stage in Blender Cycles driven by Python scripts. Simulation meshes from CLO3D are automatically textured, lighted with calibrated HDR profiles, and batch composited.",
    outcome:
      "Standardized virtual photoshoot deliverables, eliminated physical reshoots, and established scalable digital catalog feeds across partner platforms with 94% cost reduction.",
    tech: ["CLO3D", "Blender Cycles", "Python Automation", "HDR Lighting"],
    image: "assets/images/portfolio/system/project1.jpg",
    blueprintTitle: "Virtual Photoshoot Architecture Blueprint",
    archiveLink: "portfolio.html#spotlight",
  },
  {
    id: "cs-2",
    category: "ar-vr",
    client: "Real-Time Web3D · Ecosystem Implementation",
    tag: "Low-Poly Optimization",
    title: "Enterprise AR/VR Fashion Implementation",
    summary:
      "Deploying high-fidelity interactive 3D apparel experiences accessible directly within consumer web browsers and mobile AR runtimes.",
    challenge:
      "Raw garment simulation meshes typically exceed millions of polygons with dense topology, making direct deployment on mobile WebGL engines non-viable.",
    approach:
      "Formulated a retopology and Draco-compression pipeline in Blender and Python. Dense cloth geometry is decimated to lightweight meshes while preserving surface silhouette, backed by high-resolution normal maps.",
    outcome:
      "Reduced polygon density from 2M polygons down to highly optimized 50k runtime meshes, enabling instantaneous mobile 3D garment loading in under 1.2s.",
    tech: ["Blender", "Python Retopology", "Draco GLB", "WebGL / Three.js"],
    image: "assets/images/portfolio/system/project2.jpg",
    blueprintTitle: "Enterprise AR/VR Fashion Architecture",
    externalLink: {
      label: "Live Configurator",
      href: "https://fashion-configurator.vickylive.com/",
    },
  },
  {
    id: "cs-3",
    category: "ar-vr",
    client: "Social Platforms · Interactive Discovery",
    tag: "Body Tracking & Physics",
    title: "Social Media 3D Discovery & Virtual Try-On",
    summary:
      "Developing responsive, body-tracked virtual try-on filters and interactive 3D apparel experiences for social camera ecosystems.",
    challenge:
      "Camera-based virtual try-on requires low-latency mesh tracking responsive to body movements while respecting strict platform file-size caps.",
    approach:
      "Integrated CLO3D drape silhouettes into real-time tracking rigs. Implemented lightweight vertex deformation algorithms and optimized PBR shader graphs replicating silk, denim, and knitwear.",
    outcome:
      "Delivered fluid real-time camera experiences with realistic cloth movement, driving 2.4M+ user impressions across mobile channels.",
    tech: ["Spark AR", "Marvelous Designer", "Real-Time Shaders", "Physics Rigs"],
    image: "assets/images/portfolio/system/project3.jpg",
    blueprintTitle: "Social Media 3D Discovery Architecture",
    archiveLink: "portfolio.html#media-archive",
  },
  {
    id: "cs-4",
    category: "automation",
    client: "Robotic Process Automation · Python Tooling",
    tag: "Autonomous Microservices",
    title: "Autonomous AI & RPA Workflow Engineering",
    summary:
      "Building proprietary automation workers that ingest raw 3D assets, apply procedural textures, perform validation tests, and export synchronized deliverables.",
    challenge:
      "Repetitive manual asset setup, file conversions, UV coordinate validation, and metadata naming created significant operational bottlenecks.",
    approach:
      "Engineered headless Python background workers and Power Automate flow sequences. Workers monitor ingestion directories, trigger procedural texture baking, audit mesh norms, and generate multi-format bundles.",
    outcome:
      "Eliminated repetitive manual pipeline stages, reducing manual turnaround time by 85% and allowing production teams to focus on creative R&D.",
    tech: ["Python 3.x", "Power Automate", "PyAutoGUI", "CLI Tooling"],
    image: "assets/images/portfolio/system/project4.jpg",
    blueprintTitle: "Autonomous AI Workflow Architecture",
    archiveLink: "portfolio.html#ecosystem",
  },
];

export function App() {
  const [caseFilter, setCaseFilter] = useState<"all" | "photoshoot" | "ar-vr" | "automation">("all");
  const [blueprintModal, setBlueprintModal] = useState<{ title: string; image: string } | null>(null);
  
  // Contact Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formService, setFormService] = useState("3D Digital Fashion Pipeline");
  const [formMessage, setFormMessage] = useState("");
  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Email copy button state
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Map toggle state
  const [showMap, setShowMap] = useState(false);

  const navLinks = [
    { label: "Executive Overview", href: "#overview" },
    { label: "Core Competencies", href: "#competencies", badge: "8 Focus" },
    { label: "Case Studies", href: "#case-studies", badge: "4 Studies" },
    { label: "Leadership & Impact", href: "#leadership" },
    { label: "Collaboration & Advisory", href: "#collaboration" },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ilovemymother@vickylive.com").then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      setFormFeedback({
        type: "error",
        text: "Please provide your name, email, and message objectives before dispatching.",
      });
      return;
    }

    // Prepare dual-recipient mailto (Recipient + CC client)
    const primaryRecipient = "ilovemymother@vickylive.com";
    const subject = encodeURIComponent(`Consultation Inquiry: ${formService} — from ${formName}`);
    const body = encodeURIComponent(
      `Hello Vigneshwaran,\n\nName: ${formName}\nEmail: ${formEmail}\nInquiry Area: ${formService}\n\nProject Objectives / Message:\n${formMessage}\n\nRegards,\n${formName}`
    );

    const mailtoUrl = `mailto:${primaryRecipient}?cc=${encodeURIComponent(formEmail)}&subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    setFormFeedback({
      type: "success",
      text: "Consultation inquiry dispatched! A copy has been prepared for both ilovemymother@vickylive.com and your address (" + formEmail + ").",
    });
  };

  const filteredCaseStudies = caseFilter === "all"
    ? caseStudiesData
    : caseStudiesData.filter((item) => item.category === caseFilter);

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      
      {/* ── Spotlight Navigation Bar ────────────────────────────────────────── */}
      <SpotlightNavbar
        items={navLinks}
        currentPage="index"
      />

      {/* ── Antigravity Floating Particles Background ─────────────────────── */}
      <AntigravityBackground
        particleCount={40}
        particleColor="rgba(160, 165, 175, 0.45)"
        lineColor="rgba(225, 230, 238, 0.3)"
        speed={0.4}
      />

      {/* ── 01. EXECUTIVE OVERVIEW (HERO & BIO) ──────────────────────────────── */}
      <section id="overview" className="relative pt-32 pb-20 md:pt-40 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Executive Overview Copy */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              01 / Executive Overview &bull; Principal R&amp;D Technologist
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
              Bridging AI,{" "}
              <FlipWords
                words={[
                  "3D Digital Fashion",
                  "Next-Gen Automation",
                  "Virtual Try-On",
                  "Intelligent Workflows",
                ]}
                duration={2600}
                className="text-neutral-900"
              />{" "}
              &amp; Scalable Production.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              I am <strong>Vigneshwaran Pugazhenthi</strong>, Principal R&amp;D Technologist at Avataar.ai. I architect intelligent workflows, garment physics engines, and creative technology systems that bridge generative AI research with deterministic, enterprise-scale production.
            </p>

            {/* Specialization Tags */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-mono text-neutral-600">
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 font-medium">
                CLO3D Garment Physics
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 font-medium">
                Autonomous RPA Pipelines
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 font-medium">
                Real-Time Web3D / Three.js
              </span>
              <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 font-medium">
                Neural Model Synthesis
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://vp-ai.vickylive.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900 text-white text-xs font-bold tracking-wide hover:bg-neutral-800 transition-all shadow-sm hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                Explore AI Studio
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href="portfolio.html"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-neutral-900 border border-neutral-200 text-xs font-bold tracking-wide hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm hover:-translate-y-0.5"
              >
                <Compass className="w-4 h-4" />
                Visual Archive &amp; Systems
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors text-xs font-medium"
                title="Export Portfolio PDF"
              >
                <Download className="w-3.5 h-3.5" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Hero Portrait Visual Card (Frame naturally wraps the image) */}
          <div className="lg:col-span-5 flex justify-center z-10">
            <MeteorImpactBorder
              duration={7}
              borderRadius="1.75rem"
              className="inline-block w-auto max-w-[360px] shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
            >
              <div className="p-2 bg-white rounded-[1.75rem]">
                <div className="relative rounded-2xl overflow-hidden shadow-xs">
                  {/* Uncropped portrait image fitting the exact image frame */}
                  <img
                    src="assets/images/home/vp.jpg"
                    alt="Vigneshwaran Pugazhenthi"
                    className="w-full h-auto block rounded-2xl object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none rounded-2xl" />
                  
                  <div className="absolute bottom-3.5 inset-x-3.5 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-white/50 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-900 leading-tight">
                        Vigneshwaran Pugazhenthi
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        Principal R&amp;D Technologist &bull; Avataar.ai
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 shrink-0">
                      Chennai, IN
                    </span>
                  </div>
                </div>
              </div>
            </MeteorImpactBorder>
          </div>

        </div>

        {/* Professional Impact Strip */}
        <div className="mt-16 pt-12 border-t border-neutral-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1.5">
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              10+ Years Technical Craft
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Advancing computational garment physics, 2D pattern conversion, and real-time interactive 3D pipelines.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              Enterprise R&amp;D Architecture
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Formulating deterministic production engines for enterprise digital twins and virtual try-ons at Avataar.ai.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              Workflow Automation &amp; RPA
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Engineering autonomous Python and Power Automate microservices that eliminate repetitive production stages.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              Ecosystem Delivery
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Deploying Draco-optimized WebGL, USDZ, and ARCore assets engineered for instantaneous consumer mobile discovery.
            </p>
          </div>
        </div>

        {/* Executive Philosophy & 4 Architectural Focus Cards */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="text-xs font-mono font-bold uppercase text-neutral-500 mb-2">
                CORE PHILOSOPHY
              </div>
              <p className="text-sm font-semibold text-neutral-800 italic leading-relaxed">
                &ldquo;True innovation in creative technology is not just generating novel visual artifacts; it is engineering deterministic, repeatable pipelines that make complex computational craft effortless at enterprise scale.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-neutral-200 text-xs font-mono text-neutral-500">
                &mdash; Vigneshwaran Pugazhenthi
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
                <Shirt className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mb-1">
                Garment CAD &amp; Physics
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Precision 2D pattern conversion, seam tension, and authentic fabric mechanical drape in CLO3D.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
                <Workflow className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mb-1">
                Autonomous RPA Pipelines
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Headless Python workers orchestrating batch retopology, UV unwrapping, and catalog packaging.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
                <Camera className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mb-1">
                Virtual Studio Systems
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Automated multi-camera virtual photoshoot setups replacing physical catalog photography.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3">
                <Box className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mb-1">
                Real-Time Web3D &amp; Spatial
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Three.js configurators with Draco compression and WebXR/USDZ models for mobile commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02. CORE COMPETENCIES ────────────────────────────────────────────── */}
      <section id="competencies" className="py-24 px-4 md:px-8 bg-neutral-50/80 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-2xl mb-12">
            <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-full">
              02 / Core Competencies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Engineered for Scale, Speed, and Precision.
            </h2>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
              Reconciled across verified production toolchains, real-time garment physics, and enterprise workflow automation.
            </p>
          </div>

          {/* Subsection A: Verified Technical Toolchains in Production */}
          <div className="mb-14 p-6 md:p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-neutral-100 gap-2">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-900">
                  Verified Technical Toolchains in Production
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Production-tested software suites, compilers, and algorithmic frameworks deployed across enterprise client solutions.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 shrink-0">
                16 Verified Suites
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { name: "CLO3D", cat: "CAD & Fashion" },
                { name: "Marvelous Designer", cat: "Garment Physics" },
                { name: "Blender Cycles", cat: "3D & Rendering" },
                { name: "Python 3.x", cat: "Automation & RPA" },
                { name: "Three.js / WebGL", cat: "Interactive 3D" },
                { name: "ComfyUI", cat: "Generative AI" },
                { name: "Stable Diffusion", cat: "Latent Vision" },
                { name: "Power Automate", cat: "Enterprise RPA" },
                { name: "Unreal Engine 5", cat: "Virtual Production" },
                { name: "Draco Compression", cat: "3D Optimization" },
                { name: "Google ARCore", cat: "Spatial Discovery" },
                { name: "Meta Spark AR", cat: "Social Filters" },
                { name: "Substance Painter", cat: "PBR Materials" },
                { name: "PyAutoGUI", cat: "GUI Automation" },
                { name: "USDZ / glTF", cat: "Standard Formats" },
                { name: "Git & CI/CD", cat: "Version Pipeline" },
              ].map((tool) => (
                <div
                  key={tool.name}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="font-semibold">{tool.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">({tool.cat})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subsection B: Ecosystem Pipeline (Chain Carousel) */}
          <div className="mb-14">
            <ChainCarousel
              title="Ecosystem Pipeline &amp; Interconnected Workflows"
              subtitle="Explore the end-to-end engineering architecture connecting design simulation, automation, and spatial delivery."
            />
          </div>

          {/* 8 Core Competencies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  AI Research &amp; Development
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Formulating custom generative vision toolchains, procedural texture models, and hybrid AI workflows to accelerate digital asset production.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">ComfyUI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Stable Diffusion</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">PyTorch</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Shirt className="w-5 h-5 text-neutral-800" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  3D Digital Fashion
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Precision 2D pattern conversion, cloth simulation draping, multi-layer garment assembly, and authentic fabric tension modeling in CLO3D.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">CLO3D</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Marvelous</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Cloth Physics</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Boxes className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  Virtual Try-On &amp; Configurators
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Architecting real-time modular garment configurators using Three.js, Draco-compressed GLB assets, and dynamic mix-and-match conflict resolution.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Three.js</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">WebGL</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Draco</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5 text-neutral-800" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  Workflow Automation &amp; RPA
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Developing autonomous Python workers and Power Automate pipelines to execute batch rendering, UV unwrapping, and metadata catalog packaging.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Python</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Power Automate</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">PyAutoGUI</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Camera className="w-5 h-5 text-neutral-800" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  Creative Tech &amp; Rendering
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Building automated virtual photoshoot environments with custom HDR lighting rigs, physically-based shaders, and multi-camera composite pipelines.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Blender Cycles</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">PBR Shaders</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">HDR Rigs</span>
              </div>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Glasses className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  Technical Architecture
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Designing scalable end-to-end pipelines bridging CAD apparel creation with cross-platform Google ARCore, Meta Spark, and iOS USDZ runtime engines.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">ARCore</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Spark AR</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">USDZ / GLB</span>
              </div>
            </div>

            {/* Card 7 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Scale className="w-5 h-5 text-neutral-800" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  Production QC &amp; Optimization
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Rigorous automated topology inspection, polygon budgeting, normal map baking integrity, and cross-platform shader validation frameworks.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Mesh QC</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Topology</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Normal Audit</span>
              </div>
            </div>

            {/* Card 8 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-900 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">
                  Technical Leadership &amp; SOPs
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                  Authoring engineering Standard Operating Procedures (SOPs), guiding cross-functional teams, and running technical workshops to scale creative talent.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">SOP Frameworks</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Mentorship</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">Agile R&amp;D</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 03. PRODUCTION CASE STUDIES ──────────────────────────────────────── */}
      <section id="case-studies" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 rounded-full">
              03 / Production Case Studies
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              High-Performance Architectures in Production.
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Evidence-led case studies distinguishing challenge, approach, implementation, and verified operational delivery.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Case Studies" },
              { id: "photoshoot", label: "Virtual Photoshoot" },
              { id: "ar-vr", label: "AR/VR & Real-Time" },
              { id: "automation", label: "Automation & RPA" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCaseFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all ${
                  caseFilter === tab.id
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-12">
          {filteredCaseStudies.map((cs) => (
            <article
              key={cs.id}
              className="p-6 md:p-10 rounded-3xl bg-neutral-50/60 border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Information Column */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-500">
                        {cs.client}
                      </span>
                      <span className="text-neutral-300">&bull;</span>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold">
                        {cs.tag}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-extrabold text-neutral-900 mb-3 tracking-tight">
                      {cs.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                      {cs.summary}
                    </p>

                    {/* Breakdown Steps */}
                    <div className="space-y-3 mb-6">
                      <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80">
                        <div className="text-[11px] font-mono uppercase font-bold text-red-600 mb-1">
                          Challenge
                        </div>
                        <div className="text-xs text-neutral-600 leading-relaxed">
                          {cs.challenge}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80">
                        <div className="text-[11px] font-mono uppercase font-bold text-blue-600 mb-1">
                          Approach &amp; Implementation
                        </div>
                        <div className="text-xs text-neutral-600 leading-relaxed">
                          {cs.approach}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-neutral-200/80">
                        <div className="text-[11px] font-mono uppercase font-bold text-emerald-600 mb-1">
                          Verified Outcome
                        </div>
                        <div className="text-xs text-neutral-600 leading-relaxed">
                          {cs.outcome}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack & Action Buttons */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {cs.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-neutral-200/70 text-neutral-800 text-[11px] font-mono font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-200">
                      <button
                        onClick={() =>
                          setBlueprintModal({ title: cs.blueprintTitle, image: cs.image })
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Inspect Architecture Blueprint</span>
                      </button>

                      {cs.externalLink && (
                        <a
                          href={cs.externalLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-semibold transition-all shadow-xs"
                        >
                          <span>{cs.externalLink.label}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      )}

                      {cs.archiveLink && (
                        <a
                          href={cs.archiveLink}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-200 text-xs font-semibold transition-all shadow-xs"
                        >
                          <span>View in Archive</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Blueprint Column */}
                <div className="lg:col-span-5">
                  <div
                    onClick={() =>
                      setBlueprintModal({ title: cs.blueprintTitle, image: cs.image })
                    }
                    className="relative group rounded-2xl overflow-hidden bg-white border border-neutral-200/90 shadow-sm cursor-pointer p-2 hover:border-neutral-400 transition-all"
                  >
                    <img
                      src={cs.image}
                      alt={cs.blueprintTitle}
                      className="w-full h-auto max-h-[380px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-mono flex items-center gap-1.5 shadow-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full Blueprint</span>
                    </div>
                  </div>
                </div>

              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 04. LEADERSHIP & IMPACT ──────────────────────────────────────────── */}
      <section id="leadership" className="py-24 px-4 md:px-8 bg-neutral-50/70 border-t border-neutral-200/80">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-2xl mb-12">
            <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-full">
              04 / Leadership &amp; Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              A Decade of Technical Leadership &amp; Social Progress.
            </h2>
            <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
              Dual tracks of executive technical innovation at Avataar.ai and community empowerment through Integrity People Trust.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Column 1: Avataar.ai Technical Direction */}
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-blue-600">
                      Enterprise R&amp;D
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
                      Avataar.ai Technical Direction
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800">
                    2018 &mdash; Present
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="border-l-2 border-neutral-900 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-blue-600 font-bold">2024 &ndash; PRESENT</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Principal R&amp;D Technologist</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Leading enterprise technology strategy. Overseeing 3D pipeline innovation, automated virtual photoshoots, and procedural generative AI integration.
                    </p>
                  </div>

                  <div className="border-l-2 border-neutral-300 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-neutral-500 font-bold">2022 &ndash; 2023</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Virtual Try-On &amp; Pipeline Architecture</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Directed production of body-tracking try-on experiences. Formulated custom Python toolsets to accelerate simulation and drape computation.
                    </p>
                  </div>

                  <div className="border-l-2 border-neutral-300 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-neutral-500 font-bold">2020 &ndash; 2021</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Automation &amp; Workflow Innovation</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Architected RPA pipelines for automated texture baking and garment quality control, removing repetitive manual production stages.
                    </p>
                  </div>

                  <div className="border-l-2 border-neutral-300 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-neutral-500 font-bold">2018 &ndash; 2019</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">AR/VR Ecosystem Implementation</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Delivered optimized real-time 3D garments for Google AR and Meta platforms within strict polygon and texture constraints.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-mono text-neutral-500">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Directing cross-functional AI &amp; 3D engineering teams</span>
              </div>
            </div>

            {/* Column 2: Integrity People Trust Non-Profit */}
            <div className="p-8 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-600">
                      Non-Profit Initiative
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 mt-0.5">
                      Integrity People Trust
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                    2019 &mdash; Present
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="border-l-2 border-emerald-600 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-emerald-600 font-bold">2024 &ndash; PRESENT</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Mentorship &amp; Sustainable Growth</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Scaling student technical mentorship initiatives across Tamil Nadu, focusing on foundational programming skills, creative design, and career guidance.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-300 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-emerald-700 font-bold">2023</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Digital Literacy &amp; AI Workshops</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Organized hands-on technology sessions introducing practical programming, digital tools, and creative design thinking to underserved students.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-300 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-emerald-700 font-bold">2021 &ndash; 2022</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Educational Sponsorship Drive</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Funded tuition and essential learning resources for economically challenged students to ensure continuity in secondary and higher education.
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-300 pl-4 py-0.5">
                    <div className="text-[11px] font-mono text-emerald-700 font-bold">2019 &ndash; 2020</div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-0.5">Co-Founding &amp; Mission Vision</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      Co-founded Integrity People Trust with the core principle that opportunity and knowledge access should be available to every young mind.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center gap-2 text-xs font-mono text-neutral-500">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>1,200+ Lives empowered through education, literacy, and aid</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 05. COLLABORATION & ADVISORY ─────────────────────────────────────── */}
      <section id="collaboration" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="p-8 md:p-12 rounded-3xl bg-neutral-50/80 border border-neutral-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Contact Column */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 mb-3 text-[11px] font-mono uppercase tracking-widest font-semibold text-neutral-600 bg-white border border-neutral-200 rounded-full">
                  05 / Collaboration &amp; Advisory
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  Let&apos;s Build the Impossible.
                </h2>
                <p className="mt-3 text-sm text-neutral-500 leading-relaxed max-w-lg">
                  Open for strategic enterprise advisory, 3D digital pipeline architecture, virtual try-on consulting, and high-impact technology partnerships.
                </p>

                {/* Direct Verified Email Box with 1-Click Copy */}
                <div className="mt-8 p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between gap-4 max-w-md">
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold text-neutral-400">
                      Direct Email
                    </div>
                    <span className="text-xs sm:text-sm font-mono font-bold text-neutral-900 select-all">
                      ilovemymother@vickylive.com
                    </span>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Professional Social Links */}
                <div className="mt-6">
                  <div className="text-xs font-bold text-neutral-800 mb-3">
                    Verified Professional Networks
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://www.linkedin.com/in/vickyilovemymother"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-neutral-400 hover:bg-neutral-100 transition-all shadow-xs"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://www.instagram.com/VickyILoveMyMom/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-neutral-400 hover:bg-neutral-100 transition-all shadow-xs"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://x.com/VickyILoveMyMom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-neutral-400 hover:bg-neutral-100 transition-all shadow-xs"
                    >
                      X / Twitter
                    </a>
                    <a
                      href="https://www.youtube.com/@vickyilovemymother1625"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-neutral-400 hover:bg-neutral-100 transition-all shadow-xs"
                    >
                      YouTube
                    </a>
                    <a
                      href="https://www.facebook.com/search/people/?q=VickyILoveMyMother"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 hover:border-neutral-400 hover:bg-neutral-100 transition-all shadow-xs"
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </div>

              {/* Chennai Headquarters Location Accordion */}
              <div className="mt-8 p-4 rounded-2xl bg-white border border-neutral-200 max-w-md">
                <div
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold text-neutral-800">
                      Headquarters: Chennai, Tamil Nadu, India
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500 hover:text-neutral-900 underline">
                    {showMap ? "Hide Map" : "View Map"}
                  </span>
                </div>

                {showMap && (
                  <div className="mt-3 pt-3 border-t border-neutral-100 rounded-xl overflow-hidden animate-in fade-in duration-200">
                    <iframe
                      className="w-full h-48 rounded-lg border-0"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5959578806746!2d80.21700907588877!3d13.124763211500087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264581352d3c1%3A0xc80ac04ea9ee8b69!2sVickyILoveMyMother!5e0!3m2!1sen!2sin!4v1775606357089!5m2!1sen!2sin"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Vigneshwaran Pugazhenthi Office Location"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Consultation Inquiry Form (Configured to email client & Vigneshwaran Pugazhenthi) */}
            <div className="lg:col-span-6">
              <form
                onSubmit={handleFormSubmit}
                className="p-6 md:p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col gap-4"
              >
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    Consultation &amp; Advisory Inquiry
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Messages initialize a dual-copy dispatch to both our desk and your address.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. sarah@enterprise.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Inquiry Area
                  </label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 transition-colors bg-white"
                  >
                    <option value="3D Digital Fashion Pipeline">3D Digital Fashion Pipeline</option>
                    <option value="Workflow Automation & RPA">Workflow Automation &amp; RPA</option>
                    <option value="AR/VR Virtual Try-On Advisory">AR/VR Virtual Try-On Advisory</option>
                    <option value="Integrity People Trust / Non-Profit Collaboration">Integrity People Trust / Mentorship</option>
                    <option value="Strategic Advisory & Keynote">Strategic Advisory &amp; Keynote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Project Objectives / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Describe your technical objectives, timeline, or current pipeline challenges..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Consultation Inquiry</span>
                </button>

                <div className="text-[11px] text-neutral-400 text-center">
                  Your communication is handled in strict confidentiality. A mailto dispatch will be initialized with your pre-filled inquiry.
                </div>

                {formFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold mt-2 ${
                      formFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {formFeedback.text}
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

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
            <a href="#overview" className="text-neutral-700 hover:text-neutral-900">
              Executive Overview
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#competencies" className="text-neutral-700 hover:text-neutral-900">
              Core Competencies
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#case-studies" className="text-neutral-700 hover:text-neutral-900">
              Production Case Studies
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#leadership" className="text-neutral-700 hover:text-neutral-900">
              Leadership &amp; Impact
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="#collaboration" className="text-neutral-700 hover:text-neutral-900">
              Collaboration &amp; Advisory
            </a>
            <span className="text-neutral-300">&bull;</span>
            <a href="portfolio.html" className="text-neutral-900 font-bold hover:underline">
              Visual Archive &rarr;
            </a>
          </div>

          <div className="mt-10 pt-6 border-t border-neutral-100 w-full text-center text-xs text-neutral-400 font-mono">
            &copy; {new Date().getFullYear()} Vigneshwaran Pugazhenthi. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── CASE STUDY BLUEPRINT FULLSCREEN MODAL ────────────────────────────── */}
      {blueprintModal && (
        <div
          onClick={() => setBlueprintModal(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <span className="text-xs font-mono uppercase text-neutral-600 font-bold">
                {blueprintModal.title}
              </span>
              <button
                onClick={() => setBlueprintModal(null)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 bg-neutral-950 flex items-center justify-center overflow-auto max-h-[80vh]">
              <img
                src={blueprintModal.image}
                alt={blueprintModal.title}
                className="max-h-[75vh] max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
