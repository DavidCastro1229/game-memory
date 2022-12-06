const { Router }= require('express')
const rutas=Router();
const {userConnect, obtenerUsuariosConectados, userDisconnect} = require('../controllers/controllers')

rutas.post('/obtenerUsuariosConectados',obtenerUsuariosConectados);
rutas.post('/userConnect', userConnect);
rutas.delete('/userDisconnect/:socket', userDisconnect);
    
module.exports= rutas;