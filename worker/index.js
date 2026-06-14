const MAKE_TEAM_ID   = '1661045';
const MAKE_FOLDER_ID = '186004';

const CORS = {
  'Access-Control-Allow-Origin':  'https://gilldo.github.io',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: CORS });
    }

    try {
      const url = `https://us2.make.com/api/v2/scenarios?teamId=${MAKE_TEAM_ID}&folderId=${MAKE_FOLDER_ID}&pg[limit]=100`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Token ${env.MAKE_API_TOKEN}` },
      });

      if (!res.ok) {
        const text = await res.text();
        return new Response(JSON.stringify({ error: `Make API ${res.status}`, detail: text }), {
          status: 502,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        });
      }

      const data = await res.json();
      return new Response(JSON.stringify({ scenarios: data.scenarios ?? [] }), {
        status: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: String(err) }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }
  }
};
