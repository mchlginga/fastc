import { useState, useRef, useEffect } from "react";
import {
    Camera,
    X,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    UserCheck,
} from "react-feather";

const FacialRecognitionModal = ({
    isOpen,
    onClose,
    onSuccess,
    courseId,
    lessonId,
    courseTitle,
    lessonTitle,
    isEnrollment = false,
}) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [status, setStatus] = useState("initial");
    const [errorMessage, setErrorMessage] = useState("");
    const [capturedImage, setCapturedImage] = useState(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [detectionMessage, setDetectionMessage] = useState(
        "Position your face within the frame"
    );

    const detectionIntervalRef = useRef(null);
    const faceApiLoaded = useRef(false);
    const autoSubmitTimerRef = useRef(null);

    // Add auto-submit trigger
    useEffect(() => {
        if (status === "ready" && faceDetected) {
            // Clear any existing timer
            if (autoSubmitTimerRef.current) {
                clearTimeout(autoSubmitTimerRef.current);
            }

            // Set new timer for auto-submit
            autoSubmitTimerRef.current = setTimeout(() => {
                if (status === "ready" && faceDetected) {
                    captureImage();
                }
            }, 1500); // 1.5 second delay for user to see confirmation
        }

        return () => {
            if (autoSubmitTimerRef.current) {
                clearTimeout(autoSubmitTimerRef.current);
            }
        };
    }, [status, faceDetected]);

    // Reset auto-submit timer when face is lost
    useEffect(() => {
        if (status === "ready" && !faceDetected && autoSubmitTimerRef.current) {
            clearTimeout(autoSubmitTimerRef.current);
        }
    }, [faceDetected, status]);

    // Load face-api.js models
    useEffect(() => {
        if (isOpen && !faceApiLoaded.current) {
            loadFaceApi();
        }
    }, [isOpen]);

    useEffect(() => {
        if (status === "detecting") {
            startFaceDetection();
        }
    }, [status]);

    const loadFaceApi = async () => {
        try {
            if (typeof window.faceapi === "undefined") {
                return;
            }

            const MODEL_URL = "/models";

            await Promise.all([
                window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);

            faceApiLoaded.current = true;
        } catch (error) {
            console.error("Failed to load face-api.js models:", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            resetModal();
        }

        return () => {
            stopCamera();
            if (autoSubmitTimerRef.current) {
                clearTimeout(autoSubmitTimerRef.current);
            }
        };
    }, [isOpen]);

    const startCamera = async () => {
        try {
            setStatus("initial");
            setErrorMessage("");
            setFaceDetected(false);
            setDetectionMessage("Position your face within the frame");

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    facingMode: "user",
                },
                audio: false,
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                videoRef.current.onloadedmetadata = () => {
                    setStatus("detecting");
                };

                videoRef.current.onerror = (error) => {
                    setStatus("error");
                    setErrorMessage("Camera feed error. Please try again.");
                };
            }
        } catch (error) {
            setStatus("error");

            if (error.name === "NotAllowedError") {
                setErrorMessage("Camera permission denied");
            } else if (error.name === "NotFoundError") {
                setErrorMessage("No camera detected");
            } else if (error.name === "NotSupportedError") {
                setErrorMessage("Camera not supported");
            } else {
                setErrorMessage("Camera access failed");
            }
        }
    };

    const startFaceDetection = () => {
        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
        }

        detectionIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
                await detectFace();
            }
        }, 500);
    };

    const detectFace = async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4) return;

        try {
            const video = videoRef.current;

            if (faceApiLoaded.current && window.faceapi) {
                const detectionOptions =
                    new window.faceapi.TinyFaceDetectorOptions({
                        inputSize: 320,
                        scoreThreshold: 0.3,
                    });

                const detections = await window.faceapi
                    .detectAllFaces(video, detectionOptions)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                const faceCount = detections.length;

                if (faceCount === 0) {
                    if (status === "ready") {
                        setStatus("detecting");
                        setFaceDetected(false);
                        setDetectionMessage(
                            "Face lost - Position your face within the frame"
                        );
                    } else {
                        setFaceDetected(false);
                        setDetectionMessage(
                            "No face detected - Position your face within the frame"
                        );
                    }
                    return;
                }

                if (faceCount > 1) {
                    setFaceDetected(false);
                    setDetectionMessage(
                        "Multiple faces detected - Ensure only one person is in frame"
                    );
                    return;
                }

                const detection = detections[0];
                const box = detection.detection.box;
                const confidence = Math.round(detection.detection.score * 100);

                const faceWidth = box.width;
                const faceHeight = box.height;
                const minFaceSize = 100;
                const maxFaceSize = 400;

                const sizeStatus =
                    faceWidth < minFaceSize || faceHeight < minFaceSize
                        ? "Too small - Move closer"
                        : faceWidth > maxFaceSize || faceHeight > maxFaceSize
                        ? "Too large - Move back"
                        : "Optimal distance";

                const centerX = box.x + box.width / 2;
                const centerY = box.y + box.height / 2;
                const canvasCenterX = video.videoWidth / 2;
                const canvasCenterY = video.videoHeight / 2;
                const tolerance = 100;

                const xOffset = Math.abs(centerX - canvasCenterX);
                const yOffset = Math.abs(centerY - canvasCenterY);

                const positionStatus =
                    xOffset > tolerance || yOffset > tolerance
                        ? `Adjust position - Center your face in frame`
                        : "Optimal positioning";

                const isGoodSize =
                    faceWidth >= minFaceSize &&
                    faceHeight >= minFaceSize &&
                    faceWidth <= maxFaceSize &&
                    faceHeight <= maxFaceSize;
                const isCentered = xOffset <= tolerance && yOffset <= tolerance;
                const isConfident = confidence >= 70;

                if (isGoodSize && isCentered && isConfident) {
                    setFaceDetected(true);
                    setDetectionMessage(
                        "Face verified - Processing automatically..."
                    );
                    setStatus("ready");
                } else {
                    setFaceDetected(false);
                    if (!isCentered) {
                        setDetectionMessage(positionStatus);
                    } else if (!isGoodSize) {
                        setDetectionMessage(sizeStatus);
                    } else if (!isConfident) {
                        setDetectionMessage(
                            `Low confidence: ${confidence}% - Ensure adequate lighting`
                        );
                    }
                }
            } else {
                await basicFaceDetection();
            }
        } catch (error) {
            console.error("Face detection error:", error);
            await basicFaceDetection();
        }
    };

    const basicFaceDetection = async () => {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const brightness = calculateBrightness(imageData);

        if (brightness > 100 && brightness < 160) {
            setFaceDetected(true);
            setDetectionMessage("Camera ready - Adequate lighting detected");
            setStatus("ready");
        } else {
            setFaceDetected(false);
            setDetectionMessage(
                "Adjust lighting - Adequate lighting required for verification"
            );
        }
    };

    const calculateBrightness = (imageData) => {
        let total = 0;
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const brightness =
                0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            total += brightness;
        }

        return total / (data.length / 4);
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
            setStream(null);
        }
        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
        }
    };

    const resetModal = () => {
        setStatus("initial");
        setErrorMessage("");
        setCapturedImage(null);
        setFaceDetected(false);
        setDetectionMessage("Position your face within the frame");
    };

    const captureImage = async () => {
        if (!videoRef.current || !canvasRef.current) {
            setStatus("error");
            setErrorMessage("Camera not ready. Please try again.");
            return;
        }

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const originalImageData = canvas.toDataURL("image/jpeg", 0.8);

            console.log(
                `📸 Original image captured: ${originalImageData.length} bytes`
            );

            setCapturedImage(originalImageData);
            setStatus("capturing");

            if (isEnrollment) {
                await processFaceEnrollment(originalImageData);
            } else {
                await processAttendance(originalImageData);
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error.message || "Failed to capture image. Please try again."
            );
        }
    };

    const processAttendance = async (imageData) => {
        try {
            setStatus("processing");

            const { verifyAttendance } = await import(
                "../../services/attendanceService"
            );
            const result = await verifyAttendance(
                courseId,
                lessonId,
                imageData
            );

            if (result.success) {
                setStatus("success");

                // Update success message if attendance was already marked
                if (result.alreadyMarked) {
                    setDetectionMessage(
                        "Attendance already verified today - Proceeding to lesson"
                    );
                }

                console.log(
                    "✅ Attendance check completed, navigating to lesson..."
                );

                // Navigate immediately on success (including "already marked" case)
                setTimeout(() => {
                    console.log("🚀 Navigating to lesson...");
                    stopCamera();
                    onSuccess();
                }, 1000);
            } else {
                throw new Error(result.message || "Verification failed");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error.message ||
                    "Attendance verification failed. Please try again."
            );
        }
    };

    const processFaceEnrollment = async (imageData) => {
        try {
            setStatus("processing");

            const { enrollFace } = await import(
                "../../services/attendanceService"
            );
            const result = await enrollFace(imageData);

            if (result.success) {
                setStatus("success");
                setTimeout(() => {
                    stopCamera();
                    onSuccess();
                }, 1500);
            } else {
                throw new Error(result.message || "Facial enrollment failed");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage(
                error.message || "Facial enrollment failed. Please try again."
            );
        }
    };

    const retryVerification = () => {
        setCapturedImage(null);
        setStatus("initial");
        setErrorMessage("");
        setFaceDetected(false);
        setDetectionMessage("Position your face within the frame");
        startCamera();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 cursor-pointer">
            <div
                className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100 cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            {isEnrollment
                                ? "Facial Enrollment"
                                : "Attendance Verification"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            {isEnrollment
                                ? "Register facial data for attendance tracking"
                                : `${courseTitle} - ${lessonTitle}`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Status Messages */}
                    {status === "initial" && (
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center text-blue-600 mb-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Initializing camera...
                            </p>
                        </div>
                    )}

                    {status === "detecting" && (
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center text-blue-600 mb-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                            <p className="text-gray-600 text-sm">
                                {detectionMessage}
                            </p>
                        </div>
                    )}

                    {status === "ready" && faceDetected ? (
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center text-green-600 mb-2">
                                <CheckCircle size={20} />
                            </div>
                            <p className="text-green-600 text-sm font-medium">
                                Face verified - Processing automatically...
                            </p>
                        </div>
                    ) : status === "ready" && !faceDetected ? (
                        <div className="text-center mb-4">
                            <div className="flex items-center justify-center text-yellow-600 mb-2">
                                <AlertCircle size={20} />
                            </div>
                            <p className="text-yellow-600 text-sm font-medium">
                                Face lost - Reposition within frame
                            </p>
                        </div>
                    ) : null}

                    {status === "error" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center text-red-800">
                                <AlertCircle size={16} className="mr-2" />
                                <span className="text-sm font-medium">
                                    {errorMessage}
                                </span>
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center text-green-800">
                                <CheckCircle size={16} className="mr-2" />
                                <span className="text-sm font-medium">
                                    {isEnrollment
                                        ? "Facial enrollment completed successfully"
                                        : "Attendance verified successfully"}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Camera Feed */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
                        {["initial", "detecting", "ready"].includes(status) && (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-64 object-cover"
                            />
                        )}

                        {status === "capturing" && capturedImage && (
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-full h-64 object-cover"
                            />
                        )}

                        {status === "processing" && (
                            <div className="w-full h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                    <p className="text-white text-sm">
                                        {isEnrollment
                                            ? "Processing facial data..."
                                            : "Verifying attendance..."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === "success" && capturedImage && (
                            <img
                                src={capturedImage}
                                alt="Verified"
                                className="w-full h-64 object-cover"
                            />
                        )}

                        {/* Face Detection Frame */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className={`w-48 h-48 border-2 rounded-lg transition-all duration-300 ${
                                    faceDetected
                                        ? "border-green-500 bg-green-500/20 shadow-lg shadow-green-500/30"
                                        : "border-yellow-500 bg-yellow-500/10 border-dashed"
                                }`}
                            >
                                {faceDetected && (
                                    <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-pulse"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hidden canvas */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Action Buttons - Simplified for auto-submit */}
                    <div className="flex gap-3">
                        {(status === "error" || status === "capturing") && (
                            <>
                                <button
                                    onClick={retryVerification}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center cursor-pointer"
                                >
                                    <RefreshCw size={18} className="mr-2" />
                                    Retry
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>

                    {/* Help Text */}
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            {status === "detecting" &&
                                "Position your face clearly within the frame with adequate lighting"}
                            {status === "ready" &&
                                faceDetected &&
                                "Face verified - Processing will begin automatically"}
                            {status === "ready" &&
                                !faceDetected &&
                                "Adjust position - Center your face within the frame"}
                            {status === "error" &&
                                "Verify camera permissions and lighting conditions"}
                            {status === "success" &&
                                (isEnrollment
                                    ? "Facial enrollment process completed"
                                    : "Attendance verification successful")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacialRecognitionModal;
