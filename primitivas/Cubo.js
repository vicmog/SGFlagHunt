import * as THREE from 'three';

class Cubo extends THREE.Object3D {
    constructor(gui, tituloGui) {
        super();
        this.createGUI(gui, tituloGui);
        this.material = new THREE.MeshStandardMaterial({ color: 0x338BFF });

        // Lado 50 cm
        var lado = 0.1;
        this.cubo = this.createCubo(lado);
        this.add(this.cubo);

        // Añadir propiedad para la animación de rotación
        this.rotationSpeed = 0.01;
    }

    createCubo(lado) {
        var cubo = new THREE.Object3D();
        cubo.position.y = lado / 2;
        cubo.position.x = 2 * lado;
        var geometriaCubo = new THREE.Mesh(new THREE.BoxGeometry(lado, lado, lado), this.material);

        cubo.add(geometriaCubo);
        return cubo;
    }

    setAltura(altura) {
        this.cubo.position.y = altura;
    }

    setAngulo(angulo) {
        this.cubo.rotation.y = angulo;
    }

    createGUI(gui, titleGui) {
        this.guiControls = {
            altura: 0,
            angulo: 0
        };

        var folder = gui.addFolder(titleGui);
        folder.add(this.guiControls, 'altura', 0, 0.5, 0.001)
            .name('Altura: ')
            .onChange((value) => this.setAltura(value));

        folder.add(this.guiControls, 'angulo', -2 * Math.PI, 2 * Math.PI, 0.001)
            .name('Angulo: ')
            .onChange((value) => this.setAngulo(value));
    }

    update() {
        // Actualizar la rotación en cada fotograma
        this.cubo.rotation.x += this.rotationSpeed;
    }
}

export { Cubo };
