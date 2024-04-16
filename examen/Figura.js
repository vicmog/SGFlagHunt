import * as THREE from 'three';
import {CSG} from '../libs/CSG-v2.js';

class Figura extends THREE.Object3D{

    constructor(){
        super();
        var material = new THREE.MeshNormalMaterial();

        //Creo la base
        var shapeBase = new THREE.Shape();
        shapeBase.moveTo(0,1);
        shapeBase.lineTo(0,4);
        shapeBase.quadraticCurveTo(0.2,5,1,5);
        shapeBase.lineTo(4,5);
        shapeBase.quadraticCurveTo(5,5,5,4);
        shapeBase.lineTo(5,1);
        shapeBase.quadraticCurveTo(5,0,4,0);
        shapeBase.lineTo(1,0);
        shapeBase.quadraticCurveTo(0,0,0,1);
        




        const extrudeSettings = {
            steps: 5,
            depth: 4,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 10
        };




        var baseGeometry = new THREE.ExtrudeGeometry(shapeBase,extrudeSettings);
        baseGeometry.rotateX(Math.PI/2);
        baseGeometry.scale(1,0.20,2);
        this.base = new THREE.Mesh(baseGeometry,material);


        //Creo el cilindro central con un cubo para su posterior corte con un cubo inclinado

        var cilindoGrandeGeometry = new THREE.CylinderGeometry(2,2,2,32);
        cilindoGrandeGeometry.translate(2.5,1,5);

        var cuboCilindroGeometry = new THREE.BoxGeometry(3,2,6);
        cuboCilindroGeometry.translate(2.5,1,2.6)
        this.cuboCilindroGeometry = new THREE.Mesh(cuboCilindroGeometry,material);
        this.cilindroGrandeGeometry = new THREE.Mesh(cilindoGrandeGeometry,material);

        //Creamos el cubo inclinado

        var geometryCuboInclinado = new THREE.BoxGeometry(6,3,10);
        geometryCuboInclinado.rotateX(-Math.PI/15);
        geometryCuboInclinado.translate(2.5,2.3,3);

        this.cuboInclinado = new THREE.Mesh(geometryCuboInclinado,material);

   

        var csg = new CSG();
        csg.union([this.cilindroGrandeGeometry,this.cuboCilindroGeometry]);
        csg.subtract([this.cuboInclinado]);

        this.cilindroCubo = csg.toMesh();


        //Crreo en cilindro para hacer el hueco del Cilindro central

        var cilindroCentralHuecoGeometry = new THREE.CylinderGeometry(1,1,6,32);
        cilindroCentralHuecoGeometry.translate(2.6,1,1.25);
        this.cilindroCentralHueco = new THREE.Mesh(cilindroCentralHuecoGeometry,material);


        csg = new CSG();
        csg.union([this.cilindroCubo,this.base]);
        csg.subtract([this.cilindroCentralHueco]);

        this.cilindroCentroFinal = csg.toMesh();


        //Creo las esferas para hacer los huecos del otro lado

        var esfera1Geometry = new THREE.SphereGeometry(0.5,32,32);
        esfera1Geometry.translate(4,0.38,9);
        this.esfera1 = new THREE.Mesh(esfera1Geometry,material);

        var esfera2Geometry = new THREE.SphereGeometry(0.5,32,32);
        esfera2Geometry.translate(1,0.38,9);
        this.esfera2 = new THREE.Mesh(esfera2Geometry,material);

        var cilindroEsfera1Geometry = new THREE.CylinderGeometry(0.5,0.5,1,32);
        cilindroEsfera1Geometry.translate(4,-0.55,9);
        this.cilindrindroEsfera1 = new THREE.Mesh(cilindroEsfera1Geometry,material);

        var cilindroEsfera2Geometry = new THREE.CylinderGeometry(0.5,0.5,1,32);
        cilindroEsfera2Geometry.translate(1,-0.55,9);
        this.cilindroEsfera2 = new THREE.Mesh(cilindroEsfera2Geometry,material);


        csg = new CSG();
        csg.subtract([this.cilindroCentroFinal,this.esfera1,this.esfera2,this.cilindrindroEsfera1,this.cilindroEsfera2]);

        this.nuevaFigura = csg.toMesh();  
        
        

        var esferaGrandeHuecoGemoetry = new THREE.SphereGeometry(1,32,32);
        esferaGrandeHuecoGemoetry.translate(2.5,0.35,8.5);
        this.esferaGrandeHueco = new THREE.Mesh(esferaGrandeHuecoGemoetry,material);


        //Deberia haber realizado una extrusion, no se ve muy bien
        var cuboEsferaHuecoGeometry = new THREE.ExtrudeGeometry(shapeBase,extrudeSettings);
        cuboEsferaHuecoGeometry.rotateX(Math.PI/2);
        cuboEsferaHuecoGeometry.scale(0.35,0.15,0.5);
        cuboEsferaHuecoGeometry.translate(1.65,0.25,8.5);
        this.cuboEsferaHueco = new THREE.Mesh(cuboEsferaHuecoGeometry,material);


        var cilindroHuecoEsferaGeometry = new THREE.CylinderGeometry(0.5,0.5,8,32);
        cilindroHuecoEsferaGeometry.translate(2.5,1,9);
        this.cilindrindroHuecoEsfera = new THREE.Mesh(cilindroHuecoEsferaGeometry,material);


        csg = new CSG();
        csg.subtract([this.nuevaFigura,this.esferaGrandeHueco,this.cuboEsferaHueco,this.cilindrindroHuecoEsfera]);

        this.nuevaFigura2 = csg.toMesh();


        this.nuevaFigura2.position.x = -2.5;
        this.nuevaFigura2.position.z = -4.5;



        this.add(this.nuevaFigura2);
        

        
        
    }

}
export {Figura}