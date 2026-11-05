const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;
const file = path.join(__dirname, '../data/products.json');
fs.mkdirSync(path.dirname(file), {recursive:true});
if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([
  {id:1,name:'Keyboard Mechanical',category:'Aksesoris',price:350000,stock:20,reserved:0},
  {id:2,name:'Mouse Wireless',category:'Aksesoris',price:150000,stock:30,reserved:0},
  {id:3,name:'Monitor 24 inch',category:'Elektronik',price:1750000,stock:10,reserved:0}
], null, 2));
const read=()=>JSON.parse(fs.readFileSync(file,'utf8'));
const save=x=>fs.writeFileSync(file,JSON.stringify(x,null,2));
app.get('/health',(req,res)=>res.json({service:'katalog-service',status:'ok'}));
app.get('/products',(req,res)=>res.json(read()));
app.get('/products/:id',(req,res)=>{const p=read().find(x=>x.id===Number(req.params.id)); p?res.json(p):res.status(404).json({error:'Produk tidak ditemukan'});});
app.post('/products',(req,res)=>{
 const {name,category,price,stock}=req.body;
 if(!name||!category||!Number.isFinite(Number(price))||Number(stock)<0) return res.status(400).json({error:'name, category, price, stock wajib valid'});
 const items=read(); const p={id:items.reduce((m,x)=>Math.max(m,x.id),0)+1,name,category,price:Number(price),stock:Number(stock),reserved:0}; items.push(p); save(items); res.status(201).json(p);
});
app.post('/products/:id/reserve',(req,res)=>{
 const items=read(), p=items.find(x=>x.id===Number(req.params.id)), qty=Number(req.body.quantity||1);
 if(!p) return res.status(404).json({error:'Produk tidak ditemukan'});
 if(!Number.isInteger(qty)||qty<1) return res.status(400).json({error:'quantity harus bilangan bulat positif'});
 if(p.stock-p.reserved<qty) return res.status(409).json({error:'Stok tidak mencukupi'});
 p.reserved+=qty; save(items); res.json({message:'Stok berhasil direservasi',product:p});
});
app.post('/products/:id/release',(req,res)=>{
 const items=read(), p=items.find(x=>x.id===Number(req.params.id)), qty=Number(req.body.quantity||1);
 if(!p) return res.status(404).json({error:'Produk tidak ditemukan'});
 p.reserved=Math.max(0,p.reserved-qty); save(items); res.json({message:'Reservasi dilepas',product:p});
});
app.post('/products/:id/commit',(req,res)=>{
 const items=read(), p=items.find(x=>x.id===Number(req.params.id)), qty=Number(req.body.quantity||1);
 if(!p||p.reserved<qty||p.stock<qty) return res.status(409).json({error:'Reservasi tidak valid'});
 p.reserved-=qty; p.stock-=qty; save(items); res.json({message:'Stok dikurangi',product:p});
});
app.listen(PORT,()=>console.log(`katalog-service listening on ${PORT}`));
