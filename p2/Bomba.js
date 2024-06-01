import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js';


class Bomba extends THREE.Object3D {
  constructor(geometriaTubo, t, a) {
    super();

    //MATERIAL
    var material = new THREE.MeshStandardMaterial({
      color: 0x121112,
    });

    var material2 = new THREE.MeshStandardMaterial({
      color: 0xfafdff,
    });

    var material3 = new THREE.MeshStandardMaterial({
      color: 0x593509,
    });

    var bombaCuerpoGeometry = new THREE.SphereGeometry(1.75, 32, 32);
    var bombaCabezaGeometry = new THREE.CylinderGeometry(0.75,0.75,1,30);
    bombaCabezaGeometry.translate(0, 1.5, 0);
    var bombaMechaGeometry = new THREE.CylinderGeometry(0.1,0.1,0.75,30);
    bombaMechaGeometry.translate(0, 2.25, 0);

    //MESH
    this.bombaCuerpo = new THREE.Mesh(bombaCuerpoGeometry, material);
    this.bombaCabeza = new THREE.Mesh(bombaCabezaGeometry, material2);
    this.bombaMecha = new THREE.Mesh(bombaMechaGeometry, material3);

    this.bomba = new THREE.Object3D();
    this.bomba.add(this.bombaCuerpo);
    this.bomba.add(this.bombaCabeza);
    this.bomba.add(this.bombaMecha);

    this.bomba.scale.set(0.5,0.5,0.5);

    this.bomba.userData = "bomba";
    
    this.nodoPos = this.asignarPos(geometriaTubo, t,a);

    this.add(this.nodoPos);

    this.animarLuzIntermitente();
    
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
    nodoTraslacionY.add(this.bomba);
    nodoTraslacionY.position.y += this.radio + 0.5;

    //LUZ
    this.luzRoja = new THREE.PointLight(0xff0000, 1000, 500);
    this.luzRoja.power = 1000;
    this.luzRoja.position.set(0, 3, 0);
    nodoTraslacionY.add(this.luzRoja);

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

  animarLuzIntermitente() {
    const luzIntensidadMaxima = 5000;
    const luzIntensidadMinima = 0;
    const duracionIntermitencia = 300;

    const intermitencia = new TWEEN.Tween(this.luzRoja)
        .to({ intensity: luzIntensidadMinima }, duracionIntermitencia)
        .yoyo(true)
        .repeat(Infinity)
        .start();
  }


  update(){
    TWEEN.update();
  }

}

export { Bomba };