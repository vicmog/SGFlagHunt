import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';


class Tanque extends THREE.Object3D{
    constructor(){
        super();
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



        /*var csg = new CSG();
        csg.union([this.cuerpoTanque, this.]);

        this.tanque = csg.toMesh();*/


        this.add(this.cuerpoTanque);
        this.add(this.cuerpoSoporte);
        this.add(this.cuerpoMiraTanque);
        this.add(this.cuerpoCanionTanque);
        this.add(this.cuerpoRecubrimentoCanionTanque);
        this.add(this.cuerpoCupulaTanque);
        this.add(this.cuerpoRueda1);
        this.add(this.cuerpoRueda2);
        this.add(this.cuerpoRueda3);
        this.add(this.cuerpoRueda4);
        this.add(this.cuerpoRueda5);
       

    }

    update(){

    }
}

export {Tanque};