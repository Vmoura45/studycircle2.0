import React, { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface FileUploadProps {
  onUpload: (url: string) => void
  onError: (error: string) => void
  accept?: string
  maxSize?: number // in bytes
}

export default function FileUpload({
  onUpload,
  onError,
  accept = 'image/*,application/pdf',
  maxSize = 5 * 1024 * 1024, // 5MB default
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (!droppedFile) return

      if (!accept.split(',').some(type => {
        const [category, extension] = type.trim().split('/')
        return extension === '*' 
          ? droppedFile.type.startsWith(category)
          : droppedFile.type === type
      })) {
        onError('Invalid file type')
        return
      }

      if (droppedFile.size > maxSize) {
        onError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
        return
      }

      setFile(droppedFile)
      await uploadFile(droppedFile)
    },
    [accept, maxSize, onError]
  )

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > maxSize) {
      onError(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }

    setFile(selectedFile)
    await uploadFile(selectedFile)
  }

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      const { error: uploadError, data } = await supabase.storage
        .from('materials')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(filePath)

      onUpload(publicUrl)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      {!file && !uploading && (
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-indigo-600 hover:text-indigo-500">
                Upload a file
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept={accept}
                onChange={handleFileSelect}
              />
            </label>
            <p className="text-gray-500 mt-2">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Max file size: {maxSize / 1024 / 1024}MB
          </p>
        </>
      )}

      {file && !uploading && (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <span className="text-sm text-gray-900">{file.name}</span>
          <button
            onClick={removeFile}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {uploading && (
        <div className="text-sm text-gray-500">Uploading...</div>
      )}
    </div>
  )
}