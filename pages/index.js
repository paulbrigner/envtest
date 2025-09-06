import { useEffect, useState } from 'react';

export async function getServerSideProps() {
  // Read on the server at runtime in Amplify (SSR Lambda)
  const serverVars = {
    // Example names – set these in Amplify to test
    RUNTIME_FOO: process.env.NEXT_PUBLIC_RUNTIME_FOO || null,
    SERVER_SECRET: process.env.SERVER_SECRET || null,
  };

  return { props: { serverVars } };
}

export default function Home({ serverVars }) {
  const [apiVars, setApiVars] = useState(null);
  const [error, setError] = useState(null);

  // Keys allowed to be fetched via API, controlled by env var on server
  const allowed = (process.env.NEXT_PUBLIC_ALLOWED_RUNTIME_KEYS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  useEffect(() => {
    // Fetch runtime env via API to demonstrate true runtime resolution
    const fetchVars = async () => {
      try {
        if (!allowed.length) return; // nothing to fetch
        const params = new URLSearchParams();
        allowed.forEach((k) => params.append('key', k));
        const res = await fetch(`/api/env?${params.toString()}`);
        const data = await res.json();
        setApiVars(data);
      } catch (e) {
        setError(String(e));
      }
    };
    fetchVars();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>Next.js Env Test (Amplify Runtime)</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Build-time (Client) variables</h2>
        <p>
          NEXT_PUBLIC_ vars are replaced at build time. If you update these in
          Amplify, you must redeploy to see changes on the client.
        </p>
        <pre style={{ background: '#f6f8fa', padding: 12 }}>
{JSON.stringify({
  NEXT_PUBLIC_PUBLIC_KEY: process.env.NEXT_PUBLIC_PUBLIC_KEY || null,
  NEXT_PUBLIC_ALLOWED_RUNTIME_KEYS:
    process.env.NEXT_PUBLIC_ALLOWED_RUNTIME_KEYS || null,
}, null, 2)}
        </pre>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Server runtime variables (getServerSideProps)</h2>
        <p>Read on the server during each request in Amplify SSR.</p>
        <pre style={{ background: '#f6f8fa', padding: 12 }}>
{JSON.stringify({ ...serverVars, SERVER_SECRET_MASKED: serverVars.SERVER_SECRET ? 'SET' : null }, null, 2)}
        </pre>
        <small>Secrets are masked in the UI; check your logs carefully.</small>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Server runtime via API</h2>
        <p>
          This fetches selected runtime env vars from <code>/api/env</code>.
          Control which keys can be returned via the server env variable
          <code> ALLOWED_RUNTIME_KEYS</code>. Provide a client hint via
          <code> NEXT_PUBLIC_ALLOWED_RUNTIME_KEYS</code> to pick what to fetch.
        </p>
        {allowed.length === 0 ? (
          <p><em>Set NEXT_PUBLIC_ALLOWED_RUNTIME_KEYS to try this (comma-separated).</em></p>
        ) : null}
        <pre style={{ background: '#f6f8fa', padding: 12 }}>
{apiVars ? JSON.stringify(apiVars, null, 2) : error ? error : 'Loading...'}
        </pre>
      </section>

      <hr style={{ margin: '32px 0' }} />
      <p style={{ color: '#555' }}>
        Tip: In Amplify Hosting, set environment variables in the app settings.
        <br />
        - Client (build-time): <code>NEXT_PUBLIC_*</code>
        <br />
        - Server (runtime): any name, available via <code>process.env</code>
      </p>
    </main>
  );
}

