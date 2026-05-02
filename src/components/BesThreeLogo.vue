<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const mountRef = ref(null)

let animationFrame = 0
let renderer
let scene
let camera
let resizeObserver

const letters = []

function createSegment(material, width, height, x, y, depth = 0.45) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
  mesh.position.set(x, y, 0)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

function createLetterB(material) {
  const group = new THREE.Group()
  ;[
    [-0.65, 0, 0.34, 2.9],
    [0.05, 1.22, 1.36, 0.3],
    [0.05, 0, 1.28, 0.3],
    [0.05, -1.22, 1.36, 0.3],
    [0.75, 0.65, 0.28, 0.84],
    [0.75, -0.65, 0.28, 0.84]
  ].forEach(([x, y, width, height]) => {
    group.add(createSegment(material, width, height, x, y))
  })
  return group
}

function createLetterE(material) {
  const group = new THREE.Group()
  ;[
    [-0.72, 0, 0.34, 2.9],
    [0.02, 1.22, 1.46, 0.3],
    [-0.04, 0, 1.12, 0.3],
    [0.02, -1.22, 1.46, 0.3]
  ].forEach(([x, y, width, height]) => {
    group.add(createSegment(material, width, height, x, y))
  })
  return group
}

function createLetterS(material) {
  const group = new THREE.Group()
  ;[
    [0, 1.22, 1.44, 0.3],
    [0, 0, 1.42, 0.3],
    [0, -1.22, 1.44, 0.3],
    [-0.74, 0.66, 0.28, 0.86],
    [0.74, -0.66, 0.28, 0.86]
  ].forEach(([x, y, width, height]) => {
    group.add(createSegment(material, width, height, x, y))
  })
  return group
}

function createSparkField() {
  const count = 140
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 12
    positions[index * 3 + 1] = (Math.random() - 0.4) * 7
    positions[index * 3 + 2] = (Math.random() - 0.5) * 4
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x7fffe8,
      size: 0.06,
      transparent: true,
      opacity: 0.75
    })
  )
}

function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(119, 255, 231, 0.95)')
  gradient.addColorStop(0.3, 'rgba(0, 197, 167, 0.58)')
  gradient.addColorStop(1, 'rgba(0, 197, 167, 0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)

  return new THREE.CanvasTexture(canvas)
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
  camera.position.z = width < 580 ? 9.5 : 8.2
  camera.updateProjectionMatrix()
}

onMounted(() => {
  if (!mountRef.value) {
    return
  }

  letters.length = 0
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    34,
    mountRef.value.clientWidth / mountRef.value.clientHeight,
    0.1,
    100
  )
  camera.position.set(0, 0.15, 8.2)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  mountRef.value.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0x8bf8e9, 1.2)
  scene.add(ambient)

  const keyLight = new THREE.PointLight(0x7effea, 18, 24, 1.4)
  keyLight.position.set(0.8, 2.8, 7)
  scene.add(keyLight)

  const fillLight = new THREE.PointLight(0x0f8f80, 12, 18, 1.6)
  fillLight.position.set(-5, -2, 2)
  scene.add(fillLight)

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xb8fff2,
    emissive: 0x00c5a7,
    emissiveIntensity: 1.8,
    metalness: 0.42,
    roughness: 0.18,
    clearcoat: 0.4
  })

  const word = new THREE.Group()
  const letterB = createLetterB(material)
  const letterE = createLetterE(material)
  const letterS = createLetterS(material)

  letterB.position.x = -2.9
  letterE.position.x = 0
  letterS.position.x = 2.9

  letters.push(letterB, letterE, letterS)
  word.add(letterB, letterE, letterS)
  scene.add(word)

  const glowTexture = createGlowTexture()
  if (glowTexture) {
    ;[-2.9, 0, 2.9].forEach((positionX) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color: 0x00c5a7,
          transparent: true,
          opacity: 0.44,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      )
      sprite.position.set(positionX, 0, -0.45)
      sprite.scale.set(3.8, 3.8, 1)
      word.add(sprite)
    })
  }

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(4.6, 0.04, 24, 180),
    new THREE.MeshBasicMaterial({
      color: 0x00c5a7,
      transparent: true,
      opacity: 0.42
    })
  )
  halo.rotation.x = Math.PI / 2.7
  scene.add(halo)

  const sparkField = createSparkField()
  scene.add(sparkField)

  const clock = new THREE.Clock()

  const animate = () => {
    const elapsed = clock.getElapsedTime()

    word.rotation.y = Math.sin(elapsed * 0.45) * 0.26
    word.rotation.x = Math.sin(elapsed * 0.28) * 0.08
    word.position.y = Math.sin(elapsed * 1.3) * 0.12

    letters.forEach((letter, index) => {
      letter.position.y = Math.sin(elapsed * 1.8 + index * 0.9) * 0.22
      letter.rotation.z = Math.sin(elapsed * 1.4 + index * 0.8) * 0.08
      letter.rotation.x = Math.cos(elapsed * 1.2 + index * 0.5) * 0.05
    })

    halo.rotation.z += 0.0024
    sparkField.rotation.z = elapsed * 0.05
    sparkField.rotation.y = elapsed * 0.08

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
  letters.length = 0
  renderer?.dispose()

  if (renderer?.domElement && mountRef.value?.contains(renderer.domElement)) {
    mountRef.value.removeChild(renderer.domElement)
  }
})
</script>

<template>
  <div class="three-logo-shell">
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

.three-logo {
  width: 100%;
  height: 100%;
  min-height: 430px;
  filter: drop-shadow(0 0 40px rgba(0, 197, 167, 0.32));
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
