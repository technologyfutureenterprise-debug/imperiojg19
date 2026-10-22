export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = process.env;
  const { products } = req.body;
  const content = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');
  let sha = null;
  try {
    const r = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/productos.json`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (r.ok) { const d = await r.json(); sha = d.sha; }
  } catch {}
  const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/productos.json`;
  const save = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'update productos', content, sha })
  });
  if (!save.ok) return res.status(500).json({error: await save.text()});
  return res.json({ok: true});
}
