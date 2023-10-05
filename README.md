fork from: https://github.com/rodgomesc/vision-camera-face-detector

reason: old repo not maintenance

# vision-camera-face-detector

VisionCamera Frame Processor Plugin to detect faces using MLKit Vision Face Detector

## Installation

```sh
yarn add vision-camera-face-detector
```

## Usage

```js
import * as React from 'react';
import { runOnJS } from 'react-native-reanimated';

import { StyleSheet } from 'react-native';
import {
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import { Camera } from 'react-native-vision-camera';
import { scanFaces, Face } from 'vision-camera-face-detector';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [faces, setFaces] = React.useState<Face[]>();

  const devices = useCameraDevices();
  const device = devices.front;

  React.useEffect(() => {
    console.log(faces);
  }, [faces]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const scannedFaces = scanFaces(frame);
    runOnJS(setFaces)(scannedFaces);
  }, []);

  return device != null && hasPermission ? (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5}
    />
  ) : null;
}

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Troubleshot

Error Clean

Need to edit "/node-modules/react-native-vision-camera/android/build.gradle" line 177. From:

```
if (task.name.contains("clean")) {
    task.dependsOn(cleanCmakeCache)
}
```

To:

```
if (task.name.contains("clean") && task.name != "cleanCmakeCache") {
    task.dependsOn(cleanCmakeCache)
}
```
