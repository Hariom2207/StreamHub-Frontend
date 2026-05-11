import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetChannel } from '@/queries/useUserQuery'
import { useGetVideos } from '@/queries/useVideoQuery'
import { useGetUserPlaylists } from '@/queries/usePlaylistQuery'
import { ChannelHeader } from '@/components/channel/ChannelHeader'
import { VideoGrid } from '@/components/video/VideoGrid'
import { PlaylistGrid } from '@/components/playlist/PlaylistGrid'
import { TweetFeed } from '@/components/tweet/TweetFeed'
import { TweetInput } from '@/components/tweet/TweetInput'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/stores/auth.store'

const TABS = ['Videos', 'Playlists', 'Tweets']

export const ChannelPage = () => {
  const { username } = useParams()
   const { user } = useAuthStore()

// console.log("USERNAME FROM URL:", username)
// console.log("Store user:", user?.username);
 

  const [activeTab, setActiveTab] = useState('Videos')

  // ================= CHANNEL =================
  const {
    data: channelResponse,
    isLoading: loadingChannel,
    isError
  } = useGetChannel(username)

  //  actual backend data
  const channel = channelResponse
//   console.log("channelResponse:", channelResponse)
// console.log("channel:", channel)

  const channelId = channel?._id

  // console.log("channelId:", channelId)


  // ================= VIDEOS =================
  const {
    data: videosData,
    isLoading: loadingVideos
  } = useGetVideos(
    { userId: channelId },
    {
      enabled: !!channelId
    }
  )
// console.log("videosData:", videosData)

  // ================= PLAYLISTS =================
  const {
    data: playlists,
    isLoading: loadingPlaylists
  } = useGetUserPlaylists(channelId, {
    enabled: !!channelId
  })

  // ================= OWNER CHECK =================
  const isOwner =
    user?._id === channelId ||
    user?.username === channel?.username

  // ================= LOADING =================
  if (loadingChannel) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  // ================= ERROR =================
  if (isError || !channel) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium text-gray-900 dark:text-white">
          Channel not found
        </p>
      </div>
    )
  }

  // ================= VIDEOS FLATTEN =================
const videos = videosData?.pages?.flatMap((page) => {

  // console.log("each page:", page)  
  
  return page?.docs ?? page?.data?.docs ?? page?.videos ?? page ?? []
}) ?? []

// console.log("page[0] type:", typeof videosData?.pages?.[0])
// console.log("Array?:", Array.isArray(videosData?.pages?.[0]))

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <ChannelHeader channel={channel} />

      {/* ================= TABS ================= */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          const active = activeTab === tab

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                active
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* ================= VIDEOS ================= */}
      {activeTab === 'Videos' && (
        <VideoGrid
          videos={videos}
          isLoading={loadingVideos}
        />
      )}

      {/* ================= PLAYLISTS ================= */}
      {activeTab === 'Playlists' && (
        <PlaylistGrid
          playlists={playlists?.data ?? playlists ?? []}
          isLoading={loadingPlaylists}
        />
      )}

      {/* ================= TWEETS ================= */}
      {activeTab === 'Tweets' && (
        <div className="space-y-6">
          {isOwner && (
            <TweetInput userId={channelId} />
          )}

          <TweetFeed userId={channelId} />
        </div>
      )}
    </div>
  )
}