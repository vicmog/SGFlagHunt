
import * as THREE from 'three';


class MuroBasico extends THREE.Object3D{
    constructor(geometriaTubo, t,a) {
        super();
        var textureLoader = new THREE.TextureLoader();
        var texturaColor = textureLoader.load('../imgs/ladrillo-difuso.png');
        var textureBump = textureLoader.load('../imgs/ladrillo-bump.png');
        var texturaNormal = textureLoader.load('../imgs/ladrillo-mapaNormal.png');
        // Ajustar la textura para los lados finos del muro
        texturaColor.wrapS = texturaColor.wrapT = THREE.RepeatWrapping;
        texturaColor.repeat.set(4, 2); // Ajusta la repetición según sea necesario
        const material = new THREE.MeshStandardMaterial({
            map: texturaColor,
            bumpMap: textureBump,
            normalMap: texturaNormal
        });

        var geometriaMuro = new THREE.BoxGeometry(10, 5, 0.5);
        this.muroMesh = new THREE.Mesh(geometriaMuro, material);


        //NODO MURO
        this.muro = new THREE.Object3D();
        this.muro.add(this.muroMesh);
        this.muro.userData = "muro";
        this.muro.scale.set(0.5,0.75,0.5);


        this.nodoPos = this.asignarPos(geometriaTubo, t,a);
        this.add(this.nodoPos);
    }

    asignarPos(geometriaTubo, t,a){
        this.tubo = geometriaTubo;
        this.path = geometriaTubo.parameters.path;
        this.radio = geometriaTubo.parameters.radius;
        this.segmentos = geometriaTubo.parameters.tubularSegments;
        this.alfa = a;
    
        // NODO TRASLACION Y
        var nodoTraslacionY = new THREE.Object3D();
        nodoTraslacionY.position.y = 0;
        nodoTraslacionY.add(this.muro);
        nodoTraslacionY.position.y += this.radio + 0.05;
    
        //LUZ
        this.luz = new THREE.SpotLight(0xffffff);
        this.luz.power = 1000;
        this.luz.angle = Math.PI / 2;
        this.luz.penumbra = 1;
        this.luz.position.set(0,15,0);
        this.luz.target = nodoTraslacionY;

        nodoTraslacionY.add(this.luz);
    
        // NODO ROTACION Z
        var nodoRotacionZ = new THREE.Object3D();
        nodoRotacionZ.add(nodoTraslacionY);
        nodoRotacionZ.rotateZ(this.alfa);
    
        // NODO POSICION Y ORIENTACION TUBO
        var nodoPosOrientTubo = new THREE.Object3D();
        nodoPosOrientTubo.add(nodoRotacionZ);
        var posTmp = this.path.getPointAt(t);
        nodoPosOrientTubo.position.copy(posTmp);
    
        var tangente = this.path.getTangentAt(t);
        posTmp.add(tangente);
        var segmentoActual = Math.floor(t * this.segmentos);
        nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
        nodoPosOrientTubo.lookAt(posTmp);
    
        return nodoPosOrientTubo;
    }

    update(){

    }
}

export { MuroBasico };