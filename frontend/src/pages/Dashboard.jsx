import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import { FiVideo, FiBarChart2, FiUploadCloud } from 'react-icons/fi';

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      const fetchUserVideos = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/videos/user/${user._id}`);
          setVideos(res.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserVideos();
    }
  }, [user]);

  if (authLoading || !user) return null;

  const totalViews = videos.reduce((acc, v) => acc + v.views, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm mb-12">
        <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-full border border-slate-200 shadow-md object-cover" />
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{user.username}</h1>
          <p className="text-slate-500 mb-6 font-medium">{user.bio || 'Continuous learner and creator.'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-slate-50 px-6 py-4 rounded-2xl flex items-center gap-4 border border-slate-100 min-w-40">
               <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><FiVideo size={24}/></div>
               <div>
                 <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Uploads</p>
                 <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{videos.length}</p>
               </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 rounded-2xl flex items-center gap-4 border border-slate-100 min-w-40">
               <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><FiBarChart2 size={24}/></div>
               <div>
                 <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Views</p>
                 <p className="text-2xl font-bold text-slate-900 leading-none mt-1">{totalViews}</p>
               </div>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
           <Link to="/add-video" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-8 rounded-full shadow-lg shadow-indigo-600/20 transition-all inline-flex items-center gap-2">
              <FiUploadCloud size={20}/> Upload New
           </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
         <h2 className="text-2xl font-bold text-slate-900">My Uploads</h2>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-4 border-slate-200 border-t-indigo-600"></div></div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10">
          {videos.map(video => <VideoCard key={video._id} video={video} />)}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4 border border-slate-100">
             <FiVideo className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No videos uploaded yet</h3>
          <p className="text-slate-500 mt-2 font-medium">Start sharing your knowledge with the community.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
