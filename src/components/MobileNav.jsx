import { useState } from 'react'
import { Menu, X, Home, User, Code2, Briefcase, FolderGit2, Award, Mail, ExternalLink, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MobileNav = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const menuItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'introduce', label: 'Introduce', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'education', label: 'Education', icon: Award },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'contact', label: 'Contact', icon: Mail },
  ]

  const handleNavigate = (id) => {
    onNavigate(id)
    setIsOpen(false)
  }

  const copyPortfolioLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link", error);
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            TungTXDev Portfolio
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-white/10 text-white/90"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden fixed top-[72px] left-0 right-0 bottom-0 z-50 bg-[#1e1e1e] overflow-y-auto">
          <nav className="px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                      ? 'bg-gray-700 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="px-4 pb-6 space-y-3 border-t border-white/10 pt-6">
            {/* Share on Facebook */}
            <button
              onClick={() => {
                const url = encodeURIComponent(window.location.href)
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share on Facebook
            </button>

            {/* Copy Link */}
            <button
              onClick={copyPortfolioLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-600 text-white text-sm font-medium hover:shadow-lg transition-all"
            >
              <Pin className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Portfolio Link"}
            </button>

            {/* View CV */}
            <a
              href="https://tung-tx-dev-resume.vercel.app/TungTXDev_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-200 text-black text-sm font-medium hover:shadow-lg transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              View my CV
            </a>

            {/* Download CV */}
            <a
              href="/resume/TungTXDev_Resume.pdf"
              download="TungTXDev_Resume.pdf"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CV
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default MobileNav
