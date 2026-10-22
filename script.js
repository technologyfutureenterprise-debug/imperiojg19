let products=[],selectedFile=null,cart=[];

async function loadProducts(){
 try{
  const r=await fetch('/api/products');
  if(r.ok) products=await r.json();
  else{
   const r2=await fetch('https://raw.githubusercontent.com/technologyfutureenterprise-debug/imperiojg19/main/productos.json?t='+Date.now());
   if(r2.ok) products=await r2.json();
  }
 }catch{products=[];}
 document.getElementById('status').textContent=`✅ ${products.length} productos desde GitHub`;
 render();
}

function render(){
 const grid=document.getElementById('grid');
 const empty=document.getElementById('empty');
 grid.innerHTML='';
 if(products.length===0){empty.classList.remove('hidden');return;}
 empty.classList.add('hidden');
 products.forEach(p=>{
  const d=document.createElement('div');d.className='card';
  d.innerHTML=`<img src="${p.img}"><div class="card-info"><h4>${p.name}</h4><p>${p.sizes||''}</p><div class="price">$${Number(p.price).toLocaleString('es-CO')}</div><button onclick="addCart('${p.id}')">AGREGAR</button></div>`;
  grid.appendChild(d);
 });
 document.getElementById('adminList').innerHTML=products.map(p=>`<div style="display:flex;gap:10px;align-items:center;background:rgba(255,255,255,.05);padding:8px;border-radius:12px"><img src="${p.img}" width="40" style="border-radius:8px"><span style="flex:1;font-size:12px">${p.name}</span><button onclick="deleteProd('${p.id}')" style="color:#f55;background:none;border:none">Borrar</button></div>`).join('');
}

window.addCart=id=>{cart.push(products.find(p=>p.id==id));document.getElementById('cartCount').textContent=cart.length;}
window.deleteProd=async id=>{if(!confirm('Borrar?'))return;const upd=products.filter(p=>p.id!=id);await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({products:upd})});loadProducts();}
function toBase64(f){return new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result.split(',')[1]);rd.readAsDataURL(f);});}

document.getElementById('adminLock').onclick=()=>document.getElementById('adminModal').classList.remove('hidden');
document.getElementById('closeAdmin').onclick=()=>document.getElementById('adminModal').classList.add('hidden');
document.getElementById('closeBg').onclick=()=>document.getElementById('adminModal').classList.add('hidden');
document.getElementById('loginBtn').onclick=()=>{if(document.getElementById('passInput').value==='JG19'){document.getElementById('loginBox').classList.add('hidden');document.getElementById('panelBox').classList.remove('hidden');}else alert('Clave incorrecta');};
document.getElementById('pFile').onchange=e=>{selectedFile=e.target.files[0];document.getElementById('preview').textContent='Foto: '+selectedFile.name;};
document.getElementById('publishBtn').onclick=async()=>{
 const name=document.getElementById('pName').value,price=parseInt(document.getElementById('pPrice').value),sizes=document.getElementById('pSizes').value,st=document.getElementById('upStatus');
 if(!name||!price||!selectedFile) return alert('Falta nombre, precio o foto');
 st.textContent='⏳ Subiendo foto...';const b64=await toBase64(selectedFile);
 const up=await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:selectedFile.name,content:b64})});
 if(!up.ok){st.textContent='Error foto';return;}const{url}=await up.json();
 st.textContent='⏳ Guardando...';const updated=[{id:Date.now().toString(),name,price,sizes,img:url},...products];
 const sv=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({products:updated})});
 if(!sv.ok){st.textContent='Error';return;}st.textContent='✅ PUBLICADO!';products=updated;render();
};
document.getElementById('cartBtn').onclick=()=>{
 if(cart.length==0) return alert('Carrito vacío');
 const total=cart.reduce((s,p)=>s+p.price,0);
 const msg=encodeURIComponent(`Hola IMPERIO JG19, quiero: ${cart.map(p=>p.name).join(', ')} Total $${total}`);
 window.open(`https://wa.me/573053680666?text=${msg}`,'_blank');
};
loadProducts();