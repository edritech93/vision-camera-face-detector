#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("VisionCameraFaceDetector/VisionCameraFaceDetector-Swift.h")
#import "VisionCameraFaceDetector/VisionCameraFaceDetector-Swift.h"
#else
#import "VisionCameraFaceDetector-Swift.h"
#endif

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