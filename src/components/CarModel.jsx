import { useLayoutEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_TARGET_SIZE = 4.65
const BASE_URL = import.meta.env.BASE_URL || '/'

const PAINT_FINISHES = {
  gloss: { roughness: 0.12, metalness: 0.72, clearcoat: 1, clearcoatRoughness: 0.08 },
  satin: { roughness: 0.42, metalness: 0.62, clearcoat: 0.55, clearcoatRoughness: 0.32 },
  matte: { roughness: 0.82, metalness: 0.42, clearcoat: 0.05, clearcoatRoughness: 0.75 },
  pearl: { roughness: 0.18, metalness: 0.5, clearcoat: 1, clearcoatRoughness: 0.04 },
  chrome: { roughness: 0.06, metalness: 1, clearcoat: 1, clearcoatRoughness: 0.02 },
}

const RIM_STYLES = {
  silver: '#cfd3d5',
  dark: '#101113',
  gold: '#c8a449',
  bronze: '#8d6040',
  white: '#f5f2ea',
  blackChrome: '#24272b',
}

const CALIPER_STYLES = {
  red: '#c8102e',
  yellow: '#f6d525',
  black: '#111111',
  blue: '#0061a0',
  acid: '#b5d334',
}

const INTERIOR_STYLES = {
  black: '#111111',
  red: '#7d0f18',
  tan: '#9b7048',
  chalk: '#d8d3ca',
}

const EXHAUST_STYLES = {
  chrome: { color: '#c8c8c8', metalness: 1, roughness: 0.15 },
  black: { color: '#101010', metalness: 0.85, roughness: 0.24 },
  titanium: { color: '#7a8190', metalness: 1, roughness: 0.18 },
}

const AERO_STYLES = {
  carbon: { color: '#0d0f10', metalness: 0.38, roughness: 0.5, clearcoat: 0.25 },
  black: { color: '#060606', metalness: 0.5, roughness: 0.2, clearcoat: 0.85 },
  body: null,
}

const DECAL_STYLES = {
  black: '#050505',
  white: '#f4f0e8',
  red: '#c8102e',
}

const BADGE_STYLES = {
  chrome: { color: '#d2d2d2', metalness: 1, roughness: 0.12 },
  black: { color: '#080808', metalness: 0.85, roughness: 0.18 },
  gold: { color: '#caa247', metalness: 1, roughness: 0.16 },
}

const METAL_STYLES = {
  chrome: { color: '#c9c9c9', metalness: 1, roughness: 0.1 },
  black: { color: '#0b0b0b', metalness: 0.9, roughness: 0.2 },
  bronze: { color: '#8c6041', metalness: 1, roughness: 0.18 },
  titanium: { color: '#7f8791', metalness: 1, roughness: 0.2 },
}

const TIRE_STYLES = {
  deepBlack: { color: '#020202', metalness: 0, roughness: 0.82 },
  track: { color: '#111111', metalness: 0, roughness: 0.96 },
  whiteLetter: { color: '#303030', metalness: 0, roughness: 0.78 },
}

const SUSPENSION_DROP = {
  stock: 0,
  sport: -0.08,
  track: -0.15,
}

function modelPath(modelId) {
  return `${BASE_URL}models/${modelId}/scene.gltf`
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term))
}

function getPartText(child, material) {
  return `${child.name || ''} ${material?.name || ''}`.toLowerCase()
}

function cloneMaterial(material) {
  if (!material) return material

  const cloned = material.clone()
  cloned.userData.tuningBase = {
    color: cloned.color?.clone(),
    emissive: cloned.emissive?.clone(),
    roughness: cloned.roughness,
    metalness: cloned.metalness,
    opacity: cloned.opacity,
    transparent: cloned.transparent,
    clearcoat: cloned.clearcoat,
    clearcoatRoughness: cloned.clearcoatRoughness,
    envMapIntensity: cloned.envMapIntensity,
  }
  return cloned
}

function resetMaterial(material) {
  const base = material.userData.tuningBase
  if (!base) return

  if (material.color && base.color) material.color.copy(base.color)
  if (material.emissive && base.emissive) material.emissive.copy(base.emissive)
  if (base.roughness !== undefined) material.roughness = base.roughness
  if (base.metalness !== undefined) material.metalness = base.metalness
  if (base.opacity !== undefined) material.opacity = base.opacity
  if (base.transparent !== undefined) material.transparent = base.transparent
  if ('clearcoat' in material && base.clearcoat !== undefined) material.clearcoat = base.clearcoat
  if ('clearcoatRoughness' in material && base.clearcoatRoughness !== undefined) {
    material.clearcoatRoughness = base.clearcoatRoughness
  }
  if (base.envMapIntensity !== undefined) material.envMapIntensity = base.envMapIntensity
}

function applyMetal(material, color, settings = {}) {
  if (material.color) material.color.set(color)
  if (settings.metalness !== undefined) material.metalness = settings.metalness
  if (settings.roughness !== undefined) material.roughness = settings.roughness
  if ('clearcoat' in material && settings.clearcoat !== undefined) material.clearcoat = settings.clearcoat
  if ('clearcoatRoughness' in material && settings.clearcoatRoughness !== undefined) {
    material.clearcoatRoughness = settings.clearcoatRoughness
  }
}

function prepareScene(scene) {
  const prepared = scene.clone(true)

  prepared.traverse((child) => {
    if (!child.isMesh) return

    child.userData.tuningBase = {
      visible: child.visible,
    }

    child.material = Array.isArray(child.material)
      ? child.material.map(cloneMaterial)
      : cloneMaterial(child.material)

    child.castShadow = false
    child.receiveShadow = true
    child.frustumCulled = false
  })

  return prepared
}

function isPaintPart(text) {
  return includesAny(text, ['paint', 'paint_2', 'p918_paint', 'car_mat', 'coloured', 'colored', 'exterior', 'coat', 'shell', 'carpaint'])
    && !isGlassPart(text)
    && !isLightPart(text)
    && !isInteriorPart(text)
    && !isTirePart(text)
}

function isRimPart(text) {
  return includesAny(text, ['rim', 'alloy', 'wheel1a', '3dwheel', 'wheel', 'hub'])
    && !includesAny(text, ['tire', 'tyre', 'rubber', 'brake', 'caliper', 'calliper', 'rotor', 'disc'])
}

function isCaliperPart(text) {
  return includesAny(text, ['caliper', 'calliper', 'calliperzone'])
}

function isGlassPart(text) {
  return includesAny(text, ['glass', 'window', 'windo', 'windscreen', 'windshield'])
}

function isLightPart(text) {
  return includesAny(text, ['light', 'headlamp', 'taillamp', 'headlight', 'brakelight', 'turn_lights', 'red_glass'])
}

function isInteriorPart(text) {
  return includesAny(text, ['interior', 'seat', 'cabin', 'dashboard'])
}

function isTrimPart(text) {
  return includesAny(text, ['grille', 'grill', 'base', 'textured', 'plastic', 'radiator'])
}

function isCarbonPart(text) {
  return includesAny(text, ['carbon'])
}

function isSpoilerPart(text) {
  return includesAny(text, ['spoiler', 'wing', 'rearwing'])
}

function isExhaustPart(text) {
  return includesAny(text, ['exhaust', 'muffler', 'tailpipe', 'pipe', 'engine'])
}

function isAeroPart(text) {
  return includesAny(text, ['splitter', 'skirt', 'diffuser', 'lip', 'bottom'])
}

function isDecalPart(text) {
  return includesAny(text, ['sticker', 'decal', 'stripe', 'doorline', 'turbo', 'support_logo', 'side_windo_logo'])
}

function isBadgePart(text) {
  return includesAny(text, ['badge', 'emblem', 'hood_emblem', 'rim_emblem', 'plate_logo', 'logo'])
    && !isDecalPart(text)
}

function isMirrorPart(text) {
  return includesAny(text, ['mirror', 'side_mirrors'])
}

function isMetalPart(text) {
  return includesAny(text, ['chrome', 'aluminium', 'aluminum', 'silver'])
    && !isRimPart(text)
    && !isLightPart(text)
    && !isGlassPart(text)
}

function isTirePart(text) {
  return includesAny(text, ['tire', 'tyre', 'rubber'])
}

export function CarModel({
  modelId,
  color,
  paintFinish = 'gloss',
  rimType = 'silver',
  spoilerType = 'body',
  trimType = 'carbon',
  carbonType = 'visible',
  aeroType = 'carbon',
  decalType = 'factory',
  badgeType = 'chrome',
  mirrorType = 'body',
  metalType = 'chrome',
  tireType = 'factory',
  caliperType = 'red',
  glassType = 'clear',
  lightType = 'clear',
  interiorType = 'black',
  exhaustType = 'chrome',
  suspensionType = 'stock',
}) {
  const { scene } = useGLTF(modelPath(modelId))
  const modelScene = useMemo(() => prepareScene(scene), [scene])

  useLayoutEffect(() => {
    if (!modelScene) return

    modelScene.scale.setScalar(1)
    modelScene.position.set(0, 0, 0)
    modelScene.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(modelScene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? MODEL_TARGET_SIZE / maxDim : 1

    modelScene.scale.setScalar(scale)
    modelScene.updateMatrixWorld(true)

    box.setFromObject(modelScene)
    box.getCenter(center)

    modelScene.position.set(
      -center.x,
      -box.min.y + (SUSPENSION_DROP[suspensionType] ?? 0),
      -center.z,
    )
    modelScene.updateMatrixWorld(true)
  }, [modelScene, suspensionType])

  useLayoutEffect(() => {
    if (!modelScene) return

    modelScene.traverse((child) => {
      if (!child.isMesh || !child.material) return

      const materials = Array.isArray(child.material) ? child.material : [child.material]
      const materialText = materials.map((material) => getPartText(child, material)).join(' ')
      const childText = `${child.name || ''} ${materialText}`.toLowerCase()

      child.visible = child.userData.tuningBase?.visible ?? true
      if ((spoilerType === 'none' && isSpoilerPart(childText)) || (decalType === 'delete' && isDecalPart(childText))) {
        child.visible = false
      }

      materials.forEach((material) => {
        resetMaterial(material)
        material.envMapIntensity = 1.65

        const text = getPartText(child, material)

        if (isPaintPart(text)) {
          applyMetal(material, color, PAINT_FINISHES[paintFinish] ?? PAINT_FINISHES.gloss)
        }

        if (isRimPart(text)) {
          applyMetal(material, RIM_STYLES[rimType] ?? RIM_STYLES.silver, {
            metalness: 1,
            roughness: rimType === 'dark' ? 0.24 : 0.14,
          })
        }

        if (isTirePart(text) && tireType !== 'factory') {
          applyMetal(material, TIRE_STYLES[tireType]?.color ?? '#050505', TIRE_STYLES[tireType] ?? TIRE_STYLES.deepBlack)
        }

        if (isSpoilerPart(text) && spoilerType !== 'none') {
          const spoilerColor = spoilerType === 'carbon' ? '#0f1011' : color
          applyMetal(material, spoilerColor, spoilerType === 'carbon'
            ? { metalness: 0.42, roughness: 0.55, clearcoat: 0.35 }
            : PAINT_FINISHES[paintFinish] ?? PAINT_FINISHES.gloss)
        }

        if (isCarbonPart(text)) {
          if (carbonType === 'visible') {
            applyMetal(material, '#0d0f10', { metalness: 0.38, roughness: 0.48, clearcoat: 0.32 })
          } else if (carbonType === 'body') {
            applyMetal(material, color, PAINT_FINISHES[paintFinish] ?? PAINT_FINISHES.gloss)
          }
        }

        if (isAeroPart(text) && aeroType !== 'factory') {
          if (aeroType === 'body') {
            applyMetal(material, color, PAINT_FINISHES[paintFinish] ?? PAINT_FINISHES.gloss)
          } else {
            const aero = AERO_STYLES[aeroType] ?? AERO_STYLES.carbon
            applyMetal(material, aero.color, aero)
          }
        }

        if (isMirrorPart(text)) {
          if (mirrorType === 'body') {
            applyMetal(material, color, PAINT_FINISHES[paintFinish] ?? PAINT_FINISHES.gloss)
          } else if (mirrorType === 'black') {
            applyMetal(material, '#070707', { metalness: 0.5, roughness: 0.22, clearcoat: 0.85 })
          } else if (mirrorType === 'carbon') {
            applyMetal(material, '#0d0f10', { metalness: 0.36, roughness: 0.52, clearcoat: 0.26 })
          }
        }

        if (isDecalPart(text) && decalType !== 'factory' && decalType !== 'delete') {
          applyMetal(material, DECAL_STYLES[decalType] ?? DECAL_STYLES.black, {
            metalness: 0.12,
            roughness: 0.28,
            clearcoat: 0.35,
          })
        }

        if (isBadgePart(text)) {
          const badge = BADGE_STYLES[badgeType] ?? BADGE_STYLES.chrome
          applyMetal(material, badge.color, badge)
        }

        if (isMetalPart(text)) {
          const metal = METAL_STYLES[metalType] ?? METAL_STYLES.chrome
          applyMetal(material, metal.color, metal)
        }

        if (isTrimPart(text) && !isCarbonPart(text)) {
          if (trimType === 'black') {
            applyMetal(material, '#090909', { metalness: 0.42, roughness: 0.28, clearcoat: 0.55 })
          } else if (trimType === 'body') {
            applyMetal(material, color, PAINT_FINISHES[paintFinish] ?? PAINT_FINISHES.gloss)
          } else if (trimType === 'carbon') {
            applyMetal(material, '#101112', { metalness: 0.35, roughness: 0.52, clearcoat: 0.25 })
          }
        }

        if (isCaliperPart(text)) {
          applyMetal(material, CALIPER_STYLES[caliperType] ?? CALIPER_STYLES.red, {
            metalness: 0.32,
            roughness: 0.25,
            clearcoat: 0.8,
          })
        }

        if (isGlassPart(text)) {
          material.transparent = true
          material.depthWrite = false
          material.opacity = glassType === 'tinted' ? 0.68 : glassType === 'blue' ? 0.42 : 0.28
          if (material.color) material.color.set(glassType === 'tinted' ? '#050505' : glassType === 'blue' ? '#8bb7df' : '#edf7ff')
          material.metalness = 0
          material.roughness = 0.04
        }

        if (isLightPart(text)) {
          if (lightType === 'smoked') {
            applyMetal(material, '#252525', { metalness: 0.15, roughness: 0.18 })
            material.opacity = 0.82
            material.transparent = true
          } else if (lightType === 'yellow') {
            applyMetal(material, '#ffd35a', { metalness: 0.05, roughness: 0.12 })
          } else if (lightType === 'ice') {
            applyMetal(material, '#dff5ff', { metalness: 0.02, roughness: 0.08 })
          }
        }

        if (isInteriorPart(text)) {
          applyMetal(material, INTERIOR_STYLES[interiorType] ?? INTERIOR_STYLES.black, {
            metalness: 0.12,
            roughness: 0.58,
          })
        }

        if (isExhaustPart(text)) {
          const exhaust = EXHAUST_STYLES[exhaustType] ?? EXHAUST_STYLES.chrome
          applyMetal(material, exhaust.color, exhaust)
        }

        material.needsUpdate = true
      })
    })
  }, [
    modelScene,
    color,
    paintFinish,
    rimType,
    spoilerType,
    trimType,
    carbonType,
    aeroType,
    decalType,
    badgeType,
    mirrorType,
    metalType,
    tireType,
    caliperType,
    glassType,
    lightType,
    interiorType,
    exhaustType,
    suspensionType,
  ])

  return <primitive object={modelScene} />
}

useGLTF.preload(modelPath('porsche_911_gt3'))
useGLTF.preload(modelPath('free_1975_porsche_911_930_turbo'))
useGLTF.preload(modelPath('porsche_911_turbo_996'))
useGLTF.preload(modelPath('free_porsche_911_carrera_4s'))
useGLTF.preload(modelPath('porsche_918_free'))
useGLTF.preload(modelPath('2022_porsche_cayenne_turbo_gt'))
