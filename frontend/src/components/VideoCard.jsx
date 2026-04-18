import { Link } from 'react-router-dom';
import { FiEye, FiCloud, FiMessageCircle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const VideoCard = ({ video }) => {
  const isCloudinary = video.sourceType === 'cloudinary';

  return (
    <Link to={`/video/${video._id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-2 left-2 bg-white/90 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md">
          {video.category}
        </div>
        <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-md text-slate-600 shadow-sm backdrop-blur-md" title={isCloudinary ? "Hosted on Cloudinary" : "Telegram Link"}>
          {isCloudinary ? <FiCloud size={14} className="text-indigo-500"/> : <FiMessageCircle size={14} className="text-blue-500"/>}
        </div>
        
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
           <div className="opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 bg-white text-indigo-600 rounded-full px-5 py-2.5 font-semibold shadow-xl flex items-center gap-2">
             Watch Now
           </div>
        </div>
      </div>
      
      <div className="flex gap-3 px-1 pt-1">
        <img 
          src={video.uploader?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'} 
          alt={video.uploader?.username} 
          className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-200 flex-shrink-0"
        />
        <div className="flex flex-col overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium truncate">
            {video.uploader?.username || 'Unknown Creator'}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium">
            <span className="flex items-center gap-1"><FiEye /> {video.views}</span>
            <span>•</span>
            <span>{video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'Recently'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
