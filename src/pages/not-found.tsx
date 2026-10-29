import { Link } from 'wouter';
import { CompassRose, useSeo } from '@/components/site';

export default function NotFound() {
  useSeo('Page not found: ESO Companion', 'This page doesn\'t exist.');
  return (
    <section className="mx-auto max-w-3xl px-5 py-24 text-center">
      <CompassRose className="mx-auto w-56 opacity-70" />
      <p className="overline mt-8">404</p>
      <h1 className="display text-5xl sm:text-6xl mt-4">Page not found.</h1>
      <p className="mt-4 text-dim">The link may be old, or the address may have a typo.</p>
      <Link href="/" className="btn-gold mt-8" data-testid="link-404-home">Go to the home page</Link>
    </section>
  );
}
