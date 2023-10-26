#if __has_include(<VisionCamera/FrameProcessorPlugin.h>)
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "VisionCameraFaceDetector-Swift.h"

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(VisionCameraFaceDetectorPlugin, scanFace)

#endif