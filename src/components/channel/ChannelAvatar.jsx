import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'

export const ChannelAvatar = ({ channel, size = 'md' }) => (
  <Link to={`/channel/${channel?.username}`}>
    <Avatar src={channel?.avatar} alt={channel?.fullName} size={size} />
  </Link>
)