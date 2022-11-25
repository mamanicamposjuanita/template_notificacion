const jwt = require('jsonwebtoken')

const validarToken = (token)=>{
    try{
        const decoded = jwt.verify(token, '12345');
        return decoded
    } catch(error){

        console.log('------------------->>>>>',error)
        // return null
    }
    

}

module.exports = validarToken