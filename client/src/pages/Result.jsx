import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext';

function Result() {

  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedResolution, setSelectedResolution] = useState('original');

  // Handlers for format and resolution change
  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleResolutionChange = (e) => {
    setSelectedResolution(e.target.value);
  };
  const {generateImage} = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)

    if(input){
      const image = await generateImage(input)
      if(image){
        setIsImageLoaded(true)
        setImage(image)
      }
    }
    setLoading(false)
  }

  const convertImage = (imgElement, format, resolution) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width = imgElement.naturalWidth;
    let height = imgElement.naturalHeight;

    // Adjust resolution
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

    // Draw and resize image
    ctx.drawImage(imgElement, 0, 0, width, height);

    // Convert to selected format
    return canvas.toDataURL(`image/${format}`);
  };

  const downloadImage = () => {
    if (!isImageLoaded) return;

    const imgElement = document.querySelector('img.max-w-sm.rounded');
    if (!imgElement) return;

    const convertedImage = convertImage(imgElement, selectedFormat, selectedResolution);
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = `imagify_${Date.now()}.${selectedFormat}`;
    link.click();
  };

  const shareImage = async () => {
    if (!isImageLoaded) return;

    const imgElement = document.querySelector('img.max-w-sm.rounded');
    if (!imgElement) return;

    try {
      const convertedImage = convertImage(imgElement, selectedFormat, selectedResolution);
      // Convert data URL to blob
      const response = await fetch(convertedImage);
      const blob = await response.blob();
      const file = new File([blob], `imagify_${Date.now()}.${selectedFormat}`, { type: `image/${selectedFormat}` });

      if (navigator.share) {
        await navigator.share({
          title: 'Generated Image',
          text: 'Check out this generated image!',
          files: [file],
        });
      } else {
        // fallback to copying URL to clipboard
        await navigator.clipboard.writeText(convertedImage);
        alert('Image URL copied to clipboard');
      }
    } catch {
      alert('Failed to share image');
    }
  };

  return (
    <motion.form 

    initial={{opacity: 0.2, y: 100}}
    transition={{duration: 1}}
    whileInView={{opacity: 1, y: 0}}
    viewport={{ once: true }}

    onSubmit={onSubmitHandler} className='flex flex-col min-h-[90vh] justify-center items-center'>
   
    <div>
      <div className='relative'>
        <img src={image} alt="" className='max-w-sm rounded' />
        <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}/> 
      </div>
        <p className={!loading ? 'hidden' : ' '}>Loading.....</p>
    </div>

    {!isImageLoaded && 
     <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
        <input onChange={e => setInput(e.target.value)} value={input}
        type="text" placeholder='Describe what you want to generate' className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color' />
        <button type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
      </div>
    }

    {isImageLoaded &&
      <div className='flex flex-col items-center gap-4 mt-10'>
        {/* Download Options */}
        <div className="p-3 max-w-xs w-full">
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Format:</label>
              <select
                value={selectedFormat}
                onChange={handleFormatChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300"
                style={{ borderRadius: '0.375rem', overflow: 'hidden' }}
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Resolution:</label>
              <select
                value={selectedResolution}
                onChange={handleResolutionChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300"
                style={{ minWidth: '190px' }}
              >
                <option value="small">Small (640×426)</option>
                <option value="medium">Medium (1280×853)</option>
                <option value="large">Large (1920×1280)</option>
                <option value="original">Original</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm'>
          <p onClick={()=> {
            setIsImageLoaded(false);
            setImage(assets.sample_img_1);
            setInput('');
          }}
          className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</p>
          <button type="button" onClick={downloadImage} className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</button>
          <button type="button" onClick={shareImage} className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Share</button>
        </div>
      </div>
    }

    </motion.form>
  ) 
}

export default Result