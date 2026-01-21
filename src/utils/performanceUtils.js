import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Performance Utilities
 * Helper functions for optimizing 3D scene performance
 */

/**
 * Create optimized texture with compression
 * @param {string} url - Image URL
 * @param {object} options - Texture options
 * @returns {Promise<THREE.Texture>}
 */
export async function createOptimizedTexture(url, options = {}) {
    const {
        minFilter = THREE.LinearMipmapLinearFilter,
        magFilter = THREE.LinearFilter,
        anisotropy = 4,
        generateMipmaps = true,
    } = options;

    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            (texture) => {
                texture.minFilter = minFilter;
                texture.magFilter = magFilter;
                texture.anisotropy = anisotropy;
                texture.generateMipmaps = generateMipmaps;

                // Compress texture for better performance
                texture.needsUpdate = true;

                resolve(texture);
            },
            undefined,
            reject
        );
    });
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if object is in camera frustum (for culling)
 * @param {THREE.Object3D} object - 3D object
 * @param {THREE.Camera} camera - Camera
 * @returns {boolean}
 */
export function isInFrustum(object, camera) {
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(matrix);

    return frustum.intersectsObject(object);
}

/**
 * Dispose of Three.js resources properly
 * @param {THREE.Object3D} object - Object to dispose
 */
export function disposeObject(object) {
    if (!object) return;

    // Dispose geometry
    if (object.geometry) {
        object.geometry.dispose();
    }

    // Dispose material
    if (object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach(material => disposeMaterial(material));
        } else {
            disposeMaterial(object.material);
        }
    }

    // Dispose children
    if (object.children) {
        object.children.forEach(child => disposeObject(child));
    }
}

/**
 * Dispose of material and its textures
 * @param {THREE.Material} material - Material to dispose
 */
function disposeMaterial(material) {
    if (!material) return;

    // Dispose textures
    Object.keys(material).forEach(key => {
        if (material[key] && material[key].isTexture) {
            material[key].dispose();
        }
    });

    material.dispose();
}

/**
 * Calculate optimal LOD (Level of Detail) based on distance
 * @param {number} distance - Distance from camera
 * @returns {number} LOD level (0-2)
 */
export function calculateLOD(distance) {
    if (distance < 10) return 0; // High detail
    if (distance < 20) return 1; // Medium detail
    return 2; // Low detail
}

/**
 * Batch geometry updates for better performance
 * @param {Array} geometries - Array of geometries to update
 */
export function batchGeometryUpdates(geometries) {
    geometries.forEach(geometry => {
        if (geometry.attributes.position) {
            geometry.attributes.position.needsUpdate = true;
        }
    });
}

/**
 * Create shared geometry for instancing
 * @param {number} width - Plane width
 * @param {number} height - Plane height
 * @returns {THREE.PlaneGeometry}
 */
export function createSharedGeometry(width, height) {
    const geometry = new THREE.PlaneGeometry(width, height);
    // Mark as shared to prevent disposal
    geometry.userData.shared = true;
    return geometry;
}

/**
 * Object pool for reusing objects
 */
export class ObjectPool {
    constructor(createFn, resetFn) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];
    }

    acquire() {
        let obj = this.pool.pop();
        if (!obj) {
            obj = this.createFn();
        }
        this.active.push(obj);
        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    clear() {
        this.pool = [];
        this.active = [];
    }
}
