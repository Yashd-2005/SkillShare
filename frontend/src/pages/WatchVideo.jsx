import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FiEye, FiExternalLink, FiShare2, FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';

const WatchVideo = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        setError('Video not found or server error');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  useEffect(() => {
      // Async trigger view count on mount when video loads naturally
      if (video) {
        axios.put(`http://localhost:5000/api/videos/${id}/view`).catch(e => console.error("Could not register view"));
      }
  }, [id, video?._id]);

  const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
  }

  const handleLike = () => {
      toast.success("Liked! (Coming soon in Phase 3)");
  }

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin h-10 w-10 border-t-4 border-slate-200 border-t-indigo-600 rounded-full"></div></div>;
  if (error) return <div className="text-center py-32 text-red-500 font-semibold text-lg">{error}</div>;
  if (!video) return null;

  const isCloudinary = video.sourceType === 'cloudinary';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Video Player Area */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 group shadow-2xl mb-8 border border-slate-200">
        
        {isCloudinary ? (
          <video 
             src={video.videoUrl} 
             poster={video.thumbnailUrl}
             controls 
             className="w-full h-full object-contain bg-black"
             playsInline
          />
        ) : (
            <>
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                  <a 
                      href={video.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl p-6 sm:p-8 shadow-2xl shadow-indigo-600/50 transform hover:scale-105 transition-all outline-none focus:ring-4 focus:ring-indigo-500/50 flex flex-col items-center gap-3"
                  >
                      <FiExternalLink className="text-3xl sm:text-4xl" />
                      <span className="font-bold sm:text-lg">Watch on Telegram</span>
                  </a>
              </div>
            </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div>
                <div className="flex gap-2 mb-4">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100">{video.category}</span>
                    {video.tags?.map(tag => (
                       <span key={tag} className="bg-slate-100 text-slate-600 font-medium text-xs px-3 py-1.5 rounded-full border border-slate-200">#{tag}</span>
                    ))}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 leading-tight">{video.title}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-500 font-medium border-b border-slate-200 pb-6 mb-6">
                    <span className="flex items-center gap-1.5"><FiEye size={16}/> {video.views + 1} views</span>
                    <span>•</span>
                    <span>Published {formatDistanceToNow(new Date(video.createdAt))} ago</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 text-lg">Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{video.description}</p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wider">About the Creator</h3>
                <div className="flex items-start gap-4">
                    <img src={video.uploader?.avatar} alt="avatar" className="w-14 h-14 rounded-full border border-slate-200 shadow-sm object-cover" />
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight">{video.uploader?.username}</h4>
                        <p className="text-sm text-slate-500 mt-1 font-medium">{video.uploader?.bio || 'Educational content creator.'}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleLike}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl py-3.5 flex items-center justify-center gap-2 font-bold transition-all shadow-sm"
                >
                    <FiHeart className="text-red-500" size={18} /> Like
                </button>
                <button 
                  onClick={handleShare}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl py-3.5 flex items-center justify-center gap-2 font-bold transition-all shadow-sm"
                >
                    <FiShare2 className="text-indigo-500" size={18} /> Share
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
