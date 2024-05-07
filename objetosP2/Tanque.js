import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';
import { Tubo } from '../p2/tubo.js';
import * as TWEEN from '../libs/tween.esm.js';



class Tanque extends THREE.Object3D{

    constructor(geometriaTubo){
        super();

        this.tubo = geometriaTubo;
        this.path = geometriaTubo.parameters.path;
        this.radio = geometriaTubo.parameters.radius;
        this.segmentos = geometriaTubo.parameters.tubularSegments;
        this.t = 0 ;
        this.alfa = 0;

        this.camera = null;


        var material = new THREE.MeshNormalMaterial();
        var material2 = new THREE.MeshStandardMaterial({color: 0x0000ff});

        var cuerpoRuedasGeometria = new THREE.CylinderGeometry(2, 2, 10, 64);
        cuerpoRuedasGeometria.rotateX(Math.PI/2);
        cuerpoRuedasGeometria.scale(3, 0.5, 1);

        var cuerpoSoporteGeometria = new THREE.BoxGeometry(6,2,8);
        cuerpoSoporteGeometria.translate(0, 1, 0);

        var cuerpoMiraTanqueGeometria = new THREE.CylinderGeometry(2, 2.5, 1.5, 64);
        cuerpoMiraTanqueGeometria.translate(0, 2.5, 0);        
        cuerpoMiraTanqueGeometria.scale(1, 1, 1.5);

        var cuerpoCanionTanqueGeometria = new THREE.CylinderGeometry(0.35, 0.35, 10, 64);
        cuerpoCanionTanqueGeometria.rotateX(Math.PI/2);
        cuerpoCanionTanqueGeometria.rotateY(Math.PI/2);
        cuerpoCanionTanqueGeometria.translate(-4, 2.7, 0);

        var cuerpoRecubrimentoCanionTanqueGeometria = new THREE.CylinderGeometry(0.5, 0.5, 4, 64);
        cuerpoRecubrimentoCanionTanqueGeometria.rotateX(Math.PI/2);
        cuerpoRecubrimentoCanionTanqueGeometria.rotateY(Math.PI/2);
        cuerpoRecubrimentoCanionTanqueGeometria.translate(-4, 2.7, 0);


        var cuerpoCupulaTanqueGeometria = new THREE.SphereGeometry(1, 32, 32);
        cuerpoCupulaTanqueGeometria.scale(1, 0.5, 1);
        cuerpoCupulaTanqueGeometria.translate(0, 3.5, 0);

        var cuerpoRuedaGeometria = new THREE.CylinderGeometry(0.75, 0.75, 10.5, 64);
        cuerpoRuedaGeometria.rotateX(Math.PI/2);
        

        this.cuerpoTanque = new THREE.Mesh(cuerpoRuedasGeometria, material);
        this.cuerpoSoporte = new THREE.Mesh(cuerpoSoporteGeometria, material);
        this.cuerpoMiraTanque = new THREE.Mesh(cuerpoMiraTanqueGeometria, material);
        this.cuerpoCanionTanque = new THREE.Mesh(cuerpoCanionTanqueGeometria, material);
        this.cuerpoRecubrimentoCanionTanque = new THREE.Mesh(cuerpoRecubrimentoCanionTanqueGeometria, material);
        this.cuerpoCupulaTanque = new THREE.Mesh(cuerpoCupulaTanqueGeometria, material);

        this.cuerpoRueda1 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda2 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda2.position.x = -2;
        this.cuerpoRueda3 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda3.position.x = 2;
        this.cuerpoRueda4 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda4.position.x = -3.7;
        this.cuerpoRueda5 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda5.position.x = 3.7;


        //NODO PERSONAJE
        this.tanque = new THREE.Object3D();
        this.tanque.add(this.cuerpoTanque);
        this.tanque.add(this.cuerpoSoporte);
        this.tanque.add(this.cuerpoMiraTanque);
        this.tanque.add(this.cuerpoCanionTanque);
        this.tanque.add(this.cuerpoRecubrimentoCanionTanque);
        this.tanque.add(this.cuerpoCupulaTanque);
        this.tanque.add(this.cuerpoRueda1);
        this.tanque.add(this.cuerpoRueda2);
        this.tanque.add(this.cuerpoRueda3);
        this.tanque.add(this.cuerpoRueda4);
        this.tanque.add(this.cuerpoRueda5);

        this.tanque.scale.set(0.35, 0.35, 0.35);
        this.tanque.rotateY(Math.PI/2);


        this.origen = {t:0};
        this.destino = {t:1};


        //NODO TRANSLACION Y
        this.nodoTranslacionY = new THREE.Object3D();
        this.nodoTranslacionY.add(this.tanque);
        this.nodoTranslacionY.position.y += this.radio + 0.05;

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.nodoTranslacionY.add(this.camera);
        this.camera.position.set(0, 15,-43);


        var puntoDeMiraRelativo = new THREE.Vector3(0,-1,20);
        var target = new THREE.Vector3(0,0,0);
        this.camera.getWorldPosition(target);
        target.add(puntoDeMiraRelativo);
        this.camera.lookAt(target);

        //NODO ROTACION Z
        this.nodoRotacionZ = new THREE.Object3D();
        this.nodoRotacionZ.add(this.nodoTranslacionY);
        this.nodoRotacionZ.rotateZ(this.alfa);
        //NODO POSICION Y ORIENTACION TUBO
        this.nodoPosOrientTubo = new THREE.Object3D();
        this.nodoPosOrientTubo.add(this.nodoRotacionZ);
        var posTmp = this.path.getPointAt(this.origen.t);
        this.nodoPosOrientTubo.position.copy(posTmp);


        var tangente = this.path.getTangentAt(this.origen.t);
        posTmp.add(tangente);
        var segmentoActual = Math.floor(this.origen.t * this.segmentos);
        this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
        this.nodoPosOrientTubo.lookAt(posTmp);

        this.add(this.nodoPosOrientTubo);

        var tiempo = 50000;
        var animacion = new TWEEN.Tween(this.origen).to(this.destino, tiempo)
        .onUpdate(() => {
            var posicion = this.path.getPointAt(this.origen.t);
            this.nodoPosOrientTubo.position.copy(posicion);
            var tangente = this.path.getTangentAt(this.origen.t);
            posicion.add(tangente);

            var segmentoActual = Math.floor(this.origen.t * this.segmentos);
            this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
            this.nodoPosOrientTubo.lookAt(posicion);
        })
        .repeat(Infinity)
        .start();

    }

    getCameraPersonaje () {
        return this.camera;
    }

    girarDerecha(){
        this.alfa += 0.001;
        this.nodoRotacionZ.rotateZ(this.alfa);
    }

    girarIzda(){
        this.alfa += 0.001;
        this.nodoRotacionZ.rotateZ(-this.alfa);
    }

    update(){
       TWEEN.update();
    }
}

export {Tanque};