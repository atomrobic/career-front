import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, Building, FileText, Bell, Settings, LogOut, Search, Menu, X, ChevronDown, Calendar, DollarSign } from 'lucide-react';

// Mock data - in a real app, this would come from your Django API
const mockData = {
  userCount: 1254,
  companyCount: 87,
  jobCount: 342,
  newUsersToday: 24,
  newJobsToday: 15,
  
  users: [
    { id: 1, username: "john_doe", email: "john@example.com", role: "user", joined: "2024-01-15" },
    { id: 2, username: "sarah_smith", email: "sarah@example.com", role: "company_staff", joined: "2024-02-20" },
    { id: 3, username: "admin_user", email: "admin@example.com", role: "admin", joined: "2023-11-05" },
    { id: 4, username: "tech_recruiter", email: "recruiter@techcorp.com", role: "company_staff", joined: "2024-03-10" },
    { id: 5, username: "job_seeker", email: "seeker@gmail.com", role: "user", joined: "2024-04-01" },
  ],
  
  companies: [
    { id: 1, name: "Tech Solutions Inc", location: "San Francisco, CA", jobs: 12 },
    { id: 2, name: "Global Finance", location: "New York, NY", jobs: 8 },
    { id: 3, name: "Creative Design Studio", location: "Austin, TX", jobs: 5 },
    { id: 4, name: "Health Innovations", location: "Boston, MA", jobs: 9 },
    { id: 5, name: "Green Energy Co", location: "Seattle, WA", jobs: 4 }
  ],
  
  recentJobs: [
    { id: 1, title: "Senior Frontend Developer", company: "Tech Solutions Inc", category: "IT", applications: 18 },
    { id: 2, title: "Marketing Manager", company: "Global Finance", category: "Marketing", applications: 24 },
    { id: 3, title: "UI/UX Designer", company: "Creative Design Studio", category: "Design", applications: 12 },
    { id: 4, title: "Data Scientist", company: "Health Innovations", category: "IT", applications: 8 },
    { id: 5, title: "Project Manager", company: "Green Energy Co", category: "Management", applications: 15 }
  ],
  
  monthlyStats: [
    { month: "Jan", users: 125, jobs: 42, applications: 380 },
    { month: "Feb", users: 148, jobs: 56, applications: 450 },
    { month: "Mar", users: 162, jobs: 63, applications: 520 },
    { month: "Apr", users: 180, jobs: 59, applications: 490 },
    { month: "May", users: 210, jobs: 68, applications: 550 },
    { month: "Jun", users: 205, jobs: 72, applications: 610 }
  ],
  
  jobsByCategory: [
    { name: "IT", jobs: 120 },
    { name: "Marketing", jobs: 65 },
    { name: "Design", jobs: 48 },
    { name: "Management", jobs: 56 },
    { name: "Finance", jobs: 39 },
    { name: "Healthcare", jobs: 42 }
  ]
};

// Main Dashboard component
const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-indigo-800 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          {isSidebarOpen && <h1 className="text-xl font-bold">JobPortal Admin</h1>}
          <button className="p-2 rounded hover:bg-indigo-700" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem 
              icon={<FileText size={20} />} 
              title="Dashboard" 
              isActive={activeTab === 'dashboard'} 
              isExpanded={isSidebarOpen} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <NavItem 
              icon={<Users size={20} />} 
              title="Users" 
              isActive={activeTab === 'users'} 
              isExpanded={isSidebarOpen} 
              onClick={() => setActiveTab('users')} 
            />
            <NavItem 
              icon={<Building size={20} />} 
              title="Companies" 
              isActive={activeTab === 'companies'} 
              isExpanded={isSidebarOpen} 
              onClick={() => setActiveTab('companies')} 
            />
            <NavItem 
              icon={<Briefcase size={20} />} 
              title="Jobs" 
              isActive={activeTab === 'jobs'} 
              isExpanded={isSidebarOpen} 
              onClick={() => setActiveTab('jobs')} 
            />
            <NavItem 
              icon={<Settings size={20} />} 
              title="Settings" 
              isActive={activeTab === 'settings'} 
              isExpanded={isSidebarOpen} 
              onClick={() => setActiveTab('settings')} 
            />
            <NavItem 
              icon={<LogOut size={20} />} 
              title="Logout" 
              isActive={false} 
              isExpanded={isSidebarOpen} 
              onClick={() => alert('Logout clicked')} 
            />
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center rounded-lg bg-gray-100 p-2">
              <Search size={20} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="ml-2 bg-transparent border-none outline-none"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center">
                <img 
                  src="/api/placeholder/32/32" 
                  alt="Admin" 
                  className="w-8 h-8 rounded-full" 
                />
                <span className="ml-2 font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-64px)]">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'users' && <UsersContent />}
          {activeTab === 'companies' && <CompaniesContent />}
          {activeTab === 'jobs' && <JobsContent />}
          {activeTab === 'settings' && <SettingsContent />}
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ icon, title, isActive, isExpanded, onClick }) => {
  return (
    <li 
      className={`flex items-center p-2 rounded-lg cursor-pointer transition ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      {isExpanded && <span className="ml-3">{title}</span>}
    </li>
  );
};

// Dashboard Content
const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={mockData.userCount} 
          icon={<Users size={24} className="text-blue-500" />} 
          change={"+12%"} 
          changeType="positive" 
        />
        <StatCard 
          title="Companies" 
          value={mockData.companyCount} 
          icon={<Building size={24} className="text-green-500" />} 
          change={"+5%"} 
          changeType="positive" 
        />
        <StatCard 
          title="Active Jobs" 
          value={mockData.jobCount} 
          icon={<Briefcase size={24} className="text-purple-500" />} 
          change={"+8%"} 
          changeType="positive" 
        />
        <StatCard 
          title="New Users Today" 
          value={mockData.newUsersToday} 
          icon={<Users size={24} className="text-orange-500" />} 
          change={"+3"} 
          changeType="neutral" 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" name="New Users" />
                <Line type="monotone" dataKey="jobs" stroke="#10B981" name="New Jobs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Jobs by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.jobsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#8B5CF6" name="Jobs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Jobs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Jobs</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Applications</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockData.recentJobs.map(job => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4">{job.company}</td>
                  <td className="px-6 py-4">{job.category}</td>
                  <td className="px-6 py-4">{job.applications}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Users Content
const UsersContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add New User</button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center rounded-lg bg-gray-100 p-2">
            <Search size={20} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="ml-2 bg-transparent border-none outline-none"
            />
          </div>
          <div className="flex space-x-2">
            <select className="border rounded p-2">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Company Staff</option>
              <option>User</option>
            </select>
            <select className="border rounded p-2">
              <option>Sort By: Newest</option>
              <option>Sort By: Oldest</option>
              <option>Sort By: A-Z</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Username</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockData.users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                      user.role === 'company_staff' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.joined}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing 1-5 of 1254 users
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 border rounded bg-indigo-600 text-white">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Companies Content
const CompaniesContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Companies Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Add New Company</button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockData.companies.map(company => (
            <div key={company.id} className="border rounded-lg overflow-hidden">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                <Building size={48} className="text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{company.name}</h3>
                <p className="text-gray-500 text-sm flex items-center mt-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {company.location}
                </p>
                <p className="text-gray-500 text-sm flex items-center mt-1">
                  <Briefcase size={16} className="mr-1" />
                  {company.jobs} Active Jobs
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button className="text-blue-600 hover:text-blue-900">View</button>
                  <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Jobs Content
const JobsContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Jobs Management</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Post New Job</button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
          <div className="flex items-center rounded-lg bg-gray-100 p-2 w-full md:w-auto">
            <Search size={20} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="ml-2 bg-transparent border-none outline-none w-full"
            />
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <select className="border rounded p-2 w-full md:w-auto">
              <option>All Categories</option>
              <option>IT</option>
              <option>Marketing</option>
              <option>Design</option>
              <option>Management</option>
            </select>
            <select className="border rounded p-2 w-full md:w-auto">
              <option>All Locations</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Job Title</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Applications</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockData.recentJobs.map((job, index) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4">{job.company}</td>
                  <td className="px-6 py-4">{job.category}</td>
                  <td className="px-6 py-4">{index % 2 === 0 ? "Remote" : "On-site"}</td>
                  <td className="px-6 py-4">{job.applications}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      index % 3 === 0 ? 'bg-green-100 text-green-800' : 
                      index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Draft' : 'Reviewing'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Settings Content
const SettingsContent = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              className="w-full border rounded p-2"
              defaultValue="JobPortal Admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              className="w-full border rounded p-2"
              defaultValue="admin@jobportal.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select className="w-full border rounded p-2">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenance"
              className="rounded text-indigo-600"
              defaultChecked={false}
            />
            <label htmlFor="maintenance" className="ml-2 text-sm text-gray-700">
              Enable Maintenance Mode
            </label>
          </div>
          
          <div className="pt-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">User Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default User Role
            </label>
            <select className="w-full border rounded p-2">
              <option>User</option>
              <option>Company Staff</option>
              <option>Admin</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email_verification"
              className="rounded text-indigo-600"
              defaultChecked={true}
            />
            <label htmlFor="email_verification" className="ml-2 text-sm text-gray-700">
              Require Email Verification
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="public_profiles"
              className="rounded text-indigo-600"
              defaultChecked={true}
            />
            <label htmlFor="public_profiles" className="ml-2 text-sm text-gray-700">
              Allow Public Profiles
            </label>
          </div>
          
          <div className="pt-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, change, changeType }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm ${
          changeType === 'positive' ? 'text-green-500' : 
          changeType === 'negative' ? 'text-red-500' : 
          'text-gray-500'
        }`}>
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-1">since last month</span>
      </div>
    </div>
  );
};

export default Dashboard;