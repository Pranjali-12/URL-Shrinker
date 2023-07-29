const express=require('express');
const mongoose=require('mongoose')
// const env=require('dotenv');

const shortUrl=require('./models/shorturl');

// env.config();
require('dotenv').config();

const app=express();

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,useUnifiedTopology:true
})

app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}))

app.get('/',async (req,res)=>{
    const shortUrls=await shortUrl.find();
    res.render('index',{shortUrls:shortUrls});
})

app.post('/shorturls',async (req,res)=>{
    await shortUrl.create({full:req.body.fullUrl})
    res.redirect('/');
})

app.get('/:shortUrl',async (req,res)=>{
    const ShortUrl= await shortUrl.findOne({short:req.params.shortUrl});
    if(ShortUrl==null){
        return res.sendStatus(404);
    }

    ShortUrl.clicks++;
    ShortUrl.save()

    res.redirect(ShortUrl.full)
})

app.listen(process.env.PORT)