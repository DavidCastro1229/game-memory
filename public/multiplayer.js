const btnMulti=document.getElementById('multiplayer');
const mulltiplayerContainer=document.getElementById('mulltiplayerContainer')
const conectados=document.getElementById('juagadoresconectados');
const userName=document.getElementById('userName');
const ok=document.getElementById('ok');
const desafio=document.getElementById('desafio');
const jugadorVsjuagador=document.getElementById('jugadorVsjuagador');
const player1=document.getElementById('player1');
const player2=document.getElementById('player2');
const mostrarResultado=document.getElementById('mostrarResultado');
const turnoDe=document.getElementById('turnoDe');




let aparecerContainer=true; 
let aparecerDesafio=false;
let desafiosID=null;
let userDesafioOnline=undefined
let salas=null;
let aciertosPlayer1=0;
let aciertosPlayer2=0;
let desafioNuevo=false;
let cambiarNombre=true;
let ultimoUser;
const socket = io({
    autoConnect: false
});
function Iniciar(){
    if(userName.value.length <=7 && userName.value.length >=1 ){
        ok.disabled=true;
        socket.auth = { username:userName.value };
        socket.connect();
        socket.emit("user name", userName.value)
        entrar()
    }else{
        if(userName.value.length < 1){
            document.getElementById("nombreLargo").style.display="block";
            document.getElementById("nombreLargo").innerHTML="ingresa un nombre"
            return setTimeout(() => {
                document.getElementById("nombreLargo").style.display="none";
            }, 3000);
        }        
        document.getElementById("nombreLargo").style.display="block";
        document.getElementById("nombreLargo").innerHTML="Tu nombre debe ser menor a 8 caracteres"
        setTimeout(() => {
            document.getElementById("nombreLargo").style.display="none";
        }, 3000);
    }
}
  
socket.on("users", (users)=>{
        let indice = users.indexOf(socket.id)
        users.splice(indice, 1)
        if(users.length !==0){
            users.map((user)=>{
          conectados.innerHTML += `<article id=${"target"+user.userID} class="targetaConectado" > <p class="textPokemon marginCero textIluminado" >${user.userName}</p> <img id=${user.userID}  onClick="Desafiar(id)" class="battle"  src="styles/img/battle.png" /> </article>`
        })
            }
    }
    );
socket.on("user connected", (user)=>{    
    conectados.innerHTML += `<article id=${"target"+user.userID} class="targetaConectado" > <p class="textPokemon marginCero textIluminado" >${user.username}</p><img id=${user.userID}  onClick="Desafiar(id)" class="battle"  src="styles/img/battle.png" />  </article>`
});
function Desafiar(enviarID){
    const userDesafio=userName.value
    socket.emit("desafiar", userDesafio, enviarID)
};



let userIdEnpartida;
socket.on("desafio privado", (userDesafio, socketID)=>{
    ultimoUser=userDesafio
    desafiosID=socketID;
    if(cambiarNombre===true){//
        userDesafioOnline=userDesafio
        userIdEnpartida=socketID

    }
    document.getElementById("targetDesafio").style.opacity="100"
    desafio.style.display="grid"
    desafio.style.height="80px"
    document.getElementById("targetDesafio").style.height="80%"
    document.getElementById("desafioNombre").innerHTML=userDesafio
    setTimeout(() => {
        desafio.style.height="0px"
    document.getElementById("targetDesafio").style.opacity="0"
    }, 5000);
});

socket.on("usuario desconectado", id=>{
    conectados.removeChild(document.getElementById(`target${id}`))
});

// btnMulti.addEventListener('click', ()=>{
//     if(aparecerContainer){
//         mulltiplayerContainer.style.display='block';     
//         btnMulti.style.background='yellow';
//         aparecerContainer=false
//     }else{
//         mulltiplayerContainer.style.display='none';  
//         btnMulti.style.background='white';
//         aparecerContainer=true
//     }
// });

//Desafio aceotado ?
function AceptarDesafio(){
    turnoDe.style.visibility="hidden";
    cambiarNombre=false;
    document.getElementById("desafioGo").disabled=true;
    let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9 ,10 ,10 ,11, 11 ,12 ,12 ,13 ,13 ,14 ,14];
    numeros = numeros.sort(()=>{return Math.random()-0.5});
    if(desafioNuevo===true){
        document.getElementById(userIdEnpartida).style.display="block"
        userDesafioOnline=ultimoUser;
        userIdEnpartida=desafiosID;
        socket.emit("salir de sala", salas);
    }
    salas=desafiosID+userName.value;
    socket.emit("aceptar desafio", desafiosID, numeros, userName.value);
    desafioOnline(numeros, false, desafioNuevo);
    mostrarNombresDeVs(userDesafioOnline, userName.value)
    document.getElementById(userIdEnpartida).style.display="none"
    
    
}
function desafioNuevoEnPartida(nuevo){
    desafioNuevo=nuevo;
    document.getElementById("desafioGo").disabled=false;
}
function mostrarNombresDeVs(usernameRival, meUSerNAme){
    player1.innerHTML=`${usernameRival}<br> <p id="player1Puntaje"></p>`;
    player2.innerHTML=`${meUSerNAme}<br> <p id="player2Puntaje"></p>`;
    mulltiplayerContainer.style.display="none";
   jugadorVsjuagador.style.display="flex";
   btnMulti.style.background='yellow';
   btnMulti.disabled=true
}
socket.on("desafio aceptado", (sala, arreglo, username, idRival)=>{
    desafiosID=idRival;
    turnoDe.style.visibility="hidden";
    document.getElementById("desafioGo").disabled=true;
    cambiarNombre=false;
    if(desafioNuevo===true){
        socket.emit("salir de sala", salas)
    }
    salas=sala;
    socket.emit("unirse a sala de partida", sala)
    userDesafioOnline=username;
    userIdEnpartida=idRival;
    mostrarNombresDeVs(username, userName.value)
    desafioOnline(arreglo, true, desafioNuevo);
    document.getElementById(userIdEnpartida).style.display="none"
});
 function destMultiplayer(id){
     socket.emit("destapar", id, salas )
}
 socket.on("destapar btn", (idBtn)=>destapar(idBtn, true))

 function TurnoPlayer1(turno, userName){
     for(i=0; i<=27; i++){
         document.getElementById(i).disabled=turno
 }
 if(!turno){
     turnoDe.style.visibility="visible"
     document.getElementById("turnoPlayer").innerHTML = "tu turno"
    setTimeout(() => {
        turnoDe.style.visibility="hidden"
    }, 800);
}else{
    turnoDe.style.visibility="visible"
    document.getElementById("turnoPlayer").innerHTML = "turno de "+userDesafioOnline
     setTimeout(() => {
         turnoDe.style.visibility="hidden"
     }, 800);

 }
}

function AciertosOnlinePlayer1(aciertos){
    aciertosPlayer1++
    document.getElementById("player1Puntaje").innerHTML= aciertosPlayer1;
}

function AciertosOnlinePlayer2(aciertos){
    aciertosPlayer2++
    document.getElementById("player2Puntaje").innerHTML= aciertosPlayer2;
}

function mostrarGanador(){
    setTimeout(() => {
        btnMulti.style.backgroundColor="yellow"
        mulltiplayerContainer.style.display="block"
    }, 2000);
    jugadorVsjuagador.style.display="none";
    mostrarResultado.style.display="flex";
    if(aciertosPlayer1>aciertosPlayer2){
       return mostrarResultado.innerHTML=`<p class="textPokemon textMediano textAzul"> gana <p class="textPokemon textMediano">${userDesafioOnline} <br> </p>
       <br> <button class="btnPequeño textPokemon textPequeño" onclick="JugarOtraVezOnline()" >¿Revancha?</button> </p>` 
       
    }else if(aciertosPlayer1<aciertosPlayer2){
    return mostrarResultado.innerHTML=`<p class="textPokemon textMediano textAzul">Eres el Ganador <br> <button class="btnPequeño textPokemon textPequeño" onclick="JugarOtraVezOnline()" >¿Otra?</button></p>`
}
return mostrarResultado.innerHTML=`<p class="textPokemon textMediano textAzul">Empate <br> <button class="btnPequeño textPokemon textPequeño" onclick="JugarOtraVezOnline()" >¿Revancha?</button></p>`
}

function JugarOtraVezOnline(){
    socket.emit("enviar jugar de nuevo", salas, userName.value)
}
socket.on("recibir jugar de nuevo!", (user)=>{   
    document.getElementById("aceptarRevancha").style.display="block";
    document.getElementById("imgTurnos").setAttribute("src", "./styles/img/fist.png");
    document.getElementById("turnoPlayer").innerHTML = `${user} busca revancha !!`;
    turnoDe.style.visibility="visible"
}
)

function  AceptarRevancha(){
    mostrarResultado.style.display="none";
    jugadorVsjuagador.style.display="flex";
    setTimeout(() => {
        turnoDe.style.visibility="hidden"
        document.getElementById("aceptarRevancha").style.display="none";
        document.getElementById("imgTurnos").setAttribute("src", "./styles/img/fight.png");
    }, 500);
    let nuevoArreglo = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9 ,10 ,10 ,11, 11 ,12 ,12 ,13 ,13 ,14 ,14];
    nuevoArreglo=nuevoArreglo.sort(()=>{return Math.random()-0.5});
    socket.emit("revancha aceptada", salas, nuevoArreglo);
    mostrarNombresDeVs(userDesafioOnline, userName.value);
    reintentar(nuevoArreglo);
    aciertosPlayer1=0;
    aciertosPlayer2=0;
    document.getElementById("player1Puntaje").innerHTML= "";
    document.getElementById("player2Puntaje").innerHTML= "";
    btnMulti.disabled=true
}

socket.on("poner nuevo arreglo de revancha", (nuevoArreglo)=>{
    mostrarResultado.style.display="none";
    jugadorVsjuagador.style.display="flex";
    reintentar(nuevoArreglo)
    aciertosPlayer1=0;
    aciertosPlayer2=0
    turnoDe.style.visibility="hidden"
    document.getElementById("player1Puntaje").innerHTML= "";
    document.getElementById("player2Puntaje").innerHTML= "";
    btnMulti.disabled=true
    })
    socket.on("usuario abandono sala", (sala)=>{
        socket.emit("salir de sala",sala, true);
        cambiarNombre=true;
        desafioNuevo=true;
        document.getElementById("imgTurnos").style.display="none"
        document.getElementById("aceptarRevancha").style.display="none"
        turnoDe.style.visibility="visible";
        document.getElementById("turnoPlayer").classList.add("textRed");
        document.getElementById("turnoPlayer").innerHTML=`${userDesafioOnline} Abandono la sala`;
        document.getElementById(userIdEnpartida).style.display="block";
    })