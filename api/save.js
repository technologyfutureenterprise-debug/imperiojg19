export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'method'});
  const {GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN}=process.env;
  const {action, index, name, price}=req.body;
  const getUrl=`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/data/productos.json`;
  const getRes=await fetch(getUrl,{headers:{Authorization:`Bearer ${GITHUB_TOKEN}`}});
  if(!getRes.ok) return res.status(404).json({error:'no file'});
  const fileData=await getRes.json();
  const content=JSON.parse(Buffer.from(fileData.content,'base64').toString());
  if(action==='delete'){ content.splice(index,1); }
  if(action==='edit'){ content[index].name=name; content[index].price=price; }
  const updated=Buffer.from(JSON.stringify(content,null,2)).toString('base64');
  const putRes=await fetch(getUrl,{method:'PUT',headers:{Authorization:`Bearer ${GITHUB_TOKEN}`, 'Content-Type':'application/json'},body:JSON.stringify({message:`${action} ${index}`, content:updated, sha:fileData.sha})});
  if(!putRes.ok){ const err=await putRes.text(); return res.status(500).json({error:err}); }
  res.json({ok:true});
}