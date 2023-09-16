import React, { useEffect, useRef } from 'react'

// Khai báo type cho đối tượng Blob
type BlobType = Blob | null

function PDFViewer({ pdfBlob }: { pdfBlob: BlobType }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !pdfBlob) return

    const context = canvas.getContext('2d')
    if (!context) return // Kiểm tra null

    const reader = new FileReader()
    reader.onloadend = function () {
      const arrayBuffer = reader.result
      const context = canvas.getContext('2d')
      // Now you have the PDF data as an ArrayBuffer
      // You can proceed to rendering it on a canvas
    }
    reader.readAsArrayBuffer(pdfBlob)

    // Đọc dữ liệu từ Blob
  }, [pdfBlob])

  return <canvas ref={canvasRef}></canvas>
}

export default PDFViewer
