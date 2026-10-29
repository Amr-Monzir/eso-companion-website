import { useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { AlertTriangle, Check, Mail, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { useHostedForm } from '@/lib/use-hosted-form';
import { PageHead, useSeo } from '@/components/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [done, setDone] = useState<string | null>(null);
  const m = useHostedForm(siteConfig.betaEndpoint);

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e: typeof errors = {};
    const v = email.trim();
    if (!EMAIL_RE.test(v) || v.length > 254) e.email = 'Enter a valid email address.';
    if (!consent) e.consent = 'Tick the box to agree before you sign up.';
    setErrors(e);
    if (e.email) return document.getElementById('f-beta-email')?.focus();
    if (e.consent) return document.getElementById('f-beta-consent')?.focus();
    const accepted = await m.submit({
      email: v,
      website,
      form_type: 'private_beta',
      _subject: 'ESO Companion private beta signup',
    });
    if (accepted) setDone("Your email has been submitted for private beta contact. We won't use it for anything else.");
  };

  if (done)
    return (
      <div role="status" aria-live="polite" className="border border-gold/60 bg-panel p-8 rise" data-testid="status-beta-success">
        <span className="h-12 w-12 grid place-items-center border border-gold text-brass"><Check size={22} /></span>
        <h2 className="display text-4xl mt-6">Signup submitted.</h2>
        <p className="mt-4 text-dim leading-relaxed">{done}</p>
        <p className="mt-3 text-sm text-dim">We'll write when there's a beta place for you. There's no fixed date.</p>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="space-y-6" data-testid="form-beta">
      {!siteConfig.betaEndpoint && <p role="status" className="border border-goldsoft p-4 text-sm text-dim" data-testid="status-beta-unconfigured">Beta signup is not connected yet. We cannot accept email addresses at the moment. Please check back later.</p>}
      <div>
        <label htmlFor="f-beta-email" className="overline block mb-2">Email</label>
        <input id="f-beta-email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-beta-email' : undefined} data-testid="input-beta-email" />
        {errors.email && <p id="e-beta-email" className="mt-2 text-sm text-danger">{errors.email}</p>}
      </div>
      <div>
        <label className="flex gap-3 items-start cursor-pointer text-sm leading-relaxed">
          <input id="f-beta-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-1 h-4 w-4 accent-[#c79a43] shrink-0" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'e-beta-consent' : undefined} data-testid="checkbox-beta-consent" />
          <span>I agree that my email address can be used to contact me about the ESO Companion private beta, and for nothing else. The signup list will be deleted when the app is released.</span>
        </label>
        {errors.consent && <p id="e-beta-consent" className="mt-2 text-sm text-danger">{errors.consent}</p>}
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="f-beta-website">Website</label>
        <input id="f-beta-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={200} />
      </div>
      <div aria-live="assertive">
        {m.error && <div role="alert" className="flex gap-3 border border-danger/50 p-4 text-sm" data-testid="status-beta-error"><AlertTriangle size={17} className="text-danger shrink-0" /><span>{m.error}</span></div>}
      </div>
      <button type="submit" disabled={m.isPending || !siteConfig.betaEndpoint} className="btn-gold disabled:opacity-60 disabled:pointer-events-none" data-testid="button-join-beta">
        {m.isPending ? 'Signing up...' : <>Join the private beta <Mail size={15} /></>}
      </button>
    </form>
  );
}

function SignupArea() {
  if (!siteConfig.betaOpen)
    return (
      <div className="border border-dashed border-goldsoft p-6" role="status" data-testid="status-beta-closed">
        <p className="overline">Signup closed</p>
        <p className="mt-3 text-dim leading-relaxed">Private beta signup is closed. You can still <Link href="/contact" className="link-u text-parchment">send a message</Link>.</p>
      </div>
    );
  return <SignupForm />;
}

export default function Beta() {
  useSeo('Private beta: ESO Companion', 'Sign up for the ESO Companion private beta. Your email is used only for beta contact, and the beta list will be deleted at release.');
  return (
    <>
      <PageHead kicker="Private beta" title={<>Try the build planner <em className="text-brass font-medium">before release.</em></>}>
        ESO Companion isn't publicly available yet. Leave your email if you'd like to be contacted about the private beta.
      </PageHead>
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid gap-12 lg:grid-cols-[1.2fr_.8fr] items-start">
        <section aria-labelledby="signup-h">
          <h2 id="signup-h" className="sr-only">Sign up</h2>
          <SignupArea />
        </section>
        <aside className="space-y-6">
          <div>
            <div className="border border-gold/50 bg-panel p-6" data-testid="text-storage-policy">
              <p className="flex items-center gap-2 text-brass font-medium"><ShieldCheck size={17} /> How we use your email</p>
              <ul className="mt-4 space-y-2 text-sm text-dim list-[square] pl-5 marker:text-gold">
                <li>We ask only for your email address.</li>
                <li>It's used only to contact you about the private beta. No newsletters, marketing or anything else.</li>
                <li>The whole signup list is deleted when the app is released.</li>
              </ul>
              <p className="mt-4 text-xs text-dim leading-relaxed">Formspree processes the signup and forwards it to the developer's inbox. Release cleanup covers the beta list, provider submissions and inbox copies. The service handles technical data under its <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noreferrer" className="link-u text-parchment">privacy policy</a>.</p>
            </div>
          </div>
          <div>
            <div className="border border-line p-6 text-sm text-dim leading-relaxed">
              <p className="overline mb-3">What signing up means</p>
              <p>You won't get an automatic confirmation email, and an invite isn't immediate. There's no set date for beta places.</p>
              <p className="mt-3">All platforms are planned. Compatibility testing is still needed for each, so we can't say yet which ones the beta will cover.</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
