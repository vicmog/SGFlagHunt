
// Clases de la biblioteca
// import * as THREE from "three"

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Tubo } from './tubo.js'
import { Tanque } from './Tanque.js'
import * as KeyCode from '../libs/keycode.esm.js';
import { Luna } from './Luna.js';
import { Botiquin } from './Botiquin.js';
import { Misil } from './Misil.js';
import { Estrella } from './Estrella.js'
import { Dron } from './Dron.js'
import { Bomba } from './Bomba.js'
import { Bandera } from './Bandera.js'
import { MuroBasico } from './MuroBasico.js';

 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  // Recibe el  div  que se ha creado en el  html  que va a ser el lienzo en el que mostrar
  // la visualización de la escena
  constructor (myCanvas) { 
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se crea la interfaz gráfica de usuario
    this.gui = this.createGUI ();
    this.camaraPrincipal = true;
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    //this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();
  

    this.createLights();
 

    this.tubo = new Tubo();
    this.tanque = new Tanque(this.tubo.getTubeGeometry(),this);
    this.luna = new Luna();
  
    ;
    // Mover la luna
    this.luna.position.set(-100, 100, 10);

    this.candidatos = [];
    this.objects = [];
    this.pickableObjects = [this.luna];
    this.tengoEstrella = false;

    this.createRayos();

    // PICKING
    this.raton = new THREE.Vector2();
    this.raycasterRaton = new THREE.Raycaster();
  

    // Objetos Variables
    this.addObjetos();

    this.add(this.luna);
    this.add(this.tanque);
    this.add(this.tubo);

    this.score = 0;
    this.maxLife = 100;
    this.currentLife = this.maxLife;

  }

  updateLifeBar() {
    const lifeBar = document.getElementById('lifeBar');
    const lifePercentage = (this.currentLife / this.maxLife) * 100;
    lifeBar.style.width = lifePercentage + '%';
  }

  updatePuntuacion(score) {
    if(this.tengoEstrella){
      this.score += score * 2;
    }else{
      this.score += score;
    }
    document.getElementById('score').innerText = 'Puntuacion: ' + this.score;

  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vértical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // También se indica dónde se coloca
    this.camera.position.set (0, 10, 300);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);

    this.camara = this.camera;
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightPower : 100.0,  // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity : 0.35,
      axisOnOff : true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la potencia de la luz puntual
    folder.add (this.guiControls, 'lightPower', 0, 200, 10)
      .name('Luz puntual : ')
      .onChange ( (value) => this.setLightPower(value) );
    
    // Otro para la intensidad de la luz ambiental
    folder.add (this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange ( (value) => this.setAmbientIntensity(value) );
      
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    const ambientLight = new THREE.AmbientLight(0xffffff,0.2);
    // Sombra
    this.add(ambientLight);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    //return this.camera;
    return this.camara;
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
    
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }
  // Funcion para colisiones
  createRayos(){
    var distancia = 2;
    this.rayos = [];
    let posiciones = [];

    var posicion  = new THREE.Vector3();
    this.tanque.nodoTranslacionY.getWorldPosition(posicion);

    var direccion = new THREE.Vector3(0,0,0);
    this.tanque.nodoPosOrientTubo.getWorldDirection(direccion);

    posiciones.push(posicion);

    var posicionPrimerRayo = posicion.clone();
    posicionPrimerRayo.y -= 1;
    posiciones.push(posicionPrimerRayo);

    var posicionSegundoRayo = posicion.clone();
    posicionSegundoRayo.y -= 2;
    posicionSegundoRayo.x += 1;
    posiciones.push(posicionSegundoRayo);

    var posicionTercerRayo = posicion.clone();
    posicionTercerRayo.y -= 2;
    posicionTercerRayo.x -= 1;
    posiciones.push(posicionTercerRayo);

    var posicionCuartoRayo = posicion.clone();
    posicionCuartoRayo.y += 0.2;
    posicionCuartoRayo.x += 1;
    posiciones.push(posicionCuartoRayo);

    var posicionQuintoRayo = posicion.clone();
    posicionQuintoRayo.y += 0.1;
    posicionQuintoRayo.x -= 1;
    posiciones.push(posicionQuintoRayo);

    var posicionSextoRayo = posicion.clone();
    posicionSextoRayo.y += 0.1;
    posiciones.push(posicionSextoRayo);

    var posicionSeptimoRayo = posicion.clone();
    posicionSeptimoRayo.y -= 2;
    posiciones.push(posicionSeptimoRayo);


    for(let i = 0; i < posiciones.length; i++){
      this.rayos.push(new THREE.Raycaster(posiciones[i], direccion,0,distancia));
    }

    this.impactados = [];

    for(let i = 0; i < this.rayos.length; i++){
      this.impactados.push(this.rayos[i].intersectObjects(this.candidatos, true));
    }

    for(let i = 0; i < this.impactados.length; i++){
      if(this.impactados[i].length > 0){
        var obj = this.impactados[i][0].object;
        if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
          obj.parent.visible = false;
        }

        if(obj.parent.userData == "estrella"){
          obj = obj.parent.parent.parent.parent.parent;
          this.remove(obj);
          this.currentLife -= 10;
          this.updateLifeBar();
        }
      }
    }
    
  }
  

  updateRayos() {
    let posiciones = [];
    var posicion  = new THREE.Vector3();
    this.tanque.nodoTranslacionY.getWorldPosition(posicion);
    posiciones.push(posicion);

    var direccion = new THREE.Vector3(0,0,0);
    this.tanque.nodoPosOrientTubo.getWorldDirection(direccion);

    var posicionPrimerRayo = posicion.clone();
    posicionPrimerRayo.y -= 1;
    posiciones.push(posicionPrimerRayo);


    var posicionSegundoRayo = posicion.clone();
    posicionSegundoRayo.y -= 2;
    posicionSegundoRayo.x += 1;
    posiciones.push(posicionSegundoRayo);


    var posicionTercerRayo = posicion.clone();
    posicionTercerRayo.y -= 2;
    posicionTercerRayo.x -= 1;
    posiciones.push(posicionTercerRayo);
 

    var posicionCuartoRayo = posicion.clone();
    posicionCuartoRayo.y += 0.2;
    posicionCuartoRayo.x += 1;
    posiciones.push(posicionCuartoRayo);

    var posicionQuintoRayo = posicion.clone();
    posicionQuintoRayo.y += 0.1;
    posicionQuintoRayo.x -= 1;
    posiciones.push(posicionQuintoRayo);


    var posicionSextoRayo = posicion.clone();
    posicionSextoRayo.y += 0.1;
    posiciones.push(posicionSextoRayo);


    var posicionSeptimoRayo = posicion.clone();
    posicionSeptimoRayo.y -= 2;
    posiciones.push(posicionSeptimoRayo);

    for(let i = 0; i < posiciones.length; i++){
      this.rayos[i].set(posiciones[i], direccion);
    }

    this.impactados = [];

    for(let i = 0; i < this.rayos.length; i++){
      this.impactados.push(this.rayos[i].intersectObjects(this.candidatos, true));
    }

    for(let i = 0; i < this.impactados.length; i++){
      if(this.impactados[i].length > 0){
        var obj = this.impactados[i][0].object;

        if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
          
          obj.parent.visible = false;

          if(this.currentLife < this.maxLife){
            this.currentLife += 10;
            if(this.currentLife > this.maxLife){
              this.currentLife = this.maxLife;
            }
            this.updateLifeBar();
          }

        }else if(obj.parent.userData == "estrella" && obj.parent.visible == true){
          obj.parent.visible = false; 

          this.tengoEstrella = true;
          this.actualizaEstadoEstrella();
          this.updatePuntuacion(10);
          this.desabilitarEstrella();
          
        }else if(obj.parent.userData == "bomba" && obj.parent.visible == true){
          obj.parent.visible = false;

         if(!this.tengoEstrella){
            this.currentLife -= 10;
            
            if(this.currentLife <= 0){
              this.currentLife = 0;
              this.updateLifeBar();
              this.showGameOver();
            }

            this.updateLifeBar();
         }
         

        }else if(obj.parent.userData == "bandera" && obj.parent.visible == true){
          obj.parent.visible = false;
          this.updatePuntuacion(10);

        }else if(obj.parent.userData == "muro" && obj.parent.visible == true){
          obj.parent.visible = false;
          if(!this.tengoEstrella){
            this.currentLife -= 30;

            if(this.currentLife <= 0){
              this.currentLife = 0;
              this.updateLifeBar();
              this.showGameOver();
            }
  
            this.updateLifeBar();
          }
          
        }

      }
    }
}



  desabilitarEstrella(){
    setTimeout(() => {
      this.tengoEstrella = false;
      this.actualizaEstadoEstrella();
    }, 10000);
  }


  actualizaEstadoEstrella(){
    const starStatus = document.getElementById('starStatus');
    starStatus.innerText = 'Estrella: ' + (this.tengoEstrella ? 'Sí' : 'No');
  }

  addObjetos(){

    let nDron = 3;
    let nBotiquin = 6;
    let nBomba = 12;
    let nEstrella = 1;
    let nBanderas = 20;
    let nMuros = 5;
    let nMisiles = 3;


   

    for(let i=0;i<this.objects.length;i++){
      this.remove(this.objects[i]);
    }

    this.candidatos = [];
    this.objects = [];
    this.pickableObjects = [this.luna];

    for(let i = 0; i < nMisiles; i++){
      let nAleatorio = Math.random()*360;
      let misil = new Misil(this.tubo.getTubeGeometry(),nAleatorio,nAleatorio);
      this.pickableObjects.push(misil);
      this.objects.push(misil);
    }
    
    for(let i = 0; i < nDron; i++){
      let nAleatorio = Math.random();
      let dron = new Dron(this.tubo.getTubeGeometry(), nAleatorio);
      this.pickableObjects.push(dron);
      this.objects.push(dron);
    }

    for(let i = 0; i < nBotiquin; i++){
      let nAleatorio = Math.random();
      let angulo = Math.random() * 360;
      let botiquin = new Botiquin(this.tubo.getTubeGeometry(), nAleatorio,angulo);

      this.candidatos.push(botiquin);
      this.objects.push(botiquin);
    }

    for(let i = 0; i < nBomba; i++){
      let nAleatorio = Math.random();
      let angulo = Math.random() * 360;
      let bomba = new Bomba(this.tubo.getTubeGeometry(), nAleatorio,angulo);
      this.candidatos.push(bomba);
      this.objects.push(bomba);
    }

    for(let i = 0; i < nEstrella; i++){
      let nAleatorio = Math.random();
      let angulo = Math.random() * 360;
      let estrella = new Estrella(this.tubo.getTubeGeometry(), nAleatorio,angulo);
      this.candidatos.push(estrella);
      this.objects.push(estrella);
    }


    let imgs = ['../imgs/marruecos.png','../imgs/spain.svg','../imgs/francia.png','../imgs/england.png','../imgs/italy.jpg'];

    for(let i = 0; i < nBanderas; i++){
      let nAleatorio = Math.random();
      let angulo = Math.random() * 360;
      let bandera = new Bandera(imgs[i%imgs.length],this.tubo.getTubeGeometry(), nAleatorio,angulo);
      this.candidatos.push(bandera);
      this.objects.push(bandera);
    }

    for(let i = 0; i < nMuros; i++){
      let nAleatorio = Math.random();
      let angulo = Math.random() * 360;
      let muro = new MuroBasico(this.tubo.getTubeGeometry(), nAleatorio,angulo);
      this.candidatos.push(muro);
      this.objects.push(muro);
    }


    for(let i = 0; i < this.objects.length; i++){
      this.add(this.objects[i]);
    }


  }


  showGameOver() {
    this.tanque.pararAnimacion();
    document.getElementById('finalScore').innerText = 'Puntuacion final: ' + this.score;
    document.getElementById('gameOver').style.display = 'flex';
  }



  // Funcion para el picking
  onDocumentMouseDown(event){
    this.raton.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.raton.y = 1 - 2 * (event.clientY / window.innerHeight);
    this.raycasterRaton.setFromCamera(this.raton, this.getCamera());
    
    var pickedObjects = this.raycasterRaton.intersectObjects(this.pickableObjects, true);

    if (pickedObjects.length > 0) { 
        var objeto = pickedObjects[0].object;
        /*while (objeto.parent && objeto.parent !== this) {
          objeto = objeto.parent;
        }*/
      
      
        objeto.parent.visible = false;
        this.updatePuntuacion(30);
    }
  }
  // Funcion para el movimiento del tanque
  onKeyDown (event) {
    var mov = event.key;
    switch (mov) {
      case 'ArrowLeft':
        this.tanque.girarIzda();
        break;
      case 'ArrowRight':
        this.tanque.girarDerecha();
        break;
      case ' ':
        if(!this.camaraPrincipal){
          this.camara = this.camera;
          this.camaraPrincipal = true;
        }else{
          this.camara = this.tanque.getCameraPersonaje();
          this.camaraPrincipal = false;
        }

      default:
        break;
    }
  }
  update () {
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
    // Movimiento
    if(this.tanque.dcha){
      this.tanque.girarDerecha();
    }
    if(this.tanque.izda){
      this.tanque.girarIzda();
    }
    this.updateRayos();
    // Se actualiza el resto del modelo
    this.tubo.update();
    this.tanque.update();

     // Actualiza cada objeto que tiene un método update
     this.objects.forEach(obj => {
      if (typeof obj.update === 'function') {
        obj.update();
      }
    });

   


    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}


/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Movimiento del tanque
  window.addEventListener ("keydown", (event) => scene.onKeyDown(event));

  // Raton
  window.addEventListener ("click", (event) => scene.onDocumentMouseDown(event));


  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});