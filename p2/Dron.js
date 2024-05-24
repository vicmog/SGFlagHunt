import * as THREE from 'three';

class Dron extends THREE.Object3D {
    constructor(geometriaTubo, t) {
        super();
        this.material = new THREE.MeshNormalMaterial();
        this.tubo = geometriaTubo;
        this.path = geometriaTubo.parameters.path;
        this.radio = geometriaTubo.parameters.radius;
        this.segmentos = geometriaTubo.parameters.tubularSegments;
        this.t = 0;
        this.alfa = 0;

        var textureLoader = new THREE.TextureLoader();
        var texturaColor = textureLoader.load('../imgs/dron/Metal_Pierced_001_4K_basecolor.png');
        var textureBump = textureLoader.load('../imgs/dron/Metal_Pierced_001_4K_normal.png');
        var texturaRoughness = textureLoader.load('../imgs/dron/Metal_Pierced_001_4K_roughness.png');
        var texturaMetalness = textureLoader.load('../imgs/dron/Metal_Pierced_001_4K_metallic.png');
        var texturaAmbientOcclusion = textureLoader.load('../imgs/dron/Metal_Pierced_001_4K_ambientOcclusion.png');
        var texturaDisplacement = textureLoader.load('../imgs/dron/Metal_Pierced_001_4K_height.png');
        var texturaOpacity = textureLoader.load('../imgs/dron/Metal_Pierced_001_4K_opacity.png');
        
        const material = new THREE.MeshStandardMaterial({
            map: texturaColor,
            normalMap: textureBump,
            roughnessMap: texturaRoughness,
            metalnessMap: texturaMetalness,
            aoMap: texturaAmbientOcclusion,
            displacementMap: texturaDisplacement,
            displacementScale: 0.1,
            alphaMap: texturaOpacity,
            aoMapIntensity: 0.5,
            roughness: 0.5,
            metalness: 0.5,
        });

        texturaColor.wrapS = texturaColor.wrapT = THREE.RepeatWrapping;
        texturaColor.repeat.set(2, 2); // Ajusta la repetición según sea necesario

        this.dron = new THREE.Object3D();

        var cuerpoGeometry = new THREE.SphereGeometry(0.6, 50, 50);
        cuerpoGeometry.scale(1, 0.6, 1);
        this.cuerpo = new THREE.Mesh(cuerpoGeometry, material);
        this.dron.add(this.cuerpo);

        this.arrayHelices = [];

        var helice1 = this.createHelice(material);
        var helice2 = this.createHelice(material);
        helice2.rotateY(Math.PI / 2);

        var helice3 = this.createHelice(material);
        helice3.rotateY(-Math.PI / 2);

        var helice4 = this.createHelice(material);
        helice4.rotateY(Math.PI);

        this.dron.add(helice1);
        this.dron.add(helice2);
        this.dron.add(helice3);
        this.dron.add(helice4);

        // NODO TRASLACION Y
        var nodoTraslacionY = new THREE.Object3D();
        nodoTraslacionY.position.y = 0;
        nodoTraslacionY.add(this.dron);
        nodoTraslacionY.position.y += this.radio + 10;

        this.luz = new THREE.SpotLight(0x001ac2);
        this.luz.power = 1500;
        this.luz.angle = Math.PI / 5;
        this.luz.penumbra = 1;
        this.luz.position.set(0,10,0);
        this.luz.target = nodoTraslacionY;

        nodoTraslacionY.add(this.luz);
        // NODO ROTACION Z
        this.nodoRotacionZ = new THREE.Object3D();
        this.nodoRotacionZ.add(nodoTraslacionY);
        this.nodoRotacionZ.rotateZ(this.alfa);

        // NODO POSICION Y ORIENTACION TUBO
        var nodoPosOrientTubo = new THREE.Object3D();
        nodoPosOrientTubo.add(this.nodoRotacionZ);
        var posTmp = this.path.getPointAt(t);
        nodoPosOrientTubo.position.copy(posTmp);

        var tangente = this.path.getTangentAt(t);
        posTmp.add(tangente);
        var segmentoActual = Math.floor(t * this.segmentos);
        nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
        nodoPosOrientTubo.lookAt(posTmp);
        // Hacer mas grande el dron
        nodoPosOrientTubo.scale.set(1.5, 1.5, 1.5);
        this.dron.userData = "dron";

        this.add(nodoPosOrientTubo);
    }

    createHelice(material) {
        var objPata1 = new THREE.Object3D();
        var pata1Geometry = new THREE.CylinderGeometry(0.3, 0.1, 2, 50);
        pata1Geometry.scale(0.5, 1, 1);
        pata1Geometry.rotateX(-Math.PI / 2);
        pata1Geometry.translate(0, 0, 1);
        this.pata1 = new THREE.Mesh(pata1Geometry, material);
        objPata1.add(this.pata1);

        var soporteHeliceGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 50);
        soporteHeliceGeometry.translate(0, 0, 2);
        this.soporteHelice = new THREE.Mesh(soporteHeliceGeometry, material);
        objPata1.add(this.soporteHelice);

        // Crear una nueva Object3D para la hélice
        this.heliceContainer = new THREE.Object3D();
        this.heliceContainer.position.set(0, 0.25, 2); // Ajustar la posición de contenedor al soporte
        objPata1.add(this.heliceContainer);

        var heliceGeometry = new THREE.CylinderGeometry(0.07, 0.07, 0.6, 50);
        heliceGeometry.rotateX(Math.PI / 2);
        this.helice = new THREE.Mesh(heliceGeometry, material);
        this.helice.scale.set(1, 0.2, 1);
        this.heliceContainer.add(this.helice);

        this.arrayHelices.push(this.heliceContainer);
        return objPata1;
    }

    update() {
        // Rotación del dron
        this.alfa = 0.01;
        this.nodoRotacionZ.rotateZ(this.alfa);

        // Movimiento de las hélices
        this.arrayHelices.forEach(helice => {
            helice.rotation.y += 0.5;
        });
    }
}

export { Dron };
