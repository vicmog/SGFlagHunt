import * as THREE from 'three';

class Cohete extends THREE.Object3D {
    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();

        //Creo el cuerpo del cohete
        var points = [
            new THREE.Vector2(0.01, 0.01),
            new THREE.Vector2(3.2, 0.01),
            new THREE.Vector2(3, 1),
            new THREE.Vector2(2.9, 1.9),
            new THREE.Vector2(2.5, 2.9),
            new THREE.Vector2(2.1, 4),
            new THREE.Vector2(1.9, 5),
            new THREE.Vector2(1.2, 6.9),
            new THREE.Vector2(1, 7),
            new THREE.Vector2(0.7, 7.8),
            new THREE.Vector2(0.01, 8)
        ];
        

        //Comprobacion del perfil 

        /*var geometriaLinea = new THREE.BufferGeometry();
        geometriaLinea.setFromPoints(points);
        var materialLinea = new THREE.LineBasicMaterial( { color : 0xff0000, linewidth : 5 } );
        this.recorrido = new THREE.Line( geometriaLinea, materialLinea );

        this.add(this.recorrido);*/

        var cuerpoCoheteGeometry = new THREE.LatheGeometry(points, 30, 0, 2*Math.PI);
        this.cuerpoCohete = new THREE.Mesh(cuerpoCoheteGeometry, material);

        this.cuerpoCohete.scale.set(1, 1.5, 1);

        var path = new THREE.CatmullRomCurve3([
            new THREE.Vector3( 1, 2.5, 0),
            new THREE.Vector3( 1, 2.3, 1),
            new THREE.Vector3( 1, 2, 2)
        ]) ;

        const shape = new THREE.Shape();

        shape.moveTo(0, 0);
        shape.lineTo(1, 5);
        shape.lineTo(2, 0);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            steps : 2,
            extrudePath : path
        };

        var alasGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        alasGeometry.rotateX(2*(Math.PI/2));
        alasGeometry.scale(0.5, 0.5, 0.5);
        alasGeometry.rotateX(-Math.PI/7);
        alasGeometry.translate(0, 7.5, 2);


        this.ala1 = new THREE.Mesh(alasGeometry, material);
        this.ala2 = new THREE.Mesh(alasGeometry, material);
        this.ala2.rotateY(Math.PI);
        this.ala3 = new THREE.Mesh(alasGeometry, material);
        this.ala3.rotateY(Math.PI/2);
        this.ala4 = new THREE.Mesh(alasGeometry, material);
        this.ala4.rotateY(-Math.PI/2);


        //Patas del cohete

        this.pata = new THREE.Object3D();

        var patasGeometry = new THREE.CylinderGeometry(0.4, 0.4, 9, 30);
        patasGeometry.rotateZ(Math.PI/5);
        patasGeometry.translate(4, 0, 0);

        this.pata1 = new THREE.Mesh(patasGeometry, material);

        this.pata.add(this.pata1);
        var gemotriaBasePata = new THREE.BoxGeometry(1, 0.4, 1);
        gemotriaBasePata.translate(6.5, -3.65, 0);
        var basePata = new THREE.Mesh(gemotriaBasePata, material);
        this.pata.add(basePata);

        /*this.pata2 = new THREE.Mesh(patasGeometry, material);
        this.pata2.rotateY(Math.PI);
        this.pata3 = new THREE.Mesh(patasGeometry, material);
        this.pata3.rotateY(Math.PI/2);
        this.pata4 = new THREE.Mesh(patasGeometry, material);
        this.pata4.rotateY(-Math.PI/2);

        this.add(this.pata1);
        this.add(this.pata2);
        this.add(this.pata3);
        this.add(this.pata4);*/

        this.pata2 = this.pata.clone();
        this.pata2.rotateY(Math.PI);
        this.pata3 = this.pata.clone();
        this.pata3.rotateY(Math.PI/2);
        this.pata4 = this.pata.clone();
        this.pata4.rotateY(-Math.PI/2);


        this.add(this.pata);
        this.add(this.pata2);
        this.add(this.pata3);
        this.add(this.pata4);

        this.add(this.ala1);
        this.add(this.ala2);
        this.add(this.ala3);
        this.add(this.ala4);
        this.add(this.cuerpoCohete);

    }

    update (){

    }
}
export { Cohete };