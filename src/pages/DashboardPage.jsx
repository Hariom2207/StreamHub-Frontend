

import { useGetDashboardStats, useGetDashboardVideos } from '@/queries/useDashboardQuery'
import { useUIStore } from '@/stores/ui.store'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { VideoTable } from '@/components/dashboard/VideoTable'
import { VideoUploadForm } from '@/components/video/VideoUploadForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

export const DashboardPage = () => {
  const { data: stats,  isLoading: loadingStats  } = useGetDashboardStats()
  const { data: videos, isLoading: loadingVideos } = useGetDashboardVideos()
  const { activeModal, openModal, closeModal }      = useUIStore()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <Button onClick={() => openModal('upload')}>+ Upload Video</Button>
      </div>

      <StatsCard stats={stats} />

      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Your Videos</h2>
      <VideoTable videos={videos ?? []} isLoading={loadingVideos} />

      <Modal isOpen={activeModal === 'upload'} onClose={closeModal} title="Upload Video" maxWidth="max-w-xl">
        <VideoUploadForm onClose={closeModal} />
      </Modal>
    </div>
  )
}