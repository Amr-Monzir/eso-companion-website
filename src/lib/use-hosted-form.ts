import { useRef, useState } from 'react';

export function useHostedForm(endpoint: string | null) {
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  async function submit(data: Record<string, string>): Promise<boolean> {
    if (busy.current) return false;
    if (!endpoint) {
      setError('This form is not connected yet. Please check back later.');
      return false;
    }
    if (data.website?.trim()) {
      setError('Please check the form and try again.');
      return false;
    }
    busy.current = true;
    setPending(true);
    setError(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20_000);
    try {
      const { website, ...fields } = data;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...fields, _gotcha: website || '' }),
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      if (!response.ok) {
        setError(response.status === 429
          ? 'Too many submissions. Please wait a few minutes and try again.'
          : 'The form service did not accept this submission. Please check your details and try again later.');
        return false;
      }
      return true;
    } catch {
      setError('We could not confirm your submission. Check your connection and try again. It may already have reached the form service.');
      return false;
    } finally {
      window.clearTimeout(timer);
      busy.current = false;
      setPending(false);
    }
  }

  return { submit, isPending, error, reset: () => setError(null) };
}
