import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js';

class Tanque extends THREE.Object3D {

    constructor() {
        super();

        //MATERIALES Y LUCES
        var textureLoader = new THREE.TextureLoader();
        var texturaColor = textureLoader.load('../imgs/tanquecamo.jpg');
        texturaColor.wrapS = THREE.RepeatWrapping;
        texturaColor.wrapT = THREE.RepeatWrapping;
        texturaColor.repeat.set(2, 2);

        const material = new THREE.MeshStandardMaterial({
            map: texturaColor,
            roughness: 0.2,
            metalness: 0.6,
        });

        const material2 = new THREE.MeshStandardMaterial({ 
            color: 0x000000, 
        });

        this.rotacionMinimaCanion = -Math.PI /200; 
        this.rotacionMaximaCanion = Math.PI / 200;
        this.rotacionCanionActual = 0;
        this.movIzq = true;
        this.movDer = false;

        this.rotacionMinima = -Math.PI / 5; 
        this.rotacionMaxima = Math.PI / 5; 
        this.duracionRotacion = 2000; 

        //Geometria del tanque
        var cuerpoRuedasGeometria = new THREE.CylinderGeometry(2, 2, 10, 64);
        cuerpoRuedasGeometria.rotateX(Math.PI / 2);
        cuerpoRuedasGeometria.scale(3, 0.5, 1);

        var cuerpoSoporteGeometria = new THREE.BoxGeometry(6, 2, 8);
        cuerpoSoporteGeometria.translate(0, 1, 0);

        var cuerpoMiraTanqueGeometria = new THREE.CylinderGeometry(2, 2.5, 1.5, 64);
        cuerpoMiraTanqueGeometria.translate(0, 2.5, 0);
        cuerpoMiraTanqueGeometria.scale(1, 1, 1.5);

        var cuerpoCanionTanqueGeometria = new THREE.CylinderGeometry(0.35, 0.35, 8, 64);
        cuerpoCanionTanqueGeometria.rotateX(Math.PI / 2);
        cuerpoCanionTanqueGeometria.rotateY(Math.PI / 2);
        cuerpoCanionTanqueGeometria.translate(-4, 2.7, 0);

        var cuerpoRecubrimentoCanionTanqueGeometria = new THREE.CylinderGeometry(0.5, 0.5, 4, 64);
        cuerpoRecubrimentoCanionTanqueGeometria.rotateX(Math.PI / 2);
        cuerpoRecubrimentoCanionTanqueGeometria.rotateY(Math.PI / 2);
        cuerpoRecubrimentoCanionTanqueGeometria.translate(-3.3, 2.7, 0);

       
        var cuerpoCupulaTanqueGeometria = new THREE.SphereGeometry(1, 32, 32);
        cuerpoCupulaTanqueGeometria.scale(1, 0.5, 1);
        cuerpoCupulaTanqueGeometria.translate(0, 3.5, 0);

        var cuerpoRuedaGeometria = new THREE.CylinderGeometry(0.75, 0.75, 10.5, 64);
        cuerpoRuedaGeometria.rotateX(Math.PI / 2);

        // Declaraciond de los Mesh

        this.cuerpoTanque = new THREE.Mesh(cuerpoRuedasGeometria, material);
        this.cuerpoSoporte = new THREE.Mesh(cuerpoSoporteGeometria, material);
        this.cuerpoMiraTanque = new THREE.Mesh(cuerpoMiraTanqueGeometria, material);
        this.cuerpoCanionTanque = new THREE.Mesh(cuerpoCanionTanqueGeometria, material);
        this.cuerpoRecubrimentoCanionTanque = new THREE.Mesh(cuerpoRecubrimentoCanionTanqueGeometria, material);

        this.cuerpoRueda1 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda2 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda2.position.x = -2;
        this.cuerpoRueda3 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda3.position.x = 2;
        this.cuerpoRueda4 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda4.position.x = -3.7;
        this.cuerpoRueda5 = new THREE.Mesh(cuerpoRuedaGeometria, material2);
        this.cuerpoRueda5.position.x = 3.7;

        //Nodo Animacion Cañon
        this.canionAnimacion = new THREE.Object3D();
        this.canionAnimacion.add(this.cuerpoCanionTanque);
        this.canionAnimacion.add(this.cuerpoRecubrimentoCanionTanque);
        this.cuerpoCupulaTanque = new THREE.Mesh(cuerpoCupulaTanqueGeometria, material);

        // Nodo Girar Cuerpo Animacion
        this.cuerpoMiraTanqueGirar = new THREE.Object3D();
        this.cuerpoMiraTanqueGirar.add(this.cuerpoMiraTanque);
        this.cuerpoMiraTanqueGirar.add(this.canionAnimacion);
        this.cuerpoMiraTanqueGirar.add(this.cuerpoCupulaTanque);

        

        // NODO TANQUE
        this.tanque = new THREE.Object3D();
        this.tanque.add(this.cuerpoTanque);
        this.tanque.add(this.cuerpoSoporte);
        this.tanque.add(this.cuerpoMiraTanqueGirar);
        this.tanque.add(this.cuerpoRueda1);
        this.tanque.add(this.cuerpoRueda2);
        this.tanque.add(this.cuerpoRueda3);
        this.tanque.add(this.cuerpoRueda4);
        this.tanque.add(this.cuerpoRueda5);

        //ESCALADO Y POSICIONAMIENTO DEL TANQUE
        this.tanque.scale.set(0.35, 0.35, 0.35);
        this.tanque.rotateY(Math.PI / 2);


        //LUZ DEL TANQUE
        this.luz = new THREE.SpotLight(0xffffff);
        this.luz.power = 1000;
        this.luz.angle = Math.PI / 2;
        this.luz.penumbra = 1;
        this.luz.position.set(0,15,0);
        this.luz.target = this.tanque;

        this.tanque.add(this.luz);

        //SOMBRA 
        this.luz.castShadow = true;
        this.luz.shadow.mapSize.width = 512;
        this.luz.shadow.mapSize.height = 512;
        this.luz.shadow.camera.near = 0.5;
        this.luz.shadow.camera.far = 500;
        this.luz.shadow.camera.fov = 30;

        //Añaadir el tanque a la escena
        this.add(this.tanque);

        this.tiempo = 50000;

        this.animacionRotacion();
    }

    animacionRotacion() {
        var _this = this;
        new TWEEN.Tween({ y: this.rotacionMinima })
            .to({ y: this.rotacionMaxima }, this.duracionRotacion)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function (object) {
                _this.cuerpoMiraTanqueGirar.rotation.y = object.y;
            })
            .yoyo(true)
            .repeat(Infinity)
            .start();
    }

    update() {

        if(this.movDer){
            this.rotacionCanionActual += 0.0009;
            this.canionAnimacion.rotateZ(this.rotacionCanionActual);
            if(this.rotacionCanionActual >= this.rotacionMaximaCanion){
                this.movDer = false;
                this.movIzq = true;
            }
        }else if(this.movIzq){
            this.rotacionCanionActual -= 0.0009;
            this.canionAnimacion.rotateZ(this.rotacionCanionActual);
            if(this.rotacionCanionActual <= this.rotacionMinimaCanion){
                this.movDer = true;
                this.movIzq = false;
            }
        }
        TWEEN.update();
    }
}

export { Tanque };
