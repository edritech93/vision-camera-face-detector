import VisionCamera
import MLKitFaceDetection
import MLKitVision
import CoreML
import UIKit
import AVFoundation

@objc(VisionCameraFaceDetectorPlugin)
public class VisionCameraFaceDetectorPlugin: FrameProcessorPlugin {
    static var FaceDetectorOption: FaceDetectorOptions = {
        let option = FaceDetectorOptions()
        option.contourMode = .none
        option.classificationMode = .all
        option.landmarkMode = .none
        option.performanceMode = .fast // doesn't work in fast mode!, why?
        return option
    }()
    
    static var faceDetector = FaceDetector.faceDetector(options: FaceDetectorOption)
    
    private static func processContours(from face: Face) -> [String:[[String:CGFloat]]] {
        let faceContoursTypes = [
            FaceContourType.face,
            FaceContourType.leftEyebrowTop,
            FaceContourType.leftEyebrowBottom,
            FaceContourType.rightEyebrowTop,
            FaceContourType.rightEyebrowBottom,
            FaceContourType.leftEye,
            FaceContourType.rightEye,
            FaceContourType.upperLipTop,
            FaceContourType.upperLipBottom,
            FaceContourType.lowerLipTop,
            FaceContourType.lowerLipBottom,
            FaceContourType.noseBridge,
            FaceContourType.noseBottom,
            FaceContourType.leftCheek,
            FaceContourType.rightCheek,
        ]
        
        let faceContoursTypesStrings = [
            "FACE",
            "LEFT_EYEBROW_TOP",
            "LEFT_EYEBROW_BOTTOM",
            "RIGHT_EYEBROW_TOP",
            "RIGHT_EYEBROW_BOTTOM",
            "LEFT_EYE",
            "RIGHT_EYE",
            "UPPER_LIP_TOP",
            "UPPER_LIP_BOTTOM",
            "LOWER_LIP_TOP",
            "LOWER_LIP_BOTTOM",
            "NOSE_BRIDGE",
            "NOSE_BOTTOM",
            "LEFT_CHEEK",
            "RIGHT_CHEEK",
        ];
        
        var faceContoursTypesMap: [String:[[String:CGFloat]]] = [:]
        
        for i in 0..<faceContoursTypes.count {
            let contour = face.contour(ofType: faceContoursTypes[i]);
            
            var pointsArray: [[String:CGFloat]] = []
            
            if let points = contour?.points {
                for point in points {
                    let currentPointsMap = [
                        "x": point.x,
                        "y": point.y,
                    ]
                    
                    pointsArray.append(currentPointsMap)
                }
                
                faceContoursTypesMap[faceContoursTypesStrings[i]] = pointsArray
            }
        }
        
        return faceContoursTypesMap
    }
    
    private static func processBoundingBox(from face: Face) -> [String:Any] {
        let frameRect = face.frame
        
        let offsetX = (frameRect.midX - ceil(frameRect.width)) / 2.0
        let offsetY = (frameRect.midY - ceil(frameRect.height)) / 2.0
        
        let x = frameRect.maxX + offsetX
        let y = frameRect.minY + offsetY
        
        return [
            "x": frameRect.midX + (frameRect.midX - x),
            "y": frameRect.midY + (y - frameRect.midY),
            "width": frameRect.width,
            "height": frameRect.height,
            "boundingCenterX": frameRect.midX,
            "boundingCenterY": frameRect.midY
        ]
    }
    
    @objc public init(withOptions options: [AnyHashable : Any]) {
        super.init()
    }
    
    @objc override public func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?) -> Any? {
        let image = VisionImage(buffer: frame.buffer)
        image.orientation = .up
        
        var faceAttributes: [Any] = []
        
        do {
            let faces: [Face] =  try VisionCameraFaceDetectorPlugin.faceDetector.results(in: image)
            if (!faces.isEmpty){
                for face in faces {
                    let imageCrop = getImageFaceFromBuffer(from: frame.buffer, rectImage: face.frame)
                    var imageResult: String? = nil
                    if (imageCrop != nil)  {
                        imageResult = convertImageToBase64(image: imageCrop!)
                    }
                    var map: [String: Any] = [:]
                    map["rollAngle"] = face.headEulerAngleZ  // Head is tilted sideways rotZ degrees
                    map["pitchAngle"] = face.headEulerAngleX  // Head is rotated to the uptoward rotX degrees
                    map["yawAngle"] = face.headEulerAngleY   // Head is rotated to the right rotY degrees
                    map["leftEyeOpenProbability"] = face.leftEyeOpenProbability
                    map["rightEyeOpenProbability"] = face.rightEyeOpenProbability
                    map["smilingProbability"] = face.smilingProbability
                    map["bounds"] = VisionCameraFaceDetectorPlugin.processBoundingBox(from: face)
                    map["contours"] = VisionCameraFaceDetectorPlugin.processContours(from: face)
                    map["imageResult"] = imageResult
                    
                    faceAttributes.append(map)
                }
            }
        } catch {
            print("error: \(error)")
            return nil
        }
        return faceAttributes
    }
}
