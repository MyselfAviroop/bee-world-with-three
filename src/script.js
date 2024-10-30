import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from "gsap";

// Create the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2; // Adjust the position to fit your model

// Create the GLTF loader
const loader = new GLTFLoader();

// Declare AnimationMixer variable
let animationMixer;
let bee; // Variable to store the bee model

// Load the bee model
loader.load(
    '/demon_bee_full_texture (1).glb',
    (gltf) => {
        bee = gltf.scene;
        modelmove(); // Initialize model movement after loading
        scene.add(bee);

        animationMixer = new THREE.AnimationMixer(bee);
        if (gltf.animations && gltf.animations.length > 0) {
            animationMixer.clipAction(gltf.animations[0]).play();
        }

        console.log('Bee model loaded:', bee);
    },
    undefined,
    (error) => {
        console.error('An error occurred while loading the bee model:', error);
    }
);

// Create the renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);

// Animation loop
let clock = new THREE.Clock();

const rend = () => {
    requestAnimationFrame(rend);
    const delta = clock.getDelta();
    if (animationMixer) animationMixer.update(delta);
    renderer.render(scene, camera);
};

// Define positions and rotations for each section
const arrpos = [
    {
        id: 'sec1',
        position: { x: 0, y: -1, z: 0 },
        rotation: { x: 0, y: 1.5, z: 0 }
    },
    {
        id: 'sec2',
        position: { x: -1, y: -1, z: 0 },
        rotation: { x: 0.3, y: -0.5, z: 0 }
    },
    {
        id: 'sec3',
        position: { x: 1, y: -0.5, z: 0 },
        rotation: { x: -0.3, y: 0.5, z: 0 }
    }, {
        id: 'sec4',
        position: { x: 0, y: -1, z: .8 },
        rotation: { x: -0.2, y: -.9, z: 0 }
    },
];

// Move model based on current section
const modelmove = () => {
    const sections = document.querySelectorAll('.section');
    let currentsection;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentsection = section.id;
        }
    });

    const posactive = arrpos.findIndex((val) => val.id === currentsection);
    if (posactive >= 0 && bee) {
        const newcoordinates = arrpos[posactive];
        // Animate bee's position
        gsap.to(bee.position, {
            x: newcoordinates.position.x,
            y: newcoordinates.position.y,
            z: newcoordinates.position.z,
            duration: 2,
            ease: "power1.inOut"
        });
        // Animate bee's rotation
        gsap.to(bee.rotation, {
            x: newcoordinates.rotation.x,
            y: newcoordinates.rotation.y,
            z: newcoordinates.rotation.z,
            duration: 2,
            ease: "power1.inOut"
        });
    }
};

// Scroll event listener
window.addEventListener('scroll', () => {
    if (bee) {
        modelmove();
    }
});

// Start the rendering loop
rend();
