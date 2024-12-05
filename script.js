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
  color: 0x2194ce,
  roughness: 0,
  metalness: 0,
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

// Stats for performance monitoring
const stats = new Stats();
stats.dom.style.position = "absolute";
stats.dom.style.top = "10px";
stats.dom.style.right = "10px";
stats.dom.style.zIndex = "10000";
document.body.appendChild(stats.dom);


let rotationSpeed = 0;
let showStats = false;

// Resize event
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Event listeners for settings
document.getElementById("color").addEventListener("input", (event) => {
  material.color.set(event.target.value);
});

document.getElementById("rotationSpeed").addEventListener("input", (event) => {
  rotationSpeed = parseFloat(event.target.value);
});

document.getElementById("gridToggle").addEventListener("change", (event) => {
  gridHelper.visible = event.target.checked;
});

document.getElementById("toggleStats").addEventListener("click", () => {
  showStats = !showStats;
  stats.dom.style.display = showStats ? "block" : "none";
});

document.getElementById("size").addEventListener("input", (event) => {
  const newSize = parseFloat(event.target.value);
  dodecahedron.geometry.dispose();
  dodecahedron.geometry = new THREE.DodecahedronGeometry(newSize);
});

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

const settingsPanel = document.getElementById("settings");
const toggleButton = document.getElementById("toggleSettings");

toggleButton.addEventListener("click", () => {
  if (settingsPanel.style.display === "block") {
    settingsPanel.style.display = "none";
  } else {
    settingsPanel.style.display = "block";
  }
});


// Animation loop
function animate() {
  dodecahedron.rotation.y += rotationSpeed;
  controls.update();
  if (showStats) stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
