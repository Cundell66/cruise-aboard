import { NextRequest } from 'next/server';

// Decap CMS external OAuth client - callback handler.
// GitHub redirects here with ?code=... after the user authorizes.
// We exchange the code for an access token, then serve an HTML page that
// hands the token back to Decap's opener window via postMessage
// (the exact protocol Decap's NetlifyAuthenticator expects).

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.OAUTH_CLIENT_ID || 'Ov23ct55SGuJWNpF9IUo';
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '';
const REDIRECT_URI =
  process.env.OAUTH_REDIRECT_URL || 'https://cruise-aboard.vercel.app/api/auth/callback';
const SITE_HOSTS = (process.env.OAUTH_SITE_HOSTS || 'cruise-aboard.vercel.app')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return html(scriptFor('authorization:github:error:' + JSON.stringify({ message: 'Missing code' })));
  }
  if (!CLIENT_SECRET) {
    return html(
      scriptFor('authorization:github:error:' + JSON.stringify({ message: 'OAuth client secret not configured' })),
    );
  }

  let data: Record<string, string>;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
    data = await res.json();
  } catch (err) {
    return html(
      scriptFor('authorization:github:error:' + JSON.stringify({ message: String(err) })),
    );
  }

  if (!data.access_token) {
    return html(
      scriptFor(
        'authorization:github:error:' +
          JSON.stringify({ message: data.error_description || data.error || 'Token exchange failed' }),
      ),
    );
  }

  const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
  return html(scriptFor('authorization:github:success:' + payload));
}

function scriptFor(message: string) {
  const msgJson = JSON.stringify(message);
  return `<!doctype html><html><head><meta charset="utf-8"><title>Authorizing...</title></head>
<body><script>
(function() {
  var allowed = ${JSON.stringify(SITE_HOSTS)};
  function originOk(origin) {
    if (!origin) return false;
    var host = origin.replace(/^https?:\\/\\//, '').split('/')[0];
    return allowed.indexOf(host) !== -1;
  }
  function send(m, target) {
    try { window.opener.postMessage(m, target || '*'); } catch (e) {}
  }
  // Handshake: tell the opener we're alive; Decap echoes it back,
  // then we deliver the result.
  window.addEventListener('message', function (e) {
    if (originOk(e.origin)) {
      send(${msgJson}, e.origin);
    }
  }, false);
  send('authorizing:github');
})();
<\/script></body></html>`;
}

function html(body: string) {
  return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
