import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';

class Cascos extends THREE.Object3D{
    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();

        //Creo los audifonos
        var cascoIzquierdoGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        cascoIzquierdoGeometry.translate(0, 0, 0);
        var cortarEsferasGeometry = new THREE.BoxGeometry(3,3,3);
        cortarEsferasGeometry.translate(1.5, 0, 0);
        var cascoDerechoGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        cascoDerechoGeometry.translate(3, 0, 0);

        this.cascoIzquierdo = new THREE.Mesh(cascoIzquierdoGeometry, material);
        this.cortarEsfera = new THREE.Mesh(cortarEsferasGeometry, material);
        this.cascoDerecho = new THREE.Mesh(cascoDerechoGeometry, material);
        

        this.cascos = new THREE.Object3D();

        var csg = new CSG();
        csg.union([this.cascoIzquierdo, this.cascoDerecho]);
        csg.subtract([this.cortarEsfera]);

        this.audifonos = csg.toMesh();
        this.audifonos.scale.set(1,1.2,1);
        this.cascos.add(this.audifonos);


        //Creo la diadema
        var diademaGeometry = new THREE.TorusGeometry(2.1, 0.2, 16, 100);
        diademaGeometry.translate(1.5, 1, 0);
        var cortarDiademaGeometry = new THREE.BoxGeometry(6,3,3);
        cortarDiademaGeometry.translate(1.5, 0, 0);

        this.cortarDiadema = new THREE.Mesh(cortarDiademaGeometry, material);
        this.diadema = new THREE.Mesh(diademaGeometry, material);
        this.diadema.scale.set(1,1.1,1);

        var csg2 = new CSG();
        csg2.subtract([this.diadema,this.cortarDiadema]);

        this.diademaAjustada = csg2.toMesh();
        this.cascos.add(this.diademaAjustada);



        //Creo almohadillas
        var almohadillaDerechaGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
        almohadillaDerechaGeometry.rotateY(Math.PI/2);
        almohadillaDerechaGeometry.scale(1,1.2,1);

        this.almohadillaDerecha = new THREE.Mesh(almohadillaDerechaGeometry, material);
        this.cascos.add(this.almohadillaDerecha);

        var almohadillaIzquierdaGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
        almohadillaIzquierdaGeometry.rotateY(Math.PI/2);
        almohadillaIzquierdaGeometry.scale(1,1.2,1);
        almohadillaDerechaGeometry.translate(3, 0, 0);

        this.almohadillaDerecha = new THREE.Mesh(almohadillaIzquierdaGeometry, material);
        this.cascos.add(this.almohadillaDerecha);


        //Ajusto y escalo 
        this.cascos.scale.set(0.5,0.5,0.5);
        this.cascos.position.x -= 0.75;

        this.add(this.cascos);

    }

    update(){
        this.cascos.rotation.y += 0.01;

    }

}

export {Cascos}