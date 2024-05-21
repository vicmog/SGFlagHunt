
// Clases de la biblioteca
// import * as THREE from "three"

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Tubo } from './tubo.js'
import { Tanque } from './Tanque.js'
import * as KeyCode from '../libs/keycode.esm.js';
import { Luna } from '../objetosP2/Luna.js';
import { Botiquin } from '../objetosP2/Botiquin.js';
import { Misil } from '../objetosP2/Misil.js';
import { Estrella } from './Estrella.js'
import { Dron } from '../objetosP2/Dron.js'

 
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
    
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    /*this.axis = new THREE.AxesHelper (10);
    this.add (this.axis);*/

 

    this.tubo = new Tubo();
    this.tanque = new Tanque(this.tubo.getTubeGeometry());
    this.luna = new Luna();
    this.misil = new Misil(this.tubo.getTubeGeometry(),0,0);
    this.misil2 = new Misil(this.tubo.getTubeGeometry(),0.5,200);
    this.misil3 = new Misil(this.tubo.getTubeGeometry(),0.7,100);
    this.dron = new Dron(this.tubo.getTubeGeometry(),0.5);
    // Mover la luna
    this.luna.position.set(-100, 100, 10);

    this.botiquin = new Botiquin(this.tubo.getTubeGeometry(), 0.1);
    this.botiquin2 = new Botiquin(this.tubo.getTubeGeometry(), 0.2);
    this.botiquin3 = new Botiquin(this.tubo.getTubeGeometry(), 0.5);
    this.botiquin4 = new Botiquin(this.tubo.getTubeGeometry(), 0.7);    
    this.botiquin5 = new Botiquin(this.tubo.getTubeGeometry(), 0.9);

    this.estrella = new Estrella(this.tubo.getTubeGeometry(), 0.3);
    this.estrella2 = new Estrella(this.tubo.getTubeGeometry(), 0.6);
    this.estrella3 = new Estrella(this.tubo.getTubeGeometry(), 0.8);





    this.createRayos();


    // PICKING
    this.raton = new THREE.Vector2();
    this.raycasterRaton = new THREE.Raycaster();
    
    this.add(this.botiquin);
    this.add(this.botiquin2);
    this.add(this.botiquin3);
    this.add(this.botiquin4);
    this.add(this.botiquin5);

    this.add(this.estrella);
    this.add(this.estrella2);
    this.add(this.estrella3);


    this.add(this.misil);
    this.add(this.misil2);
    this.add(this.misil3);

    this.add(this.dron);

    this.add(this.luna);
    this.add(this.tanque);
    this.add(this.tubo);
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
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.add(ambientLight);


    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    this.add(pointLight);

    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    // La añadimos a la escena
    this.add (this.ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.pointLight = new THREE.SpotLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 3, 1 );
    this.add (this.pointLight);
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
    var distancia = 5;
    this.rayo = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, distancia);
    this.rayo2 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, distancia);
    this.rayo3 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, distancia);
    this.rayo4 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, distancia);
    this.rayo5 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, distancia);
    this.rayo6 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, distancia);
    this.rayo7 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,0,0), 0, distancia);

    var posicion  = new THREE.Vector3();
    this.tanque.nodoTranslacionY.getWorldPosition(posicion);

    var direccion = new THREE.Vector3(0,0,0);
    this.tanque.nodoPosOrientTubo.getWorldDirection(direccion);


    var posicionPrimerRayo = posicion.clone();
    posicionPrimerRayo.y -= 1;
    this.rayo.set(posicionPrimerRayo, direccion);


    var posicionSegundoRayo = posicion.clone();
    posicionSegundoRayo.y -= 2;
    posicionSegundoRayo.x += 1;
    this.rayo2.set(posicionSegundoRayo, direccion);


    var posicionTercerRayo = posicion.clone();
    posicionTercerRayo.y -= 2;
    posicionTercerRayo.x -= 1;
    this.rayo3.set(posicionTercerRayo, direccion);


    var posicionCuartoRayo = posicion.clone();
    posicionCuartoRayo.y += 0.2;
    posicionCuartoRayo.x += 1;
    this.rayo4.set(posicionCuartoRayo, direccion);


    var posicionQuintoRayo = posicion.clone();
    posicionQuintoRayo.y += 0.1;
    posicionQuintoRayo.x -= 1;
    this.rayo5.set(posicionQuintoRayo, direccion);


    var posicionSextoRayo = posicion.clone();
    posicionSextoRayo.y += 0.1;
    this.rayo6.set(posicionSextoRayo, direccion);


    var posicionSeptimoRayo = posicion.clone();
    posicionSeptimoRayo.y -= 2;
    this.rayo7.set(posicionSeptimoRayo, direccion);


    
    this.candidatos = [this.botiquin, this.botiquin2, this.botiquin3, this.botiquin4, this.botiquin5, this.estrella, this.estrella2, this.estrella3];

    var impactados = this.rayo.intersectObjects(this.candidatos, true);
    var impactados2 = this.rayo2.intersectObjects(this.candidatos, true);
    var impactados3 = this.rayo3.intersectObjects(this.candidatos, true);
    var impactados4 = this.rayo4.intersectObjects(this.candidatos, true);
    var impactados5 = this.rayo5.intersectObjects(this.candidatos, true);
    var impactados6 = this.rayo6.intersectObjects(this.candidatos, true);
    var impactados7 = this.rayo7.intersectObjects(this.candidatos, true);

    if(impactados.length > 0){
      var obj = impactados[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados2.length > 0){
      var obj = impactados2[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados3.length > 0){
      var obj = impactados3[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados4.length > 0){
      var obj = impactados4[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados5.length > 0){
      var obj = impactados5[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados6.length > 0){
      var obj = impactados6[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados7.length > 0){
      var obj = impactados7[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    
  }

  updateRayos() {
    var posicion  = new THREE.Vector3();
    this.tanque.nodoTranslacionY.getWorldPosition(posicion);

    var direccion = new THREE.Vector3(0,0,0);
    this.tanque.nodoPosOrientTubo.getWorldDirection(direccion);

    var posicionPrimerRayo = posicion.clone();
    posicionPrimerRayo.y -= 1;
    this.rayo.set(posicionPrimerRayo, direccion);


    var posicionSegundoRayo = posicion.clone();
    posicionSegundoRayo.y -= 2;
    posicionSegundoRayo.x += 1;
    this.rayo2.set(posicionSegundoRayo, direccion);


    var posicionTercerRayo = posicion.clone();
    posicionTercerRayo.y -= 2;
    posicionTercerRayo.x -= 1;
    this.rayo3.set(posicionTercerRayo, direccion);
 

    var posicionCuartoRayo = posicion.clone();
    posicionCuartoRayo.y += 0.2;
    posicionCuartoRayo.x += 1;
    this.rayo4.set(posicionCuartoRayo, direccion);


    var posicionQuintoRayo = posicion.clone();
    posicionQuintoRayo.y += 0.1;
    posicionQuintoRayo.x -= 1;
    this.rayo5.set(posicionQuintoRayo, direccion);


    var posicionSextoRayo = posicion.clone();
    posicionSextoRayo.y += 0.1;
    this.rayo6.set(posicionSextoRayo, direccion);


    var posicionSeptimoRayo = posicion.clone();
    posicionSeptimoRayo.y -= 2;
    this.rayo7.set(posicionSeptimoRayo, direccion);

    var impactados = this.rayo.intersectObjects(this.candidatos, true);
    var impactados2 = this.rayo2.intersectObjects(this.candidatos, true);
    var impactados3 = this.rayo3.intersectObjects(this.candidatos, true);
    var impactados4 = this.rayo4.intersectObjects(this.candidatos, true);
    var impactados5 = this.rayo5.intersectObjects(this.candidatos, true);
    var impactados6 = this.rayo6.intersectObjects(this.candidatos, true);
    var impactados7 = this.rayo7.intersectObjects(this.candidatos, true);

    if(impactados.length > 0){
      var obj = impactados[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados2.length > 0){
      var obj = impactados2[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados3.length > 0){
      var obj = impactados3[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados4.length > 0){
      var obj = impactados4[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados5.length > 0){
      var obj = impactados5[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados6.length > 0){
      var obj = impactados6[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }

    if(impactados7.length > 0){
      var obj = impactados7[0].object;
      if(obj.parent.userData == "botiquin" && obj.parent.visible == true){
        console.log("COLISION CON BOTIQUIN");
        obj.parent.visible = false;
      }

      if(obj.parent.userData == "estrella" && obj.parent.visible == true){
        console.log("COLISION CON ESTRELLA");
        obj.parent.visible = false;
      }
    }
}


  // Funcion para el picking
  onDocumentMouseDown(event){
    this.raton.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.raton.y = 1 - 2 * (event.clientY / window.innerHeight);
    this.raycasterRaton.setFromCamera(this.raton, this.getCamera());
    var pickableObjects = [this.luna,this.misil,this.misil2,this.misil3,this.dron];
    
    var pickedObjects = this.raycasterRaton.intersectObjects(pickableObjects, true);

    if (pickedObjects.length > 0) { 
        var objeto = pickedObjects[0].object;
        var selectedPoint = pickedObjects[0].point;
        while (objeto.parent && objeto.parent !== this) {
          objeto = objeto.parent;
        }
      
      // Ahora `objeto` es el primer padre del objeto seleccionado
        objeto.visible = false;
        console.log(objeto);
        console.log(selectedPoint);
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
    this.dron.update();
    this.estrella.update();
    this.estrella2.update();
    this.estrella3.update();
     // Colisiones
     //this.createRayos();

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
