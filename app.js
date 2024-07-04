
require("dotenv").config();

const express=require("express");
const mongoose=require('mongoose')
const path=require('path');
const cookieparser =require("cookie-parser");
const Blog=require('./models/blog');

//path imported
const userroute =require('./routes/user');
const blogroute =require('./routes/blog');
const{checkforauthenticationcookie,}= require("./middleware/auth");

//server
const PORT=process.env.PORT || 9000;
const app=express();

//here we are using mongodb which we dont want  now when deploying our project
//mongoose
//.connect('mongodb://localhost:27017/blogify')
//.then (e=>console.log('mongodb connected'))// changed

//we need to change this

mongoose
.connect(process.env.MONGO_URL)
.then ((e) =>console.log('mongodb connected'))

//viewengine

app.set("view engine",'ejs');
app.set('views', path.resolve('./views'));

//middleware
app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(checkforauthenticationcookie("token"));
app.use(express.static(path.resolve('./public')));
app.get('/',async (req,res)=>{
    const allblogs =  await Blog.find({}) ;
    res.render('home',{
    user:req.user,
blogs:allblogs,})
})

app.use("/user",userroute);
app.use("/blog",blogroute);
app.listen(PORT, ()=>console.log(`server satrted at ${PORT}`))