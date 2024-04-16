import * as THREE from 'three';

class Bomba extends THREE.Object3D {
  constructor() {
    super();
    var material = new THREE.MeshNormalMaterial();
    var bombaCuerpoGeometry = new THREE.SphereGeometry(1.75, 32, 32);
    var bombaCabezaGeometry = new THREE.CylinderGeometry(0.75,0.75,1,30);
    bombaCabezaGeometry.translate(0, 1.5, 0);
    var bombaMechaGeometry = new THREE.CylinderGeometry(0.1,0.1,0.75,30);
    bombaMechaGeometry.translate(0, 2.5, 0);




    this.bombaCuerpo = new THREE.Mesh(bombaCuerpoGeometry, material);
    this.bombaCabeza = new THREE.Mesh(bombaCabezaGeometry, material);
    this.bombaMecha = new THREE.Mesh(bombaMechaGeometry, material);
    

    this.add(this.bombaCuerpo);
    this.add(this.bombaCabeza);
    this.add(this.bombaMecha);
  }


  update(){

  }
}

export { Bomba };