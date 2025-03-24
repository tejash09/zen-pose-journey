
/**
 * Service for communicating with the Python pose detection API
 */

const API_URL = "http://localhost:5000"; // Update this if your Flask API is hosted elsewhere

/**
 * Check if the API is healthy and models are loaded
 */
export const checkApiHealth = async (): Promise<{ status: string; modelsLoaded: boolean }> => {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    return {
      status: data.status,
      modelsLoaded: data.models_loaded
    };
  } catch (error) {
    console.error("Error checking API health:", error);
    throw new Error("Failed to connect to pose detection API");
  }
};

/**
 * Request the API to load the pose detection models
 */
export const loadModels = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/load_models`);
    const data = await response.json();
    
    if (data.status === "error") {
      throw new Error(data.message || "Failed to load models");
    }
    
    return data.poses || [];
  } catch (error) {
    console.error("Error loading models:", error);
    throw new Error("Failed to load pose detection models");
  }
};

/**
 * Detect pose in the provided image data
 */
export const detectPose = async (imageData: string): Promise<{
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
    console.error("Error detecting pose:", error);
    throw new Error("Failed to detect pose");
  }
};

/**
 * Capture current frame from video element
 */
export const captureVideoFrame = (videoElement: HTMLVideoElement): string | null => {
  if (!videoElement) return null;
  
  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  
  // Draw the current video frame to the canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Convert to base64
  return canvas.toDataURL("image/jpeg", 0.9);
};
