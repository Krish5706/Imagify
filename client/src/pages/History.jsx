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

  const handleDownload = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'generated-image.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'Generated Image',
          text: 'Check out this generated image!',
          files: [file],
        });
      } else {
        // fallback to copying URL to clipboard
        await navigator.clipboard.writeText(imageUrl);
        toast.success('Image URL copied to clipboard');
      }
    } catch {
      // fallback to opening the image
      window.open(imageUrl, '_blank');
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading history...</p>;
  }

  if (history.length === 0) {
    return <p className="text-center mt-10">No image history found.</p>;
  }

  return (
    <div className="min-h-[90vh] p-4 flex flex-col items-center">
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
            <div className="flex gap-2">
              <button onClick={() => handleDownload(backendUrl + item.imageUrl, item.prompt)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Download
              </button>
              <button onClick={() => handleShare(backendUrl + item.imageUrl)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Share
              </button>
              <button onClick={() => handleDelete(item._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
