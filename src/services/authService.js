const authModel = require('./../models/authModel')
const ServiceResponse = require('./../helper/ServiceResponse')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (body)=>{
    const { email, password, tokenFcm } = body;
    
    try {
        const result = await authModel.login(email)
        const user = result[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return ServiceResponse(null,400,"email/pasword wrong")
        const payload = {
            id: user.id,
            name: user.name,
            role: user.role
          };
        const jwtOptions = {
            expiresIn: "5h",
          };
          const token = jwt.sign(payload, process.env.SECRET_KEY, jwtOptions);
          await authModel.insertWhiteList(token)
          console.log(tokenFcm);
          if(tokenFcm){
              await authModel.updateTokenFcm(tokenFcm,email)
          }
          return ServiceResponse({user:payload, token},200, "login success")
    } catch (error) {
        return ServiceResponse(null, 500, 'Terjadi Error', error)
        
    }
}
const createUser = async (body) =>{
    const  {username, email, password }=body
    try {
        const cekEmail = await authModel.cekEmail(email)
        console.log(cekEmail)
        if(cekEmail.length > 0 ) return ServiceResponse(null,400,"email already used ")
        const passwordHash = await bcrypt.hash(password, 10)
        const result = await authModel.createUser(username, email, passwordHash)
        return ServiceResponse(result,200, "sign up succes")
    } catch (error) {
        return ServiceResponse(null, 500, 'Terjadi Error', error)
        
    }
}

const logout = async (token) => {
    try {
        const user = await authModel.deleteWhiteList(token);
        return ServiceResponse(user, 200, 'logout succes')
    } catch (error) {
        return ServiceResponse(null, 500, 'Terjadi Error', error)
    }
}

module.exports={login, createUser, logout}