
const mongoose = require('mongoose')
const dbConexion = async ()=>{
    try{
        await  mongoose.connect('mongodb://juana:password@mymongo:27017/notificacion?authSource=admin',
        // await  mongoose.connect('mongodb://localhost:27017/notificacion',
    
        { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,  
            // useFindAndModify: false, 
            // useCreateIndex:true // version < 6.0.2
        })
        console.log('conectado a mongoDB... Puerto: ' + 8008)
    
    }catch(err){
        console.log('ERROR:', err)
        throw new Error('Error al iniciar mongoDB')
    }
}

module.exports = {
    dbConexion
}