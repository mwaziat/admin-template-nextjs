const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import dotenv from 'dotenv';
dotenv.config();

const hashPassword = async (password: any) => {
  try {
    const salt = process.env.SALT || '$2a$10$VUtvjdtWfI5Rq3mxZT5MXe'
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Password hashing failed');
  }
};

const matchPassword = async (plainPassword: any, hashedPassword: any) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const generateToken = (payload: any, exp: any) => {
  try {
    // Sign the JWT token with a secret key and set an expiration time (e.g., 1 hour)
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: exp ? exp : '1d' });

    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate JWT token');
  }
};

const encodeToken = (token: any) => {
  try {
    // Sign the JWT token with a secret key and set an expiration time (e.g., 1 hour)
    if(!token){
      throw new Error( 'token not found') ;
    }
    return jwt.verify(token, process.env.JWT_SECRET, (err: string | undefined, user: any) => {
      if (err) {
        throw new Error( err ) ;
      }
      return user;
    });
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error(' Failed Encode token');
  }
};


const middleware = (req: { session: { token: any; }; user: any; }, res: { redirect: (arg0: string) => any; }, next: () => void) => {
  const token = req.session.token;
  if (!token) {
    return res.redirect('/');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.redirect('/');
    }
    req.user = user;
    next();
  });
}

export {
  hashPassword,
  matchPassword,
  generateToken,
  middleware,
  encodeToken
}