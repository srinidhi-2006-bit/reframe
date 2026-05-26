import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let detector: FaceDetector | null = null;

async function getDetector() {
  if (detector) return detector;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  detector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
    },
    runningMode: "VIDEO",
  });

  return detector;
}

export async function detectFaceCenter(
  video: HTMLVideoElement
) {
  const detector = await getDetector();

  const result = detector.detectForVideo(
    video,
    performance.now()
  );

  if (!result.detections.length) return null;

  const box = result.detections[0].boundingBox;

  return {
    x: box.originX + box.width / 2,
    y: box.originY + box.height / 2,
  };
}
