import { Link } from 'wouter';
import { Coffee, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { PageHead, Reveal, useSeo } from '@/components/site';

function SupportAction() {
  if (siteConfig.supportUrl)
    return (
      <div>
        <a href={siteConfig.supportUrl} target="_blank" rel="noopener noreferrer" className="btn-gold text-base" data-testid="link-buy-coffee"><Coffee size={18} /> Buy me a coffee <ExternalLink size={14} /></a>
        <p className="mt-3 text-xs text-dim">Opens the developer's page on another site. Payment happens there, and this site never sees card details.</p>
      </div>
    );
  return (
    <div className="border border-dashed border-goldsoft p-6" data-testid="status-support-disabled">
      <p className="overline">Not open yet</p>
      <p className="mt-3 text-dim leading-relaxed">Tips aren't set up yet, so there's nothing to pay. If a tip page is added later, the button will appear here.</p>
      <button disabled className="btn-gold mt-5 opacity-40 cursor-not-allowed" aria-disabled="true"><Coffee size={18} /> Buy me a coffee</button>
    </div>
  );
}

export default function Support() {
  useSeo('Buy me a coffee: ESO Companion', 'Optional tips for ESO Companion, a fan-made build planner for Elder Scrolls Online.');
  return (
    <>
      <PageHead kicker="Support" title={<>Buy me a <em className="text-brass font-medium">coffee</em>.</>}>
        Tips are optional. The app works the same either way.
      </PageHead>
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid gap-14 lg:grid-cols-[1fr_1fr] items-start">
        <Reveal>
          <div className="border border-line bg-panel p-8 md:p-10 relative overflow-hidden">
            <Coffee className="absolute -right-6 -bottom-6 text-line" size={180} strokeWidth={0.8} aria-hidden="true" />
            <div className="relative">
              <h2 className="display text-4xl">Why tips help</h2>
              <p className="mt-4 text-dim leading-relaxed max-w-md">ESO Companion is built in spare time by one player who got tired of logging into four alts to check whether a build was possible. Tips pay for hosting the Vault.</p>
              <div className="mt-8"><SupportAction /></div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="overline">Other ways to help</p>
          <ul className="mt-5">
            {[
              ['Tell a guildmate', 'If someone in your guild plans builds, mention it.'],
              ['Report what breaks', 'A bug report with the steps you took is the most useful thing you can send.'],
              ['Share an idea', "Tell me what's missing from builds, or what you'd want from Achievements."],
            ].map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] py-5 border-b border-line group">
                <span className="font-serif text-2xl text-goldsoft group-hover:text-brass transition-colors">{['i', 'ii', 'iii'][i]}</span>
                <div><p className="font-serif text-2xl text-strong">{t}</p><p className="text-sm text-dim mt-1">{d}</p></div>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn-ghost mt-8" data-testid="link-support-contact">Go to contact</Link>
        </Reveal>
      </div>
    </>
  );
}
