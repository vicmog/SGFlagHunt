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

        this.tanque.scale.set(0.5, 0.5, 0.5);
        this.tanque.rotateY(Math.PI/2);


        var origen = {t:0};
        var destino = {t:1};

        
        //NODO TRANSLACION Y
        this.nodoTranslacionY = new THREE.Object3D();
        this.nodoTranslacionY.add(this.tanque);
        this.nodoTranslacionY.position.y += this.radio;
        //NODO ROTACION Z
        this.nodoRotacionZ = new THREE.Object3D();
        this.nodoRotacionZ.add(this.nodoTranslacionY);
        this.nodoRotacionZ.rotateZ(this.alfa);
        //NODO POSICION Y ORIENTACION TUBO
        this.nodoPosOrientTubo = new THREE.Object3D();
        this.nodoPosOrientTubo.add(this.nodoTranslacionY);
        var posTmp = this.path.getPointAt(origen.t);
        this.nodoPosOrientTubo.position.copy(posTmp);


        var tangente = this.path.getTangentAt(origen.t);
        posTmp.add(tangente);
        var segmentoActual = Math.floor(origen.t * this.segmentos);
        this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
        this.nodoPosOrientTubo.lookAt(posTmp);

        this.add(this.nodoPosOrientTubo);

        var tiempo = 50000;
        var animacion = new TWEEN.Tween(origen).to(destino, tiempo)
        .onUpdate(() => {
            var posicion = this.path.getPointAt(origen.t);
            this.nodoPosOrientTubo.position.copy(posicion);
            var tangente = this.path.getTangentAt(origen.t);
            posicion.add(tangente);

            var segmentoActual = Math.floor(origen.t * this.segmentos);
            this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
            this.nodoPosOrientTubo.lookAt(posicion);
        })
        .repeat(Infinity)
        .start();

    }

    update(){
       TWEEN.update();
    }
}

export {Tanque};