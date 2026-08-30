/* ==========================================================================
   THREEUI-INSPIRED 3D WEBGL AMBIENT ENGINE
   Mountain Mist, Atmospheric Particles & Parallax Depth
   ========================================================================== */

export class KomorebiScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.currentMood = 'night';
    this.scrollProgress = 0;
    this.scrollVelocity = 0;

    this.init();
    this.createAtmosphere();
    this.createTerrain();
    this.createFireflies();
    this.bindEvents();
    this.animate();
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070a08, 0.022);

    // Camera
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 1.8, 8);

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0x1a2620, 1.5);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x8cb6d9, 1.8);
    this.dirLight.position.set(5, 12, 5);
    this.scene.add(this.dirLight);

    // Warm Lantern Light near center
    this.lanternLight = new THREE.PointLight(0xe2b173, 2.5, 15, 1.5);
    this.lanternLight.position.set(0, 1.5, 3);
    this.scene.add(this.lanternLight);
  }

  createTerrain() {
    // Generative mountain valley terrain mesh
    const geometry = new THREE.PlaneGeometry(35, 35, 64, 64);
    geometry.rotateX(-Math.PI / 2.2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle rolling mountain ridge wave
      const elevation =
        Math.sin(x * 0.25) * 1.8 +
        Math.cos(y * 0.2) * 1.2 +
        Math.sin(x * 0.8 + y * 0.6) * 0.5;
      pos.setZ(i, elevation - 2.5);
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: 0x0f1813,
      roughness: 0.85,
      metalness: 0.15,
      wireframe: false,
      flatShading: true,
    });

    this.terrain = new THREE.Mesh(geometry, material);
    this.terrain.position.set(0, -1.2, -6);
    this.scene.add(this.terrain);

    // Additional wireframe horizon crest for high-tech aesthetic
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x243b2f,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    this.terrainWire = new THREE.Mesh(geometry, wireMat);
    this.terrainWire.position.set(0, -1.18, -6);
    this.scene.add(this.terrainWire);
  }

  createAtmosphere() {
    // Layered drifting mist planes
    const mistGeo = new THREE.PlaneGeometry(28, 12);
    const mistMat = new THREE.MeshBasicMaterial({
      color: 0x1a2e24,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.mistPlanes = [];
    for (let i = 0; i < 4; i++) {
      const mist = new THREE.Mesh(mistGeo, mistMat.clone());
      mist.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 2 + 0.5,
        -Math.random() * 8 - 2
      );
      mist.rotation.y = (Math.random() - 0.5) * 0.4;
      this.mistPlanes.push(mist);
      this.scene.add(mist);
    }
  }

  createFireflies() {
    // 350 floating glowing firefly particles with soft pulse
    const particleCount = 320;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 6 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      scales[i] = Math.random() * 1.5 + 0.5;

      speeds[i * 3] = (Math.random() - 0.5) * 0.008;
      speeds[i * 3 + 1] = Math.random() * 0.006 + 0.002;
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    this.particleSpeeds = speeds;

    // Glowing point texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 235, 180, 1)');
    gradient.addColorStop(0.3, 'rgba(226, 177, 115, 0.7)');
    gradient.addColorStop(0.7, 'rgba(226, 177, 115, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      color: 0xe2b173,
      size: 0.35,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setMood(mood) {
    this.currentMood = mood;
    const duration = 1.2;

    if (mood === 'night') {
      gsap.to(this.ambientLight.color, { r: 0.1, g: 0.15, b: 0.13, duration });
      gsap.to(this.dirLight.color, { r: 0.55, g: 0.71, b: 0.85, duration });
      gsap.to(this.lanternLight.color, { r: 0.89, g: 0.69, b: 0.45, duration });
      gsap.to(this.scene.fog.color, { r: 0.027, g: 0.039, b: 0.031, duration });
      gsap.to(this.particles.material.color, { r: 0.89, g: 0.69, b: 0.45, duration });
    } else if (mood === 'sunset') {
      gsap.to(this.ambientLight.color, { r: 0.25, g: 0.12, b: 0.1, duration });
      gsap.to(this.dirLight.color, { r: 1.0, g: 0.45, b: 0.25, duration });
      gsap.to(this.lanternLight.color, { r: 1.0, g: 0.65, b: 0.35, duration });
      gsap.to(this.scene.fog.color, { r: 0.07, g: 0.035, b: 0.03, duration });
      gsap.to(this.particles.material.color, { r: 1.0, g: 0.65, b: 0.3, duration });
    } else if (mood === 'dawn') {
      gsap.to(this.ambientLight.color, { r: 0.12, g: 0.2, b: 0.24, duration });
      gsap.to(this.dirLight.color, { r: 0.7, g: 0.9, b: 0.95, duration });
      gsap.to(this.lanternLight.color, { r: 0.6, g: 0.85, b: 0.85, duration });
      gsap.to(this.scene.fog.color, { r: 0.04, g: 0.067, b: 0.08, duration });
      gsap.to(this.particles.material.color, { r: 0.6, g: 0.85, b: 0.85, duration });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Handle visibility changes to save GPU performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.clock.stop();
      } else {
        this.clock.start();
      }
    });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  setScrollProgress(progress, velocity = 0) {
    this.scrollProgress = progress; // 0 to 1
    this.scrollVelocity = velocity;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth camera mouse parallax
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Camera 3D Scroll Journey into the misty valley
    // As user scrolls down, camera descends and moves forward into the trees
    const targetCamX = this.mouse.x * 0.9;
    const targetCamY = 1.8 - this.scrollProgress * 2.2 + this.mouse.y * 0.5;
    const targetCamZ = 8.0 - this.scrollProgress * 3.8;

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.06;

    const targetLookY = 0.5 - this.scrollProgress * 0.8;
    this.camera.lookAt(0, targetLookY, 0);

    // Drifting mist accelerates with scroll velocity
    const mistSpeedBoost = 1.0 + Math.min(Math.abs(this.scrollVelocity) * 0.005, 3.0);
    if (this.mistPlanes) {
      this.mistPlanes.forEach((mist, i) => {
        mist.position.x += Math.sin(time * 0.2 + i) * 0.003 * mistSpeedBoost;
        mist.position.y += Math.cos(time * 0.15 + i) * 0.002 * mistSpeedBoost;
      });
    }

    // Floating fireflies animation with scroll excitation
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      const count = positions.length / 3;
      const particleBoost = Math.min(Math.abs(this.scrollVelocity) * 0.0003, 0.008);

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += this.particleSpeeds[i * 3 + 1] + particleBoost;
        positions[i * 3] += Math.sin(time + i) * 0.005;
        positions[i * 3 + 2] += Math.cos(time + i) * 0.005;

        // Reset if reached top
        if (positions[i * 3 + 1] > 6.0) {
          positions[i * 3 + 1] = -0.5;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Lantern warm flicker
    if (this.lanternLight) {
      this.lanternLight.intensity = 2.4 + Math.sin(time * 3.5) * 0.25 + Math.cos(time * 7) * 0.15;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
