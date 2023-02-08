const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

const camera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
camera.position.z = 20
scene.add(camera)

const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.render(scene, camera)

scene.background = new THREE.Color( 0xffffff );
scene.fog = new THREE.Fog( 0xffffff, 0.95, 100 ); 

/**
 * Particles
 */
const objectsDistance = 16
const textureLoader = new THREE.TextureLoader()

// Geometry
const particlesCount = 1000
const positions = new Float32Array(particlesCount * 30)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    // color: '#00A5E0',
    color: '#37343b',
    // color: '#05F140',
    // color: '#0000ff',
    sizeAttenuation: textureLoader,
    size: 0.2
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
particles.rotateX(120)
particles.scale.set(6,6,6)
scene.add(particles)

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
    camera.position.x = parallaxX * 5
    camera.position.y = parallaxY * 5

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
