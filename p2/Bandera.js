import * as THREE from 'three';

class Bandera extends THREE.Object3D{
    createBandera(material){

        //GEMOTRIA DE LA BANDER
        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.quadraticCurveTo(0.5, -0.2, 1, 0); // Primer tramo
        shape.quadraticCurveTo(1.5, 0.2, 2, 0); // Segundo tramo
        shape.quadraticCurveTo(2.5, -0.2, 3, 0); // Tercer tramo

        // Parte inferior de la bandera
        shape.lineTo(3, 2); // Línea hacia abajo
        shape.quadraticCurveTo(2.7, 2.2, 2, 2); // Primer curva hacia arriba
        shape.quadraticCurveTo(1.3, 1.8, 1, 2); // Segunda curva hacia arriba
        shape.quadraticCurveTo(0.7, 2.2, 0, 2); // Tercera curva hacia arriba

        shape.lineTo(0, 0); // Volver al punto inicial para cerrar la forma


        const extrudeSettings = {
            steps: 5,
            depth: 0.025,
            bevelEnabled: false,
            bevelThickness: 0,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 30
        };

        var banderaGeometria = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        this.bandera = new THREE.Mesh(banderaGeometria, material);
        return this.bandera;
    }


    constructor(ruta,geometriaTubo, t,a){
        super();
        var textureLoader = new THREE.TextureLoader();
        var texturaColor = textureLoader.load(ruta);
        
        texturaColor.wrapS = THREE.RepeatWrapping;
        texturaColor.wrapT = THREE.RepeatWrapping;
        texturaColor.repeat.set(0.3, 0.5);

        const material2 = new THREE.MeshStandardMaterial({
            map: texturaColor,
            roughness: 0.2,
            metalness: 0.6,
        });

        var material = new THREE.MeshStandardMaterial({
            color:0x000000,
        });

        

        var cilindroGeometry = new THREE.CylinderGeometry(0.2,0.2,6,32);
        this.cilindro = new THREE.Mesh(cilindroGeometry, material);
        this.cilindro.position.set(0,3,0);
        this.add(this.cilindro);
        this.bandera = this.createBandera(material2);
        this.bandera.position.set(0,4,0);

        this.banderaFinal = new THREE.Object3D();
        this.banderaFinal.add(this.bandera);
        this.banderaFinal.add(this.cilindro);
        this.banderaFinal.scale.set(0.75,0.75,0.75);
        this.banderaFinal.userData = "bandera";


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
        nodoTraslacionY.add(this.banderaFinal);
        nodoTraslacionY.position.y += this.radio - 2.25;
    
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

export { Bandera };