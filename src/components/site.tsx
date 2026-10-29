import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

const IMG = `${import.meta.env.BASE_URL}images/`;
export const img = (name: string) => `${IMG}${name}`;

export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = val;
    };
    set('meta[name="description"]', 'name', 'description', description);
    set('meta[property="og:title"]', 'property', 'og:title', title);
    set('meta[property="og:description"]', 'property', 'og:description', description);
    set('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    set('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  }, [title, description]);
}

export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function CompassRose({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" fill="none">
      <g className="spin-slow" style={{ transformOrigin: '200px 200px' }}>
        <circle cx="200" cy="200" r="190" stroke="#433522" />
        <circle cx="200" cy="200" r="176" stroke="#433522" strokeDasharray="1 6" />
        {Array.from({ length: 72 }).map((_, i) => (
          <line key={i} x1="200" y1="14" x2="200" y2={i % 6 === 0 ? 34 : 24} stroke="#8f713b" strokeWidth={i % 18 === 0 ? 2 : 1} transform={`rotate(${i * 5} 200 200)`} />
        ))}
        {['N', 'E', 'S', 'W'].map((d, i) => (
          <text key={d} x="200" y="58" textAnchor="middle" fill="#c79a43" fontFamily="Cormorant Garamond, serif" fontSize="22" transform={`rotate(${i * 90} 200 200)`}>{d}</text>
        ))}
        <circle cx="200" cy="200" r="120" stroke="#433522" />
      </g>
      <g className="needle">
        <path d="M200 70 L218 200 L200 330 L182 200Z" fill="#201912" stroke="#c79a43" />
        <path d="M200 70 L218 200 L182 200Z" fill="#c79a43" opacity=".85" />
        <path d="M70 200 L200 186 L330 200 L200 214Z" fill="#201912" stroke="#8f713b" />
        <circle cx="200" cy="200" r="9" fill="#130f0b" stroke="#e0b65f" strokeWidth="2" />
      </g>
    </svg>
  );
}

const NAV = [
  { href: '/', label: 'Builds' },
  { href: '/beta', label: 'Private beta' },
  { href: '/contact', label: 'Contact' },
  { href: '/support', label: 'Buy me a coffee' },
];

export function Shell({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [loc]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  return (
    <div className="dark min-h-[100dvh] flex flex-col bg-ink text-parchment">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] btn-gold">Skip to content</a>
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-ink/92 backdrop-blur border-b border-line' : 'border-b border-transparent'}`}>
        <div className="mx-auto max-w-7xl px-5 md:px-8 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group" data-testid="link-home">
            <img src={img('icon.png')} alt="" className="h-9 w-9 rounded-[6px] ring-1 ring-line transition-transform duration-500 group-hover:rotate-[20deg]" />
            <span className="font-serif text-[1.35rem] font-semibold text-strong tracking-tight">ESO Companion</span>
          </Link>
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
            {NAV.map((n) => {
              const active = loc === n.href;
              return (
                <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined} data-testid={`link-nav-${n.href.slice(1) || 'features'}`}
                  className={`relative text-[.88rem] py-2 transition-colors ${active ? 'text-strong' : 'text-dim hover:text-parchment'}`}>
                  {n.label}
                  <span className={`absolute left-0 right-0 -bottom-0.5 h-px bg-gold origin-left transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                </Link>
              );
            })}
          </nav>
          <button className="lg:hidden h-11 w-11 grid place-items-center border border-line text-parchment hover:border-gold transition-colors" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)} data-testid="button-menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div id="mobile-nav" className={`lg:hidden fixed inset-0 top-[72px] z-40 bg-ink transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden={!open}>
        <nav aria-label="Mobile" className="px-6 pt-6 ledger-lines h-full">
          <p className="overline mb-4">Menu</p>
          {NAV.map((n, i) => (
            <Link key={n.href} href={n.href} tabIndex={open ? 0 : -1} data-testid={`link-mobile-${n.href.slice(1) || 'features'}`}
              className={`flex items-baseline gap-4 py-4 border-b border-line transition-transform duration-500 ${open ? 'translate-x-0' : '-translate-x-4'}`}
              style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="font-mono text-xs text-goldsoft">{String(i + 1).padStart(2, '0')}</span>
              <span className={`font-serif text-3xl ${loc === n.href ? 'text-brass' : 'text-strong'}`}>{n.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <main id="main" className="flex-1">{children}</main>

      <footer className="border-t border-line mt-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={img('icon.png')} alt="" className="h-10 w-10 rounded-[6px] ring-1 ring-line" />
              <span className="font-serif text-2xl text-strong">ESO Companion</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-dim leading-relaxed">A fan-made phone app for planning Elder Scrolls Online builds from gear you already have. Not affiliated with or endorsed by ZeniMax Online Studios or Bethesda.</p>
          </div>
          <div>
            <p className="overline mb-4">Pages</p>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}><Link href={n.href} className="link-u text-parchment">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="overline mb-4">Credits</p>
            <p className="text-xs text-dim leading-relaxed">Equipment icons in the app screenshots are from game-icons.net by Lorc, Delapouite and Lucas, used under <a className="link-u text-parchment" href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer">CC BY 3.0</a>. Elder Scrolls Online is a trademark of its respective owners.</p>
          </div>
        </div>
        <div className="rule" />
        <p className="mx-auto max-w-7xl px-5 md:px-8 py-5 font-mono text-[11px] tracking-widest uppercase text-goldsoft">In private beta. Platform testing is ongoing.</p>
      </footer>
    </div>
  );
}

export function PageHead({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <CompassRose className="absolute -right-32 -top-24 w-[520px] opacity-25 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-16 pb-14 md:pt-24 md:pb-20">
        <p className="overline rise">{kicker}</p>
        <h1 className="display mt-5 text-5xl sm:text-6xl md:text-7xl max-w-4xl rise" style={{ animationDelay: '.08s' }}>{title}</h1>
        {children && <div className="mt-6 max-w-2xl text-lg text-dim leading-relaxed rise" style={{ animationDelay: '.16s' }}>{children}</div>}
      </div>
    </section>
  );
}

