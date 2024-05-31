import * as THREE from 'three';
import * as TWEEN from '../libs/tween.esm.js';


class Bomba extends THREE.Object3D {
  constructor() {
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

    //LUZ
    this.luzRoja = new THREE.PointLight(0xff0000, 1000, 500);
    this.luzRoja.power = 1000;
    this.luzRoja.position.set(0, 3, 0);
    this.bomba.add(this.luzRoja);
    

    this.add(this.bomba);

    this.animarLuzIntermitente();
    
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