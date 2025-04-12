import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
} from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ApplyButton = ({ id }) => {
  const navigate = useNavigate();
  const handleApplyClick = () => {
    navigate(`/details/${id}`);
  };
  return (
    <button
      onClick={handleApplyClick}
      className="flex items-center text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-violet-500/20 font-medium"
    >
      Apply <ArrowRight size={14} className="ml-2 transition-all" />
    </button>
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
    { id: "tech", name: "Technology", icon: <Zap size={18} /> },
    { id: "design", name: "Design", icon: <Award size={18} /> },
  ];

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/jobs/");
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
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Add font family to body
    document.body.style.fontFamily = "'Inter', sans-serif";
    
    return () => {
      document.head.removeChild(link);
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
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] text-white">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-[#0F172A] to-[#1E293B] border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#EC4899] mb-6 font-heading" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Find Your Dream Job Today
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover thousands of opportunities with top companies and start your next career adventure.
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 rounded-3xl p-8 shadow-2xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-4 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/80 text-white placeholder-gray-400 shadow-inner border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                  placeholder="Job title, skills, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative md:w-64">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-purple-400" />
                <select
                  className="block w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/80 text-white placeholder-gray-400 shadow-inner border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none"
                  defaultValue=""
                >
                  <option value="">Any Location</option>
                  <option value="remote">Remote</option>
                  <option value="sf">San Francisco</option>
                  <option value="ny">New York</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white py-4 px-8 rounded-xl font-medium shadow-lg shadow-purple-500/20 transition-all hover:scale-105 hover:shadow-purple-500/30">
                Search Jobs
              </button>
            </div>

            {/* Job Categories */}
            <div className="flex flex-wrap gap-4 mt-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800/80 text-gray-300 hover:bg-gray-700"
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
  <button
    onClick={() => setShowPostForm(true)}
    className="flex items-center gap-2 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white py-3 px-6 sm:px-8 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 font-medium"
  >
    <Plus size={18} /> Post a Job
  </button>
</div>

{/* Post Job Modal */}
{showPostForm && (
  <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-lg flex items-center justify-center z-50 px-4 sm:px-6 overflow-y-auto">
    <div className="bg-gradient-to-b from-[#1E293B]/95 to-[#0F172A]/95 backdrop-blur-lg rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg md:max-w-2xl shadow-2xl border border-gray-700/50 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#EC4899]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Post a New Job
        </h2>
        <button
          onClick={() => setShowPostForm(false)}
          className="text-gray-400 hover:text-white bg-gray-800/80 p-2 rounded-full transition-colors"
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
            className="block w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 shadow-inner border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
            className="block w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 shadow-inner border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
              className="block w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 shadow-inner border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
              className="block w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 shadow-inner border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 appearance-none"
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
            className="block w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white placeholder-gray-400 shadow-inner border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
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
            className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-300">
            Feature this job posting (premium)
          </label>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => setShowPostForm(false)}
            className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Featured Job Listings */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <Flame size={24} className="text-yellow-400 mr-2" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 pb-2 border-b-2 border-yellow-400" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                className="group relative bg-gradient-to-b from-[#1E293B]/60 to-[#0F172A]/80 backdrop-blur-sm rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl border border-yellow-400/30 hover:border-yellow-400/60"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center shadow-lg">
                  <Flame size={12} className="mr-1" /> Featured
                </div>
                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="h-14 w-14 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden mr-3 border border-gray-600 shadow-lg">
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
                        className={savedJobs.includes(job.id) ? "text-yellow-400" : ""}
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
                    <span className="text-xs text-yellow-400 font-medium">Premium position</span>
                    <ApplyButton id={job.id} />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Regular Job Listings */}
        <div className="flex items-center mb-8">
          <TrendingUp size={24} className="text-[#6366F1] mr-2" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#EC4899] pb-2 border-b-2 border-[#6366F1]" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                className="group relative bg-gradient-to-b from-[#1E293B]/60 to-[#0F172A]/80 backdrop-blur-sm rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl border border-purple-500/30 hover:border-purple-500/60"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="p-6 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="h-14 w-14 rounded-xl bg-gray-700 flex items-center justify-center overflow-hidden mr-3 border border-gray-600 shadow-lg">
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
                        className={savedJobs.includes(job.id) ? "text-purple-500" : ""}
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
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6366F1] to-[#EC4899] text-white p-3 rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-110 z-20"
          aria-label="Back to top"
        >
          <ChevronUp size={24} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Home;