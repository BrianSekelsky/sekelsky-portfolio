const isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

const camera = new THREE.PerspectiveCamera(70, 0.3, 1, 1000);
camera.position.z = -20
camera.position.x = 0
camera.position.y = 0

camera.lookAt(0,0,0)

scene.add(camera)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.render(scene, camera)

scene.background = new THREE.Color( 0x000000 );
scene.fog = new THREE.Fog( 0x000000, 0.95, 40 ); 

// Light
const light2 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2 );
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light, light2 );

const rotationGroup = new THREE.Group();

/**
 * Particles
 */
// Geometry
// const particlesGeometry = new THREE.TorusKnotGeometry( 7, 1.5, 200, 32 )
const particlesGeometry = new THREE.TorusGeometry( 10, 3, 64, 200 );
// const particlesGeometry = new THREE.SphereGeometry( 15, 128, 128 );
// const particlesGeometry = new THREE.BoxGeometry( 15, 15, 15, 15, 15, 15 );
// particlesGeometry.rotateZ(Math.PI / 2)
// const particlesGeometry = new THREE.BufferGeometry()

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xd1dced,
});

// const particlesMaterial = new THREE.MeshBasicMaterial();

// Material
if(!isMobile){
    particlesMaterial.size = 0.05
} else {
    particlesMaterial.size = 0.05
}

// const particlesGeometry = new THREE.BufferGeometry()
// const count = 5000
// const positions = new Float32Array(count * 3)
// for(let i = 0; i < count * 3; i++){
//     positions[i] = (Math.random() - 0.5) * 20
// }
// particlesGeometry.setAttribute(
//     'position',
//     new THREE.BufferAttribute(positions, 3)
// )

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
const particles2 = new THREE.Points(particlesGeometry, particlesMaterial)

console.log(particles.geometry)

// scene.add(rotationGroup)

if(!isMobile){
    // scene.add(particles2)
}

particles.position.set(0, 1.8, 0)
if(isMobile){
    particles.position.set(2, 4, 3)
}
particles2.position.set(0, -32, 0)

particles.scale.set(0.5, 0.5, 0.5)

scene.add(particles)

/**
 * Parallax
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = event.clientY / window.innerHeight - 0.5
})

let matrix = new THREE.Matrix4()

const clock = new THREE.Clock()

// Raycaster
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
// let intersects = []
let INTERSECTED = null
const PARTICLE_SIZE = 3
let theta = 0
let radius = 500

const tick = () =>
{

    camera.updateMatrixWorld();

    raycaster.setFromCamera( pointer, camera )
    const intersects = raycaster.intersectObjects( particles, false );

    const geometry = particles.geometry;
    const attributes = geometry.attributes;

    if ( intersects.length > 0 ) {

        console.log(intersects[0])

        // if ( INTERSECTED ) {
        //     console.log(INTERSECTED)
        // }

        // INTERSECTED = intersects[ 0 ].object;
        // INTERSECTED.currentHex = INTERSECTED.material.emissive.set();
        // INTERSECTED.material.emissive.set( 0xff0000 );


    } else {

        // if ( INTERSECTED ) INTERSECTED.material.emissive.set( INTERSECTED.currentHex );

        INTERSECTED = null;

    }



    // Camera rotate around scene
    const elapsedTime = clock.getElapsedTime()

    // Rotate mesh
    // particles.rotation.y += 0.004
    // particles.rotation.z += 0.001
    // camera.position.x += 0.02
    // camera.position.y -= 0.02


    if(isMobile){
        camera.position.x += 0.02
        camera.position.y += 0.02
    }

    // particles.rotation.x += 0.002
    // particles2.rotation.x += 0.002

    // Parallax
    const parallaxX = cursor.x
    const parallaxY = - cursor.y
    // camera.position.x = parallaxX * 1
    // camera.position.y = parallaxY * 2

    // camera.lookAt(0,0,0)

    gsap.to(particles.rotation, { // selector text, Array, or object
        x: parallaxY * 2,
        y: parallaxX * 2,
        duration: 1,
      });

    // rotationGroup.children[0].rotation.x += parallaxY * 0.02
    // rotationGroup.children[0].rotation.y += parallaxX * 0.02

    let scale = 0.6 - parallaxY * 0.5

    // particles.scale.set(scale, scale, scale)

    // particles2.rotation.y = parallaxX * 0.5
    // particles2.rotation.x = parallaxY * 0.5

    matrix.makeRotationY(Math.PI / 5000)
    camera.lookAt(0,0,0)

    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    resizeCanvasToDisplaySize();
}

tick()

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
  
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  
      // update any render target sizes here
    }
  }

function onPointerMove( event ) {

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
