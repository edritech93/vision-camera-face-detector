package com.visioncamerafacedetector

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.mrousavy.camera.frameprocessor.FrameProcessorPluginRegistry
import com.mrousavy.camera.frameprocessor.FrameProcessorPluginRegistry.PluginInitializer

class VisionCameraFaceDetectorPluginPackage : ReactPackage {
  init {
    FrameProcessorPluginRegistry.addFrameProcessorPlugin("scanFace") { _ ->
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
