import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function History() {
  const { token, backendUrl } = useContext(AppContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page] = useState(1);
  const [limit] = useState(9);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedResolution, setSelectedResolution] = useState('original');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null); // 'download' or 'share'

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(backendUrl + '/api/image/user-history', {
          headers: { token },
          params: { page, limit }
        });
        if (data.success) {
          setHistory(data.history);
        }
      } catch {
        // ignore error
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [backendUrl, token, page, limit]);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(backendUrl + '/api/image/delete-history', {
        headers: { token },
        data: { id }
      });
      if (data.success) {
        setHistory(history.filter(item => item._id !== id));
        toast.success('History item deleted');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Convert image to selected format and resolution before download
  const convertImage = (imageUrl, format, resolution) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.naturalWidth;
          let height = img.naturalHeight;

          switch(resolution) {
            case 'small':
              width = 640;
              height = 426;
              break;
            case 'medium':
              width = 1280;
              height = 853;
              break;
            case 'large':
              width = 1920;
              height = 1280;
              break;
            case 'original':
            default:
              break;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL(`image/${format}`);
          resolve(dataUrl);
        };
        img.onerror = reject;
      } catch (error) {
        reject(error);
      }
    });
  };

  // Removed unused functions handleDownloadClick and handleShareClick as their logic is now inline in buttons


  const handleActualDownload = async () => {
    if (!selectedItem) return;

    try {
      const convertedDataUrl = await convertImage(
        backendUrl + selectedItem.imageUrl,
        selectedFormat,
        selectedResolution
      );
      const a = document.createElement('a');
      a.href = convertedDataUrl;
      a.download = `${selectedItem.prompt}.${selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setSelectedItem(null);
      setSelectedAction(null);
    } catch {
      toast.error('Failed to download image');
    }
  };

  const handleActualShare = async () => {
    if (!selectedItem) return;

    try {
      const convertedDataUrl = await convertImage(
        backendUrl + selectedItem.imageUrl,
        selectedFormat,
        selectedResolution
      );
      // Convert data URL to blob
      const response = await fetch(convertedDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${selectedItem.prompt}.${selectedFormat}`, { type: `image/${selectedFormat}` });

      if (navigator.share) {
        await navigator.share({
          title: 'Generated Image',
          text: 'Check out this generated image!',
          files: [file],
        });
      } else {
        // fallback to copying URL to clipboard
        await navigator.clipboard.writeText(convertedDataUrl);
        toast.success('Image URL copied to clipboard');
      }
      setSelectedItem(null);
      setSelectedAction(null);
    } catch {
      toast.error('Failed to share image');
    }
  };



  // Handlers for format and resolution change
  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleResolutionChange = (e) => {
    setSelectedResolution(e.target.value);
  };

  if (loading) {
    return <p className="text-center mt-10">Loading history...</p>;
  }

  if (history.length === 0) {
    return <p className="text-center mt-10">No image history found.</p>;
  }

  return (
    <div className="min-h-[90vh] p-4 flex flex-col items-center bg-gradient-to-b from-teal-50 to-orange-50">
      <h1 className="text-2xl font-semibold mb-6">Image Generation History</h1>



      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {history.map((item) => (
          <div key={item._id} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <img
              src={backendUrl + item.imageUrl}
              alt={item.prompt}
              className="max-w-xs rounded mb-4"
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src = '/fallback-image.png'; }}
            />
            <p className="text-sm mb-2 text-center">{item.prompt}</p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 justify-center">
                <button onClick={() => {
                  if (selectedItem && selectedItem._id === item._id && selectedAction === 'download') {
                    handleActualDownload();
                  } else {
                    setSelectedItem(item);
                    setSelectedAction('download');
                  }
                }} className={`px-4 py-2 rounded transition ${selectedItem && selectedItem._id === item._id && selectedAction === 'download' ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                  {selectedItem && selectedItem._id === item._id && selectedAction === 'download' ? 'Confirm Download' : 'Download'}
                </button>
                <button onClick={() => {
                  if (selectedItem && selectedItem._id === item._id && selectedAction === 'share') {
                    handleActualShare();
                  } else {
                    setSelectedItem(item);
                    setSelectedAction('share');
                  }
                }} className={`px-4 py-2 rounded transition ${selectedItem && selectedItem._id === item._id && selectedAction === 'share' ? 'bg-green-800' : 'bg-green-600 hover:bg-green-700'} text-white`}>
                  {selectedItem && selectedItem._id === item._id && selectedAction === 'share' ? 'Confirm Share' : 'Share'}
                </button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                  Delete
                </button>
              </div>
              {selectedItem && selectedItem._id === item._id && (selectedAction === 'download' || selectedAction === 'share') && (
                <div className="p-3 max-w-sm w-full">
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format:</label>
                      <select
                        value={selectedFormat}
                        onChange={handleFormatChange}
                        className="w-full px-3 py-2 rounded-md bg-white shadow-md"
                        style={{ borderRadius: '0.375rem', overflow: 'hidden' }}
                      >
                        <option value="jpeg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="webp">WebP</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resolution:</label>
                      <select
                        value={selectedResolution}
                        onChange={handleResolutionChange}
                        className="w-full px-3 py-2 rounded-md bg-white shadow-md"
                      >
                        <option value="small">Small (640×426)</option>
                        <option value="medium">Medium (1280×853)</option>
                        <option value="large">Large (1920×1280)</option>
                        <option value="original">Original</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => {
                        setSelectedItem(null);
                        setSelectedAction(null);
                      }}
                      className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}

export default History;
