
import * as ort from 'onnxruntime-web';
import { toast } from 'sonner';
import { detectKeypoints } from './mockKeypoints';

let session: ort.InferenceSession | null = null;
let classMapping: Record<number, string> | null = null;

// Configuration
const CONFIDENCE_THRESHOLD = 0.7;
const KEYPOINT_THRESHOLD = 0.3;

/**
 * Initialize and load the ONNX model
 */
export const initializeOnnxModel = async (): Promise<string[]> => {
  try {
    // Check if the model is already loaded
    if (session !== null) {
      return classMapping ? Object.values(classMapping) : [];
    }

    toast.info("Loading ONNX model...");
    
    // For demo purposes, simulate model loading with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, you would load the actual ONNX model
    // session = await ort.InferenceSession.create('/models/yoga_pose_classifier.onnx');
    
    // Simulate model loading
    session = true as any;
    
    // Simulate class mapping
    classMapping = {
      0: 'Downward Dog',
      1: 'Tree Pose',
      2: 'Warrior I',
      3: 'Warrior II',
      4: 'Chair Pose',
      5: 'Triangle Pose',
      6: 'Cobra Pose',
      7: 'Bridge Pose'
    };
    
    toast.success("ONNX model loaded successfully");
    
    return Object.values(classMapping);
  } catch (error) {
    console.error("Failed to load ONNX model:", error);
    toast.error("Failed to load ONNX model", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    return [];
  }
};

/**
 * Get the center point between two landmarks
 */
const getCenterPoint = (landmarks: number[][], leftIdx: number, rightIdx: number): number[] => {
  const left = landmarks[leftIdx];
  const right = landmarks[rightIdx];
  return [(left[0] + right[0]) * 0.5, (left[1] + right[1]) * 0.5];
};

/**
 * Calculate pose size based on torso and overall dimensions
 */
const getPoseSize = (landmarks: number[][], torsoSizeMultiplier = 2.5): number => {
  const hipsCenter = getCenterPoint(landmarks, 11, 12); // LEFT_HIP=11, RIGHT_HIP=12
  const shouldersCenter = getCenterPoint(landmarks, 5, 6); // LEFT_SHOULDER=5, RIGHT_SHOULDER=6
  
  // Calculate torso size as the distance between shoulders and hips
  const dx = shouldersCenter[0] - hipsCenter[0];
  const dy = shouldersCenter[1] - hipsCenter[1];
  const torsoSize = Math.sqrt(dx * dx + dy * dy);
  
  // Find the max distance from the center to any keypoint
  const poseCenter = hipsCenter;
  let maxDist = 0;
  
  for (const landmark of landmarks) {
    const dx = landmark[0] - poseCenter[0];
    const dy = landmark[1] - poseCenter[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    maxDist = Math.max(maxDist, dist);
  }
  
  return Math.max(torsoSize * torsoSizeMultiplier, maxDist);
};

/**
 * Normalize landmarks to be centered and scaled
 */
const normalizePoseLandmarks = (landmarks: number[][]): number[][] => {
  // Extract x,y coordinates from keypoints (ignore confidence)
  const keypointsXY = landmarks.map(kp => [kp[0], kp[1]]);
  
  const poseCenter = getCenterPoint(keypointsXY, 11, 12);
  const poseSize = getPoseSize(keypointsXY);
  
  // Center and scale landmarks
  return keypointsXY.map(landmark => [
    (landmark[0] - poseCenter[0]) / poseSize,
    (landmark[1] - poseCenter[1]) / poseSize
  ]);
};

/**
 * Convert normalized landmarks to embedding vector
 */
const landmarksToEmbedding = (landmarks: number[][]): Float32Array => {
  const normalizedLandmarks = normalizePoseLandmarks(landmarks);
  
  // Flatten the array of [x,y] coordinates to a single array
  const embedding = new Float32Array(normalizedLandmarks.length * 2);
  let idx = 0;
  
  for (const landmark of normalizedLandmarks) {
    embedding[idx++] = landmark[0];
    embedding[idx++] = landmark[1];
  }
  
  return embedding;
};

/**
 * Check if enough keypoints are visible with sufficient confidence
 */
export const checkKeypointVisibility = (keypoints: number[][], threshold = KEYPOINT_THRESHOLD): boolean => {
  const visibleKeypoints = keypoints.filter(kp => kp[2] > threshold).length;
  const visibilityRatio = visibleKeypoints / keypoints.length;
  return visibilityRatio >= 0.7; // Require at least 70% of keypoints to be visible
};

/**
 * Run the ONNX model to classify the pose
 */
const runInferenceOnnx = async (embedding: Float32Array): Promise<[number, number]> => {
  if (!session) {
    throw new Error("ONNX model not initialized");
  }
  
  // For demo purposes, simulate model inference
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Generate a random prediction (this would be replaced with actual model inference)
  const predictedClass = Math.floor(Math.random() * (Object.keys(classMapping).length));
  const confidence = 0.7 + Math.random() * 0.3; // Random confidence between 0.7 and 1.0
  
  return [predictedClass, confidence];
};

/**
 * Process a video frame to detect and classify a yoga pose
 */
export const detectPoseFromFrame = async (video: HTMLVideoElement): Promise<{
  poseName: string;
  confidence: number;
  keypoints: number[][];
  isCorrect: boolean;
}> => {
  try {
    if (!session) {
      throw new Error("ONNX model not initialized");
    }
    
    // Capture the current frame from the video
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error("Could not create canvas context");
    }
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Get keypoints using our mock service (in a real app, you'd use TensorFlow.js or MoveNet)
    const keypointsData = await detectKeypoints(imageData);
    const keypoints = keypointsData.keypoints;
    
    // Check keypoint visibility
    if (!checkKeypointVisibility(keypoints)) {
      return {
        poseName: "Not enough keypoints visible",
        confidence: 0,
        keypoints,
        isCorrect: false
      };
    }
    
    // Convert keypoints to embedding
    const embedding = landmarksToEmbedding(keypoints);
    
    // Run yoga pose classification
    const [predictedClass, confidence] = await runInferenceOnnx(embedding);
    
    // Get pose name from class mapping
    const poseName = classMapping 
      ? classMapping[predictedClass] 
      : `Unknown pose (${predictedClass})`;
    
    // Determine if pose is correct based on confidence
    const isCorrect = confidence >= CONFIDENCE_THRESHOLD;
    
    return {
      poseName,
      confidence: confidence * 100, // Convert to percentage
      keypoints,
      isCorrect
    };
  } catch (error) {
    console.error("Error in pose detection:", error);
    throw error;
  }
};
