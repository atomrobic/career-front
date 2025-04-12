const Footer = () => {
    return (
      <footer className="relative bg-gradient-to-r from-purple-900 to-indigo-500 mt-8">
        {/* Diagonal top edge */}
        <div className="absolute top-0 left-0 w-full h-6 overflow-hidden transform -translate-y-6">
          <div className="w-full h-16 transform -rotate-1 origin-bottom-left bg-black"></div>
        </div>
  
        {/* Footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-400">
                NEXUS
              </span>
              <p className="text-gray-300 text-sm">
                Discover your next career move with NEXUS. We connect top talent with leading companies worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>
  
            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Categories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
              </ul>
            </div>
  
            {/* Column 3: Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
  
            {/* Column 4: Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Subscribe</h3>
              <p className="text-gray-300 text-sm">
                Get the latest job opportunities and career tips delivered to your inbox.
              </p>
              <form className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
  
          {/* Footer bottom */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} NEXUS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;