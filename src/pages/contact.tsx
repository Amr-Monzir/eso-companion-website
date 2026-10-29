import { useState, type FormEvent } from 'react';
import { AlertTriangle, ArrowUpRight, Check, MessageCircle, Send, ShieldAlert } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { useHostedForm } from '@/lib/use-hosted-form';
import { PageHead, useSeo } from '@/components/site';

type ContactCategory = 'general' | 'installation' | 'bug' | 'feedback';
const CATS: { v: ContactCategory; l: string }[] = [
  { v: 'general', l: 'General' },
  { v: 'installation', l: 'Setup or beta' },
  { v: 'bug', l: 'Bug report' },
  { v: 'feedback', l: 'Feedback' },
];

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export default function Contact() {
  useSeo('Contact: ESO Companion', 'Send a question, setup problem, bug report or feedback to the ESO Companion developer.');
  const [form, setForm] = useState({ name: '', email: '', category: 'general' as ContactCategory, message: '', website: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [receipt, setReceipt] = useState(false);
  const m = useHostedForm(siteConfig.contactEndpoint);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Enter a name.';
    else if (form.name.length > 100) e.name = 'Keep it under 100 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.length > 254) e.email = 'Enter a valid email address.';
    if (form.message.trim().length < 10) e.message = 'Write at least 10 characters.';
    else if (form.message.length > 5000) e.message = 'Keep it under 5000 characters.';
    return e;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const accepted = await m.submit({
      name: form.name.trim(), email: form.email.trim(), category: form.category,
      message: form.message.trim(), website: form.website,
      form_type: 'contact', _subject: 'ESO Companion contact message',
    });
    if (accepted) setReceipt(true);
  };

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <PageHead kicker="Contact" title={<>Send a <em className="text-brass font-medium">message</em>.</>}>
        Questions, bugs, setup problems or ideas for builds. This form sends your message through Formspree to the developer's inbox.
      </PageHead>
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid gap-12 lg:grid-cols-[1.3fr_.7fr]">
        {receipt ? (
          <div className="border border-gold/60 bg-panel p-8 md:p-12 rise" role="status" data-testid="status-contact-success">
            <span className="h-12 w-12 grid place-items-center border border-gold text-brass"><Check size={22} /></span>
            <h2 className="display text-4xl mt-6">Message received.</h2>
            <p className="mt-4 text-dim leading-relaxed">The form service has accepted your message for delivery to the developer. There's no fixed response time.</p>
            <button className="btn-ghost mt-8" onClick={() => { setReceipt(false); m.reset(); setForm({ name: '', email: '', category: 'general', message: '', website: '' }); }} data-testid="button-new-message">Write another</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-7">
            {!siteConfig.contactEndpoint && <p role="status" className="border border-goldsoft p-4 text-sm text-dim" data-testid="status-contact-unconfigured">The contact form is not connected yet. It cannot send messages at the moment.</p>}
            <div className="grid gap-7 sm:grid-cols-2">
              <Field id="name" label="Name" error={errors.name}>
                <input id="f-name" className="field" value={form.name} onChange={set('name')} maxLength={100} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} data-testid="input-name" />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <input id="f-email" type="email" className="field" value={form.email} onChange={set('email')} maxLength={254} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} data-testid="input-email" />
              </Field>
            </div>
            <fieldset>
              <legend className="overline mb-3">Category</legend>
              <div className="flex flex-wrap gap-2">
                {CATS.map((c) => (
                  <label key={c.v} className={`cursor-pointer px-4 py-2.5 border text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brass ${form.category === c.v ? 'border-gold bg-gold text-ink' : 'border-line text-parchment hover:border-goldsoft'}`}>
                    <input type="radio" name="category" value={c.v} checked={form.category === c.v} onChange={() => setForm((f) => ({ ...f, category: c.v }))} className="sr-only" data-testid={`radio-category-${c.v}`} />
                    {c.l}
                  </label>
                ))}
              </div>
            </fieldset>
            <Field id="message" label="Message" error={errors.message} hint={`${form.message.length} / 5000`}>
              <textarea id="f-message" rows={8} className="field resize-y" value={form.message} onChange={set('message')} maxLength={5000} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-message' : undefined} data-testid="input-message" />
            </Field>
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="f-website">Website</label>
              <input id="f-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
            </div>
            {m.error && (
              <div role="alert" className="flex gap-3 border border-danger/50 p-4 text-sm"><AlertTriangle size={17} className="text-danger shrink-0" /><span>{m.error}</span></div>
            )}
            <button type="submit" disabled={m.isPending || !siteConfig.contactEndpoint} className="btn-gold disabled:opacity-60 disabled:pointer-events-none" data-testid="button-submit-contact">
              {m.isPending ? 'Sending...' : <>Send message <Send size={15} /></>}
            </button>
          </form>
        )}
        <aside className="space-y-6">
          <div className="border border-goldsoft bg-panel p-6">
            <p className="overline mb-3">Discord</p>
            <h2 className="font-serif text-2xl text-parchment">Join the conversation.</h2>
            <p className="mt-3 mb-5 text-sm text-dim leading-relaxed">Talk builds, ask questions or share feedback on the ESO Companion Discord.</p>
            <a href="https://discord.gg/ty3zb6eZYz" target="_blank" rel="noopener noreferrer" className="btn-gold" data-testid="link-discord">
              <MessageCircle size={17} aria-hidden="true" /> Join the Discord <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="border border-danger/40 p-6">
            <p className="flex items-center gap-2 text-danger font-medium"><ShieldAlert size={17} /> Never send these</p>
            <ul className="mt-4 space-y-2 text-sm text-dim list-[square] pl-5 marker:text-danger">
              <li>Your ESOCompanion.lua SavedVariables file</li>
              <li>Snapshots or exported data</li>
              <li>Pairing codes, QR codes or Helper secrets</li>
              <li>Passwords of any kind</li>
            </ul>
            <p className="mt-4 text-xs text-dim">Attachments aren't accepted. Describe what you see, and paste any error text.</p>
          </div>
          <div className="border border-line p-6 text-sm text-dim leading-relaxed">
            <p className="overline mb-3">How this works</p>
            Formspree processes your message and forwards it to the developer's inbox. Its service may retain a copy. There's no fixed response time. <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noreferrer" className="link-u text-parchment">Read Formspree's privacy policy</a>.
          </div>
        </aside>
      </div>
    </>
  );
}

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: import("react").ReactNode }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label htmlFor={`f-${id}`} className="overline">{label}</label>
        {hint && <span className="font-mono text-[11px] text-dim">{hint}</span>}
      </div>
      {children}
      {error && <p id={`e-${id}`} className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
