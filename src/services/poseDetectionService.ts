
/**
 * Service for communicating with the Python pose detection API
 */

import { websocketService } from './websocketService';

// Fallback to HTTP API if WebSocket fails
const API_URL = "http://localhost:8000"; 

// Track last detection time for throttling
let lastDetectionTime = 0;
const THROTTLE_MS = 50; // Minimum time between detections (milliseconds)

/**
 * Check if the API is healthy and models are loaded
 */
export const checkApiHealth = async (): Promise<{ status: string; modelsLoaded: boolean; usingWebsocket: boolean }> => {
  try {
    // Try WebSocket first
    await websocketService.connect();
    
    return new Promise((resolve) => {
      const unsubscribe = websocketService.on('message', (data) => {
        unsubscribe();
        resolve({
          status: data.status,
          modelsLoaded: data.models_loaded,
          usingWebsocket: true
        });
      });
      
      websocketService.sendMessage({ command: "health" });
      
      // Timeout after 3 seconds and try HTTP fallback
      setTimeout(() => {
        unsubscribe();
        checkApiHealthHttp().then(resolve);
      }, 3000);
    });
  } catch (error) {
    console.error("Error checking API health via WebSocket:", error);
    return checkApiHealthHttp();
  }
};

/**
 * Fallback HTTP health check
 */
const checkApiHealthHttp = async (): Promise<{ status: string; modelsLoaded: boolean; usingWebsocket: false }> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return {
      status: data.status,
      modelsLoaded: data.models_loaded,
      usingWebsocket: false
    };
  } catch (error) {
    console.error("Error checking API health via HTTP:", error);
    throw new Error("Failed to connect to pose detection API");
  }
};

/**
 * Request the API to load the pose detection models
 */
export const loadModels = async (): Promise<string[]> => {
  try {
    // Try WebSocket first
    await websocketService.connect();
    
    return new Promise((resolve, reject) => {
      const unsubscribe = websocketService.on('message', (data) => {
        unsubscribe();
        
        if (data.status === "error") {
          reject(new Error(data.message || "Failed to load models"));
        } else {
          resolve(data.poses || []);
        }
      });
      
      websocketService.sendMessage({ command: "load_models" });
      
      // Timeout after 5 seconds and try HTTP fallback
      setTimeout(() => {
        unsubscribe();
        loadModelsHttp().then(resolve).catch(reject);
      }, 5000);
    });
  } catch (error) {
    console.error("Error loading models via WebSocket:", error);
    return loadModelsHttp();
  }
};

/**
 * Fallback HTTP load models
 */
const loadModelsHttp = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/load_models`);
    const data = await response.json();
    
    if (data.status === "error") {
      throw new Error(data.message || "Failed to load models");
    }
    
    return data.poses || [];
  } catch (error) {
    console.error("Error loading models via HTTP:", error);
    throw new Error("Failed to load pose detection models");
  }
};

/**
 * Detect pose in the provided image data using WebSocket
 */
export const detectPose = async (imageData: string): Promise<{
  pose_name: string;
  confidence: number;
  is_correct: boolean;
  keypoints?: number[][];
  error?: string;
}> => {
  try {
    const now = Date.now();
    if (now - lastDetectionTime < THROTTLE_MS) {
      return {
        pose_name: "throttled",
        confidence: 0,
        is_correct: false
      };
    }
    
    lastDetectionTime = now;
    
    // Try WebSocket first if connected
    if (await websocketService.connect()) {
      return new Promise((resolve) => {
        const unsubscribe = websocketService.on('message', (data) => {
          unsubscribe();
          resolve(data);
        });
        
        websocketService.sendMessage({ image: imageData });
      });
    } else {
      // Fallback to HTTP
      return detectPoseHttp(imageData);
    }
  } catch (error) {
    console.error("Error detecting pose via WebSocket:", error);
    return detectPoseHttp(imageData);
  }
};

/**
 * Fallback HTTP pose detection
 */
const detectPoseHttp = async (imageData: string): Promise<{
  pose_name: string;
  confidence: number;
  is_correct: boolean;
  keypoints?: number[][];
  error?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/detect_pose`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageData }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error("Error detecting pose via HTTP:", error);
    throw new Error("Failed to detect pose");
  }
};

/**
 * Capture current frame from video element with optional quality/size reduction
 */
export const captureVideoFrame = (
  videoElement: HTMLVideoElement, 
  quality = 0.7, 
  scaleDown = 0.5
): string | null => {
  if (!videoElement) return null;
  
  const canvas = document.createElement("canvas");
  // Scale down the image to improve performance
  canvas.width = videoElement.videoWidth * scaleDown;
  canvas.height = videoElement.videoHeight * scaleDown;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  
  // Draw the current video frame to the canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Convert to base64 with reduced quality
  return canvas.toDataURL("image/jpeg", quality);
};

/**
 * Clean up WebSocket connection when component unmounts
 */
export const cleanupWebSocket = () => {
  websocketService.disconnect();
};

