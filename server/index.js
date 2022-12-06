const express =require('express');
const morgan=require('morgan');
const cors=require('cors');
const http = require('http')
const {Server} =require('socket.io');
const Axios = require('axios')
//configuracion para webSocket
const app=express();
const server = http.createServer(app);// modulo http usa las configuraciones de express

const io= new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        method:["GET", "POST"]
    }
})


// agregar diirecctiorio para que el app pueda acceder al fornt end desde suu mismo app
const path = require('path')
const root = path.join(__dirname, '../public')

// middlewire
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// usa el front end con el mismo puerto
app.use(express.static(root))

// manejador de errores

// routes
const rutas=require('./routes/rutas');
const { disconnect } = require('process');
app.use(rutas);


//iniciar server
server.listen(process.env.PORT || 4000, ()=>console.log('server activo'));

io.on('connection', (socket)=>{
    const username = socket.handshake.auth.username;
    socket.username=username

    let users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID:id,
            userName:socket.username
        });
       };
    socket.on("user name", name=>{
        socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: name,
    });
    io.to(socket.id).emit("users", users);
});
    socket.on("desafiar", (desafio, id)=>{
        io.to(id).emit("desafio privado", desafio, socket.id)

      });
      socket.on("disconnect", ()=>{
        io.sockets.emit("usuario desconectado", socket.id)
      }); 
        socket.on("disconnecting", () => {
  });
          //desafio
    socket.on("aceptar desafio", (to, arreglo, username)=>{
        
        let sala=to+socket.username;
        socket.join(sala);
        io.to(to).emit("desafio aceptado", sala, arreglo, username, socket.id)
    });
    socket.on("unirse a sala de partida", sala=>{
        socket.join(sala)
    })
    socket.on("destapar", (idBtn, sala)=>socket.to(sala).emit("destapar btn", idBtn) )
    socket.on("enviar jugar de nuevo", (sala, username)=> socket.to(sala).emit("recibir jugar de nuevo!", username))
    socket.on("revancha aceptada", (sala, nuevoArreglo)=> socket.to(sala).emit("poner nuevo arreglo de revancha", nuevoArreglo))

    socket.on("salir de sala", (sala, salirPlayerDOs)=>{
        if(salirPlayerDOs){
        return socket.leave(sala);
        }
        socket.to(sala).emit("usuario abandono sala", sala)
         socket.leave(sala);
         
    })
    
    
 });
