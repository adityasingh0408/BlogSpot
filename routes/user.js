const{Router}=require ("express");
const user=require('../models/user');
const router = Router();

router.get('/signin',(req,res)=>{
return res.render('signin');
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
})

router.get('/logout',(req,res)=>{
  return res.clearCookie('token').redirect('/');
})

router.post('/signup',async(req,res)=>{
const {fullname,email,password}=req.body;
await user.create({
    fullname,
    email,
    password,
});
return res.redirect('/');
})

router.post('/signin' ,async(req,res)=>{
  const{email,password}=req.body;
  console.log(email,password);
  try {
    const token = await user.matchPasswordandgeneratetoken(email,password);
    console.log('token', token);
    return res.cookie("token" ,token).redirect('/');
   } catch (error) {
    return res.render('signin',{error:"Incorrect email or password"})
   }
    
   /*try {
        const user= await user.findOne({ email });
        if (user && user.matchPassword(password)) {
          console.log('User authenticated successfully:', user);
          return res.redirect('/');
        } else {
          console.log('Invalid email or password');
          return res.redirect('/signin');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).send('Internal Server Error');
      }
      console.log(user);
    console.log('user', user)
    return res.redirect('/');*/
});
module.exports = router;