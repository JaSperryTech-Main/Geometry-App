import Stats from "https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js";

// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Create a dodecahedron
const geometry = new THREE.DodecahedronGeometry(10);
const material = new THREE.MeshStandardMaterial({
  color: 0xB00B69,
  roughness: 0.5,
  metalness: 0.5,
});
const dodecahedron = new THREE.Mesh(geometry, material);
dodecahedron.castShadow = true;
scene.add(dodecahedron);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(30, 50, 30);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Add grid helper
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Set camera position
camera.position.z = 40;

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;

let rotationSpeed = 0;

// Stats for performance monitoring
const stats = new Stats();
stats.dom.style.position = "absolute";
stats.dom.style.top = "10px";
stats.dom.style.right = "10px";
stats.dom.style.zIndex = "10000";
document.body.appendChild(stats.dom);

let showStats = true;

// Save and load user settings
const loadSettings = () => {
  const savedColor = localStorage.getItem("dodecahedronColor");
  const savedRotationSpeed = localStorage.getItem("rotationSpeed");
  const savedSize = localStorage.getItem("dodecahedronSize");

  if (savedColor) material.color.set(savedColor);
  if (savedRotationSpeed) rotationSpeed = parseFloat(savedRotationSpeed);
  if (savedSize) {
    const newSize = parseFloat(savedSize);
    dodecahedron.geometry.dispose();
    dodecahedron.geometry = new THREE.DodecahedronGeometry(newSize);
  }
};

const saveSettings = () => {
  localStorage.setItem("dodecahedronColor", material.color.getStyle());
  localStorage.setItem("rotationSpeed", rotationSpeed);
  localStorage.setItem("dodecahedronSize", dodecahedron.geometry.parameters.radius);
};

// Resize event
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Settings functionality
document.getElementById("color").addEventListener("input", (event) => {
  material.color.set(event.target.value);
  saveSettings();
});

document.getElementById("rotationSpeed").addEventListener("input", (event) => {
  rotationSpeed = parseFloat(event.target.value);
  saveSettings();
});

document.getElementById("gridToggle").addEventListener("change", (event) => {
  gridHelper.visible = event.target.checked;
});

document.getElementById("toggleStats").addEventListener("click", () => {
  showStats = !showStats;
  stats.dom.style.display = showStats ? "block" : "none";
});

// Dodecahedron size control
document.getElementById("size").addEventListener("input", (event) => {
  const newSize = parseFloat(event.target.value);
  dodecahedron.geometry.dispose();
  dodecahedron.geometry = new THREE.DodecahedronGeometry(newSize);
  saveSettings();
});

// Camera presets
document.getElementById("frontView").addEventListener("click", () => {
  camera.position.set(0, 0, 40);
  controls.update();
});

document.getElementById("topView").addEventListener("click", () => {
  camera.position.set(0, 40, 0);
  controls.update();
});

document.getElementById("sideView").addEventListener("click", () => {
  camera.position.set(40, 0, 0);
  controls.update();
});

// Animation loop with frame rate control
let lastTime = 0;
const desiredFPS = 60;
const frameInterval = 1000 / desiredFPS;

function animate(timestamp) {
  if (timestamp - lastTime > frameInterval) {
    lastTime = timestamp;
    dodecahedron.rotation.y += rotationSpeed;
    controls.update();
    if (showStats) stats.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

// Load settings and start animation
loadSettings();
animate();
