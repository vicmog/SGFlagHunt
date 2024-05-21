import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js';


class Misil extends THREE.Object3D{
    constructor(geometriaTubo,t,alfa) {
        super();

        this.tubo = geometriaTubo;
        this.path = geometriaTubo.parameters.path;
        this.radio = geometriaTubo.parameters.radius;
        this.segmentos = geometriaTubo.parameters.tubularSegments;
        this.t = t;
        this.alfa = alfa;
        

        this.origen = {t:1};
        this.destino = {t:0};



        this.rotacionMisilSpeed = 0.01;
        
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

        this.cuerpoPataMisil = new THREE.Mesh(cuerpoPataMisilGeometry, material);
    
        
        this.cuerpoMisil = new THREE.Mesh(cuerpoMisilGeometry, material2);
        this.pata2 = this.cuerpoPataMisil.clone();
        this.pata2.rotation.y = Math.PI/2;
        this.pata3 = this.cuerpoPataMisil.clone();
        this.pata3.rotation.y = Math.PI;

        this.pata4 = this.cuerpoPataMisil.clone();
        this.pata4.rotation.y = -Math.PI/2;
        
        this.misil= new THREE.Object3D();
        this.misil.add(this.cuerpoMisil);
        this.misil.add(this.cuerpoPataMisil);
        this.misil.add(this.pata2);
        this.misil.add(this.pata3);
        this.misil.add(this.pata4);

        this.misil.scale.set(0.5,0.5,0.5);
        this.misil.rotateX(-Math.PI/2);

        //NODO TRANSLACION Y
        this.nodoTranslacionY = new THREE.Object3D();
        this.nodoTranslacionY.add(this.misil);
        this.nodoTranslacionY.position.y += this.radio*2.5;


        this.luzRoja = new THREE.PointLight(0xff0000, 1, 100);
        this.luzRoja.power = 1000;
        this.luzRoja.position.set(5, 10, 0);
        this.nodoTranslacionY.add(this.luzRoja);

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

        var tiempo = 70000;
        var animacion = new TWEEN.Tween(this.origen).to(this.destino, tiempo)
        .onUpdate(() => {
            var posicion = this.path.getPointAt(this.origen.t);
            this.nodoPosOrientTubo.position.copy(posicion);
            var tangente = this.path.getTangentAt(this.origen.t);
            posicion.add(tangente);

            if(this.origen.t == 0){
                console.log("Misil visible");
                this.visible = true;
            }
            var segmentoActual = Math.floor(this.origen.t * this.segmentos);
            this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
            this.nodoPosOrientTubo.lookAt(posicion);

            this.misil.rotation.y += this.rotacionMisilSpeed;

        })
        .repeat(Infinity)
        .start();

    }

    update(){
        this.
        TWEEN.update();
    }
}

export { Misil };