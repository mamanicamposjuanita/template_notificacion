const { Schema, model } = require("mongoose")

const notificacionSchema = new Schema({
    titulo: {
        type: String,
        required: [true, 'El titulo es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, ' La descripcion es obligatoria']
    },
    tipo: {
        type:String,
        required: [true, 'El tipo es obligatorio']
    },

    unidad: {
        type:String,
        required: [true, 'La unidad es obligatoria']
    },

    fechaEmision: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    fechaRegistro: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    }
})

notificacionSchema.set('toJSON', {
    transform: (document, returnedObject)=>{
        returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v	
	}
})

const Notificacion = model('Notificacion', notificacionSchema)

module.exports = {
    Notificacion
}