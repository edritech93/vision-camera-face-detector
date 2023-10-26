//
//  VisionCameraFaceDetectorModule.swift
//  vision-camera-face-detector
//
//  Created by Yudi Edri Alviska on 28/07/22.
//

import Vision
import MLKitFaceDetection
import MLKitVision
import CoreML
import UIKit

@objc(VisionCameraFaceDetectorModule)
class VisionCameraFaceDetectorModule: NSObject {
    
    static let FaceDetectorOption: FaceDetectorOptions = {
        let option = FaceDetectorOptions()
        option.performanceMode = .accurate
        return option
    }()
    
    var faceDetector = FaceDetector.faceDetector(options: FaceDetectorOption)
    
    @objc(detectFromBase64:withResolver:withRejecter:)
    func detectFromBase64(imageString: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        guard let stringData = Data(base64Encoded: imageString) else {
            print("Error base64 encoded")
            return
        }
        guard let uiImage = UIImage(data: stringData) else {
            print("UIImage can't created")
            return
        }
        let image = VisionImage(image: uiImage)
        image.orientation = .up
        weak var weakSelf = self
        faceDetector.process(image) { faces, error in
            guard weakSelf != nil else {
                print("Self is nil!")
                return
            }
            guard error == nil, let faces = faces, !faces.isEmpty else {
                print("Faces is empty")
                resolve("")
                return
            }
            for face in faces {
                let faceFrame = face.frame
                let imageCrop = getImageFaceFromUIImage(from: uiImage, rectImage: faceFrame)
                resolve(convertImageToBase64(image:imageCrop!))
                return
            }
        }
    }
}
