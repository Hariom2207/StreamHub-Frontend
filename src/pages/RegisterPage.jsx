import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useRegister } from '@/queries/useUserQuery'
import { Button } from '@/components/ui/Button'
import { APP } from '@/constants/appConfig'

export const RegisterPage = () => {
  const { mutate: register_, isPending } = useRegister()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const avatarInputRef  = useRef(null)
  const coverInputRef   = useRef(null)

  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview,  setCoverPreview]  = useState(null)
  const [avatarFile,    setAvatarFile]    = useState(null)
  const [coverFile,     setCoverFile]     = useState(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const onSubmit = (data) => {
    if (!avatarFile) return

    const formData = new FormData()
    formData.append('fullName', data.fullName)
    formData.append('username', data.username.toLowerCase().trim())
    formData.append('email',    data.email)
    formData.append('password', data.password)
    formData.append('avatar',   avatarFile)
    if (coverFile) formData.append('coverImage', coverFile)

    register_(formData)
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-4xl mb-2">▶</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{APP.NAME}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create your account</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 space-y-4">

          {/* Avatar — REQUIRED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Avatar <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => avatarInputRef.current?.click()}
                className="w-16 h-16 rounded-full shrink-0 cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-400 transition-colors flex items-center justify-center bg-gray-50 dark:bg-gray-800"
              >
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-2xl">👤</span>
                }
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {avatarPreview ? 'Change' : 'Upload avatar'}
                </button>
                <p className="text-xs text-gray-400 mt-1">Required</p>
              </div>
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            {!avatarFile && <p className="text-xs text-red-500 mt-1">Avatar is required</p>}
          </div>

          {/* Cover Image — OPTIONAL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cover Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div
              onClick={() => coverInputRef.current?.click()}
              className="h-20 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-400 transition-colors cursor-pointer flex items-center justify-center bg-gray-50 dark:bg-gray-800"
            >
              {coverPreview
                ? <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                : <span className="text-sm text-gray-400">Click to upload cover</span>
              }
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input {...register('fullName', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })} className={inputClass} placeholder="John Doe" />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input
                {...register('username', {
                  required: 'Required',
                  minLength: { value: 3, message: 'Min 3 chars' },
                  pattern: { value: /^[a-z0-9_]+$/, message: 'Lowercase, numbers, underscore only' },
                })}
                className={`${inputClass} pl-7`}
                placeholder="johndoe"
              />
            </div>
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" {...register('email', { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} className={inputClass} placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password <span className="text-red-500">*</span></label>
            <input type="password" {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} className={inputClass} placeholder="••••••••" />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <Button
            className="w-full mt-2"
            isLoading={isPending}
            disabled={!avatarFile || isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Create Account
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}