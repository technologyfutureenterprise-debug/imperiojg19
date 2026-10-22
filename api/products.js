export default async function handler(req, res) {
  const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = process.env;
  try{
    const r = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/productos.json`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if(!r.ok) return res.json([]);
    const d = await r.json();
    const content = JSON.parse(Buffer.from(d.content, 'base64').toString());
    return res.json(content);
  }catch(e){ return res.json([]); }
}
