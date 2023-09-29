import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useFrameProcessor } from 'react-native-vision-camera';
import { scanFaces, type FaceType } from 'vision-camera-face-detector';
import { runOnJS } from 'react-native-reanimated';

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [faces, setFaces] = useState<FaceType[]>();
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

  useEffect(() => {
    console.log(faces);
  }, [faces]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    console.log('frame => ', frame);
    const scannedFaces = scanFaces(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  return device != null && hasPermission ? (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      fps={5}
      frameProcessor={frameProcessor}
    />
  ) : null;
}
