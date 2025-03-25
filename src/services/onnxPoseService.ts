
import * as ort from 'onnxruntime-web';
import * as tf from '@tensorflow/tfjs';
import { toast } from 'sonner';

let session: ort.InferenceSession | null = null;
let classMapping: Record<number, string> | null = null;
let movenetModel: any = null;

// Configuration
const CONFIDENCE_THRESHOLD = 0.7;
const KEYPOINT_THRESHOLD = 0.3;

/**
 * Initialize and load the ONNX model
 */
export const initializeOnnxModel = async (): Promise<string[]> => {
  try {
    // Check if the model is already loaded
    if (session !== null && classMapping !== null) {
      return Object.values(classMapping);
    }

    toast.info("Loading pose models...");
    
    // Initialize TensorFlow.js
    await tf.ready();
    console.log("TensorFlow.js initialized");
    
    // Load the ONNX model
    try {
      // Set WebAssembly execution providers
      const options = {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all'
      };
      
      // Load the model from the public directory using fetch first, then pass as arrayBuffer
      const modelResponse = await fetch('/yoga_pose_classifier.onnx');
      
      if (!modelResponse.ok) {
        throw new Error(`Failed to load ONNX model file: ${modelResponse.statusText}`);
      }
      
      const modelArrayBuffer = await modelResponse.arrayBuffer();
      
      // Create model from the array buffer
      session = await ort.InferenceSession.create(
        new Uint8Array(modelArrayBuffer), 
        options
      );
      console.log("ONNX model loaded successfully");
    } catch (error) {
      console.error("Error loading ONNX model:", error);
      throw new Error(`Failed to load ONNX model: ${error.message}`);
    }
    
    // Load class mapping
    try {
      const response = await fetch('/label_mapping.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const mapping = await response.json();
      classMapping = mapping;
      console.log("Class mapping loaded:", classMapping);
    } catch (error) {
      console.error("Error loading class mapping:", error);
      // Fallback to hardcoded class mapping
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
      console.log("Using fallback class mapping");
    }
    
    // Load MoveNet from TensorFlow.js
    try {
      // We'll use the TensorFlow.js directly for MoveNet
      movenetModel = await tf.loadGraphModel(
        'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4',
        { fromTFHub: true }
      );
      console.log("MoveNet model loaded");
    } catch (error) {
      console.error("Error loading MoveNet model:", error);
      throw new Error(`Failed to load MoveNet model: ${error.message}`);
    }
    
    toast.success("Pose detection models loaded successfully");
    
    return Object.values(classMapping);
  } catch (error) {
    console.error("Failed to initialize models:", error);
    toast.error("Failed to load pose detection models", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
    throw error;
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
  
  try {
    // Create tensor from embedding
    const tensor = new ort.Tensor('float32', embedding, [1, embedding.length]);
    
    // Prepare input for the model
    const feeds = {};
    feeds[session.inputNames[0]] = tensor;
    
    // Run inference
    const results = await session.run(feeds);
    
    // Get output data
    const output = results[session.outputNames[0]];
    const predictions = output.data as Float32Array;
    
    // Find the class with highest probability
    let maxProb = -Infinity;
    let predictedClass = -1;
    
    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] > maxProb) {
        maxProb = predictions[i];
        predictedClass = i;
      }
    }
    
    // Apply softmax to get probability
    const expValues = Array.from(predictions).map(val => Math.exp(val - maxProb));
    const sumExp = expValues.reduce((a, b) => a + b, 0);
    const confidence = expValues[predictedClass] / sumExp;
    
    return [predictedClass, confidence];
  } catch (error) {
    console.error("Error in ONNX inference:", error);
    throw error;
  }
};

/**
 * Detect keypoints using MoveNet
 */
const detectKeypoints = async (image: HTMLVideoElement): Promise<number[][]> => {
  if (!movenetModel) {
    throw new Error("MoveNet model not initialized");
  }
  
  try {
    // Convert video to tensor
    const videoWidth = image.videoWidth;
    const videoHeight = image.videoHeight;
    
    // Process the image with MoveNet
    const imageTensor = tf.browser.fromPixels(image);
    
    // Resize and normalize the image as required by MoveNet
    const resized = tf.image.resizeBilinear(imageTensor, [192, 192]);
    const normalized = tf.div(resized, 127.5).sub(1.0);
    const batched = tf.expandDims(normalized);
    
    // Run MoveNet inference
    const results = await movenetModel.predict(batched);
    
    // Clean up tensors
    imageTensor.dispose();
    resized.dispose();
    normalized.dispose();
    batched.dispose();
    
    // Extract keypoints from results
    const keypoints = await results.array();
    results.dispose();
    
    // Format keypoints to match our expected format
    // MoveNet returns keypoints as [y, x, confidence]
    // We need to convert to our format [y, x, confidence]
    const formattedKeypoints = keypoints[0].map((keypoint: number[]) => {
      return [keypoint[0], keypoint[1], keypoint[2]];
    });
    
    return formattedKeypoints;
  } catch (error) {
    console.error("Error detecting keypoints:", error);
    throw error;
  }
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
    if (!session || !movenetModel) {
      throw new Error("Models not initialized");
    }
    
    // Detect keypoints using MoveNet
    const keypoints = await detectKeypoints(video);
    
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
