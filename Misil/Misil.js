import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js';


class Misil extends THREE.Object3D{
    constructor(geometriaTubo,t,alfa) {
        super();

        this.rotacionMisilSpeed = 0.01;
        
        //MATERIAL
        var material = new THREE.MeshStandardMaterial({
            color: 0x00000f,
            roughness: 0.7,
            metalness: 0.1,
        });

        var material2 = new THREE.MeshStandardMaterial({
            color: 0xEEEEEE,
            roughness: 0.7,
            metalness: 0.1,
        });

        //GEOMETRIA
        var shapeCohete = new THREE.Shape();
        shapeCohete.moveTo(0, 0);
        shapeCohete.quadraticCurveTo(1.8, 3.5, 0, 5);
        
        var cuerpoMisilGeometry = new THREE.LatheGeometry(shapeCohete.getPoints(), 20, 0, 2*Math.PI);
        cuerpoMisilGeometry.rotateZ(Math.PI);
        cuerpoMisilGeometry.scale(1.25,1.25,1.25);
        cuerpoMisilGeometry.translate(0, 7, 0);

        var shape = new THREE.Shape();
        shape.moveTo(0, 3);
        shape.lineTo(0, 6);
        shape.quadraticCurveTo(3, 6, 4, 0);
        shape.quadraticCurveTo(2.2, 2.8, 0, 3);

        const extrudeSettings = {
            steps: 10,
            depth: 1,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };

        var cuerpoPataMisilGeometry = new THREE.ExtrudeGeometry(shape,extrudeSettings);
        cuerpoPataMisilGeometry.scale(0.5,0.5,0.5);
        cuerpoPataMisilGeometry.translate(0.7, 0, 0);

        //DECLARACION DE MESH
        this.cuerpoPataMisil = new THREE.Mesh(cuerpoPataMisilGeometry, material);
    
        this.cuerpoMisil = new THREE.Mesh(cuerpoMisilGeometry, material2);
        this.pata2 = this.cuerpoPataMisil.clone();
        this.pata2.rotation.y = Math.PI/2;
        this.pata3 = this.cuerpoPataMisil.clone();
        this.pata3.rotation.y = Math.PI;

        this.pata4 = this.cuerpoPataMisil.clone();
        this.pata4.rotation.y = -Math.PI/2;
        

        //NODO MISIL
        this.misil= new THREE.Object3D();
        this.misil.add(this.cuerpoMisil);
        this.misil.add(this.cuerpoPataMisil);
        this.misil.add(this.pata2);
        this.misil.add(this.pata3);
        this.misil.add(this.pata4);

        this.luzRoja = new THREE.PointLight(0xff0000, 1000, 500);
        this.luzRoja.power = 1000;
        this.luzRoja.position.set(0, -2, 0);
        this.misil.add(this.luzRoja);

        //POSICIONAMIENTO Y ESCALADO
    
        this.misil.scale.set(0.5,0.5,0.5);
        this.animarLuzIntermitente();

        this.add(this.misil);

    }

    animarLuzIntermitente() {
        const luzIntensidadMaxima = 1000;
        const luzIntensidadMinima = 0;
        const duracionIntermitencia = 200;

        const intermitencia = new TWEEN.Tween(this.luzRoja)
            .to({ intensity: luzIntensidadMinima }, duracionIntermitencia)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    }

    update(){
        this.misil.rotation.y += this.rotacionMisilSpeed;
        TWEEN.update();
    }
}

export { Misil };