// components/ImageUploader.tsx
'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void
  maxImages?: number
}

export function ImageUploader({ onImagesSelected, maxImages = 6 }: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...selectedFiles, ...acceptedFiles].slice(0, maxImages)
    setSelectedFiles(newFiles)
    onImagesSelected(newFiles)
  }, [selectedFiles, onImagesSelected, maxImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: maxImages - selectedFiles.length
  })

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onImagesSelected(newFiles)
  }

  return (
    <div className="space-y-4">
      {selectedFiles.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blush-400 bg-blush-50 dark:bg-blush-950'
              : 'border-border hover:border-blush-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-blush-600 dark:text-blush-400">Drop your photos here...</p>
          ) : (
            <>
              <p className="font-medium text-foreground mb-1">
                Click or drag photos here
              </p>
              <p className="text-sm text-muted-foreground">
                Upload up to {maxImages} images
              </p>
            </>
          )}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx + 1}`}
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => removeFile(idx)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
