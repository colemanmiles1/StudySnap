/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  RotateCw,
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Maximize2,
  Video,
  SwitchCamera,
} from 'lucide-react';
import { SAMPLE_NOTES, SampleNote } from '../data/sampleNotes';
import { compressImageFile } from '../utils/imageCompressor';

interface CameraScannerProps {
  onAnalyze: (
    images: Array<{ base64: string; mimeType: string; sampleId?: string }>,
    sampleId?: string
  ) => void;
  isAnalyzing: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onAnalyze,
  isAnalyzing,
}) => {
  const [selectedImages, setSelectedImages] = useState<
    Array<{ id: string; base64: string; mimeType: string; previewUrl: string; sampleId?: string }>
  >([]);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [showLiveCamera, setShowLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  // Hidden file inputs
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Live video elements
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Clean up media stream when live camera closes
  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  const startLiveCamera = async () => {
    setCameraError(null);
    setShowLiveCamera(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support live video stream capture. Please use the camera upload button.');
      }

      // Stop any existing stream
      stopLiveCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      let msg = 'Could not access camera. Please allow camera permissions in your browser or use the file upload option.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser settings, or use the Native Camera button.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera hardware found on this device. You can upload an image from your gallery.';
      }
      setCameraError(msg);
    }
  };

  const stopLiveCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const closeLiveCameraModal = () => {
    stopLiveCamera();
    setShowLiveCamera(false);
    setCameraError(null);
  };

  const captureLivePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    addImageToQueue(dataUrl, 'image/jpeg');
    closeLiveCameraModal();
  };

  const toggleFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    stopLiveCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: nextMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Failed to switch camera:', err);
    }
  };

  // Process file upload from native camera or file selector
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const { base64, mimeType } = await compressImageFile(file);
        if (base64) {
          addImageToQueue(base64, mimeType);
        }
      } catch (err) {
        console.error('Failed to compress image:', err);
      }
    }

    // Reset input value so same file can be re-selected if desired
    e.target.value = '';
  };

  const addImageToQueue = (base64: string, mimeType: string, sampleId?: string) => {
    const newEntry = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      base64,
      mimeType,
      previewUrl: base64,
      sampleId,
    };
    setSelectedImages((prev) => {
      const next = [...prev, newEntry];
      setActivePreviewIndex(next.length - 1);
      return next;
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (activePreviewIndex >= next.length) {
        setActivePreviewIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleSelectSample = (sample: SampleNote) => {
    const newEntry = {
      id: `sample-${sample.id}-${Date.now()}`,
      base64: sample.previewUrl,
      mimeType: 'image/svg+xml',
      previewUrl: sample.previewUrl,
      sampleId: sample.id,
    };
    setSelectedImages([newEntry]);
    setActivePreviewIndex(0);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const handleInstantAnalyzeSample = (e: React.MouseEvent, sample: SampleNote) => {
    e.stopPropagation();
    onAnalyze(
      [
        {
          base64: sample.previewUrl,
          mimeType: 'image/svg+xml',
          sampleId: sample.id,
        },
      ],
      sample.id
    );
  };

  const handleSubmit = () => {
    if (selectedImages.length === 0) return;
    const activeSampleId = selectedImages.find((img) => img.sampleId)?.sampleId;
    onAnalyze(
      selectedImages.map((img) => ({
        base64: img.base64,
        mimeType: img.mimeType,
        sampleId: img.sampleId,
      })),
      activeSampleId
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Hidden File Inputs */}
      {/* Native Camera Capture (Crucial for iOS Safari & Android Chrome full camera trigger) */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Standard Gallery / Photo Roll upload */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            Next-Gen AI Study Assistant
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white mb-2">
            Snap your notes. <br />
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
              Learn anything in seconds.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Take a photo of messy handwritten notes, textbook pages, or problem sets. StudySnap uses Gemini AI to extract key concepts, build 3D flashcards, and create practice exams.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Primary Native Camera Button */}
            <button
              onClick={() => {
                // If on mobile, native capture is the smoothest experience
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                  nativeCameraInputRef.current?.click();
                } else {
                  startLiveCamera();
                }
              }}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-base shadow-lg shadow-sky-500/25 active:scale-98 transition-all"
            >
              <Camera className="w-5 h-5" />
              <span>Scan My Notes</span>
            </button>

            {/* Upload Gallery Button */}
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm backdrop-blur-md active:scale-98 transition-all"
            >
              <Upload className="w-4 h-4 text-sky-300" />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Alternate button to open live camera viewfinder directly on desktop */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Works with handwritten & typed notes
            </span>
            <button
              type="button"
              onClick={startLiveCamera}
              className="text-sky-400 hover:text-sky-300 underline font-medium flex items-center gap-1"
            >
              <Video className="w-3.5 h-3.5" /> Open live viewfinder
            </button>
          </div>
        </div>
      </div>

      {/* Selected Images Preview Queue */}
      {selectedImages.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Scanned Pages ({selectedImages.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Page
              </button>
              <button
                type="button"
                onClick={() => setSelectedImages([])}
                className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Preview Display */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[300px] max-h-[460px]">
            <img
              src={selectedImages[activePreviewIndex]?.previewUrl}
              alt={`Scanned page ${activePreviewIndex + 1}`}
              className="w-full h-full object-contain max-h-[440px]"
            />

            {/* Overlay badge with page number */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
              Page {activePreviewIndex + 1} of {selectedImages.length}
            </div>

            {/* Action buttons on active image */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                onClick={() => removeImage(activePreviewIndex)}
                className="p-2 rounded-full bg-black/70 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                title="Delete this page"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thumbnail strip if multiple pages */}
          {selectedImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              {selectedImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`relative shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    idx === activePreviewIndex
                      ? 'border-sky-500 ring-2 ring-sky-500/30 scale-105'
                      : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.previewUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 px-1 text-[10px] font-bold bg-black/70 text-white rounded-tl">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Generate Study Materials Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-extrabold text-base shadow-lg shadow-indigo-500/25 active:scale-98 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>Generate Study Materials with Gemini AI</span>
            </button>
          </div>
        </div>
      )}

      {/* 1-Tap Sample Notes for instant testing without camera */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              ⚡ Try with Sample College Notes
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
              1-Tap Test
            </span>
          </div>
          <span className="text-xs text-slate-400">No upload required</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_NOTES.map((sample) => {
            const isSelected = selectedImages.some((img) => img.sampleId === sample.id);
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`group cursor-pointer rounded-2xl p-3.5 transition-all text-left flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-500 shadow-md ring-2 ring-sky-400/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50/80 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{sample.thumbnail}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {sample.course.split(' - ')[0]}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {sample.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {sample.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isSelected ? '✓ Selected' : 'Tap to preview'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleInstantAnalyzeSample(e, sample)}
                    disabled={isAnalyzing}
                    className="px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
                    title="Generate notes immediately"
                  >
                    <Sparkles className="w-3 h-3 text-yellow-300" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live WebRTC Camera Viewfinder Modal */}
      {showLiveCamera && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Header */}
          <div className="w-full max-w-lg flex items-center justify-between text-white py-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-sm tracking-wide uppercase">Live Viewfinder</span>
            </div>
            <button
              onClick={closeLiveCameraModal}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container */}
          <div className="relative w-full max-w-lg aspect-[3/4] max-h-[68vh] rounded-3xl overflow-hidden bg-black border-2 border-white/20 shadow-2xl flex items-center justify-center">
            {cameraError ? (
              <div className="p-6 text-center space-y-4 max-w-sm">
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Camera Access Notice</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      closeLiveCameraModal();
                      nativeCameraInputRef.current?.click();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors"
                  >
                    Use Native Camera Instead
                  </button>
                  <button
                    onClick={closeLiveCameraModal}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder frame guidelines */}
                <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-2 border-l-2 border-sky-400 rounded-tl-lg" />
                    <div className="w-6 h-6 border-t-2 border-r-2 border-sky-400 rounded-tr-lg" />
                  </div>
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white/90 text-xs font-medium tracking-wide">
                      Align notes inside frame
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-2 border-l-2 border-sky-400 rounded-bl-lg" />
                    <div className="w-6 h-6 border-b-2 border-r-2 border-sky-400 rounded-br-lg" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Shutter controls */}
          {!cameraError && (
            <div className="w-full max-w-lg flex items-center justify-around py-4">
              <button
                onClick={toggleFacingMode}
                className="p-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                title="Switch front/back camera"
              >
                <SwitchCamera className="w-5 h-5" />
              </button>

              {/* Shutter Button */}
              <button
                onClick={captureLivePhoto}
                className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center active:scale-90 transition-transform shadow-xl"
              >
                <div className="w-full h-full rounded-full bg-white hover:bg-sky-200 transition-colors" />
              </button>

              <button
                onClick={() => {
                  closeLiveCameraModal();
                  galleryInputRef.current?.click();
                }}
                className="p-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                title="Choose from photo library"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
