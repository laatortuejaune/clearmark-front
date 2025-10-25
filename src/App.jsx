import { useState } from 'react'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setProcessedImage(null)
    }
  }

  const handleProcessImage = async () => {
    if (!selectedImage) return
    
    setIsProcessing(true)
    const formData = new FormData()
    formData.append('image', selectedImage)

    try {
      const response = await fetch('https://clearmark-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (response.ok) {
        const blob = await response.blob()
        setProcessedImage(URL.createObjectURL(blob))
      } else {
        alert('Error processing image. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error processing image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = 'clearmark-result.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setProcessedImage(null)
    setIsProcessing(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>✨ ClearMark</h1>
        <p>Remove watermarks from your images instantly</p>
      </header>
      
      <main className="container">
        {!previewUrl ? (
          <div className="upload-section">
            <div className="upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                id="file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="upload-label">
                <div className="upload-icon">📁</div>
                <h2>Click to Upload Image</h2>
                <p>or drag and drop</p>
                <p className="file-types">PNG, JPG, or JPEG</p>
              </label>
            </div>
          </div>
        ) : (
          <>
            <div className="image-container">
              <div className="image-box">
                <h3>Original Image</h3>
                <img src={previewUrl} alt="Original" />
              </div>
              
              {processedImage && (
                <div className="image-box">
                  <h3>Processed Image</h3>
                  <img src={processedImage} alt="Processed" />
                </div>
              )}
            </div>
            <div className="action-buttons">
              {!processedImage ? (
                <>
                  <button onClick={handleProcessImage} disabled={isProcessing}>
                    {isProcessing ? '⏳ Processing...' : '✨ Remove Watermark'}
                  </button>
                  <button onClick={handleReset} className="secondary">
                    🔄 Upload Another
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleDownload}>
                    💾 Download Result
                  </button>
                  <button onClick={handleReset} className="secondary">
                    🔄 Process Another
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </main>
      <footer>
        <p>Made with ❤️ using AI | © 2025 ClearMark</p>
      </footer>
    </div>
  )
}

export default App
