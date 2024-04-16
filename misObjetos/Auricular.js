import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';
import * as TWEEN from '../libs/tween.esm.js';
import { Object3D } from '../libs/three.module.js';


class Auricular extends THREE.Object3D {

    constructor(gui,guiTitle){
        super();
        var material = new THREE.MeshNormalMaterial();
        material.flatShading = true;
        material.needsUpdate = true;

        var sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        sphereGeometry.translate(0, 2, 0);
        

        var cilindroAltavozGeometry = new THREE.CylinderGeometry(1.3, 2, 6, 32);

        var cilindroPaloGeometry = new THREE.CylinderGeometry (0.5, 0.5, 5, 30); 
        var cilindroAgujeroGeometry = new THREE.CylinderGeometry (0.9, 0.9, 2, 30); 
        var cilindroAgujeroCargaPaloGeometry = new THREE.CylinderGeometry (0.4, 0.4, 4, 30);


        this.sphere = new THREE.Mesh(sphereGeometry, material);
        this.sphere.scale.set(1, 2, 1);

        this.cilindroAltavoz = new THREE.Mesh(cilindroAltavozGeometry, material);
        this.cilindroAltavoz.scale.set(1, 1, 2);
        this.cilindroAltavoz.rotation.x = Math.PI/2;
        this.cilindroAltavoz.position.y += 4;
        this.cilindroAltavoz.position.z += 3;
        

        this.cilindroPalo = new THREE.Mesh(cilindroPaloGeometry, material);
        this.cilindroPalo.scale.set(2, 2, 2);
        this.cilindroPalo.position.y -=2;
        


        this.cilindro_agujero = new THREE.Mesh(cilindroAgujeroGeometry, material);
        this.cilindro_agujero.scale.set(1, 1, 2);
        this.cilindro_agujero.rotation.x = Math.PI/2;
        this.cilindro_agujero.position.y += 4;
        this.cilindro_agujero.position.z += 6.75;

        this.cilindroAgujeroCargaPalo = new THREE.Mesh(cilindroAgujeroCargaPaloGeometry, material);
        this.cilindroAgujeroCargaPalo.scale.set(2, 2, 2);
        this.cilindroAgujeroCargaPalo.position.y -= 10.75;

        /*this.add(this.sphere);
        this.add(this.cilindroAltavoz);
        this.add(this.cilindroPalo);
        this.add(this.cilindro_agujero);
        this.add(this.cilindroAgujeroCargaPalo);*/


        var csg = new CSG();

        csg.union([this.cilindroAltavoz, this.sphere]);
        csg.union([this.cilindroPalo]);
        csg.subtract([this.cilindro_agujero]);
        csg.subtract([this.cilindroAgujeroCargaPalo]);

        this.auricular = csg.toMesh();

        this.auricular.scale.set(0.25, 0.25, 0.25);

        this.nuevoAuricular = new THREE.Object3D();
        this.nuevoAuricular.add(this.auricular);
        this.nuevoAuricular.rotateY(-Math.PI/2);
        this.nuevoAuricular.rotateX(Math.PI/2);


        this.spline = new THREE.CatmullRomCurve3( [
            new THREE.Vector3(0,-2.5,0),
            new THREE.Vector3(-2,-2,0),
            new THREE.Vector3(-5.5,0,0),
            new THREE.Vector3(-8,2,0),
            new THREE.Vector3(-7.5,3,0),
            new THREE.Vector3(-6.5,3.5,0),
            new THREE.Vector3(0,2,0), // la mitad del recorrido
            new THREE.Vector3(6.5,3.5,0),
            new THREE.Vector3(7.5,3,0),
            new THREE.Vector3(8,2,0),
            new THREE.Vector3(5.5,0,0),
            new THREE.Vector3(2,-2,0),
            new THREE.Vector3(0,-2.5,0),
            ] );

        var geometriaLinea = new THREE.BufferGeometry();
        geometriaLinea.setFromPoints(this.spline.getPoints(100));
        var materialLinea = new THREE.LineBasicMaterial( { color : 0xff0000, linewidth : 5 } );
        this.recorrido = new THREE.Line( geometriaLinea, materialLinea );

        this.add(this.recorrido);


        var origen = {p: 0};
        var destino = {p: 1};

        var posicion = this.spline.getPoint(origen.p);
        this.nuevoAuricular.position.copy(posicion);
        var tangente = this.spline.getTangentAt(origen.p);
        posicion.add(tangente);
        this.nuevoAuricular.lookAt(posicion);
        this.nuevoAuricular.rotateX(Math.PI/2);


        var movimiento = new TWEEN.Tween(origen).to(destino, 10000)
        .easing(TWEEN.Easing.Linear.None).onUpdate(() => {
            posicion = this.spline.getPoint(origen.p);
            this.nuevoAuricular.position.copy(posicion);
            var tangente = this.spline.getTangentAt(origen.p);
            posicion.add(tangente);
            this.nuevoAuricular.lookAt(posicion);
            this.nuevoAuricular.rotateX(Math.PI/2);
        })
        .start()
        .repeat(Infinity)

        this.add(this.nuevoAuricular);

    }

    update(){
        this.auricular.rotation.y += 0.01;
        TWEEN.update();
    }
}
export { Auricular };