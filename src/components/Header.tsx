import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Logo from './Logo';
import homeIconSrc from '../assets/icon-home.svg';
import { setAuthenticated } from '../auth';

type Props = { onServiceCatalogue?: () => void; onHome?: () => void };

export default function Header({ onServiceCatalogue, onHome }: Props) {
  const navigate = useNavigate();
  const { agent } = useParams<{ agent?: string }>();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const goHome = () => {
    if (onHome) onHome();
    else navigate(`/landing/${agent ?? 'trader'}`);
  };

  useEffect(() => {
    if (!profileOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-[#0e1b3d] h-[88px] w-full shadow-[0_2px_32px_0_rgba(0,0,0,0.08)] sticky top-0 z-40">
      <div className="w-full h-full px-[60px] flex items-center justify-between gap-6">
        <Link to="/customer-type" className="flex-shrink-0">
          <Logo height={48} white />
        </Link>

        <nav className="hidden lg:flex items-center gap-[20px] text-white text-[15px]">
          <button onClick={goHome} className="hover:opacity-80 size-[24px]" aria-label="Home">
            <img src={homeIconSrc} alt="Home" className="size-[24px]" />
          </button>
          <button className="hover:opacity-80" onClick={onServiceCatalogue}>Service Catalogue</button>
          <button className="hover:opacity-80 flex items-center gap-1">
            Trade Service Providers
            <svg viewBox="0 0 16 16" className="size-[14px]" fill="currentColor"><path d="M4 6l4 4 4-4z" /></svg>
          </button>
          <button className="hover:opacity-80">Take a Tour</button>
          <button className="hover:opacity-80">Knowledge Hub</button>
        </nav>

        <div className="flex items-center gap-[10px]">
          <button className="size-[40px] rounded-full border border-[rgba(213,221,251,0.4)] flex items-center justify-center text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
          <div className="relative">
            <button className="size-[40px] rounded-full border border-[rgba(213,221,251,0.4)] flex items-center justify-center text-white hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
            </button>
            <span className="absolute -top-1 -right-1 bg-[#dc3545] border-2 border-[#051937] rounded-full size-[20px] text-white text-[10px] font-medium flex items-center justify-center">5</span>
          </div>
          <button className="size-[40px] rounded-full border border-[rgba(213,221,251,0.4)] flex items-center justify-center text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="4" r="2" /><path d="M19 13l-2-2-5 1-5-1-2 2 4 2v8h2v-5h2v5h2v-8z" /></svg>
          </button>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="bg-[#455174] rounded-[8px] h-[44px] px-2 flex items-center gap-2 hover:bg-[#3b4660] transition-colors"
              aria-label="Profile menu"
              aria-expanded={profileOpen}
            >
              <div className="size-[36px] rounded-full bg-white/20 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z" /></svg>
              </div>
              <svg viewBox="0 0 16 16" className={`size-[14px] text-white transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="currentColor"><path d="M4 6l4 4 4-4z" /></svg>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-[52px] bg-white rounded-[8px] py-[4px] overflow-hidden z-[80]" style={{ minWidth: 180, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.18)', border: '1px solid #f0f0f5' }}>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] group transition-colors"
                  style={{ fontFamily: "'Dubai', sans-serif" }}
                >
                  <svg viewBox="0 0 24 24" className="size-[18px] text-[#1360d2] group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  <span className="text-[14px] text-[#111838] group-hover:text-white leading-[20px]">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
