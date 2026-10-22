export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = process.env;
  const { name, content } = req.body;
  const path = `fotos/${Date.now()}_${name.replace(/\s/g,'_')}`;
  const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`;
  const r = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `foto ${path}`, content })
  });
  if (!r.ok) return res.status(500).json({error: await r.text()});
  const data = await r.json();
  const rawUrl = data.content.download_url.replace('github.com','raw.githubusercontent.com').replace('/blob/','/');
  return res.json({url: rawUrl});
}
