/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Resizes and compresses any image file (e.g. from iPhone Safari or Android Chrome)
 * to a lightweight, crystal-clear JPEG (max 1600px, 0.82 quality).
 * Prevents mobile browser connection drops and "Load failed" errors caused by 20MB+ raw camera payloads.
 */
export async function compressImageFile(
  file: File
): Promise<{ base64: string; mimeType: string }> {
  // If it's an SVG file, keep as is
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ base64: (reader.result as string) || '', mimeType: 'image/svg+xml' });
      };
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = (e.target?.result as string) || '';
      const img = new Image();

      img.onload = () => {
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({ base64: rawUrl, mimeType: file.type || 'image/jpeg' });
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);
        // Export as clean, optimized JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({ base64: compressedDataUrl, mimeType: 'image/jpeg' });
      };

      img.onerror = () => {
        resolve({ base64: rawUrl, mimeType: file.type || 'image/jpeg' });
      };

      img.src = rawUrl;
    };

    reader.onerror = () => {
      resolve({ base64: '', mimeType: 'image/jpeg' });
    };

    reader.readAsDataURL(file);
  });
}
