import { useState } from "react"
import { ExternalLink, Pin } from "lucide-react"

const Sidebar = ({ activeSection, onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const menuItems = [
    { id: 'hero', label: 'Home' },
    { id: 'introduce', label: 'Introduce' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ]

  const copyPortfolioLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e1e1e]/95 backdrop-blur-sm border-b border-white/10">

      <div className="max-w-screen-2xl mx-auto py-4 px-8">

        <div className="flex items-center justify-between">
          {/* Logo/Brand */}

          <div className="flex items-center gap-4 ml-20">
            <img
              src="/images/alf_logo_transparent.png"
              alt="alf_logo_transparent"
              className="w-9 h-9 object-contain scale-500 "
            />
            {/* <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              </div>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap">
              Tung TXDev Portfolio
            </h1> */}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gray-700 rounded-lg"></div>
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Share on Facebook Button */}
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href)
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-black text-sm font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share
            </button>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-black text-sm font-medium hover:shadow-lg hover:shadow-orange-500/40 transition-all hover:scale-105"
              onClick={copyPortfolioLink}
            >
              <Pin className="h-4 w-4 sm:h-5 sm:w-5" />
              {copied ? "Copied" : "Copy Link"}
            </button>

            <a
              href="https://tung-tx-dev-resume.vercel.app/TungTXDev_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-black text-sm font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
              View my CV
            </a>

            {/* Download CV Button */}
            <a
              href="/resume/TungTXDev_Resume.pdf"
              download="TungTXDev_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Sidebar
