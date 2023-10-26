#if __has_include(<VisionCamera/FrameProcessorPlugin.h>)
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#import "VisionCameraFaceDetector-Swift.h"

// VISION_EXPORT_SWIFT_FRAME_PROCESSOR(VisionCameraFaceDetectorPlugin, scanFace)

@interface VisionCameraFaceDetectorPlugin (FrameProcessorPluginLoader)
@end

@implementation VisionCameraFaceDetectorPlugin (FrameProcessorPluginLoader)

+ (void)load
{
  [FrameProcessorPluginRegistry addFrameProcessorPlugin:@"scanFace"
                                        withInitializer:^FrameProcessorPlugin*(NSDictionary* options) {
    return [[VisionCameraFaceDetectorPlugin alloc] initWithOptions:options];
  }];
}

@end

#endif
