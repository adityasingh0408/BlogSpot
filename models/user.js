//const { Admin } = require("mongodb");
const { Schema ,model} = require("mongoose");
const{createHmac,randomBytes}=require("crypto");
const { createtokenforuser } = require("../service/authentication");

const userschema = new Schema({
  fullname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  //imp
  salt:{
    type:String,
  },
  password:{
    type:String,
    required:true,
},
profileImageURL:{
type:String,
default:'/images/useravatar.jpg',
},
role:{
type:String,
enum:["USER","ADMIN"],
default:"USER",
},

},
  {timestamps:true}

);

userschema.pre("save", function(next){
  const user =this;
  //only hash password if the user is new or password is modified
  if(!user.isModified("password")) return next();
//generate a random salt
  const salt =randomBytes(16).toString('hex');
  //hash the password with the salt
  const hashedpassword=createHmac('sha256', salt)
               .update(user.password)
               .digest('hex');
               //replace the plain password with the hashed one
               this.salt=salt;
               this.password=hashedpassword;
               next();
});

userschema.static("matchPasswordandgeneratetoken",async function(email,password){
  const user=await this.findOne({email});
  if(!user) throw new Error('user not found');

  const salt=user.salt;
  const hashedpassword=user.password;

  const userprovidedpassword=createHmac('sha256', salt)
  .update(password)
  .digest('hex');
  if(hashedpassword!==userprovidedpassword) throw new Error("invalid password")

const token=createtokenforuser(user);
return token;
})

userschema.methods.matchPassword = function(password) {
  const hashedPassword = createHmac('sha256', this.salt)
    .update(password)
    .digest('hex');
  return this.password === hashedPassword;
};


//const user=model('user',userschema);
//module.exports=user;

const User = model('user', userschema); // Correct model creation
module.exports = User; 