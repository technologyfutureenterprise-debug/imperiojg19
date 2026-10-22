export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'POST'});
  const { password } = req.body;
  // La contraseña real la pones en Vercel > Environment Variables > ADMIN_PASS = JG19
  if (password === process.env.ADMIN_PASS) return res.json({ok:true});
  return res.status(401).json({error:'Clave incorrecta'});
}