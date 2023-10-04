import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useFrameProcessor } from 'react-native-vision-camera';
// import { scanFaces, type FaceType } from 'vision-camera-face-detector';
import { examplePlugin } from './frame-processors/ExamplePlugin';
import Reanimated from 'react-native-reanimated';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  // const [faces, setFaces] = useState<any[]>();
  const [device, setDevice] = useState<any>(null);

  useEffect(() => {
    async function _getCameras() {
      const arrayDev = Camera.getAvailableCameraDevices();
      const devBack = arrayDev.find((e) => e.position === 'front');
      setDevice(devBack);
    }
    _getCameras();
  }, []);

  useEffect(() => {
    async function _getPermission() {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    }
    _getPermission();
  }, []);

  // useEffect(() => {
  //   console.log(faces);
  // }, [faces]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // const scannedFaces = scanFaces(frame);
    // runOnJS(setFaces)(scannedFaces);

    console.log(
      `${frame.timestamp}: ${frame.width}x${frame.height} ${frame.pixelFormat} Frame (${frame.orientation})`
    );
    examplePlugin(frame);
  }, []);

  return device != null && hasPermission ? (
    <ReanimatedCamera
      style={StyleSheet.absoluteFill}
      device={device}
      fps={30}
      isActive={true}
      enableZoomGesture={false}
      enableFpsGraph={true}
      orientation={'portrait'}
      photo={true}
      audio={false}
      frameProcessor={frameProcessor}
    />
  ) : null;
}
