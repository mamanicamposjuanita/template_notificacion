const WebSocket = require('ws');
const { dbConexion } = require('./src/db/config');
const { Notificacion } = require('./src/modelos/Notificacion');
const { Usuario } = require('./src/modelos/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validarToken = require('./src/helpers/validarToken');
const { isObjectIdOrHexString } = require('mongoose');

async function init() {
    await dbConexion()


    var wss = new WebSocket.Server({ port: 8008 }, () => {
        console.log('Servidor iniciado')
    })

    wss.on('connection', (ws) => {
        console.log('conexion establecida') 
        ws.on('message', async (data) => {
            // console.log(JSON.parse(data))
            const { accion } = JSON.parse(data)







            if (accion === 'listar-usuarios') {
                const usuarios = await Usuario.find({})
                // console.log(usuarios)
                ws.send(JSON.stringify(usuarios))
            }








            if (accion === 'listar-notificaciones') {
                const notificaciones = await Notificacion.find({})
                // console.log(notificaciones)
                ws.send(JSON.stringify(notificaciones))
            }






            if (accion === 'registrar-notificacion') {
                const datoCompleto = JSON.parse(data)
                console.log('DATOS--->', datoCompleto)

                const { datos,token } = datoCompleto
                const esValido = validarToken(token)
                console.log('ES VALIDO-->',esValido)
                if(!esValido){
                    const mensaje = {
                        ok: false,
                        msg: 'Usuario invalido'
                    }
                    return ws.send(JSON.stringify(mensaje))
                }
                else{
                    const nuevaNotificacion = new Notificacion({
                        titulo: datos.titulo,
                        descripcion: datos.descripcion,
                        tipo: datos.tipo,
                        unidad: datos.unidad,
                        fechaEmision: datos.fecha,
                        fechaRegistro: new Date()
    
                    })
                    nuevaNotificacion.save();
    
                    const mensaje = {
                        ok: true,
                        msg: 'La notificacion fue registrada correctamente.'
                    }
                    ws.send(JSON.stringify(mensaje))

                    console.log('clientes-->',  wss.clients)
                    wss.clients.forEach((i)=>{
                        
                        i.send(JSON.stringify({
                            tipo: 'emision',
                            titulo: nuevaNotificacion.titulo,
                            descripcion: nuevaNotificacion.descripcion
                        }))
                    })
                }
            }








            if (accion === 'registrar-usuario') {
                const datoCompleto = JSON.parse(data)
                console.log('DATOS--->', datoCompleto)

                const { datos } = datoCompleto

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(datos.contraseña, salt);

                const existeUsuario = await Usuario.find({ usuario: datos.usuario })
                if(existeUsuario.length !== 0){
                    const mensaje = {
                        ok: false,
                        msg: 'Este nombre de usuario ya existe.'
                    }
                    return ws.send(JSON.stringify(mensaje))
                }
                
                const nuevoUsuario = new Usuario({
                    nombre: datos.nombre,
                    departamento: datos.departamento,
                    tipo: datos.tipo,
                    usuario: datos.usuario,
                    fecha: datos.fecha,
                    contraseña: hash,

                })
                nuevoUsuario.save();

                const mensaje = {
                    ok: true,
                    msg: 'Usuario registrado correctamente.'
                }
                ws.send(JSON.stringify(mensaje))
            }







            if(accion === 'eliminar-usuario'){
                const datoCompleto = JSON.parse(data)

                const { id } = datoCompleto
                const usuarioEliminado = await Usuario.findByIdAndDelete(id)
                console.log('eliminado:',usuarioEliminado)
                if(usuarioEliminado){
                    const mensaje = {
                        ok: true,
                        msg: 'Se eliminó el usuario.'
                    }
                    return ws.send(JSON.stringify(mensaje))
                }
            }






            if(accion === 'eliminar-notificacion'){
                const datoCompleto = JSON.parse(data)

                const { id } = datoCompleto
                const notificacionEliminado = await Notificacion.findByIdAndDelete(id)
                console.log('eliminado:',notificacionEliminado)
                if(notificacionEliminado){
                    const mensaje = {
                        ok: true,
                        msg: 'Se eliminó la notificacion.'
                    }
                    return ws.send(JSON.stringify(mensaje))
                }
            }





            if(accion === 'editar-notificacion'){
                const datoCompleto = JSON.parse(data)

                const { id } = datoCompleto
                const notificacionEditado = await Notificacion.findByIdAndUpdate(id)
                console.log('editado:',notificacionEditado)
                if(notificacionEditado){
                    const mensaje = {
                        ok: true,
                        msg: 'Se edito la notificacion.'
                    }
                    return ws.send(JSON.stringify(mensaje))
                }
            }




            if (accion === 'iniciar-sesion') {
                const datoCompleto = JSON.parse(data)
                console.log('DATOS--->', datoCompleto)

                const { datos } = datoCompleto

                console.log(datos)

                const usuarios = await Usuario.find({ usuario: datos.usuario })

                if(usuarios.length === 0){
                    const mensaje = {
                        ok: false,
                        msg: 'Ususario no existente.'
                    }
                    return ws.send(JSON.stringify(mensaje))
                }
                
                console.log(usuarios[0])

                const esCorrecta = await bcrypt.compare(datos.contraseña, usuarios[0].contraseña)
                if (esCorrecta) {
                    console.log('la contraseña es correcta')
                    const token = jwt.sign(
                        
                        {id: usuarios[0]._id},
                        '12345'
                    )
                    const mensaje = {
                        ok: true,
                        datos: {
                            token
                        },
                        msg: 'La contraseña es correcta.'
                    }
                    ws.send(JSON.stringify(mensaje))

                }
                else {
                    const mensaje = {
                        ok: false,
                        msg: 'La contraseña es incorrecta.'
                    }
                    ws.send(JSON.stringify(mensaje))
                }

            }







            if(accion === 'propagar'){
                const datoCompleto = JSON.parse(data)
                console.log('DATOS--->', datoCompleto)

                const { datos } = datoCompleto

                console.log(datos)
                const mensaje = {
                    tipo: 'informacion',
                    msg: 'Esto es un mensaje de prueba'
                }
                // emitir(ws, mensaje)
            }
        })
    });


    wss.on('listening', () => {
        console.log(`Servidor abierto, puerto 8008`)
    })
}

init()

