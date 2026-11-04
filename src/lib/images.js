export async function resizeImageToJpeg(file, maxSide) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const loadedImg = await new Promise((resolve, reject) => {
      const imgEl = new Image();
      imgEl.onload = () => resolve(imgEl);
      imgEl.onerror = reject;
      imgEl.src = objectUrl;
    });
    const scale = Math.min(
      1,
      maxSide / Math.max(loadedImg.naturalWidth, loadedImg.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(loadedImg.naturalWidth * scale);
    canvas.height = Math.round(loadedImg.naturalHeight * scale);
    canvas
      .getContext("2d")
      .drawImage(loadedImg, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolveBlob) =>
      canvas.toBlob(resolveBlob, "image/jpeg", 0.82),
    );
    return {
      blob,
      dataUrl: blob ? null : canvas.toDataURL("image/jpeg", 0.8),
      canvas,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
