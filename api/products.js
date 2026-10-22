export default async function handler(req,res){
  const {GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN}=process.env;
  try{
    const url=`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/data/productos.json`;
    const r=await fetch(url,{headers:{Authorization:`Bearer ${GITHUB_TOKEN}`}});
    if(!r.ok) return res.json([]);
    const j=await r.json();
    const data=JSON.parse(Buffer.from(j.content,'base64').toString());
    res.json(data);
  }catch(e){ res.json([]); }
}