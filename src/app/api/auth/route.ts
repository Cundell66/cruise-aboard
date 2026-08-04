import { NextRequest, NextResponse } from 'next/server';

// Decap CMS external OAuth client - begin handler.
// Decap opens a popup to {base_url}/{auth_endpoint}?provider=github&scope=repo
// and we redirect it to GitHub's OAuth authorize endpoint.

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.OAUTH_CLIENT_ID || 'Ov23ct55SGuJWNpF9IUo';
const REDIRECT_URI =
  process.env.OAUTH_REDIRECT_URL || 'https://cruise-aboard.vercel.app/api/auth/callback';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const scope = url.searchParams.get('scope') || 'repo';
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authorizeUrl.searchParams.set('scope', scope);
  authorizeUrl.searchParams.set('state', state);

  return NextResponse.redirect(authorizeUrl.toString());
}
