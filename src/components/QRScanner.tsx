import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Loader } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText);
            stopScanner();
          },
          (error) => {
            console.log('QR scan error:', error);
          }
        );
      } catch (err) {
        setError('Impossible d\'accéder à la caméra');
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScan]);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Scan QR Code</h3>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {isScanning && !error && (
          <div className="space-y-4">
            <div
              id="qr-reader"
              className="w-full rounded-lg overflow-hidden border-2 border-blue-500"
              style={{ minHeight: '300px' }}
            ></div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Loader size={20} className="animate-spin" />
              <span>Positionnez le QR code dans la caméra</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
