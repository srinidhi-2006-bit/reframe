import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export async function detectFace(video: HTMLVideoElement) {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  const detector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
    },
    runningMode: "VIDEO",
  });

  const detections = detector.detectForVideo(
    video,
    performance.now()
  );

  return detections.detections;
}
