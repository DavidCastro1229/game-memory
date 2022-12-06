const {dataBase} = require('../dataBase/dataBase');


const userConnect= async(req, res)=>{
    const {name, socket} = req.body;
    const ressult= await dataBase.query('INSERT INTO conectados (name, socket) VALUES($1, $2)', [name, socket])
    res.send(ressult.rows);
}
const obtenerUsuariosConectados= async(req, res)=>{
  const {socket}= req.body;
    const ressult= await dataBase.query("SELECT * FROM conectados WHERE socket NOT LIKE($1)", [socket]);
    res.send(ressult.rows);
}
const userDisconnect= async(req, res)=>{
    const {socket}= req.params;
        await dataBase.query("DELETE FROM conectados WHERE socket = $1 ", [socket])
       res.send('conexion eliminada');
    
};
module.exports= { userConnect, obtenerUsuariosConectados, userDisconnect }