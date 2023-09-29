package com.visioncamerafacedetector

import android.graphics.Bitmap
import android.util.Base64
import com.mrousavy.camera.frameprocessor.Frame
import java.io.ByteArrayOutputStream

class Convert {
  fun getBase64Image(bitmap: Bitmap): String? {
    val byteArrayOutputStream = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
    val byteArray = byteArrayOutputStream.toByteArray()
    return Base64.encodeToString(byteArray, Base64.DEFAULT)
  }

  fun getRotation(frame: Frame): Int {
    return when (frame.orientation) {
      "portrait" -> 0
      "portrait-upside-down" -> 180
      "landscape-left" -> 90
      "landscape-right" -> 270
      else -> {
        0
      }
    }

  }
}
