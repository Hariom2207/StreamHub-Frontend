// KYA KAAM KARTA HAI:
//   Drag-and-drop video upload form.
//   Progress bar real-time dikhata hai.
//   useUploadVideo mutation use karta hai.

// BACKEND CONNECTION:
//   POST /videos — multipart/form-data
//   Fields: videoFile, thumbnail, title, description, isPublished
// ============================================================



import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useUploadVideo } from '@/queries/useVideoQuery'
import { Button } from '@/components/ui/Button'

export const VideoUploadForm = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { mutate: upload, isPending } = useUploadVideo()

  const [videoFile,        setVideoFile]        = useState(null)
  const [thumbFile,        setThumbFile]        = useState(null)
  const [thumbPreview,     setThumbPreview]     = useState(null)
  const [uploadProgress,   setUploadProgress]   = useState(0)
  const [dragOver,         setDragOver]         = useState(false)

  const videoInputRef = useRef(null)
  const thumbInputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('video/')) setVideoFile(file)
  }

  const handleThumbSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setThumbFile(file)
    setThumbPreview(URL.createObjectURL(file))
  }

  const onSubmit = (data) => {
    if (!videoFile) return
    const formData = new FormData()
    formData.append('video',    videoFile)
    formData.append('title',        data.title)
    formData.append('description',  data.description || '')
    formData.append('isPublished',  data.isPublished ? 'true' : 'false')
    if (thumbFile) formData.append('thumbnail', thumbFile)

    upload(
      {
        formData,
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded / e.total) * 100)),
      },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      {!videoFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => videoInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
            dragOver ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-red-400'
          }`}
        >
          <div className="text-5xl">🎬</div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Drag & drop or click to select</p>
          <p className="text-xs text-gray-400">MP4, WebM up to 100MB</p>
          <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <span className="text-2xl">✅</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{videoFile.name}</p>
            <p className="text-xs text-gray-500">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
          <button onClick={() => setVideoFile(null)} className="text-gray-400 hover:text-red-500">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
          <input
            {...register('title', { required: 'Title is required', maxLength: { value: 100, message: 'Max 100 chars' } })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Video title"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            placeholder="Describe your video..."
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
          <div className="flex items-center gap-3">
            {thumbPreview && <img src={thumbPreview} alt="thumb" className="w-28 aspect-video object-cover rounded-lg" />}
            <button type="button" onClick={() => thumbInputRef.current?.click()} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              {thumbPreview ? 'Change' : 'Add thumbnail'}
            </button>
            <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbSelect} />
          </div>
        </div>

        {/* Publish */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" {...register('isPublished')} defaultChecked className="w-4 h-4 accent-red-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Publish immediately</span>
        </label>

        {/* Progress */}
        {isPending && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Uploading...</span><span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button type="submit" isLoading={isPending} disabled={!videoFile || isPending}>Upload</Button>
        </div>
      </form>
    </div>
  )
}