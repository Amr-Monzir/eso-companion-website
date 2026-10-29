import { useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Play, ExternalLink, Package, Layers, Hammer, Swords, QrCode } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { CompassRose, Reveal, img, useSeo } from '@/components/site';

const shot = (n: string) => img(`approved/${n}`);

function Phone({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={className}>
      <div className="rounded-[30px] border border-line bg-panel p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]">
        <img src={shot(src)} alt={alt} width={461} height={1024} className="block w-full h-auto aspect-[9/20] rounded-[24px] bg-ink" loading="lazy" />
      </div>
    </figure>
  );
}

function Video() {
  const id = siteConfig.videoId;
  const [play, setPlay] = useState(false);
  const watch = `https://www.youtube.com/watch?v=${id}`;
  return (
    <div>
      <div className="relative aspect-video border border-line bg-panel overflow-hidden">
        {play ? (
          <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title="ESO Companion demo video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen data-testid="video-embed" />
        ) : (
          <button onClick={() => setPlay(true)} className="group absolute inset-0 w-full h-full text-left" aria-label="Play the ESO Companion demo video. This loads YouTube." data-testid="button-play-video">
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 transition-all duration-700 group-hover:opacity-55 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="h-20 w-20 rounded-full border border-gold bg-ink/70 grid place-items-center transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110">
                <Play className="text-brass ml-1" size={30} fill="currentColor" />
              </span>
            </div>
            <span className="absolute bottom-5 left-5 overline">Press play to load the video from YouTube</span>
          </button>
        )}
      </div>
      <p className="mt-3 text-sm text-dim">Video not loading? <a href={watch} target="_blank" rel="noreferrer" className="link-u text-parchment inline-flex items-center gap-1" data-testid="link-youtube">Watch on YouTube <ExternalLink size={13} /></a></p>
    </div>
  );
}

const STATES = [
  { k: 'Owned', c: '#c79a43', d: 'The piece is in your saved inventory on some character, bank or bag.' },
  { k: 'Collected', c: '#6f9fa8', d: 'You unlocked it in the set collection. You can reconstruct it, but you don\'t hold it yet.' },
  { k: 'Craftable', c: '#b6a1d8', d: 'It\'s a crafted set piece you can make at a station.' },
  { k: 'Missing', c: '#dc7766', d: 'Nothing in your saved data covers this slot yet.' },
];

const BAR = [
  { k: 'Owned', n: 6, c: '#c79a43' },
  { k: 'Collected', n: 1, c: '#6f9fa8' },
  { k: 'Craftable', n: 1, c: '#b6a1d8' },
  { k: 'Missing', n: 6, c: '#dc7766' },
];

export default function Home() {
  useSeo('ESO Companion: plan builds from the gear you have', 'Plan Elder Scrolls Online builds from your saved inventory and set collection. See which pieces you own, have collected, can craft or still need. Private beta.');
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <CompassRose className="absolute left-1/2 top-10 w-[760px] max-w-none -translate-x-[15%] opacity-25 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-14 md:pt-20 pb-24 grid gap-14 lg:grid-cols-[1.1fr_.9fr] items-center">
          <div>
            <p className="overline rise">Elder Scrolls Online build planner</p>
            <h1 className="display mt-6 text-[3.1rem] sm:text-7xl xl:text-[5.8rem] rise" style={{ animationDelay: '.08s' }}>
              Plan a build from the gear <em className="text-brass font-medium">you already have.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-dim leading-relaxed rise" style={{ animationDelay: '.16s' }}>
              Pick a set piece for each slot from your inventory and set collection. The build page then shows what you own, what you've collected, what you can craft and what's still missing.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 rise" style={{ animationDelay: '.24s' }}>
              <Link href="/beta" className="btn-gold" data-testid="link-hero-beta">Join the private beta <ArrowRight size={16} /></Link>
              <a href="#demo" className="btn-ghost" data-testid="link-watch-demo"><Play size={16} /> Watch the demo</a>
            </div>
            <div className="mt-12 max-w-lg rise" style={{ animationDelay: '.32s' }} aria-label="Example build: 6 owned, 1 collected, 1 craftable, 6 missing">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-[10px] tracking-widest uppercase text-dim">Example: Brute Force Tank</span>
                <span className="font-serif text-2xl text-brass">43% owned</span>
              </div>
              <div className="mt-3 flex h-2 gap-[2px]" aria-hidden="true">
                {BAR.map((b) => <span key={b.k} className="block h-full origin-left rise" style={{ flexGrow: b.n, background: b.c }} />)}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-dim" aria-hidden="true">
                {BAR.map((b) => <span key={b.k}><b className="text-strong font-semibold">{b.n}</b> {b.k}</span>)}
              </div>
            </div>
          </div>
          <div className="relative h-[540px] sm:h-[640px] rise" style={{ animationDelay: '.2s' }}>
            <Phone src="builds_list.png" alt="ESO Companion Builds tab listing saved builds" className="absolute left-[2%] top-14 w-[50%] -rotate-[5deg] opacity-90 transition-transform duration-700 hover:-rotate-2" />
            <Phone src="build_top.png" alt="Brute Force Tank build at 43 percent owned, with head, shoulders, chest and hands assigned and the waist slot missing" className="absolute right-[2%] top-0 w-[54%] rotate-[3deg] transition-transform duration-700 hover:rotate-1" />
          </div>
        </div>
        <div className="rule-double mx-5 md:mx-8" />
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-4xl px-5 md:px-8 py-24 md:py-28">
        <Reveal>
          <p className="overline">Why this exists</p>
          <p className="display mt-6 text-3xl sm:text-5xl leading-tight font-medium">
            Before you farm another set, check what you already have across your characters, bank and set collection.
          </p>
          <p className="mt-6 max-w-2xl text-dim leading-relaxed">You choose the build. The app checks each slot against your saved data and tells you where the piece comes from.</p>
        </Reveal>
      </section>

      {/* WORKFLOW */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 space-y-28 md:space-y-36">
        <Step num="01" icon={<Swords size={18} />} title="Start a build" shots={[['builds_list1.png', 'Brute Force Tank build with its first two owned pieces assigned']]}>
          Name the build and choose the character it's for. Every slot starts empty and marked Missing. The app doesn't suggest builds or pick sets for you. You decide what goes in.
        </Step>
        <Step flip num="02" icon={<Layers size={18} />} title="Assign gear you've collected or own" shots={[['assign_a.png', 'Pillar of Nirn pieces in the collection, with a sheet to choose a build requirement'], ['assign_b.png', 'Assigning a collected item to a build slot']]}>
          Open a set in Collection or an item in Inventory and send it to a build slot. A collected piece is marked Collected. A piece sitting in a bag is marked Owned.
        </Step>
        <Step num="03" icon={<Hammer size={18} />} title="Fill gaps with crafted sets" shots={[['pick_craft.png', 'Searching crafted set pieces for the legs slot, showing Kagrenac\'s Hope greaves marked Craftable']]}>
          For an empty slot, search for a compatible target. Crafted set pieces show as Craftable, so you can see which gaps a station can cover.
        </Step>
        <Step flip num="04" icon={<Package size={18} />} title="Check what's left" shots={[['build_top.png', 'Build readiness bar at 43 percent owned'], ['build_s4.png', 'More of the build equipment list']]}>
          The readiness bar counts each state and splits armor weight. What's left marked Missing is your farming list.
          <ul className="mt-6 grid sm:grid-cols-2 gap-px bg-line border border-line">
            {STATES.map((r) => (
              <li key={r.k} className="bg-ink p-4 group" data-testid={`state-${r.k.toLowerCase()}`}>
                <span className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase" style={{ color: r.c }}>
                  <span className="h-2 w-2 rotate-45 transition-transform duration-300 group-hover:rotate-[225deg]" style={{ background: r.c }} />{r.k}
                </span>
                <span className="block mt-2 text-sm text-dim">{r.d}</span>
              </li>
            ))}
          </ul>
        </Step>
      </section>

      {/* SOURCES */}
      <section className="mt-32 border-y border-line bg-panel/60">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-20">
          <Reveal>
            <p className="overline">Where the build data comes from</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl max-w-3xl">Inventory and Collection are where you find the pieces.</h2>
          </Reveal>
          <div className="mt-14 grid gap-12 md:grid-cols-3 items-start">
            <Source shot="inv_top.png" alt="Inventory tab with item search" title="Inventory" delay={0}>
              Search items across characters and storage. Each result shows where it is, its trait and its enchantment.
            </Source>
            <Source shot="coll_exp0.png" alt="Collection tab showing set pieces" title="Collection" delay={100}>
              See which set pieces you've unlocked. An unlock isn't an item in your bag, so these show as Collected.
            </Source>
            <Source shot="vault.png" alt="Vault tab with pairing details" title="Vault" icon={<QrCode size={14} />} delay={200}>
              Your data is stored in a private Vault. You pair your computer by QR code or a manual code and approve it on the phone. No ESO login. The Vault isn't end-to-end encrypted.
            </Source>
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="demo" className="mx-auto max-w-6xl px-5 md:px-8 py-24 md:py-32 scroll-mt-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="overline">Demo</p>
              <h2 className="display mt-3 text-4xl sm:text-6xl">See it in use</h2>
            </div>
            <p className="max-w-sm text-sm text-dim">The player only loads when you press play, using YouTube's privacy-enhanced mode.</p>
          </div>
          <Video />
        </Reveal>
      </section>

      {/* LIMITS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-10 border border-line p-7 md:p-12 ledger-lines">
            <div>
              <p className="overline">Before you sign up</p>
              <h2 className="display mt-3 text-4xl">What to expect</h2>
            </div>
            <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6 text-sm">
              {[
                ['Saved data, not live', 'Builds are checked against your last save and sync. Nothing updates in the background.'],
                ['Platforms', 'All platforms are planned. Each one still needs compatibility testing.'],
                ['No game login', 'The app never asks for your ESO account or password.'],
                ['Plans only', 'A build doesn\'t equip a character or reserve items.'],
                ['Achievements', 'Not in the app yet.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="font-serif text-xl text-strong">{t}</dt>
                  <dd className="mt-1 text-dim leading-relaxed">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 md:px-8 pt-28 text-center">
        <Reveal>
          <img src={img('icon.png')} alt="ESO Companion logo" className="mx-auto h-20 w-20 rounded-[14px] ring-1 ring-line" />
          <h2 className="display mt-8 text-4xl sm:text-6xl">Want to try it early?</h2>
          <p className="mt-5 text-dim">The app is in private beta. Leave your email and we'll contact you about it. We only keep the address.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/beta" className="btn-gold" data-testid="link-cta-beta">Join the private beta <ArrowRight size={16} /></Link>
            <Link href="/contact" className="btn-ghost" data-testid="link-cta-contact">Ask a question</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Step({ num, icon, title, children, shots, flip }: { num: string; icon: ReactNode; title: string; children: ReactNode; shots: [string, string][]; flip?: boolean }) {
  return (
    <article className="grid gap-12 lg:grid-cols-2 items-center">
      <Reveal className={flip ? 'lg:order-2' : ''}>
        <div className="flex items-center gap-4">
          <span className="font-serif text-7xl text-line leading-none">{num}</span>
          <span className="h-10 w-10 grid place-items-center border border-line text-gold">{icon}</span>
        </div>
        <h2 className="display mt-6 text-4xl sm:text-5xl">{title}</h2>
        <div className="mt-5 text-dim leading-relaxed text-[1.02rem]">{children}</div>
      </Reveal>
      <Reveal delay={150} className={`relative flex justify-center gap-6 ${flip ? 'lg:order-1' : ''}`}>
        <div className="absolute inset-x-6 top-1/2 h-px bg-line" />
        {shots.map(([s, a], i) => (
          <Phone key={s} src={s} alt={a} className={`w-[62%] sm:w-[44%] max-w-[280px] transition-transform duration-500 hover:-translate-y-2 ${i === 1 ? 'hidden sm:block mt-16' : ''}`} />
        ))}
      </Reveal>
    </article>
  );
}

function Source({ shot: s, alt, title, children, icon, delay }: { shot: string; alt: string; title: string; children: ReactNode; icon?: ReactNode; delay: number }) {
  return (
    <Reveal delay={delay}>
      <Phone src={s} alt={alt} className="w-[70%] max-w-[240px] mx-auto transition-transform duration-500 hover:-translate-y-2" />
      <h3 className="mt-8 font-serif text-3xl text-strong flex items-center gap-2">{icon}{title}</h3>
      <p className="mt-2 text-sm text-dim leading-relaxed">{children}</p>
    </Reveal>
  );
}
