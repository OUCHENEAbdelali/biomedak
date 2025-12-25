import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, X } from 'lucide-react';

interface QRDisplayProps {
  equipmentId: string;
  equipmentName: string;
  onClose: () => void;
}

export default function QRDisplay({ equipmentId, equipmentName, onClose }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, equipmentId, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      if (canvasRef.current) {
        generateQR();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [equipmentId]);

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL('image/png');
      link.download = `QR-${equipmentName}-${equipmentId}.png`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">QR Code Équipement</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded"
              style={{ display: loading ? 'none' : 'block' }}
            />
            {loading && <div className="text-gray-500 py-8">Génération...</div>}
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Équipement:</p>
            <p className="font-medium text-gray-900">{equipmentName}</p>
            <p className="text-xs text-gray-500 mt-1 break-all">{equipmentId}</p>
          </div>

          <button
            onClick={downloadQR}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            Télécharger QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
