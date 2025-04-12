let qrScanner;
let isScanning = false;

function openScanner() {
  const overlay = document.getElementById("qr-overlay");
  overlay.style.display = "flex";
  document.getElementById("scanResult").innerText = "Initializing scanner...";

  if (isScanning) return; // Prevent double start
  isScanning = true;

  qrScanner = new Html5Qrcode("qr-reader");

  Html5Qrcode.getCameras()
    .then(cameras => {
      if (cameras && cameras.length) {
        const backCam = cameras.find(cam => cam.label.toLowerCase().includes("back")) || cameras[0];

        return qrScanner.start(
          backCam.id,
          {
            fps: 10,
            qrbox: 250
          },
          qrCodeMessage => {
            try {
              const data = JSON.parse(qrCodeMessage);
              if (data.orderId && data.items && data.amount) {
                document.getElementById("orderId").value = data.orderId;
                document.getElementById("items").value = data.items;
                document.getElementById("total").value = data.amount;
                document.getElementById("payButton").disabled = false;
                document.getElementById("scanResult").innerText = "✅ Scanned successfully!";
              } else {
                document.getElementById("scanResult").innerText = "⚠️ Missing data in QR code!";
              }
            } catch (e) {
              document.getElementById("scanResult").innerText = "❌ Invalid QR code format!";
              console.error("QR code parsing error:", e);
            }

            stopScanner(); // Auto stop after successful scan
          },
          errorMsg => {
            console.log("Scanning... ", errorMsg);
          }
        );
      } else {
        document.getElementById("scanResult").innerText = "❌ No camera found!";
      }
    })
    .catch(err => {
      console.error("Camera init failed:", err);
      document.getElementById("scanResult").innerText = "❌ Camera access error. Check permissions.";
    });
}

function stopScanner() {
  if (qrScanner && isScanning) {
    qrScanner.stop()
      .then(() => {
        qrScanner.clear();
        isScanning = false;
        document.getElementById("qr-overlay").style.display = "none";
      })
      .catch(err => {
        console.warn("Error stopping scanner:", err);
      });
  } else {
    document.getElementById("qr-overlay").style.display = "none";
  }
}

function closeScanner() {
  stopScanner();
}
