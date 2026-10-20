"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// A sea of glowing particles rolling in slow waves toward the horizon.
// Moving the cursor sends ripples out from the point under it, and the camera leans gently.
// Phones get fewer points; reduced-motion visitors get one still frame.

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;      // cursor position on the sea plane (x, z)
  uniform float uStrength;  // ripple strength, rises while the cursor moves
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vHeight;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime;
    float wave =
      sin(p.x * 0.34 + t * 0.55) * 0.42 +
      sin(p.z * 0.45 - t * 0.8) * 0.36 +
      sin((p.x + p.z) * 0.2 + t * 0.35) * 0.5;

    float d = distance(p.xz, uMouse);
    float ripple = sin(d * 1.5 - t * 3.6) * exp(-d * 0.32) * uStrength * 0.55;
    float lift = exp(-d * d * 0.12) * uStrength * 0.35;
    p.y += wave + ripple + lift;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.4 + aSeed * 1.2 + lift * 3.0) * uPixelRatio * (11.5 / -mv.z);

    vHeight = clamp((wave + ripple + lift + 1.1) / 2.3, 0.0, 1.0);
    // Fade into the distance and toward the left/right edges
    // Fade into the distance, toward the left/right edges, and right in front of the camera
    vFade = smoothstep(-42.0, -8.0, position.z) * (1.0 - smoothstep(15.0, 22.0, abs(position.x))) * (1.0 - smoothstep(0.0, 4.0, position.z));
  }
`;

const fragment = /* glsl */ `
  varying float vHeight;
  varying float vFade;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.05, r);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 teal = vec3(0.176, 0.831, 0.749);
    vec3 crest = vec3(0.86, 0.95, 0.96);
    vec3 col = mix(violet, teal, smoothstep(0.2, 0.7, vHeight));
    col = mix(col, crest, smoothstep(0.82, 1.0, vHeight));
    gl_FragColor = vec4(col, a * vFade * min(1.0, 0.65 + vHeight * 0.55));
  }
`;

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

    // A grid of points on the sea plane, slightly jittered so it doesn't look like graph paper
    const cols = phone ? 130 : 240;
    const rows = phone ? 90 : 140;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let r = 0, i = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, i++) {
        const x = (c / (cols - 1) - 0.5) * 44 + (Math.random() - 0.5) * 0.1;
        const z = 4 - (r / (rows - 1)) * 46 + (Math.random() - 0.5) * 0.1;
        positions.set([x, 0, z], i * 3);
        seeds[i] = Math.random();
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, -8) },
      uStrength: { value: 0 },
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

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Portrait screens: widen the lens so the sea still spans the hero
      camera.fov = camera.aspect < 1 ? 80 : 50;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Cursor → point on the sea plane (y = 0), used as the ripple centre
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();
    const target = new THREE.Vector2(0, -8);
    const lean = new THREE.Vector2();
    let energy = 0;
    let lastInput = -10;
    // Point the ripple at a screen position; returns false if it missed the sea
    const aimAt = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      if (clientY > rect.bottom || clientY < rect.top) return false;
      ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(plane, hit)) return false;
      target.set(hit.x, Math.max(hit.z, -40));
      lastInput = clock.getElapsedTime();
      return true;
    };
    // Mouse: ripples follow the cursor
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // a finger moving is a scroll, not an aim
      if (aimAt(e.clientX, e.clientY)) {
        energy = Math.min(1, energy + Math.min(0.25, Math.abs(e.movementX) + Math.abs(e.movementY)) * 0.15 + 0.04);
      }
    };
    // Touch: a tap drops a splash where the finger lands
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" && aimAt(e.clientX, e.clientY)) {
        uniforms.uMouse.value.copy(target);
        energy = 1;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    // Phones have no cursor, so the sea makes its own ripples while nobody is touching it
    const touchOnly = window.matchMedia("(hover: none)").matches;
    let nextAuto = 1.2;

    const render = () => {
      camera.position.set(lean.x * 0.8, 3.6 + lean.y * 0.25, 8);
      // Look down at the sea so the rolling rows read clearly.
      // Portrait tilts further down so the sea fills the top half and the copy sits below it.
      camera.lookAt(0, camera.aspect < 1 ? -4.5 : 0.2, -12);
      renderer.render(scene, camera);
    };

    let frame = 0;
    let visible = true;
    const clock = new THREE.Clock();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;
      const now = clock.getElapsedTime();
      uniforms.uTime.value = now;
      if (touchOnly) {
        if (now > nextAuto && now - lastInput > 3) {
          target.set((Math.random() - 0.5) * 12, -5 - Math.random() * 9);
          uniforms.uMouse.value.copy(target);
          energy = Math.max(energy, 0.75);
          nextAuto = now + 2.6 + Math.random() * 1.4;
        }
        // Slow camera sway stands in for the mouse lean
        ndc.set(Math.sin(now * 0.25) * 0.6, Math.sin(now * 0.17) * 0.3);
      }
      uniforms.uMouse.value.lerp(target, 0.08);
      energy *= 0.985;
      uniforms.uStrength.value += (energy - uniforms.uStrength.value) * 0.06;
      lean.lerp(ndc, 0.03);
      render();
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    if (reduced) {
      uniforms.uTime.value = 4;
      render();
    } else tick();
    el.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      geometry.dispose();
      material.dispose();
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
