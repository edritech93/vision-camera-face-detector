import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import {
  Camera,
  useFrameProcessor,
  type Frame,
  CameraRuntimeError,
  useCameraFormat,
  useCameraDevice,
} from 'react-native-vision-camera';
import { scanFaces } from 'vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height - 60,
  ios: Dimensions.get('window').height,
}) as number;
const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
const enableHdr = false;
const enableNightMode = false;
const targetFps = 30;

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  // const [faces, setFaces] = useState<FaceType[]>();
  const [faces, setFaces] = useState<any>(null);
  const setFacesJS = Worklets.createRunInJsFn(setFaces);

  const camera = useRef<Camera>(null);

  const device = useCameraDevice('front', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ]);
  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  useEffect(() => {
    async function _getPermission() {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    }
    _getPermission();
  }, []);

  useEffect(() => {
    console.log('faces => ', faces);
  }, [faces]);

  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
  }, []);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    const scannedFaces = scanFaces(frame);
    setFacesJS(scannedFaces);
  }, []);

  if (device != null && format != null && hasPermission) {
    console.log(
      `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight} video @ ${fps}fps)`
    );
    const pixelFormat = format.pixelFormats.includes('yuv') ? 'yuv' : 'native';
    return (
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        format={format}
        fps={fps}
        hdr={enableHdr}
        lowLightBoost={device.supportsLowLightBoost && enableNightMode}
        isActive={true}
        onInitialized={onInitialized}
        onError={onError}
        enableZoomGesture={false}
        enableFpsGraph={false}
        orientation={'portrait'}
        pixelFormat={pixelFormat}
        photo={false}
        video={false}
        audio={false}
        frameProcessor={frameProcessor}
      />
    );
  } else {
    return null;
  }
}
