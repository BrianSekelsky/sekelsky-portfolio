const isMobile = window.matchMedia('only screen and (max-width: 768px)').matches;

const scene = new THREE.Scene()
// scene.add(mesh)

const camera = new THREE.PerspectiveCamera(70, 0.3, 1, 1000);
camera.position.z = -30
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

const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })

for(let i = -50; i < 100; i+= 2) {
    // const material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } )
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    mesh.position.set(i, 0, 0)
    scene.add(mesh)
}

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

document.addEventListener( 'pointermove', onPointerMove );

let matrix = new THREE.Matrix4()

const clock = new THREE.Clock()

// Raycaster
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();

const tick = () =>
{

    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()

    // raycaster.set(rayOrigin, rayDirection)

    camera.updateMatrixWorld();

    raycaster.setFromCamera( pointer, camera )
    const intersects = raycaster.intersectObjects( scene.children );

    // for(const object of scene.children) {
    //     object.object.material.color.set(0xff0000)
    // }

    console.log(intersects.length)
    
    for(const intersect of intersects) {
        intersect.object.material.color.set(0xff0000)
    }

    // Camera rotate around scene
    const elapsedTime = clock.getElapsedTime()


    if(isMobile){
        camera.position.x += 0.02
        camera.position.y += 0.02
    }

    // Parallax
    const parallaxX = cursor.x
    const parallaxY = - cursor.y

    // gsap.to(particles.rotation, { // selector text, Array, or object
    //     x: parallaxY * 1,
    //     y: parallaxX * 1,
    //     duration: 1,
    //   });

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
