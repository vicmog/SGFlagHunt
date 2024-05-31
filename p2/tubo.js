import * as THREE from 'three';
import { Tanque } from '../objetosP2/Tanque.js'

class Tubo extends THREE.Object3D {
    constructor() {
        super();

        var textureLoader = new THREE.TextureLoader();
        var texturaColor = textureLoader.load('../imgs/texturatubo/Rock051_1K-JPG_Color.jpg');
        var textureBump = textureLoader.load('../imgs/texturatubo/Rock051_1K-JPG_Displacement.jpg');
        var texturaNormal = textureLoader.load('../imgs/texturatubo/Rock051_1K-JPG_NormalGL.jpg');
        var texturaRoughness = textureLoader.load('../imgs/texturatubo/Rock051_1K-JPG_Roughness.jpg');
        var texturaAmbientOcclusion = textureLoader.load('../imgs/texturatubo/Rock051_1K-JPG_AmbientOcclusion.jpg');
        var texturaMetalness = textureLoader.load('../imgs/texturatubo/Rock051_1K-JPG_Metalness.jpg');

        texturaColor.wrapS = texturaColor.wrapT = THREE.RepeatWrapping;
        texturaColor.repeat.set(20, 2); // Ajusta la repetición según sea necesario
        const material = new THREE.MeshStandardMaterial({
            map: texturaColor,
            bumpMap: textureBump,
            bumpScale: 0.8,
            normalMap: texturaNormal,
            roughnessMap: texturaRoughness,
            aoMap: texturaAmbientOcclusion,
            metalnessMap: texturaMetalness
        });

        
        const radius = 60;
        const tube = 5;
        const tubularSegments = 300;
        const radialSegments = 80;
        const p = 2;
        const q = 5;
        var torusGeometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
        
        var path = this.getPathFromTorusKnot(torusGeometry);
        this.spline = path;

        this.tuboGeometry = new THREE.TubeGeometry(path, tubularSegments, 5, radialSegments, true);
        this.tubo = new THREE.Mesh(this.tuboGeometry, material);
        
        this.add(this.tubo);
 

    }

    getTubeGeometry(){
        return this.tuboGeometry;
    }

    getPathFromTorusKnot (torusKnot) {
        // La codificación de este método está basado
        //   en el código fuente de la página oficial de Three.js
        // https://github.com/mrdoob/three.js/blob/master/src/geometries/TorusKnotGeometry.js
        const p = torusKnot.parameters.p;
        const q = torusKnot.parameters.q;
        const radius = torusKnot.parameters.radius;
        const resolution = torusKnot.parameters.tubularSegments;
        var u, cu, su, quOverP, cs;
        var x,y,z;
        // En  points  se almacenan los puntos que extraemos del torusKnot
        const points = [];
        for ( let i = 0; i < resolution; ++ i ) {
                u = i / resolution * p * Math.PI * 2;
          cu = Math.cos( u );
                su = Math.sin( u );
                quOverP = q / p * u;
                cs = Math.cos( quOverP );
    
                x = radius * ( 2 + cs ) * 0.5 * cu;
                y = radius * ( 2 + cs ) * su * 0.5;
                z = radius * Math.sin( quOverP ) * 0.5;
    
          points.push (new THREE.Vector3 (x,y,z));
        }
        // Una vez tenemos el array de puntos 3D construimos y devolvemos el CatmullRomCurve3
        return new THREE.CatmullRomCurve3 (points, true);
      }
    update() {
    }
}

export { Tubo };