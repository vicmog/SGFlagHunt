import * as THREE from 'three';
import { Tanque } from '../misObjetos/Tanque.js'
import * as TWEEN from '../libs/tween.esm.js';

class Tubo extends THREE.Object3D {
    constructor() {
        super();
        var material = new THREE.MeshNormalMaterial();

        const radius = 60;
        const tube = 5;
        const tubularSegments = 300;
        const radialSegments = 80;
        const p = 2;
        const q = 5;
        var torusGeometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
        
        var path = this.getPathFromTorusKnot(torusGeometry);
        var tuboGeometry = new THREE.TubeGeometry(path, tubularSegments, 5, radialSegments, true);
        this.tubo = new THREE.Mesh(tuboGeometry, material);


        this.tanque = new Tanque();
        this.tanque.scale.set(0.75, 0.75, 0.75);
        var origen = {p: 0};
        var destino = {p: 1};
        var posicion = path.getPointAt(origen.p);
        this.tanque.position.copy(posicion);
        // this.tanque.position.y += 5; 

        var tangente = path.getTangentAt(origen.p);
        posicion.add(tangente);
        this.tanque.lookAt(posicion);
        
        var movimiento = new TWEEN.Tween(origen).to(destino, 100000)
        .easing(TWEEN.Easing.Linear.None).onUpdate(() => {
            posicion = path.getPoint(origen.p);
            this.tanque.position.copy(posicion);
            var tangente = path.getTangentAt(origen.p);
            posicion.add(tangente);
            this.tanque.lookAt(posicion);
            this.tanque.rotateY(Math.PI/2);
            this.tanque.position.y += 6;
        })
        .start()
        .repeat(Infinity)
    
        this.add(this.tanque);
        this.add(this.tubo);

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
        TWEEN.update();
    }
}

export { Tubo };