/* ==========================================================================
   Home hero: a drop of serum in real 3D.
   Her portrait stands in the scene, clinic photographs float at different
   depths, and a liquid glass drop sits in front of her. The drop refracts
   whatever is behind it, dents under the cursor and ripples when clicked.
   Scrolling flies the camera past the photographs until her face is seen
   through the drop.

   Source of truth for the bundle: build with
   esbuild src/hero.js --bundle --minify --format=esm --outfile=js/hero.js
   ========================================================================== */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Mesh, PlaneGeometry, IcosahedronGeometry,
  MeshBasicMaterial, MeshPhysicalMaterial, TextureLoader, SRGBColorSpace, Color,
  PMREMGenerator, ACESFilmicToneMapping, Vector2, Vector3, Raycaster, Points,
  BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending,
  ShaderMaterial, Sphere, DirectionalLight, PointLight, CanvasTexture
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const stage = document.querySelector("[data-hero]");
const canvas = stage && stage.querySelector("[data-gl]");
if (canvas) start();

function webglOK() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
  catch (e) { return false; }
}

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 q0 = vec3(a0.xy, h.x);
  vec3 q1 = vec3(a0.zw, h.y);
  vec3 q2 = vec3(a1.xy, h.z);
  vec3 q3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(q0,q0), dot(q1,q1), dot(q2,q2), dot(q3,q3)));
  q0 *= norm.x; q1 *= norm.y; q2 *= norm.z; q3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(q0,x0), dot(q1,x1), dot(q2,x2), dot(q3,x3)));
}
uniform float uTime; uniform float uAmp; uniform float uDent; uniform vec3 uPtr;
uniform float uPulse; uniform vec3 uPulseDir;
float disp(vec3 n){
  float d = snoise(n * 1.3 + vec3(0.0, 0.0, uTime * 0.22)) * uAmp;
  d += snoise(n * 2.6 + vec3(uTime * 0.15)) * uAmp * 0.22;
  float c = dot(n, uPtr);
  d -= uDent * smoothstep(0.78, 1.0, c) * 0.24;
  d += uDent * smoothstep(0.5, 0.8, c) * (1.0 - smoothstep(0.8, 0.96, c)) * 0.06;
  float a = acos(clamp(dot(n, uPulseDir), -1.0, 1.0));
  d += uPulse * sin(a * 15.0 - (1.0 - uPulse) * 22.0) * 0.04 * (1.0 - smoothstep(0.0, 3.0, a));
  return d;
}
`;

function start() {
  if (!webglOK()) { stage.classList.add("is-static"); return; }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  let renderer;
  try { renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" }); }
  catch (e) { stage.classList.add("is-static"); return; }
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  if ("transmissionResolutionScale" in renderer) renderer.transmissionResolutionScale = 0.5;
  renderer.setClearColor(0x0c0c0d, 1);

  const scene = new Scene();
  const pm = new PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();

  const camera = new PerspectiveCamera(35, 1, 0.1, 60);
  const key = new DirectionalLight(0xffffff, 1.4); key.position.set(-3, 4, 6); scene.add(key);
  const rim = new PointLight(0xf3c7d1, 6, 12, 1.6); rim.position.set(2.5, 1.5, 4); scene.add(rim);

  /* ---- glow behind her ---- */
  // opaque backdrop so the glass has a soft blush light to refract
  const glowU = { uC: { value: new Vector2(0.8, 0.6) }, uR: { value: 5.5 } };
  const glow = new Mesh(new PlaneGeometry(60, 40), new ShaderMaterial({
    uniforms: glowU, toneMapped: false,
    vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: "varying vec3 vW; uniform vec2 uC; uniform float uR; void main(){ float d = distance(vW.xy, uC) / uR; vec3 base = vec3(0.047, 0.047, 0.051); vec3 rose = vec3(0.30, 0.20, 0.23); vec3 c = mix(rose, base, smoothstep(0.0, 1.0, d)); c += vec3(0.07, 0.05, 0.055) * (1.0 - smoothstep(0.0, 0.35, d)); gl_FragColor = vec4(c, 1.0); }"
  }));
  glow.position.z = -4;
  scene.add(glow);

  /* ---- dust ---- */
  const N = innerWidth < 760 ? 140 : 260;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 11; pos[i * 3 + 1] = (Math.random() - 0.5) * 7; pos[i * 3 + 2] = Math.random() * 9 - 2; }
  const dustGeo = new BufferGeometry(); dustGeo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  const dc = document.createElement("canvas"); dc.width = dc.height = 64;
  const dg = dc.getContext("2d"), grd = dg.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.35, "rgba(255,255,255,0.5)"); grd.addColorStop(1, "rgba(255,255,255,0)");
  dg.fillStyle = grd; dg.fillRect(0, 0, 64, 64);
  const dust = new Points(dustGeo, new PointsMaterial({ color: 0xf6d6de, size: 0.05, map: new CanvasTexture(dc), transparent: true, opacity: 0.5, depthWrite: false, blending: AdditiveBlending }));
  scene.add(dust);

  /* ---- the drop ---- */
  const U = {
    uTime: { value: 0 }, uAmp: { value: 0.065 }, uDent: { value: 0 }, uPtr: { value: new Vector3(0, 0, 1) },
    uPulse: { value: 0 }, uPulseDir: { value: new Vector3(0, 0, 1) }
  };
  const dropMat = new MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02, transmission: 1, thickness: 0.7, ior: 1.3,
    attenuationColor: new Color("#f9dbe2"), attenuationDistance: 2.4,
    emissive: new Color("#f3c7d1"), emissiveIntensity: 0.06,
    iridescence: 0.55, iridescenceIOR: 1.22, iridescenceThicknessMinimum: 140, iridescenceThicknessMaximum: 520,
    clearcoat: 1, clearcoatRoughness: 0.03, specularIntensity: 1, envMapIntensity: 1.6
  });
  dropMat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\n" + NOISE)
      .replace("#include <beginnormal_vertex>", `
        vec3 n0 = normalize(position);
        vec3 tg = normalize(cross(n0, abs(n0.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 bt = normalize(cross(n0, tg));
        float e = 0.012;
        vec3 p0 = n0 * (1.0 + disp(n0));
        vec3 na = normalize(n0 + tg * e); vec3 pa = na * (1.0 + disp(na));
        vec3 nb = normalize(n0 + bt * e); vec3 pb = nb * (1.0 + disp(nb));
        vec3 objectNormal = normalize(cross(pa - p0, pb - p0));
        if (dot(objectNormal, n0) < 0.0) objectNormal = -objectNormal;
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif`)
      .replace("#include <begin_vertex>", "vec3 transformed = p0;\n#ifdef USE_ALPHAHASH\nvPosition = vec3(position);\n#endif");
  };
  const detail = innerWidth < 760 ? 16 : 24;
  const drop = new Mesh(new IcosahedronGeometry(1, detail), dropMat);
  scene.add(drop);

  /* ---- photographs ---- */
  const loader = new TextureLoader();
  const load = (src) => loader.loadAsync(src).then((t) => { t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t; });

  const PHOTOS = [
    { src: "images/clinic-shelves.webp", d: { n: [-0.8, 0.46], z: 5.6, h: 0.5, r: 0.22 }, m: { n: [-0.76, -0.22], z: 5.4, h: 0.55, r: 0.2 } },
    { src: "images/clinic-treatment.webp", d: { n: [0.86, -0.42], z: 6.4, h: 0.48, r: -0.26 }, m: { n: [0.76, -0.42], z: 6.2, h: 0.5, r: -0.24 } },
    { src: "images/clinic-room.webp", d: { n: [0.6, 0.5], z: 4.2, h: 0.66, r: -0.18 }, m: { n: [0.74, -0.08], z: 3.6, h: 0.7, r: -0.2 } },
    { src: "images/skin-treatment.webp", d: { n: [-0.36, 0.6], z: 3.2, h: 0.4, r: 0.2 }, m: null },
    { src: "images/clinic-reception.webp", d: { n: [0.94, 0.08], z: 1.2, h: 0.95, r: -0.3 }, m: { n: [-0.66, -0.6], z: 1.0, h: 1.1, r: 0.3 } },
    { src: "images/clinic-desk.webp", d: { n: [-0.58, 0.3], z: -1.6, h: 1.25, r: 0.34 }, m: null }
  ];

  let her = null; const photos = [];
  let quality = 1, slowFrames = 0, sampled = 0;
  let L = null; // layout
  let p = 0, pSmooth = 0, t0 = performance.now();
  const mouse = new Vector2(0, 0), mouseS = new Vector2(0, 0);
  let over = false, down = false, needs = true, hasPtr = false;

  function layout() {
    const box = canvas.parentNode, w = box.clientWidth, h = box.clientHeight, a = w / h;
    renderer.setPixelRatio(Math.min(devicePixelRatio, (w < 760 ? 1.5 : 1.5) * quality));
    renderer.setSize(w, h, false);
    const mob = a < 1;
    camera.fov = mob ? 50 : 35; camera.aspect = a; camera.updateProjectionMatrix();
    const tan = Math.tan((camera.fov * Math.PI) / 360);
    const visH = 2 * 9 * tan, bottom = -visH / 2;
    const H = mob ? Math.min(4.6, visH * 0.56) : 4.6;
    const herX = mob ? 0.12 : Math.min(1.05, 0.95 * (a / 1.78));
    const herY = bottom + H / 2 - 0.08;
    const face = new Vector3(herX, herY + H * 0.29, 0);
    const r = mob ? 0.46 : 0.62;
    L = {
      mob, H, herX, herY, r,
      dropA: mob ? new Vector3(herX - 0.5, herY - H * 0.14, 2.2) : new Vector3(herX - 0.62, herY - H * 0.1, 2.2),
      dropB: mob ? new Vector3(face.x - 0.42, face.y - 0.62, 2.4) : new Vector3(face.x - 0.62, face.y - 0.66, 2.4),
      camA: new Vector3(0, 0, 9), lookA: new Vector3(0, 0, 0),
      camB: mob ? new Vector3(face.x - 0.12, face.y - 0.3, 4.9) : new Vector3(face.x - 0.3, face.y - 0.18, 5.4),
      lookB: mob ? new Vector3(face.x - 0.12, face.y - 0.3, 0) : new Vector3(face.x - 0.3, face.y - 0.18, 0),
      tan, a
    };
    if (her) {
      her.scale.set(H * (1200 / 1803), H, 1);
      her.position.set(herX, herY, 0);
    }
    glowU.uC.value.set(herX - 0.3, face.y - 0.4); glowU.uR.value = mob ? 5 : 6.5;
    photos.forEach((ph) => {
      const s = mob ? ph.spec.m : ph.spec.d;
      ph.mesh.visible = !!s;
      if (!s) return;
      const dd = 9 - s.z;
      ph.base = new Vector3(s.n[0] * dd * tan * a, s.n[1] * dd * tan, s.z);
      ph.mesh.scale.set(s.h * ph.aspect, s.h, 1);
      ph.mesh.rotation.y = s.r;
      ph.mesh.position.copy(ph.base);
    });
    needs = true;
  }

  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function progress() {
    const r = stage.getBoundingClientRect();
    const travel = r.height - innerHeight;
    return travel > 0 ? clamp(-r.top / travel, 0, 1) : 0;
  }

  const ray = new Raycaster(), sphere = new Sphere(), hit = new Vector3(), tmp = new Vector3();
  function pick() {
    ray.setFromCamera(mouse, camera);
    sphere.set(drop.position, drop.scale.x * 1.06);
    const ok = ray.ray.intersectSphere(sphere, hit);
    if (ok) { tmp.copy(hit); drop.worldToLocal(tmp); tmp.normalize(); }
    return ok ? tmp : null;
  }
  function setOver(v) {
    if (v === over) return; over = v;
    stage.classList.toggle("is-over-drop", v);
    if (window.DPA && window.DPA.cursor) window.DPA.cursor(v ? "Touch" : null);
  }

  function toLocal(e) {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  }
  stage.addEventListener("pointermove", (e) => { toLocal(e); hasPtr = true; needs = true; });
  stage.addEventListener("pointerleave", () => { setOver(false); down = false; hasPtr = false; mouse.set(0, 0); needs = true; });
  stage.addEventListener("pointerdown", (e) => {
    toLocal(e); hasPtr = true; const d = pick();
    if (d) { down = true; U.uPulse.value = 1; U.uPulseDir.value.copy(d); needs = true; }
  });
  addEventListener("pointerup", () => { down = false; });

  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(stage);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loop(); });
  addEventListener("resize", () => { layout(); loop(); });
  addEventListener("scroll", () => { needs = true; loop(); }, { passive: true });

  let raf = 0, last = performance.now();
  function loop() { if (!raf) raf = requestAnimationFrame(frame); }

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden || !L) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;

    p = progress();
    pSmooth += (p - pSmooth) * (reduce ? 1 : Math.min(1, dt * 7));
    const e = reduce ? 0 : ease(pSmooth);

    mouseS.lerp(mouse, Math.min(1, dt * 4));
    const par = (fine ? 1 : 0.4) * (1 - e * 0.7);

    // camera
    camera.position.lerpVectors(L.camA, L.camB, e);
    camera.position.x += mouseS.x * 0.42 * par;
    camera.position.y += mouseS.y * 0.24 * par;
    tmp.lerpVectors(L.lookA, L.lookB, e);
    camera.lookAt(tmp);

    // drop
    drop.position.lerpVectors(L.dropA, L.dropB, e);
    if (!reduce) {
      drop.position.y += Math.sin(t * 0.9) * 0.05 * (1 - e);
      drop.position.x += mouseS.x * 0.12 * (1 - e);
      drop.rotation.y = t * 0.12; drop.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    const s = L.r * (1 - e * 0.18);
    drop.scale.setScalar(s);

    // touch
    const d = hasPtr ? pick() : null;
    setOver(!!d && (fine || down));
    if (d && (fine || down)) U.uPtr.value.lerp(d, Math.min(1, dt * 10)).normalize();
    U.uDent.value += ((d && (fine || down) ? 1 : 0) - U.uDent.value) * Math.min(1, dt * 6);
    U.uPulse.value = Math.max(0, U.uPulse.value - dt * 0.65);
    U.uTime.value = reduce ? 0 : t;

    // photographs drift a little, and lean toward the cursor
    photos.forEach((ph, i) => {
      if (!ph.base) return;
      ph.mesh.position.y = ph.base.y + (reduce ? 0 : Math.sin(t * 0.5 + i * 1.7) * 0.05);
      ph.mesh.rotation.x = -mouseS.y * 0.08;
    });
    if (!reduce) { dust.rotation.y = t * 0.01; dust.position.y = Math.sin(t * 0.2) * 0.1; }

    renderer.render(scene, camera);
    // adaptive quality: drop the pixel ratio on slow GPUs
    if (sampled < 400 && quality > 0.5) { sampled++; if (dt > 0.03) slowFrames++; if (sampled % 45 === 0) { if (slowFrames > 20) { quality = Math.max(0.5, quality - 0.25); layout(); } slowFrames = 0; } }
    needs = false;

    const active = !reduce || U.uPulse.value > 0 || Math.abs(U.uDent.value - (over ? 1 : 0)) > 0.01 || mouseS.distanceTo(mouse) > 0.001 || Math.abs(p - pSmooth) > 0.0005;
    if (active || needs) loop();
  }

  Promise.all([load("images/portrait-cut.webp")].concat(PHOTOS.map((s) => load(s.src)))).then((tex) => {
    her = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: tex[0], alphaTest: 0.5, alphaToCoverage: true, toneMapped: false }));
    scene.add(her);
    PHOTOS.forEach((spec, i) => {
      const t = tex[i + 1];
      const m = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: t, toneMapped: false, color: new Color(0.82, 0.82, 0.82) }));
      scene.add(m);
      photos.push({ mesh: m, spec, aspect: t.image.width / t.image.height });
    });
    layout();
    renderer.compile(scene, camera);
    loop();
    requestAnimationFrame(() => stage.classList.add("is-gl"));
  }).catch(() => stage.classList.add("is-static"));
}
