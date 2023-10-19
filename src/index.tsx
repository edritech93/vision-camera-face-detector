import { NativeModules, Platform } from 'react-native';
import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';
import type { Face } from './Face';

const plugin = VisionCameraProxy.getFrameProcessorPlugin('scanFace');

export function scanFaces(frame: Frame): Face[] {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin!');
  }
  return plugin.call(frame) as unknown as Face[];
}

export type FaceType = Face;

const MSG_ERROR =
  `The package 'vision-camera-face-detector' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const VisionCameraFaceDetectorModule = NativeModules.VisionCameraFaceDetectorModule
  ? NativeModules.VisionCameraFaceDetectorModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(MSG_ERROR);
        },
      }
    );

export function detectFromBase64(imageString: string): Promise<string> {
  return VisionCameraFaceDetectorModule.detectFromBase64(imageString);
}
