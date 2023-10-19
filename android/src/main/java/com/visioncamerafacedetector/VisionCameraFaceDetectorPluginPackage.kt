package com.visioncamerafacedetector

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.mrousavy.camera.frameprocessor.FrameProcessorPluginRegistry

class VisionCameraFaceDetectorPluginPackage : ReactPackage {
  init {
    FrameProcessorPluginRegistry.addFrameProcessorPlugin("scanFace") { options ->
      VisionCameraFaceDetectorPlugin()
    }
  }

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(VisionCameraFaceDetectorModule(reactContext))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}
