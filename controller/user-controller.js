// import User from '../model/user.js'
// import bcrypt from 'bcrypt'
// import  jwt  from 'jsonwebtoken'
// import dotenv from 'dotenv'
// import Token from '../model/token.js'

// dotenv.config();

//  const signupUser = async (request , res) =>{
//  try{
//     const hashpassword = await bcrypt.hash(request.body.password , 10)


//     const user = {username:request.body.username, name:request.body.name, password:hashpassword};


//     const newUser = new User(user)
//      await newUser.save()

//      return res.status(200).json({msg:'sign up successfull'})

//  }catch(error){
//   return res.status(500).json({msg:'error while sign up'})
//  }
// }

// const loginUser =  async (request,response) => {
//   let user = await User.findOne({username:request.body.username})
//   if(!user){
//     console.log('response', response)
//     return response.status(400).json({msg:"Username not Found"})
    
//   }
//   try {
//     let match = await bcrypt.compare(request.body.password , user.password);
//     if(match){
//         const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_ACCESS_KEY , {expiresIn:'15s'})
//         const refreshToken = jwt.sign(user.toJSON(), process.env.SECRET_REFRESH_KEY )

//      const newToken = new Token({token: refreshToken})
//      await newToken.save()

//      return response.status(200).json({accessToken:accessToken, refreshToken:refreshToken, name :user.name , username: user.username})

//     }else{
//        return response.status(400).json({msg:"Password not correct"})
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     return response.status(500).json({msg:'error while login user'})
//   }
// }

// export { signupUser , loginUser };



import User from '../model/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js';

dotenv.config();

const validateSignupData = (data) => {
  const { username, name, password } = data;
  if (!username || !name || !password) {
    return { isValid: false, msg: 'All fields are required.' };
  }
  if (password.length < 6) {
    return { isValid: false, msg: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
};

const validateLoginData = (data) => {
  const { username, password } = data;
  if (!username || !password) {
    return { isValid: false, msg: 'Username and password are required.' };
  }
  return { isValid: true };
};

const signupUser = async (request, res) => {
  try {
    const { isValid, msg } = validateSignupData(request.body);
    if (!isValid) {
      return res.status(400).json({ msg });
    }

    const userExists = await User.findOne({ username: request.body.username });
    if (userExists) {
      return res.status(400).json({ msg: 'Username already taken.' });
    }

    const hashpassword = await bcrypt.hash(request.body.password, 10);
    const user = { username: request.body.username, name: request.body.name, password: hashpassword };

    const newUser = new User(user);
    await newUser.save();

    return res.status(200).json({ msg: 'Signup successful' });

  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ msg: 'Error while signing up' });
  }
};

const loginUser = async (request, response) => {
  const { isValid, msg } = validateLoginData(request.body);
  if (!isValid) {
    return response.status(400).json({ msg });
  }

  let user = await User.findOne({ username: request.body.username });
  if (!user) {
    return response.status(400).json({ msg: 'Username not found' });
  }

  try {
    let match = await bcrypt.compare(request.body.password, user.password);
    if (match) {
      const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_ACCESS_KEY, { expiresIn: '15s' });
      const refreshToken = jwt.sign(user.toJSON(), process.env.SECRET_REFRESH_KEY);

      const newToken = new Token({ token: refreshToken });
      await newToken.save();

      return response.status(200).json({
        accessToken,
        refreshToken,
        name: user.name,
        username: user.username
      });

    } else {
      return response.status(400).json({ msg: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return response.status(500).json({ msg: 'Error while logging in' });
  }
};

export { signupUser, loginUser };
