export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method'});
  const {GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN}=process.env;
  const {name, price, images}=req.body;
  const uploadedUrls=[];
  for(let img of images){
    const path=`images/${Date.now()}-${img.name}`;
    const url=`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`;
    const put=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GITHUB_TOKEN}`, 'Content-Type':'application/json'},body:JSON.stringify({message:`upload ${path}`, content:img.b64})});
    if(!put.ok){ const t=await put.text(); return res.status(500).json({error:t}); }
    uploadedUrls.push(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${path}`);
  }
  const prodUrl=`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/data/productos.json`;
  let products=[]; let sha=null;
  const get=await fetch(prodUrl,{headers:{Authorization:`Bearer ${GITHUB_TOKEN}`}});
  if(get.ok){ const j=await get.json(); sha=j.sha; products=JSON.parse(Buffer.from(j.content,'base64').toString()); }
  products.push({name, price, images:uploadedUrls, image:uploadedUrls[0]});
  const newContent=Buffer.from(JSON.stringify(products,null,2)).toString('base64');
  const save=await fetch(prodUrl,{method:'PUT',headers:{Authorization:`Bearer ${GITHUB_TOKEN}`, 'Content-Type':'application/json'},body:JSON.stringify({message:`add ${name}`, content:newContent, ...(sha?{sha}:{})})});
  if(!save.ok){ const err=await save.text(); return res.status(500).json({error:err}); }
  res.json({ok:true});
}