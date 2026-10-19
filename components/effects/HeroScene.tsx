"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// A ridge of glowing particles shaped like a Himalayan skyline. Points near the cursor
// are pushed away, the whole field breathes slowly, and the camera leans with the mouse.
// Phones get fewer points; reduced-motion visitors get one still frame.

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  attribute float aHeight;
  attribute float aSeed;
  varying float vHeight;
  varying float vFade;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.6 + p.x * 0.35 + aSeed * 6.28) * 0.06;
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

    vec2 ndc = clip.xy / clip.w;
    vec2 away = ndc - uMouse;
    float d = length(away * vec2(1.6, 1.0));
    float force = smoothstep(0.32, 0.0, d) * 0.09;
    clip.xy += normalize(away + 1e-5) * force * clip.w;

    gl_Position = clip;
    gl_PointSize = (2.0 + aHeight * 2.4 + force * 30.0) * uPixelRatio * (9.0 / clip.w);
    vHeight = aHeight;
    vFade = smoothstep(-22.0, -4.0, position.z);
  }
`;

const fragment = /* glsl */ `
  varying float vHeight;
  varying float vFade;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.0, r);
    vec3 teal = vec3(0.176, 0.831, 0.749);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 snow = vec3(0.93, 0.93, 0.98);
    vec3 col = mix(violet, teal, smoothstep(0.05, 0.55, vHeight));
    col = mix(col, snow, smoothstep(0.72, 1.0, vHeight));
    gl_FragColor = vec4(col, a * (0.3 + 0.7 * vFade) * (0.5 + vHeight * 0.6));
  }
`;

const starVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vTwinkle;
  varying float vSeed;

  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = clip;
    vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 40.0));
    vSeed = aSeed;
    gl_PointSize = (1.2 + aSeed * aSeed * 3.2) * uPixelRatio * (24.0 / clip.w);
  }
`;

const starFragment = /* glsl */ `
  varying float vTwinkle;
  varying float vSeed;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = pow(smoothstep(0.5, 0.0, r), 2.0);
    vec3 col = mix(vec3(0.85, 0.9, 1.0), vec3(0.55, 0.95, 0.9), step(0.85, vSeed));
    gl_FragColor = vec4(col, a * vTwinkle * 0.8);
  }
`;

// Layered sines plus a few named peaks give a believable mountain line.
function ridge(x: number, z: number) {
  const peak = (cx: number, h: number, w: number) => h * Math.exp(-((x - cx) ** 2) / w);
  const depth = 1 - Math.min(1, Math.abs(z + 9) / 13);
  const base =
    Math.sin(x * 0.42 + z * 0.3) * 0.5 +
    Math.sin(x * 1.1 - z * 0.7) * 0.22 +
    Math.sin(x * 2.3 + z) * 0.08;
  const peaks = peak(-6, 2.3, 5) + peak(3.5, 3.4, 4.5) + peak(9, 1.8, 6) + peak(-12, 1.4, 8);
  return Math.max(0, (base * 0.6 + peaks + 0.6) * (0.35 + depth * 0.9));
}

export default function HeroScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia("(max-width: 767px)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 2.2, 6.5);

    const cols = phone ? 130 : 240;
    const rows = phone ? 46 : 80;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const heights = new Float32Array(count);
    const seeds = new Float32Array(count);
    let maxH = 0;
    for (let r = 0, i = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, i++) {
        const x = (c / (cols - 1) - 0.5) * 34 + (Math.random() - 0.5) * 0.1;
        const z = -2 - (r / (rows - 1)) * 20 + (Math.random() - 0.5) * 0.1;
        const h = ridge(x, z);
        positions.set([x, h - 1.2, z], i * 3);
        heights[i] = h;
        seeds[i] = Math.random();
        maxH = Math.max(maxH, h);
      }
    }
    for (let i = 0; i < count; i++) heights[i] /= maxH;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aHeight", new THREE.BufferAttribute(heights, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(9, 9) },
      uPixelRatio: { value: pixelRatio },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(geometry, material));

    // A sky of twinkling stars above the ridge, shifting slower than the mountains for depth
    const starCount = phone ? 350 : 900;
    const starPos = new Float32Array(starCount * 3);
    const starSeed = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      starPos.set([(Math.random() - 0.5) * 90, 1 + Math.random() * 26, -26 - Math.random() * 8], i * 3);
      starSeed[i] = Math.random();
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("aSeed", new THREE.BufferAttribute(starSeed, 1));
    const starMat = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Portrait screens: widen the lens so the ridge still spans the hero
      camera.fov = camera.aspect < 1 ? 85 : 55;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = new THREE.Vector2(9, 9);
    const lean = new THREE.Vector2();
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      target.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    };
    const onLeave = () => target.set(9, 9);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const render = () => {
      camera.position.x = lean.x * 0.6;
      camera.position.y = 2.2 + lean.y * 0.3;
      // Portrait: tilt down so the ridge fills the top half and the copy sits below it
      camera.lookAt(0, camera.aspect < 1 ? -2.6 : 0.4, -8);
      renderer.render(scene, camera);
    };

    let frame = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      uniforms.uTime.value = clock.getElapsedTime();
      // Ease the cursor so the ripple trails smoothly; jump when it enters from far away
      const m = uniforms.uMouse.value;
      if (m.distanceTo(target) > 3) m.copy(target);
      else m.lerp(target, 0.12);
      if (target.x < 5) lean.lerp(target, 0.04);
      render();
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    if (reduced) render();
    else tick();
    el.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      geometry.dispose();
      material.dispose();
      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden="true"
      className="absolute inset-0 opacity-0 transition-opacity duration-[1500ms] data-[ready=true]:opacity-100 [&>canvas]:h-full [&>canvas]:w-full"
    />
  );
}
