
import React from 'react';

interface KeyPoint {
  x: number;
  y: number;
  confidence: number;
}

interface PoseOverlayProps {
  keypoints: number[][] | null;
  videoWidth: number;
  videoHeight: number;
}

export const PoseOverlay: React.FC<PoseOverlayProps> = ({ keypoints, videoWidth, videoHeight }) => {
  if (!keypoints) return null;
  
  // Function to map the MoveNet model keypoint indices to names
  const getKeypointName = (index: number): string => {
    const keyPointNames = [
      "nose", "left_eye", "right_eye", "left_ear", "right_ear",
      "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
      "left_wrist", "right_wrist", "left_hip", "right_hip",
      "left_knee", "right_knee", "left_ankle", "right_ankle"
    ];
    return keyPointNames[index] || `keypoint-${index}`;
  };
  
  const KEYPOINT_THRESHOLD = 0.3; // Only show keypoints with confidence above this threshold
  
  // Connections between keypoints to draw body segments
  const connections = [
    // Face
    [0, 1], [0, 2], [1, 3], [2, 4],
    // Upper body
    [5, 6], [5, 7], [7, 9], [6, 8], [8, 10], [5, 11], [6, 12],
    // Lower body
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16]
  ];
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full"
      viewBox={`0 0 ${videoWidth} ${videoHeight}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Draw connections between keypoints */}
      {connections.map((connection, idx) => {
        const [start, end] = connection;
        const startPoint = keypoints[start];
        const endPoint = keypoints[end];
        
        // Only draw if both points have sufficient confidence
        if (startPoint[2] > KEYPOINT_THRESHOLD && endPoint[2] > KEYPOINT_THRESHOLD) {
          return (
            <line
              key={`connection-${idx}`}
              x1={startPoint[1] * videoWidth}
              y1={startPoint[0] * videoHeight}
              x2={endPoint[1] * videoWidth}
              y2={endPoint[0] * videoHeight}
              stroke="#4ade80"
              strokeWidth="2"
              opacity="0.7"
            />
          );
        }
        return null;
      })}
      
      {/* Draw keypoints */}
      {keypoints.map((point, idx) => {
        const confidence = point[2];
        // Only draw keypoints with sufficient confidence
        if (confidence > KEYPOINT_THRESHOLD) {
          return (
            <circle
              key={`keypoint-${idx}`}
              cx={point[1] * videoWidth}
              cy={point[0] * videoHeight}
              r="4"
              fill="#22c55e"
              stroke="#ffffff"
              strokeWidth="1"
            >
              <title>{getKeypointName(idx)}</title>
            </circle>
          );
        }
        return null;
      })}
    </svg>
  );
};
