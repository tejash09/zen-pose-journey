
// This is a mock service that simulates keypoint detection
// In a real implementation, you would use TensorFlow.js with MoveNet

// Example keypoint structure for a person in various poses
const mockKeypoints = {
  // Standing pose
  standing: [
    [0.5, 0.2, 0.9],  // nose
    [0.48, 0.18, 0.8], // left eye
    [0.52, 0.18, 0.8], // right eye
    [0.46, 0.19, 0.7], // left ear
    [0.54, 0.19, 0.7], // right ear
    [0.45, 0.3, 0.9],  // left shoulder
    [0.55, 0.3, 0.9],  // right shoulder
    [0.4, 0.4, 0.8],   // left elbow
    [0.6, 0.4, 0.8],   // right elbow
    [0.35, 0.5, 0.7],  // left wrist
    [0.65, 0.5, 0.7],  // right wrist
    [0.45, 0.55, 0.9], // left hip
    [0.55, 0.55, 0.9], // right hip
    [0.43, 0.7, 0.8],  // left knee
    [0.57, 0.7, 0.8],  // right knee
    [0.42, 0.9, 0.7],  // left ankle
    [0.58, 0.9, 0.7]   // right ankle
  ],
  
  // Tree pose
  tree: [
    [0.5, 0.2, 0.9],   // nose
    [0.48, 0.18, 0.8], // left eye
    [0.52, 0.18, 0.8], // right eye
    [0.46, 0.19, 0.7], // left ear
    [0.54, 0.19, 0.7], // right ear
    [0.45, 0.3, 0.9],  // left shoulder
    [0.55, 0.3, 0.9],  // right shoulder
    [0.4, 0.4, 0.8],   // left elbow
    [0.6, 0.4, 0.8],   // right elbow
    [0.35, 0.5, 0.7],  // left wrist
    [0.65, 0.5, 0.7],  // right wrist
    [0.48, 0.55, 0.9], // left hip
    [0.52, 0.55, 0.9], // right hip
    [0.48, 0.7, 0.8],  // left knee
    [0.52, 0.55, 0.8], // right knee (bent up)
    [0.48, 0.9, 0.7],  // left ankle
    [0.52, 0.65, 0.7]  // right ankle (against left leg)
  ],
  
  // Warrior pose
  warrior: [
    [0.5, 0.2, 0.9],   // nose
    [0.48, 0.18, 0.8], // left eye
    [0.52, 0.18, 0.8], // right eye
    [0.46, 0.19, 0.7], // left ear
    [0.54, 0.19, 0.7], // right ear
    [0.35, 0.3, 0.9],  // left shoulder (extended)
    [0.65, 0.3, 0.9],  // right shoulder (extended)
    [0.25, 0.3, 0.8],  // left elbow (straight arm)
    [0.75, 0.3, 0.8],  // right elbow (straight arm)
    [0.15, 0.3, 0.7],  // left wrist (extended)
    [0.85, 0.3, 0.7],  // right wrist (extended)
    [0.45, 0.5, 0.9],  // left hip
    [0.55, 0.5, 0.9],  // right hip
    [0.3, 0.7, 0.8],   // left knee (bent)
    [0.7, 0.7, 0.8],   // right knee (straight)
    [0.3, 0.9, 0.7],   // left ankle
    [0.8, 0.9, 0.7]    // right ankle (extended)
  ]
};

// Simulate some noise in keypoints
const addNoise = (keypoints: number[][], amount = 0.01) => {
  return keypoints.map(point => {
    const noise1 = (Math.random() - 0.5) * amount;
    const noise2 = (Math.random() - 0.5) * amount;
    return [
      point[0] + noise1,
      point[1] + noise2,
      point[2]
    ];
  });
};

export const getMockKeypoints = () => {
  // Randomly select one of the mock poses
  const poses = Object.keys(mockKeypoints);
  const randomPose = poses[Math.floor(Math.random() * poses.length)];
  
  // Add some noise to make it look more realistic
  return addNoise(mockKeypoints[randomPose]);
};

// Simulate an API endpoint that would normally return keypoints from MoveNet
export const detectKeypoints = async (imageData: string): Promise<{keypoints: number[][]}> => {
  // In a real implementation, you would use TensorFlow.js to detect keypoints
  // For demo purposes, we're just returning mock data with a small delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    keypoints: getMockKeypoints()
  };
};

// Register a fetch mock handler
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    if (input === '/api/detect_keypoints') {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            json: async () => ({ keypoints: getMockKeypoints() }),
            ok: true,
            status: 200,
            headers: new Headers()
          } as Response);
        }, 100);
      });
    }
    return originalFetch(input, init);
  };
}
