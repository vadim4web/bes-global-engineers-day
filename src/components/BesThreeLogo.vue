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

function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const gradient = context.createRadialGradient(128, 128, 16, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(180, 255, 244, 0.98)')
  gradient.addColorStop(0.28, 'rgba(0, 197, 167, 0.56)')
  gradient.addColorStop(1, 'rgba(0, 197, 167, 0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, 256, 256)

  return new THREE.CanvasTexture(canvas)
}

function createSparkField() {
  const count = 160
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 16
    positions[index * 3 + 1] = (Math.random() - 0.45) * 9
    positions[index * 3 + 2] = (Math.random() - 0.5) * 6
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x7fffe8,
      size: props.variant === 'ad' ? 0.075 : 0.06,
      transparent: true,
      opacity: 0.72
    })
  )
}

function createLogoMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xc8fff4,
    emissive: 0x00c5a7,
    emissiveIntensity: 1.35,
    metalness: 0.08,
    roughness: 0.06,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    reflectivity: 0.95
  })
}

function buildLogoGroup() {
  const loader = new SVGLoader()
  const svgData = loader.parse(besLogoSvg)
  const group = new THREE.Group()
  const logoLiftRatio = props.variant === 'ad' ? 0.75 : 0.5
  const extrudeSettings = {
    depth: props.variant === 'ad' ? 24 : 18,
    bevelEnabled: true,
    bevelSegments: 16,
    steps: 1,
    bevelSize: 6,
    bevelThickness: 7,
    curveSegments: 48
  }

  logoSegments.length = 0

  svgData.paths.forEach((svgPath) => {
    const segment = new THREE.Group()
    const fillColor = new THREE.Color(svgPath.color || '#00c5a7')
    const material = createLogoMaterial()
    material.color = fillColor.clone().lerp(new THREE.Color('#ffffff'), 0.55)
    material.emissive = fillColor

    SVGLoader.createShapes(svgPath).forEach((shape) => {
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      geometry.computeVertexNormals()

      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      segment.add(mesh)
    })

    segment.userData.baseY = -225
    segment.userData.rawBounds = new THREE.Box3().setFromObject(segment)
    logoSegments.push(segment)
    group.add(segment)
  })

  const scale = props.variant === 'ad' ? 0.0155 : 0.0088
  group.scale.set(scale, -scale, scale * 1.85)

  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  // Increase this ratio to move the 3D BES logo higher inside its canvas.
  group.position.set(-center.x, -center.y, -center.z)
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
        color: 0x00c5a7,
        transparent: true,
        opacity: props.variant === 'ad' ? 0.28 : 0.24,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    )
    sprite.position.set(segmentCenter.x, segmentCenter.y, -10)
    sprite.scale.set(segmentSize.x * 1.2, segmentSize.y * 2.1, 1)
    segment.add(sprite)
  })

  return group
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
  camera.position.z =
    props.variant === 'ad'
      ? width < 1200
        ? 10.2
        : 8.4
      : width < 580
        ? 11.6
        : 10.1
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
    34,
    mountRef.value.clientWidth / mountRef.value.clientHeight,
    0.1,
    100
  )
  camera.position.set(0, 0.08, props.variant === 'ad' ? 8.4 : 10.1)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  mountRef.value.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0x8bf8e9, 1.2))

  const keyLight = new THREE.PointLight(0x7effea, 26, 28, 1.4)
  keyLight.position.set(0.8, 2.6, 8)
  scene.add(keyLight)

  const fillLight = new THREE.PointLight(0x0f8f80, 18, 22, 1.8)
  fillLight.position.set(-5.8, -1.8, 3)
  scene.add(fillLight)

  const rimLight = new THREE.PointLight(0x7dfff0, 12, 18, 2)
  rimLight.position.set(0, -1.4, -4)
  scene.add(rimLight)

  logoRoot = buildLogoGroup()
  scene.add(logoRoot)

  const logoSize = logoRoot.userData.size
  halo = new THREE.Mesh(
    new THREE.TorusGeometry(
      Math.max(logoSize.x * 0.58, logoSize.y * 1.45),
      props.variant === 'ad' ? 0.08 : 0.06,
      28,
      220
    ),
    new THREE.MeshBasicMaterial({
      color: 0x00c5a7,
      transparent: true,
      opacity: 0.28
    })
  )
  halo.rotation.x = Math.PI / 2.7
  halo.position.y = 0.05
  scene.add(halo)

  sparkField = createSparkField()
  scene.add(sparkField)

  const clock = new THREE.Clock()

  const animate = () => {
    const elapsed = clock.getElapsedTime()

    logoRoot.rotation.y = Math.sin(elapsed * 0.42) * 0.18
    logoRoot.rotation.x = Math.sin(elapsed * 0.26) * 0.05
    logoRoot.position.y = Math.sin(elapsed * 1.08) * 0.12

    logoSegments.forEach((segment, index) => {
      segment.position.y = segment.userData.baseY + Math.sin(elapsed * 1.6 + index * 0.85) * 0.18
      segment.rotation.z = Math.sin(elapsed * 1.18 + index * 0.9) * 0.035
      segment.rotation.x = Math.cos(elapsed * 1.08 + index * 0.7) * 0.03
    })

    halo.rotation.z += 0.0021
    sparkField.rotation.z = elapsed * 0.04
    sparkField.rotation.y = elapsed * 0.06

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

.three-logo {
  width: 100%;
  height: 100%;
  min-height: 430px;
  filter: drop-shadow(0 0 40px rgba(0, 197, 167, 0.32));
}

.three-logo-shell--ad .three-logo {
  min-height: 100%;
  filter: drop-shadow(0 0 84px rgba(0, 197, 167, 0.46));
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
