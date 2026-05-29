<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import besLogoSvg from '../assets/bes-logo.svg?raw'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  }
})

const mountRef = ref(null)

let animationFrame = 0
let renderer
let scene
let camera
let resizeObserver
let logoRoot
let halo
let sparkField

const logoSegments = []

// Manual tuning guide:
// - `material.whiteMix`: lower it to make the BES letters more saturated.
// - `material.emissiveIntensity`: raise it to make the glow feel hotter.
// - `variant.scale`: makes the full BES logo larger or smaller.
// - `variant.logoLiftRatio`: moves the full logo up or down inside the canvas.
// - `variant.camera.*Z`: pushes the camera closer or farther away.
// - `variant.animation.*`: controls bounce, sway, and dancing motion.
// - `variant.spriteGlowOpacity`: controls the soft glow behind each letter group.
// - `lights.*.intensity`: the fastest way to make the whole scene brighter or moodier.
const LOGO_TUNING = {
  shared: {
    accentColor: '#00c5a7',
    highlightColor: '#c8fff4',
    glowTexture: {
      centerColor: 'rgba(200, 255, 244, 1)',
      midColor: 'rgba(0, 197, 167, 0.78)',
      edgeColor: 'rgba(0, 197, 167, 0)'
    },
    material: {
      // Lower whiteMix for richer green. Higher values wash the letters toward white.
      whiteMix: 0.33,
      emissiveIntensity: 0.33,
      metalness: 0.66,
      roughness: 0.035,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      reflectivity: 0.98
    },
    lights: {
      ambient: { color: 0x8bf8e9, intensity: 1.35 },
      key: { color: 0x7effea, intensity: 28, distance: 28, decay: 1.4, position: [0.8, 2.6, 8] },
      fill: { color: 0x0f8f80, intensity: 18, distance: 22, decay: 1.8, position: [-5.8, -1.8, 3] },
      rim: { color: 0x7dfff0, intensity: 13, distance: 18, decay: 2, position: [0, -1.4, -4] }
    },
    sparks: {
      count: 160,
      spreadX: 16,
      spreadY: 9,
      spreadZ: 6,
      color: 0x7fffe8,
      opacity: 0.72
    },
    toneMappingExposure: 1.2
  },
  default: {
    scale: 0.0088,
    depthScale: 1.95,
    logoLiftRatio: 0.5,
    segmentBaseY: -225,
    shellDropShadow: 'drop-shadow(0 0 40px rgba(0, 197, 167, 0.42))',
    extrude: {
      depth: 18,
      bevelEnabled: true,
      bevelSegments: 16,
      steps: 1,
      bevelSize: 6,
      bevelThickness: 7,
      curveSegments: 48
    },
    camera: {
      fov: 34,
      y: 0.08,
      mobileBreakpoint: 580,
      desktopZ: 10.1,
      mobileZ: 11.6
    },
    sparks: {
      size: 0.06
    },
    spriteGlowOpacity: 0.28,
    spriteGlowScaleX: 1.22,
    spriteGlowScaleY: 2.2,
    halo: {
      radiusXMultiplier: 0.58,
      radiusYMultiplier: 1.45,
      tube: 0.06,
      opacity: 0.3,
      rotationX: Math.PI / 2.7,
      y: 0.05
    },
    animation: {
      rootRotateYSpeed: 0.42,
      rootRotateYAmount: 0.18,
      rootRotateXSpeed: 0.26,
      rootRotateXAmount: 0.05,
      rootBounceSpeed: 1.08,
      rootBounceAmount: 0.12,
      segmentBounceSpeed: 1.6,
      segmentBounceAmount: 0.18,
      segmentRotateZSpeed: 1.18,
      segmentRotateZAmount: 0.035,
      segmentRotateXSpeed: 1.08,
      segmentRotateXAmount: 0.03,
      segmentOffsetStep: 0.85,
      segmentOffsetStepX: 0.7,
      haloSpinSpeed: 0.0021,
      sparksRotateZSpeed: 0.04,
      sparksRotateYSpeed: 0.06
    }
  },
  ad: {
    scale: 0.0158,
    depthScale: 2.08,
    logoLiftRatio: 0.75,
    segmentBaseY: -225,
    shellDropShadow: 'drop-shadow(0 0 96px rgba(0, 197, 167, 0.56))',
    extrude: {
      depth: 24,
      bevelEnabled: true,
      bevelSegments: 18,
      steps: 1,
      bevelSize: 6.5,
      bevelThickness: 7.5,
      curveSegments: 52
    },
    camera: {
      fov: 34,
      y: 0.08,
      mobileBreakpoint: 1200,
      desktopZ: 8.4,
      mobileZ: 10.2
    },
    sparks: {
      size: 0.075
    },
    spriteGlowOpacity: 0.34,
    spriteGlowScaleX: 1.26,
    spriteGlowScaleY: 2.35,
    halo: {
      radiusXMultiplier: 0.58,
      radiusYMultiplier: 1.45,
      tube: 0.08,
      opacity: 0.32,
      rotationX: Math.PI / 2.7,
      y: 0.05
    },
    animation: {
      rootRotateYSpeed: 0.42,
      rootRotateYAmount: 0.18,
      rootRotateXSpeed: 0.26,
      rootRotateXAmount: 0.05,
      rootBounceSpeed: 1.08,
      rootBounceAmount: 0.12,
      segmentBounceSpeed: 1.6,
      segmentBounceAmount: 0.18,
      segmentRotateZSpeed: 1.18,
      segmentRotateZAmount: 0.035,
      segmentRotateXSpeed: 1.08,
      segmentRotateXAmount: 0.03,
      segmentOffsetStep: 0.85,
      segmentOffsetStepX: 0.7,
      haloSpinSpeed: 0.0021,
      sparksRotateZSpeed: 0.04,
      sparksRotateYSpeed: 0.06
    }
  },
  portrait: {
    scale: 0.0146,
    depthScale: 2.1,
    logoLiftRatio: 0.77,
    segmentBaseY: -225,
    shellDropShadow: 'drop-shadow(0 0 92px rgba(0, 197, 167, 0.58))',
    extrude: {
      depth: 24,
      bevelEnabled: true,
      bevelSegments: 18,
      steps: 1,
      bevelSize: 6.5,
      bevelThickness: 7.5,
      curveSegments: 52
    },
    camera: {
      fov: 34,
      y: 0.08,
      mobileBreakpoint: 900,
      desktopZ: 9.5,
      mobileZ: 10.9
    },
    sparks: {
      size: 0.074
    },
    spriteGlowOpacity: 0.36,
    spriteGlowScaleX: 1.28,
    spriteGlowScaleY: 2.4,
    halo: {
      radiusXMultiplier: 0.6,
      radiusYMultiplier: 1.5,
      tube: 0.08,
      opacity: 0.34,
      rotationX: Math.PI / 2.65,
      y: 0.04
    },
    animation: {
      rootRotateYSpeed: 0.38,
      rootRotateYAmount: 0.15,
      rootRotateXSpeed: 0.24,
      rootRotateXAmount: 0.045,
      rootBounceSpeed: 1,
      rootBounceAmount: 0.11,
      segmentBounceSpeed: 1.45,
      segmentBounceAmount: 0.16,
      segmentRotateZSpeed: 1.08,
      segmentRotateZAmount: 0.03,
      segmentRotateXSpeed: 0.98,
      segmentRotateXAmount: 0.026,
      segmentOffsetStep: 0.85,
      segmentOffsetStepX: 0.7,
      haloSpinSpeed: 0.0019,
      sparksRotateZSpeed: 0.035,
      sparksRotateYSpeed: 0.055
    }
  }
}

function getVariantTuning() {
  const variantTuning = LOGO_TUNING[props.variant] ?? LOGO_TUNING.default

  return {
    ...LOGO_TUNING.shared,
    ...variantTuning,
    material: {
      ...LOGO_TUNING.shared.material
    },
    lights: {
      ...LOGO_TUNING.shared.lights
    },
    sparks: {
      ...LOGO_TUNING.shared.sparks,
      ...variantTuning.sparks
    },
    extrude: {
      ...variantTuning.extrude
    },
    camera: {
      ...variantTuning.camera
    },
    halo: {
      ...variantTuning.halo
    },
    animation: {
      ...variantTuning.animation
    }
  }
}

const tuning = getVariantTuning()

function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const gradient = context.createRadialGradient(128, 128, 16, 128, 128, 128)
  gradient.addColorStop(0, tuning.glowTexture.centerColor)
  gradient.addColorStop(0.3, tuning.glowTexture.midColor)
  gradient.addColorStop(1, tuning.glowTexture.edgeColor)

  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function createSparkField() {
  const positions = new Float32Array(tuning.sparks.count * 3)

  for (let index = 0; index < tuning.sparks.count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * tuning.sparks.spreadX
    positions[index * 3 + 1] = (Math.random() - 0.45) * tuning.sparks.spreadY
    positions[index * 3 + 2] = (Math.random() - 0.5) * tuning.sparks.spreadZ
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: tuning.sparks.color,
      size: tuning.sparks.size,
      transparent: true,
      opacity: tuning.sparks.opacity
    })
  )
}

function createLogoMaterial(fillColor) {
  const highlightColor = new THREE.Color(tuning.highlightColor)
  const materialColor = fillColor.clone().lerp(highlightColor, tuning.material.whiteMix)

  return new THREE.MeshPhysicalMaterial({
    color: materialColor,
    emissive: fillColor.clone(),
    emissiveIntensity: tuning.material.emissiveIntensity,
    metalness: tuning.material.metalness,
    roughness: tuning.material.roughness,
    clearcoat: tuning.material.clearcoat,
    clearcoatRoughness: tuning.material.clearcoatRoughness,
    reflectivity: tuning.material.reflectivity
  })
}

function buildLogoGroup() {
  const loader = new SVGLoader()
  const svgData = loader.parse(besLogoSvg)
  const group = new THREE.Group()

  logoSegments.length = 0

  svgData.paths.forEach((svgPath) => {
    const segment = new THREE.Group()
    const fillColor = new THREE.Color(svgPath.color || tuning.accentColor)
    const material = createLogoMaterial(fillColor)

    SVGLoader.createShapes(svgPath).forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, tuning.extrude)
      geometry.computeVertexNormals()

      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      segment.add(mesh)
    })

    segment.userData.baseY = tuning.segmentBaseY
    segment.userData.rawBounds = new THREE.Box3().setFromObject(segment)
    logoSegments.push(segment)
    group.add(segment)
  })

  // `scale` is the main master control for overall logo size.
  group.scale.set(tuning.scale, -tuning.scale, tuning.scale * tuning.depthScale)

  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())

  // `logoLiftRatio` is the easiest manual lever for moving the full BES mark up or down.
  group.position.set(-center.x, -center.y + size.y * tuning.logoLiftRatio, -center.z)
  group.userData.size = size

  logoSegments.forEach((segment) => {
    const segmentGlow = createGlowTexture()
    if (!segmentGlow) {
      return
    }

    const segmentSize = segment.userData.rawBounds.getSize(new THREE.Vector3())
    const segmentCenter = segment.userData.rawBounds.getCenter(new THREE.Vector3())
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: segmentGlow,
        color: new THREE.Color(tuning.accentColor),
        transparent: true,
        opacity: tuning.spriteGlowOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    )

    sprite.position.set(segmentCenter.x, segmentCenter.y, -10)
    sprite.scale.set(
      segmentSize.x * tuning.spriteGlowScaleX,
      segmentSize.y * tuning.spriteGlowScaleY,
      1
    )

    segment.add(sprite)
  })

  return group
}

function getCameraDistance(width) {
  return width < tuning.camera.mobileBreakpoint
    ? tuning.camera.mobileZ
    : tuning.camera.desktopZ
}

function resizeScene() {
  if (!mountRef.value || !renderer || !camera) {
    return
  }

  const width = mountRef.value.clientWidth
  const height = mountRef.value.clientHeight

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height, false)

  camera.aspect = width / height
  camera.position.z = getCameraDistance(width)
  camera.updateProjectionMatrix()
}

function disposeSceneAssets(root) {
  if (!root) {
    return
  }

  root.traverse((child) => {
    if (child.geometry) {
      child.geometry.dispose()
    }

    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material]

      materials.forEach((material) => {
        if (material.map) {
          material.map.dispose()
        }

        material.dispose()
      })
    }
  })
}

onMounted(() => {
  if (!mountRef.value) {
    return
  }

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    tuning.camera.fov,
    mountRef.value.clientWidth / mountRef.value.clientHeight,
    0.1,
    100
  )
  camera.position.set(0, tuning.camera.y, getCameraDistance(mountRef.value.clientWidth))

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = tuning.toneMappingExposure
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  mountRef.value.appendChild(renderer.domElement)

  // Lighting is intentionally grouped here so you can brighten or darken the whole scene fast.
  scene.add(
    new THREE.AmbientLight(
      tuning.lights.ambient.color,
      tuning.lights.ambient.intensity
    )
  )

  const keyLight = new THREE.PointLight(
    tuning.lights.key.color,
    tuning.lights.key.intensity,
    tuning.lights.key.distance,
    tuning.lights.key.decay
  )
  keyLight.position.set(...tuning.lights.key.position)
  scene.add(keyLight)

  const fillLight = new THREE.PointLight(
    tuning.lights.fill.color,
    tuning.lights.fill.intensity,
    tuning.lights.fill.distance,
    tuning.lights.fill.decay
  )
  fillLight.position.set(...tuning.lights.fill.position)
  scene.add(fillLight)

  const rimLight = new THREE.PointLight(
    tuning.lights.rim.color,
    tuning.lights.rim.intensity,
    tuning.lights.rim.distance,
    tuning.lights.rim.decay
  )
  rimLight.position.set(...tuning.lights.rim.position)
  scene.add(rimLight)

  logoRoot = buildLogoGroup()
  scene.add(logoRoot)

  const logoSize = logoRoot.userData.size
  halo = new THREE.Mesh(
    new THREE.TorusGeometry(
      Math.max(
        logoSize.x * tuning.halo.radiusXMultiplier,
        logoSize.y * tuning.halo.radiusYMultiplier
      ),
      tuning.halo.tube,
      28,
      220
    ),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(tuning.accentColor),
      transparent: true,
      opacity: tuning.halo.opacity
    })
  )
  halo.rotation.x = tuning.halo.rotationX
  halo.position.y = tuning.halo.y
  scene.add(halo)

  sparkField = createSparkField()
  scene.add(sparkField)

  const clock = new THREE.Clock()

  function animate() {
    const elapsed = clock.getElapsedTime()

    // Main logo dance motion.
    logoRoot.rotation.y =
      Math.sin(elapsed * tuning.animation.rootRotateYSpeed) * tuning.animation.rootRotateYAmount
    logoRoot.rotation.x =
      Math.sin(elapsed * tuning.animation.rootRotateXSpeed) * tuning.animation.rootRotateXAmount
    logoRoot.position.y =
      Math.sin(elapsed * tuning.animation.rootBounceSpeed) * tuning.animation.rootBounceAmount

    // Per-segment micro motion keeps the letters from feeling rigid.
    logoSegments.forEach((segment, index) => {
      segment.position.y =
        segment.userData.baseY +
        Math.sin(elapsed * tuning.animation.segmentBounceSpeed + index * tuning.animation.segmentOffsetStep) *
          tuning.animation.segmentBounceAmount
      segment.rotation.z =
        Math.sin(elapsed * tuning.animation.segmentRotateZSpeed + index * tuning.animation.segmentOffsetStep) *
          tuning.animation.segmentRotateZAmount
      segment.rotation.x =
        Math.cos(elapsed * tuning.animation.segmentRotateXSpeed + index * tuning.animation.segmentOffsetStepX) *
          tuning.animation.segmentRotateXAmount
    })

    halo.rotation.z += tuning.animation.haloSpinSpeed
    sparkField.rotation.z = elapsed * tuning.animation.sparksRotateZSpeed
    sparkField.rotation.y = elapsed * tuning.animation.sparksRotateYSpeed

    renderer.render(scene, camera)
    animationFrame = window.requestAnimationFrame(animate)
  }

  resizeScene()
  animate()

  resizeObserver = new ResizeObserver(() => resizeScene())
  resizeObserver.observe(mountRef.value)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame)
  resizeObserver?.disconnect()

  disposeSceneAssets(logoRoot)
  disposeSceneAssets(halo)
  disposeSceneAssets(sparkField)

  if (logoRoot) {
    scene?.remove(logoRoot)
  }

  if (halo) {
    scene?.remove(halo)
  }

  if (sparkField) {
    scene?.remove(sparkField)
  }

  logoSegments.length = 0
  renderer?.dispose()

  if (renderer?.domElement && mountRef.value?.contains(renderer.domElement)) {
    mountRef.value.removeChild(renderer.domElement)
  }
})
</script>

<template>
  <div :class="['three-logo-shell', `three-logo-shell--${props.variant}`]">
    <div ref="mountRef" class="three-logo" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.three-logo-shell {
  position: relative;
  min-height: 430px;
  border-radius: 32px;
  border: 1px solid rgba(119, 255, 231, 0.12);
  background:
    radial-gradient(circle at center, rgba(0, 197, 167, 0.11), transparent 56%),
    rgba(2, 8, 12, 0.42);
  overflow: hidden;
  box-shadow: inset 0 0 80px rgba(0, 197, 167, 0.06);
}

.three-logo-shell--ad {
  min-height: 100%;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.three-logo-shell--portrait {
  min-height: 100%;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.three-logo {
  width: 100%;
  height: 100%;
  min-height: 430px;
  filter: v-bind('LOGO_TUNING.default.shellDropShadow');
}

.three-logo-shell--ad .three-logo {
  min-height: 100%;
  filter: v-bind('LOGO_TUNING.ad.shellDropShadow');
}

.three-logo-shell--portrait .three-logo {
  min-height: 100%;
  filter: v-bind('LOGO_TUNING.portrait.shellDropShadow');
}

@media (max-width: 980px) {
  .three-logo-shell,
  .three-logo {
    min-height: 340px;
  }
}

@media (max-width: 640px) {
  .three-logo-shell,
  .three-logo {
    min-height: 280px;
    border-radius: 24px;
  }
}
</style>
