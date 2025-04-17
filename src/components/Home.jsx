import React, { useState, useEffect, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

import {
  Search,
  Briefcase,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  ArrowRight,
  Zap,
  Award,
  Compass,
  Plus,
  ChevronUp,
  X,
  Flame,
  TrendingUp,
  Calendar,
  DollarSign,
  Sparkles,
  Cpu,
  Globe,
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Three.js Background Animation Component
const ParticleField = () => {
  const { camera } = useThree();
  const points = useRef();
  const particlesCount = 1000;
  
  // Generate random particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return positions;
  }, [particlesCount]);

  // Animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * 0.1;
    points.current.rotation.y = time * 0.05;
    
    // Slight pulsing effect
    points.current.material.size = 0.08 + Math.sin(time) * 0.02;
    
    // Slowly follow mouse movement
    if (state.mouse) {
      camera.position.x += (state.mouse.x * 0.5 - camera.position.x) * 0.01;
      camera.position.y += (-state.mouse.y * 0.5 - camera.position.y) * 0.01;
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Post-processing effects for Three.js scene
const Effects = () => {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={0.4}
      />
      <ChromaticAberration offset={[0.0005, 0.0005]} />
    </EffectComposer>
  );
};

// Scene component that combines particles and effects
const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-50">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <color attach="background" args={['#0A0F1D']} />
        <fog attach="fog" args={['#0A0F1D', 5, 25]} />
        <Suspense fallback={null}>
          <ParticleField />
          <Effects />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Animated neon border component
const NeonBorder = ({ color = "#8B5CF6", className }) => {
  return (
    <div className={`absolute inset-0 -z-10 rounded-2xl ${className}`}>
      <div className="absolute inset-0 bg-transparent border-2 rounded-2xl animate-pulse-slow" 
           style={{ borderColor: color, boxShadow: `0 0 15px ${color}` }} />
      <div className="absolute inset-0 bg-transparent border rounded-2xl animate-pulse-slower" 
           style={{ borderColor: color, boxShadow: `0 0 8px ${color}` }} />
    </div>
  );
};

// Glowing text effect component
const GlowText = ({ children, color = "from-purple-500 to-indigo-500", className }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r font-bold ${color}">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r blur-sm opacity-50 ${color}" style={{ filter: 'blur(8px)' }}>{children}</span>
    </span>
  );
};

// Futuristic button component
const FuturisticButton = ({ children, onClick, className, glowColor = "purple" }) => {
  const colorMap = {
    purple: { base: "bg-gradient-to-r from-violet-600 to-indigo-600", glow: "shadow-purple-500/30" },
    yellow: { base: "bg-gradient-to-r from-yellow-400 to-orange-500", glow: "shadow-yellow-500/30" },
  };
  
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden flex items-center text-sm text-white ${colorMap[glowColor].base} px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:${colorMap[glowColor].glow} font-medium ${className}`}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shimmer" />
      {children}
    </button>
  );
};

const ApplyButton = ({ id }) => {
  const navigate = useNavigate();
  const handleApplyClick = () => {
    navigate(`/details/${id}`);
  };
  
  return (
    <FuturisticButton onClick={handleApplyClick}>
      Apply <ArrowRight size={14} className="ml-2 transition-all group-hover:translate-x-1" />
    </FuturisticButton>
  );
};

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState([2, 5]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    logo: "https://via.placeholder.com/150",
    featured: false,
    postedDate: new Date().toISOString().split('T')[0],
  });
  const formRef = useRef(null);

  const categories = [
    { id: "all", name: "All Jobs", icon: <Compass size={18} /> },
    { id: "tech", name: "Technology", icon: <Cpu size={18} /> },
    { id: "design", name: "Design", icon: <Award size={18} /> },
    { id: "remote", name: "Remote", icon: <Globe size={18} /> },
  ];

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("https://career-backend-production.up.railway.app/api/api/jobs/");
        // Add featured flag to some jobs for demo purposes
        const processedJobs = response.data.map((job, index) => ({
          ...job,
          featured: index < 3, // First three jobs are featured
          postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        }));
        setJobs(processedJobs);
      } catch (err) {
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Font loading
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add font family to body
    document.body.style.fontFamily = "'Space Grotesk', sans-serif";
    
    // Add custom animations to CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      @keyframes pulse-slower {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.4; }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
      .animate-pulse-slow {
        animation: pulse-slow 3s infinite;
      }
      .animate-pulse-slower {
        animation: pulse-slower 4s infinite;
      }
      .text-shadow-glow {
        text-shadow: 0 0 10px currentColor;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewJob((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/jobs/", newJob);
      setJobs((prev) => [...prev, response.data]);
      setShowPostForm(false);
      setNewJob({
        title: "",
        company: "",
        location: "",
        type: "",
        salary: "",
        logo: "https://via.placeholder.com/150",
        featured: false,
        postedDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError("Failed to post job. Please try again.");
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const featuredJobs = filteredJobs.filter((job) => job.featured);
  const normalJobs = filteredJobs.filter((job) => !job.featured);

  // Function to get days since posting
  const getDaysSincePosting = (postedDate) => {
    if (!postedDate) return "Recently";
    const posted = new Date(postedDate);
    const today = new Date();
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white relative overflow-hidden">
      <ThreeBackground />
      
      {/* Ambient gradient lights */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse-slower"></div>
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-15 animate-pulse-slow"></div>
      
      <Navbar />

      {/* Hero Banner */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-16 border-b border-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: "'Syncopate', sans-serif" }}>
              <GlowText color="from-[#6366F1] via-purple-500 to-[#EC4899]">
                Find Your Dream Job Today
              </GlowText>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover thousands of opportunities with top companies and start your next career adventure.
            </p>
          </div>

          {/* Search Section */}
          <div className="relative bg-[#141B2D]/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-purple-500/20">
            <NeonBorder color="#8B5CF6" />
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-4 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 rounded-xl bg-[#0A0F1D]/80 text-white placeholder-gray-400 shadow-inner border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                  placeholder="Job title, skills, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative md:w-64">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-purple-400" />
                <select
                  className="block w-full pl-12 pr-4 py-4 rounded-xl bg-[#0A0F1D]/80 text-white placeholder-gray-400 shadow-inner border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none"
                  defaultValue=""
                >
                  <option value="">Any Location</option>
                  <option value="remote">Remote</option>
                  <option value="sf">San Francisco</option>
                  <option value="ny">New York</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <FuturisticButton className="py-4 px-8 rounded-xl">
                <Sparkles size={14} className="mr-2" /> Search Jobs
              </FuturisticButton>
            </div>

            {/* Job Categories */}
            <div className="flex flex-wrap gap-4 mt-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "bg-[#0A0F1D]/80 text-gray-300 hover:bg-[#141B2D] border border-purple-500/30"
                  }`}
                >
                  {category.icon}
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
 
      {/* Post a Job Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex justify-end sticky top-4 z-10">
        <FuturisticButton
          onClick={() => setShowPostForm(true)}
          className="gap-2 py-3 px-8"
        >
          <Plus size={18} /> Post a Job
        </FuturisticButton>
      </div>

      {/* Post Job Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-lg flex items-center justify-center z-50 px-4 sm:px-6 overflow-y-auto">
          <div className="relative bg-[#0A0F1D]/95 backdrop-blur-lg rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg md:max-w-2xl shadow-2xl border border-purple-500/30 max-h-[90vh] overflow-y-auto">
            <NeonBorder />
            
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#EC4899]"
                style={{ fontFamily: "'Syncopate', sans-serif" }}
              >
                Post a New Job
              </h2>
              <button
                onClick={() => setShowPostForm(false)}
                className="text-gray-400 hover:text-white bg-[#141B2D]/80 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg bg-[#0A0F1D]/80 text-white placeholder-gray-400 shadow-inner border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={newJob.company}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg bg-[#0A0F1D]/80 text-white placeholder-gray-400 shadow-inner border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="Your Company Name"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newJob.location}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg bg-[#0A0F1D]/80 text-white placeholder-gray-400 shadow-inner border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    placeholder="Remote, New York, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Job Type</label>
                  <select
                    name="type"
                    value={newJob.type}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 rounded-lg bg-[#0A0F1D]/80 text-white placeholder-gray-400 shadow-inner border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none"
                    required
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Salary Range</label>
                <input
                  type="text"
                  name="salary"
                  value={newJob.salary}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-lg bg-[#0A0F1D]/80 text-white placeholder-gray-400 shadow-inner border border-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  placeholder="$80k - $120k"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={newJob.featured}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 rounded border-purple-600 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">
                  Feature this job posting (premium)
                </label>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-6 py-2 rounded-lg bg-[#141B2D] text-white hover:bg-[#1E293B] transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                <FuturisticButton type="submit">
                  Post Job
                </FuturisticButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Featured Job Listings */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Flame size={24} className="text-yellow-400 mr-2 filter drop-shadow-md" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 pb-2 border-b-2 border-yellow-400/50" style={{ fontFamily: "'Syncopate', sans-serif" }}>
            Featured Opportunities
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {loading && <p className="text-gray-400">Loading jobs...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && !error && featuredJobs.length === 0 && (
            <p className="text-gray-400">No featured jobs available.</p>
          )}
          {!loading &&
            !error &&
            featuredJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="group relative bg-[#141B2D]/60 backdrop-blur-sm rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl border border-yellow-400/30 hover:border-yellow-400/60"
                onMouseEnter={() => setIsHovering(job.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                {isHovering === job.id && (
                  <NeonBorder color="#FBBF24" className="opacity-70" />
                )}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center shadow-lg">
                  <Flame size={12} className="mr-1" /> Featured
                </div>
                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="h-14 w-14 rounded-xl bg-[#0A0F1D] flex items-center justify-center overflow-hidden mr-3 border border-yellow-400/30 shadow-lg">
                        <img
                          src={job.logo || "default-icon.png"}
                          alt={`${job.company} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mt-1 hover:text-yellow-400 transition-colors">{job.title}</h3>
                        <p className="text-sm text-gray-400">{job.company}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="text-gray-400 hover:text-yellow-400 mt-1"
                    >
                      <Star
                        size={20}
                        fill={savedJobs.includes(job.id) ? "currentColor" : "none"}
                        className={savedJobs.includes(job.id) ? "text-yellow-400 filter drop-shadow-md" : ""}
                      />
                    </button>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin size={14} className="mr-2 text-yellow-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Briefcase size={14} className="mr-2 text-yellow-400" />
                      {job.type}
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-sm text-gray-400">
                        <DollarSign size={14} className="mr-2 text-yellow-400" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar size={14} className="mr-2 text-yellow-400" />
                      {getDaysSincePosting(job.postedDate)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-yellow-400 font-medium filter drop-shadow-sm">Premium position</span>
                    <ApplyButton id={job.id} />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Regular Job Listings */}
        <div className="flex items-center mb-8">
          <TrendingUp size={24} className="text-[#6366F1] mr-2 filter drop-shadow-md" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#EC4899] pb-2 border-b-2 border-[#6366F1]/50" style={{ fontFamily: "'Syncopate', sans-serif" }}>
            All Opportunities
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p className="text-gray-400">Loading jobs...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && !error && normalJobs.length === 0 && (
            <p className="text-gray-400">No regular jobs available.</p>
          )}
          
            {!loading &&
              !error &&
              normalJobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative bg-[#141B2D]/60 backdrop-blur-sm rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl border border-purple-500/30 hover:border-purple-500/60"
                  onMouseEnter={() => setIsHovering(`normal-${job.id}`)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  {isHovering === `normal-${job.id}` && (
                    <NeonBorder color="#8B5CF6" className="opacity-70" />
                  )}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-xl bg-[#0A0F1D] flex items-center justify-center overflow-hidden mr-3 border border-purple-500/30 shadow-lg">
                          <img
                            src={job.logo || "default-icon.png"}
                            alt={`${job.company} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mt-1 hover:text-purple-400 transition-colors">{job.title}</h3>
                          <p className="text-sm text-gray-400">{job.company}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="text-gray-400 hover:text-purple-400 mt-1"
                      >
                        <Star
                          size={20}
                          fill={savedJobs.includes(job.id) ? "currentColor" : "none"}
                          className={savedJobs.includes(job.id) ? "text-purple-500 filter drop-shadow-md" : ""}
                        />
                      </button>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPin size={14} className="mr-2 text-purple-400" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Briefcase size={14} className="mr-2 text-purple-400" />
                        {job.type}
                      </div>
                      {job.salary && (
                        <div className="flex items-center text-sm text-gray-400">
                          <DollarSign size={14} className="mr-2 text-purple-400" />
                          {job.salary}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar size={14} className="mr-2 text-purple-400" />
                        {getDaysSincePosting(job.postedDate)}
                      </div>
                    </div>
                    <div className="flex justify-end items-center mt-4">
                      <ApplyButton id={job.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
                  </main>
            
                  {/* Back to Top Button */}
                  {showScrollToTop && (
                    <button
                      onClick={scrollToTop}
                      className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white p-3 rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-110 z-20 group"
                      aria-label="Back to top"
                    >
                      <div className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:animate-pulse"></div>
                      <ChevronUp size={24} />
                    </button>
                  )}
            
                  {/* Floating Action Menu */}
                  <div className="fixed bottom-6 left-6 z-20">
                    <div className="flex flex-col space-y-4">
                      <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-110 group">
                        <div className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:animate-pulse"></div>
                        <Zap size={24} />
                      </button>
                      <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/20 transition-all hover:scale-110 group">
                        <div className="absolute inset-0 rounded-full bg-white opacity-10 group-hover:animate-pulse"></div>
                        <Cpu size={24} />
                      </button>
                    </div>
                  </div>
            
                  {/* Cyberpunk-style Stats Section */}
                  <section className="relative overflow-hidden bg-[#141B2D]/80 backdrop-blur-md border-t border-b border-purple-500/20 py-16 mt-12">
                    <div className="absolute -top-20 right-1/4 w-64 h-64 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
                    <div className="absolute -bottom-20 left-1/4 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20"></div>
            
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h2 className="text-2xl font-bold mb-12 text-center" style={{ fontFamily: "'Syncopate', sans-serif" }}>
                        <GlowText color="from-cyan-400 to-blue-500">
                          NEXUS STATISTICS
                        </GlowText>
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="relative bg-[#0A0F1D]/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 group hover:border-cyan-500/60 transition-all">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all"></div>
                          <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            {loading ? "..." : "10,000+"}
                          </div>
                          <div className="text-gray-400 font-medium">Active Job Listings</div>
                          <div className="absolute top-2 right-2 text-cyan-400 opacity-20">
                            <Briefcase size={36} />
                          </div>
                        </div>
                        
                        <div className="relative bg-[#0A0F1D]/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 group hover:border-purple-500/60 transition-all">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-2xl group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all"></div>
                          <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                            {loading ? "..." : "5M+"}
                          </div>
                          <div className="text-gray-400 font-medium">Registered Users</div>
                          <div className="absolute top-2 right-2 text-purple-400 opacity-20">
                            <Cpu size={36} />
                          </div>
                        </div>
                        
                        <div className="relative bg-[#0A0F1D]/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 group hover:border-pink-500/60 transition-all">
                          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5 rounded-2xl group-hover:from-pink-500/10 group-hover:to-red-500/10 transition-all"></div>
                          <div className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                            {loading ? "..." : "93%"}
                          </div>
                          <div className="text-gray-400 font-medium">Placement Rate</div>
                          <div className="absolute top-2 right-2 text-pink-400 opacity-20">
                            <Award size={36} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* Tech Stack Feature */}
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "'Syncopate', sans-serif" }}>
                      <GlowText color="from-[#6366F1] to-[#EC4899]">
                        TOP TECHNOLOGIES
                      </GlowText>
                    </h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                      {['React', 'Vue', 'Angular', 'Node.js', 'Python', 'TensorFlow'].map((tech, index) => (
                        <div 
                          key={tech} 
                          className="group relative bg-[#141B2D]/60 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all text-center flex flex-col items-center justify-center hover:shadow-lg hover:shadow-purple-500/20"
                        >
                          <div className="text-2xl mb-2 filter drop-shadow-md">
                            {['⚛️', '🟢', '🔺', '🟢', '🐍', '🧠'][index]}
                          </div>
                          <div className="font-medium text-gray-200">{tech}</div>
                          <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-y-12 opacity-0 group-hover:animate-shimmer group-hover:opacity-100"></div>
                        </div>
                      ))}
                    </div>
                  </section>
            
                  <Footer />
                </div>
              );
            };
            
            export default Home;