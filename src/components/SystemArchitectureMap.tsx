import React, { useState } from "react";
import {
  ArrowRight,
  Maximize2,
  Check,
  Cpu,
  Layers,
  Compass,
  FileCheck,
  Workflow,
  Sparkles,
  Camera,
  Boxes,
  Users,
  X,
} from "lucide-react";
import MeteorImpactBorder from "@/components/lightswind-pro/meteor-impact-border";

export interface ArchitectureNode {
  id: string;
  badge: string;
  category: string;
  title: string;
  iconName: string;
  diagram: string;
  description: string;
  approach: string[];
  tools: string[];
  impact: { label: string; val: string }[];
}

export const architectureNodes: Record<string, ArchitectureNode> = {
  PO001: {
    id: "PO001",
    badge: "NODE // 01",
    category: "THE ARCHITECT",
    title: "Intersection of Tech & Fashion Systems",
    iconName: "compass",
    diagram: "assets/images/portfolio/ecosystem/Architect.png",
    description: "Over the last three years at Avataar.ai, my role evolved into ownership of simulation processes, technical documentation, pipeline research, and automated asset delivery across enterprise fashion partners.",
    approach: ["01 · Research", "02 · Prototype", "03 · Automate", "04 · Validate"],
    tools: ["CLO3D", "Blender", "Python Automation", "Three.js / WebGL", "GSAP"],
    impact: [
      { label: "Throughput", val: "Accelerated" },
      { label: "Standard SOPs", val: "Enterprise" },
      { label: "Mesh Quality", val: "Production-Grade" },
    ],
  },
  PO002: {
    id: "PO002",
    badge: "NODE // 02",
    category: "R&D ENGINEERING",
    title: "Simulation & Real-Time Physics",
    iconName: "cpu",
    diagram: "assets/images/portfolio/ecosystem/R&D.png",
    description: "Continuous research into CLO3D drape simulation pipelines, real-time body tracking mechanics, and physically-based shader calibration for digital twins.",
    approach: ["01 · Fabric Testing", "02 · Drape Modeling", "03 · Shader Baking", "04 · Runtime Test"],
    tools: ["CLO3D", "Blender Cycles", "PBR Shading", "Color Calibration"],
    impact: [
      { label: "Fidelity", val: "Photorealistic" },
      { label: "Format", val: "GLB / USDZ" },
      { label: "Shader Specs", val: "PBR Standard" },
    ],
  },
  PO003: {
    id: "PO003",
    badge: "NODE // 03",
    category: "KNOWLEDGE INFRASTRUCTURE",
    title: "Engineering SOPs & QC Matrices",
    iconName: "filecheck",
    diagram: "assets/images/portfolio/ecosystem/Knowledge.png",
    description: "Authored technical documentation for major 3D garment workflows, establishing standard operating procedures (SOPs) and quality control checklists for cross-functional global teams.",
    approach: ["01 · Workflow Audit", "02 · SOP Authoring", "03 · QC Benchmarks", "04 · Team Training"],
    tools: ["SOP Matrices", "Markdown Specs", "Topology Standards", "Style Guides"],
    impact: [
      { label: "Documentation", val: "Comprehensive" },
      { label: "Onboarding", val: "Structured" },
      { label: "Error Prevention", val: "Systemic" },
    ],
  },
  PO004: {
    id: "PO004",
    badge: "NODE // 04",
    category: "VIRTUAL STUDIO",
    title: "Virtual Photoshoot Automation",
    iconName: "camera",
    diagram: "assets/images/portfolio/ecosystem/Realism.png",
    description: "Replaced costly physical garment photoshoots with an end-to-end automated 3D virtual render framework, combining calibrated studio lighting with high-resolution cloth simulation.",
    approach: ["01 · Virtual Staging", "02 · HDR Lighting", "03 · Batch Render", "04 · Automated Composite"],
    tools: ["Blender Cycles", "Python Compositor", "HDR Rigs", "Multi-Angle Cameras"],
    impact: [
      { label: "Studio Speed", val: "High Throughput" },
      { label: "Samples Needed", val: "Zero Physical" },
      { label: "Asset Feeds", val: "E-Commerce Ready" },
    ],
  },
  PO005: {
    id: "PO005",
    badge: "NODE // 05",
    category: "ROBOTIC LOGIC",
    title: "Workflow Automation & RPA",
    iconName: "workflow",
    diagram: "assets/images/portfolio/ecosystem/Logic.png",
    description: "Engineered headless Python background workers and Power Automate flow sequences to eliminate repetitive manual asset prep, UV checks, and metadata tagging.",
    approach: ["01 · Trace Flow", "02 · Script Bot", "03 · Test Ingestion", "04 · Auto-Run"],
    tools: ["Python Scripts", "Power Automate", "PyAutoGUI", "CLI Utilities"],
    impact: [
      { label: "Manual Touchpoints", val: "Minimized" },
      { label: "Batch Scale", val: "10,000+ Files" },
      { label: "Reliability", val: "Automated" },
    ],
  },
  PO006: {
    id: "PO006",
    badge: "NODE // 06",
    category: "AI TOOLCHAINS",
    title: "Generative AI & Procedural Textures",
    iconName: "sparkles",
    diagram: "assets/images/portfolio/ecosystem/Scripting.png",
    description: "Formulating hybrid AI toolchains integrating Stable Diffusion, ComfyUI, and procedural Blender scripts for rapid pattern synthesis and high-speed material generation.",
    approach: ["01 · Pattern Input", "02 · Model Synthesis", "03 · Normal Extraction", "04 · Engine Injection"],
    tools: ["Stable Diffusion", "ComfyUI", "Blender API", "Python"],
    impact: [
      { label: "Pattern Velocity", val: "Instantaneous" },
      { label: "Material Fidelity", val: "Seamless PBR" },
      { label: "Efficiency", val: "Significant" },
    ],
  },
  PO007: {
    id: "PO007",
    badge: "NODE // 07",
    category: "VALIDATION ARCHITECTURE",
    title: "Quality Assurance & Standards",
    iconName: "layers",
    diagram: "assets/images/portfolio/ecosystem/Validation.png",
    description: "Automated topology inspection, polygon budgeting, normal map baking integrity, and cross-platform shader validation frameworks.",
    approach: ["01 · Spec Review", "02 · Mesh Check", "03 · Visual QA", "04 · Sign-Off"],
    tools: ["Topology Inspector", "Normal Auditors", "WebGL Profiler", "Draco Validator"],
    impact: [
      { label: "Mesh Uniformity", val: "100%" },
      { label: "Real-Time Latency", val: "Ultra-Low" },
      { label: "Defects", val: "Zero Critical" },
    ],
  },
  PO008: {
    id: "PO008",
    badge: "NODE // 08",
    category: "DELIVERY & POC",
    title: "Enterprise Proofs of Concept",
    iconName: "boxes",
    diagram: "assets/images/portfolio/ecosystem/Delivery.png",
    description: "Delivered complex Proofs of Concept for tier-one retail and luxury fashion brands, blending emerging tools with stable execution to validate new business channels.",
    approach: ["01 · Brief Analysis", "02 · Rapid Prototype", "03 · Live Demo", "04 · Architecture Hand-off"],
    tools: ["Three.js", "CLO3D Garments", "Interactive Web3D", "Technical Specs"],
    impact: [
      { label: "Brand Buy-In", val: "Accelerated" },
      { label: "Deployment", val: "Turnkey" },
      { label: "Validation", val: "Empirical" },
    ],
  },
  PO009: {
    id: "PO009",
    badge: "NODE // 09",
    category: "LEADERSHIP & ENABLEMENT",
    title: "Cross-Functional Coaching & Growth",
    iconName: "users",
    diagram: "assets/images/portfolio/ecosystem/Enablement.png",
    description: "Mentoring 3D artists, technical designers, and automation engineers across technical onboarding sessions, pipeline documentation reviews, and hands-on skill workshops.",
    approach: ["01 · Needs Assessment", "02 · Curriculum Design", "03 · Active Workshop", "04 · Production Enablement"],
    tools: ["Knowledge Base", "Live Demonstrations", "Code Walkthroughs", "Process Audits"],
    impact: [
      { label: "Talent Scale", val: "Continuous" },
      { label: "Skill Depth", val: "Multi-Disciplinary" },
      { label: "Culture", val: "Quality-First" },
    ],
  },
};

const getNodeIcon = (iconName: string) => {
  switch (iconName) {
    case "compass": return <Compass className="w-4 h-4" />;
    case "cpu": return <Cpu className="w-4 h-4" />;
    case "filecheck": return <FileCheck className="w-4 h-4" />;
    case "camera": return <Camera className="w-4 h-4" />;
    case "workflow": return <Workflow className="w-4 h-4" />;
    case "sparkles": return <Sparkles className="w-4 h-4" />;
    case "layers": return <Layers className="w-4 h-4" />;
    case "boxes": return <Boxes className="w-4 h-4" />;
    case "users": return <Users className="w-4 h-4" />;
    default: return <Compass className="w-4 h-4" />;
  }
};

export function SystemArchitectureMap() {
  const nodeList = Object.values(architectureNodes);
  const [activeNodeId, setActiveNodeId] = useState<string>("PO001");
  const [fullscreenModalNode, setFullscreenModalNode] = useState<ArchitectureNode | null>(null);

  const activeNode = architectureNodes[activeNodeId] || nodeList[0];

  return (
    <div className="w-full">
      {/* Ecosystem Header Card */}
      <div className="p-4 md:p-6 mb-8 rounded-2xl bg-neutral-50 border border-neutral-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
              ECOSYSTEM PIPELINE &amp; ARCHITECTURE RUNTIME
            </div>
            <div className="text-[11px] text-neutral-500">
              Hover over any node on the left to inspect the live process architecture and operational blueprint.
            </div>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 font-bold text-neutral-800">
            9 Production Nodes
          </span>
        </div>
      </div>

      {/* Main Interactive Split Layout: Nodes List (Left) + Hover Preview Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: 9 Interactive Nodes */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {nodeList.map((node) => {
            const isActive = activeNodeId === node.id;
            return (
              <div
                key={node.id}
                onMouseEnter={() => setActiveNodeId(node.id)}
                onClick={() => setActiveNodeId(node.id)}
                className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? "bg-white border-neutral-900 shadow-md translate-x-1"
                    : "bg-neutral-50/70 hover:bg-white border-neutral-200/80 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-200/70 text-neutral-700 group-hover:bg-neutral-200"
                      }`}
                    >
                      {node.badge}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 group-hover:text-neutral-600 transition-colors">
                      {node.category}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                    }`}
                  >
                    {getNodeIcon(node.iconName)}
                  </div>
                </div>

                <h3
                  className={`text-sm font-bold transition-colors ${
                    isActive ? "text-neutral-950" : "text-neutral-700 group-hover:text-neutral-950"
                  }`}
                >
                  {node.title}
                </h3>

                <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {node.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-100">
                  <span className="truncate max-w-[200px]">
                    {node.tools.slice(0, 3).join(" · ")}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold transition-all ${
                      isActive ? "text-neutral-950 translate-x-0.5" : "text-neutral-400 group-hover:text-neutral-700"
                    }`}
                  >
                    <span>View Blueprint</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Dynamic Live Hover Preview Panel */}
        <div className="lg:col-span-7 sticky top-24">
          <MeteorImpactBorder
            duration={9}
            borderRadius="1.5rem"
            meteorColor="rgba(37, 99, 235, 0.6)"
            className="w-full shadow-lg"
          >
            <div className="p-6 md:p-8 bg-white flex flex-col gap-6">
              
              {/* Preview Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-mono font-bold">
                      {activeNode.badge}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">
                      {activeNode.category}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
                    {activeNode.title}
                  </h3>
                </div>

                <button
                  onClick={() => setFullscreenModalNode(activeNode)}
                  className="shrink-0 p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Expand Full Blueprint"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Inspect Full</span>
                </button>
              </div>

              {/* High-Resolution Diagram Display (Uncropped) */}
              <div
                onClick={() => setFullscreenModalNode(activeNode)}
                className="relative group rounded-2xl border border-neutral-200 bg-neutral-900/5 hover:bg-neutral-900/10 p-4 flex items-center justify-center cursor-pointer transition-all overflow-hidden"
              >
                <img
                  key={activeNode.diagram}
                  src={activeNode.diagram}
                  alt={activeNode.title}
                  className="max-h-[380px] w-auto max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                />
                
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="px-4 py-2 rounded-full bg-white/95 text-neutral-900 text-xs font-bold shadow-md flex items-center gap-2">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Click to Zoom Blueprint
                  </span>
                </div>
              </div>

              {/* Node Detailed Description */}
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                {activeNode.description}
              </p>

              {/* Operational Methodology Checklist */}
              <div>
                <div className="text-[11px] font-mono uppercase font-bold text-neutral-500 mb-2">
                  OPERATIONAL METHODOLOGY
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeNode.approach.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-[11px] font-semibold text-neutral-800"
                    >
                      <Check className="w-3 h-3 text-blue-600 shrink-0" />
                      <span className="truncate">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toolchains & Impact Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-4 border-t border-neutral-100 items-center">
                <div className="sm:col-span-7">
                  <div className="text-[10px] font-mono uppercase font-bold text-neutral-400 mb-2">
                    VERIFIED TOOLCHAINS
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-mono text-neutral-800 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-5 flex justify-end">
                  <div className="flex gap-2 w-full justify-between sm:justify-end">
                    {activeNode.impact.map((imp, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-center min-w-[70px]"
                      >
                        <div className="text-[9px] font-mono uppercase text-neutral-400">
                          {imp.label}
                        </div>
                        <div className="text-[11px] font-bold text-neutral-900 mt-0.5">
                          {imp.val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </MeteorImpactBorder>
        </div>

      </div>

      {/* Fullscreen Blueprint Modal */}
      {fullscreenModalNode && (
        <div
          onClick={() => setFullscreenModalNode(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-mono font-bold">
                  {fullscreenModalNode.badge}
                </span>
                <span className="text-xs font-mono uppercase text-neutral-500 font-bold">
                  {fullscreenModalNode.category} &mdash; {fullscreenModalNode.title}
                </span>
              </div>
              <button
                onClick={() => setFullscreenModalNode(null)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-950 p-4 flex items-center justify-center">
                <img
                  src={fullscreenModalNode.diagram}
                  alt={fullscreenModalNode.title}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              </div>

              <div>
                <h4 className="text-base font-bold text-neutral-900 mb-1">
                  Architecture Overview
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {fullscreenModalNode.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                <div>
                  <div className="text-[11px] font-mono uppercase font-bold text-neutral-400 mb-2">
                    Methodology Sequence
                  </div>
                  <div className="space-y-1.5">
                    {fullscreenModalNode.approach.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-800"
                      >
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase font-bold text-neutral-400 mb-2">
                    Verified Tools in Production
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fullscreenModalNode.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-mono text-neutral-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemArchitectureMap;
