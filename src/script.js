const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

const camera = new THREE.PerspectiveCamera(70, 0.3, 1, 1000);
camera.position.z = 18
camera.position.x = -10
camera.position.y = -5
scene.add(camera)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.render(scene, camera)

// scene.background = new THREE.Color( 0xffffff );
scene.background = new THREE.Color( 0x0C0910 );
scene.fog = new THREE.Fog( 0x0C0910, 0.95, 100 ); 

// Light
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 10 );
scene.add( light );

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.TorusKnotGeometry( 5, 1, 200, 32 )
// const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: 0xc8cbcf
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
const particles2 = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(particles)
scene.add(particles2)

particles.position.set(0, 11, 0)
particles2.position.set(4, -14, 0)


/**
 * Parallax
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / 800 - 0.5
    cursor.y = event.clientY / 600 - 0.5
})

let matrix = new THREE.Matrix4()

const clock = new THREE.Clock()

const tick = () =>
{

    // Camera rotate around scene
    const elapsedTime = clock.getElapsedTime()

    // Parallax
    const parallaxX = cursor.x
    const parallaxY = - cursor.y
    camera.position.x = parallaxX * 4
    camera.position.y = parallaxY * 4

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
