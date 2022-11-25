const { Schema, model } = require("mongoose")

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    departamento: {
        type: String,
        enum: ['DSA', 'DAF', 'DataCenter', 'Rectorado', 'Vicerectorado', 'Planificacion', 'RecursosHumanos'],
        default: 'Data Center',
        required: [true, 'El departamento es obligatorio']
    },
    tipo: {
        type: String,
        enum: ['Administrador', 'Emisor', 'Secrtaria'],
        default: 'Emisor',
        required: [true, 'El tipo usuario es obligatorio']
    },

    usuario: {
        type: String,
        unique: true,
        required: [true, 'El usuario es obligatorio']
    },

    contraseña: {
        type: String,
        required: [true, ' La contraseña es obligatoria']
    },

    fecha: {
        type: Date,
        default: new Date(),
        // required: [true, ' La fecha es obligatoria']
    },
    
})

usuarioSchema.set('toJSON', {
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v	
	}
})

const Usuario = model('Usuario', usuarioSchema)

module.exports = {
    Usuario
}