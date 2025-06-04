 const video = document.getElementById('video');
  const outputData = document.getElementById('outputData');
  const loadingMessage = document.getElementById('loadingMessage');
  const startButton = document.getElementById('startButton');

  let scanning = false;
  let videoStream = null;
  let canvasElement = document.createElement('canvas');
  let canvas = canvasElement.getContext('2d');

  function stopVideoStream() {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      videoStream = null;
    }
  }

  function tick() {
    if (!scanning) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      loadingMessage.hidden = true;
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code) {
        outputData.textContent = code.data;
        // Optionally stop scanning on successful detection:
        // scanning = false;
        // stopVideoStream();
      } else {
        outputData.textContent = "No QR code detected.";
      }
    }
    requestAnimationFrame(tick);
  }

  async function startScanner() {
    try {
      videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      video.srcObject = videoStream;
      video.setAttribute('playsinline', true);
      scanning = true;
      loadingMessage.textContent = '🎥 Scanning for QR code...';
      requestAnimationFrame(tick);
      startButton.textContent = 'Stop Scanner';
    } catch (e) {
      loadingMessage.textContent = '⚠️ Error accessing camera: ' + e.message;
    }
  }

  function stopScanner() {
    scanning = false;
    stopVideoStream();
    loadingMessage.textContent = '🎥 Scanner stopped.';
    outputData.textContent = 'No QR code detected.';
    startButton.textContent = 'Start Scanner';
  }

  startButton.addEventListener('click', () => {
    if (scanning) {
      stopScanner();
    } else {
      startScanner();
    }
  });