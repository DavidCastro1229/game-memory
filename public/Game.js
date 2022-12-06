// Musica Fondo
let audio = new Audio('./styles/audios/principal.mp3');

// audios aleatorios
function sonidoAleatorio(){ 
    const pokemon=(max)=> Math.floor(Math.random()*(max-1)+1);
    switch(pokemon(4)){
    case 1:const audio1=new Audio('./styles/audios/acercate.mp3');audio1.play(); break;
    case 2:const audio2=new Audio('./styles/audios/Alerta.mp3'); audio2.play(); break; 
    case 3:const audio3=new Audio('./styles/audios/bruh.mp3'); audio3.play(); break;
    default: console.log("sonidoAleatorio")}}
// intro
function entrar(){
    setInterval(()=>{
        audio.play 
    }, 1000);
    setTimeout(() => {
        intro.style.display="none";
    }, 300);
};
// Inicializacion de variables
let tarjetasDestapadas=0;
let tarjeta1= null;
let tarjeta2=null;
let primerResultado=null;
let segundoResultado=null;
let movimientos=0;
let aciertos=0;
let temporizador=false;
let timerInical=30;
let timer=30;
let tiempoRegresivo=null;
let multiplayer=false;

// apuntando al documento html
let mostrarMovimientos= document.getElementById("movimientos");
let mostrarAciertos= document.getElementById("aciertos");
let MostrarTiempo=document.getElementById("time");
let fallaste=document.getElementById("fallaste");
let jugarDeNuevo=document.getElementById("reintentar");
let intro=document.getElementById("intro");
// numeros aleatorios
let numeros= [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
numeros= numeros.sort(()=>{return Math.random()-0.5});
//fonodo carta
for(i=0; i<=15; i++ ){
    let fondoCarta=document.getElementById(i);
    fondoCarta.innerHTML=`<img class="fondoCarta" src="styles/img/carta.jpg" alt="" /> `
}

// tiempo regresivo
function contarTiempo(stop){
    if(stop){
        return clearInterval(tiempoRegresivo);
    }

    tiempoRegresivo = setInterval(() => {
        timer--;
        MostrarTiempo.innerHTML=`Tiempo: ${timer} segundos`;
        if(timer<=10){
            MostrarTiempo.style.color="red";
           };
        // detener tiempo y detener juego
        if(timer==0 && multiplayer===false){
            clearInterval(tiempoRegresivo);
            endGame();
            MostrarTiempo.innerHTML=`Fallaste`;
            MostrarTiempo.style.color="red";
            MostrarTiempo.style.fontSize="20px"
            fallaste.style.display="grid";
            jugarDeNuevo.style.display="grid"
            
        };
        if(timer===0 && multiplayer===true){
            clearInterval(tiempoRegresivo);
            endGame();
            mostrarGanador();
            desafioNuevoEnPartida(true)
            document.getElementById("multiplayer").disabled=false;
            document.getElementById("multiplayer").style.background='white';
        }
    },1000);
};
function endGame(){
    if(multiplayer===false){
        for(let i=0; i<=15; i++){
            //boton
            let finJuego=document.getElementById(i);
            finJuego.innerHTML=`<img src="./styles/img/${numeros[i]}.png" alt="">`;
            finJuego.disabled=true;
        };    
    }else{
        for(let i=0; i<=27; i++){
            //boton
            let finJuego=document.getElementById(i);
            finJuego.innerHTML=`<img src="./styles/img/${numeros[i]}.png" alt="">`;
            finJuego.disabled=true;
        };
    }
    
};
function aciertosCompletados(){
    clearInterval(tiempoRegresivo);
    mostrarAciertos.innerHTML=`Aciertos Completados`;
    mostrarAciertos.style=color="yellow";
    if(multiplayer==false){
        jugarDeNuevo.innerHTML='Jugar de nuevo';
        jugarDeNuevo.style.display="grid";
        fallaste.innerHTML="Felicidades";
        fallaste.style.color="yellow";
        fallaste.style.display="grid";
    } else{
        timerInical=150;
    }
    MostrarTiempo.innerHTML= `Fantastico solo domoraste ${timerInical-timer}segundos`;
    MostrarTiempo.style.color="yellow";
    mostrarMovimientos.innerHTML= `Movimientos totales: ${movimientos}`;
    mostrarMovimientos.style.color="yellow";
}

// funcion principal
function destapar(id, turno){
   if(temporizador===false){
    contarTiempo(false);
    temporizador=true;
   };
   tarjetasDestapadas++;
   if(tarjetasDestapadas==1){
    // mostrar el primer tarjeta
    tarjeta1=document.getElementById(id);
    // mostar valor de botones en el html
    primerResultado=numeros[id];
    tarjeta1.innerHTML= `<img src="./styles/img/${primerResultado}.png" alt="">`;
    // desabilitar el primer boton presionado
    tarjeta1.disabled=true;
   }else if(tarjetasDestapadas==2){
       // mostrar segunda tarjeta
       tarjeta2=document.getElementById(id);
segundoResultado=numeros[id];
tarjeta2.innerHTML= `<img src="./styles/img/${segundoResultado}.png" alt="">`;
// desabilitar segundo boton
tarjeta2.disabled=true;
// aumentar movimientos
movimientos++;
mostrarMovimientos.innerHTML=`Movimientos:${movimientos}`;
// consultar resultados iguales

    if(primerResultado==segundoResultado){
    // encerrar contador tarjetas destapadas
    tarjetasDestapadas=0;
    // aumentar aciertos
    aciertos++;
    mostrarAciertos.innerHTML=`Aciertos: ${aciertos}`;
    if(multiplayer==true){
        turno ? AciertosOnlinePlayer1(1): AciertosOnlinePlayer2(1)
    }
    if(aciertos==8 && multiplayer===false){
        aciertosCompletados()
    };
    if(aciertos===14 && multiplayer===true){
        aciertosCompletados()
            mostrarGanador();
            desafioNuevoEnPartida(true)
            document.getElementById("multiplayer").disabled=false;
            document.getElementById("multiplayer").style.background='white';
    }
}else{
    sonidoAleatorio();
    // mostrar valores y volve a tapar
    setTimeout(()=>{
        tarjeta1.innerHTML='<img class="fondoCarta" src="styles/img/carta.jpg" alt="" />';
        tarjeta2.innerHTML='<img class="fondoCarta" src="styles/img/carta.jpg" alt="" />';
        tarjeta1.disabled=false;
        tarjeta2.disabled=false;
        tarjetasDestapadas=0;
        if(multiplayer===true){
            if(turno){
            return TurnoPlayer1(false, userName.value)
            }
            TurnoPlayer1(true, userName.value)
        }
    },800)
};
   };
};



function reintentar(revanchaArreglo){
    if(multiplayer===true){
    document.getElementById("desafioGo").disabled=true;
    numeros=revanchaArreglo;
        for(i=0; i<=27; i++){
            document.getElementById(i).disabled=false;
            document.getElementById(i).innerHTML=`<img class="fondoCarta" src="styles/img/carta.jpg" alt="" /> `
        }
        timer=150;
    }else{
        clearInterval(tiempoRegresivo);
        numeros= numeros.sort(()=>{return Math.random()-0.5});
        for(i=0; i<=15; i++){
        document.getElementById(i).disabled=false;
        document.getElementById(i).innerHTML=`<img class="fondoCarta" src="styles/img/carta.jpg" alt="" /> `
    }
    timer=30;
    };
MostrarTiempo.innerHTML="Tiempo: 30 segundos";
MostrarTiempo.style.color="white";
mostrarMovimientos.innerHTML="Movimientos: 0";
mostrarAciertos.innerHTML="Aciertos: 0";
aciertos=0;
movimientos=0;


temporizador=false
jugarDeNuevo.style.display="none"
fallaste.style.display="none"
}

function desafioOnline(arregloOnline, turno, desafioNuevo){
    console.log(arregloOnline);
    multiplayer=true;
    contarTiempo(true)
    numeros= arregloOnline;
    document.getElementById("todo").classList.add("todoMultiplayer");
    document.getElementById("main").classList.add("mainOnLiine");
    document.getElementById("section1").classList.add("section1Multiplayer");
    const seccion1 =  document.getElementById("section1")
    for(i=0;i<=15;i++){
        let btns = document.getElementById(i);
        btns.disabled=turno;
        btns.innerHTML = `<img class="fondoCarta" src="styles/img/carta.jpg" alt="" /> `
    }
    for(i=16; i<=27; i++){
        if(desafioNuevo === false || null){
            seccion1.innerHTML+= `<button class="marginCero" id=${i} onclick="destapar(${i}); destMultiplayer(${i})"></button>`
        }
            let botones = document.getElementById(i)
            botones.disabled=turno;
            botones.innerHTML=`<img class="fondoCarta" src="styles/img/carta.jpg" alt="" /> `
    }
    document.getElementById('mostrarResultado').style.display="none";
    document.getElementById("section2").classList.add("section2Multiplayer");
    document.getElementById("aceptarRevancha").style.display="none";
    MostrarTiempo.innerHTML="Tiempo: 30 segundos";
MostrarTiempo.style.color="white";
mostrarMovimientos.innerHTML="Movimientos: 0";
mostrarAciertos.innerHTML="Aciertos: 0";
aciertos=0;
movimientos=0;
timer=150;
temporizador=false;
jugarDeNuevo.style.display="none";
fallaste.style.display="none"
}
