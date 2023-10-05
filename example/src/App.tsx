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
import Reanimated, { useSharedValue } from 'react-native-reanimated';
// import { scanFaces } from 'vision-camera-face-detector';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Platform.select<number>({
  android: Dimensions.get('screen').height - 60,
  ios: Dimensions.get('window').height,
}) as number;

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  // const [faces, setFaces] = useState<FaceType[]>();
  const enableHdr = false;
  const enableNightMode = false;
  const targetFps = 60;

  const camera = useRef<Camera>(null);

  const zoom = useSharedValue(0);

  // camera format settings
  const device = useCameraDevice('front', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });

  useEffect(() => {
    async function _getPermission() {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    }
    _getPermission();
  }, []);

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ]);

  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
  }, []);

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  if (device != null && format != null) {
    console.log(
      `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight} video @ ${fps}fps)`
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  // useEffect(() => {
  //   console.log(faces);
  // }, [faces]);

  const frameProcessor = useFrameProcessor((frame: Frame) => {
    'worklet';
    console.log(
      `${frame.timestamp}: ${frame.width}x${frame.height} ${frame.pixelFormat} Frame (${frame.orientation})`
    );
    // const scannedFaces = scanFaces(frame);
    // runOnJS(setFaces)(scannedFaces);
  }, []);

  return device != null && hasPermission ? (
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
      enableFpsGraph={true}
      orientation={'portrait'}
      photo={true}
      video={false}
      audio={false}
      frameProcessor={frameProcessor}
    />
  ) : null;
}
