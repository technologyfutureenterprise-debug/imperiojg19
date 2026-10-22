export default function handler(req,res){
  res.json({ admin: process.env.ADMIN_PASS || 'JG19' });
}