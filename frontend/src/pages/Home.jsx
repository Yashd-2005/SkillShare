import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { FiTrendingUp, FiCode, FiDatabase, FiMonitor, FiFigma } from 'react-icons/fi';

const categories = [
  { name: 'Latest', icon: <FiTrendingUp /> },
  { name: 'Web Development', icon: <FiMonitor /> },
  { name: 'Programming', icon: <FiCode /> },
  { name: 'DSA', icon: <FiDatabase /> },
  { name: 'Design', icon: <FiFigma /> },
];

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Latest');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:5000/api/videos?';
        
        let queryParams = [];
        if (activeCategory !== 'Latest') queryParams.push(`category=${activeCategory}`);
        if (searchQuery) queryParams.push(`search=${searchQuery}`);
        
        url += queryParams.join('&');

        const res = await axios.get(url);
        setVideos(res.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [activeCategory, searchQuery]);

  const handleStartExploring = () => {
    document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Refined Hero Section */}
      <div className="bg-indigo-50 rounded-3xl p-8 sm:p-12 mb-12 border border-indigo-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-white/40 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide mb-4">
            PHASE 2 UPGRADE
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
            Level up your skills with <span className="text-indigo-600">community-driven</span> learning.
          </h1>
          <p className="text-lg text-slate-600 mb-8 font-medium">
            Discover premium educational content curated by developers and designers worldwide. Now supporting cloud-native video hosting.
          </p>
          <button 
             onClick={handleStartExploring}
             className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-8 rounded-full shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            Start Exploring
          </button>
        </div>
      </div>

      {searchQuery && (
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Search results for: <span className="text-indigo-600">"{searchQuery}"</span></h2>
      )}

      {/* Category Tabs */}
      <div id="explore-section" className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide py-1">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
              activeCategory === cat.name
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-slate-200 border-t-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {videos.length > 0 ? (
            videos.map(video => <VideoCard key={video._id} video={video} />)
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                 <FiTrendingUp className="text-2xl text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No videos found</h3>
              <p className="text-slate-500 mt-1">Try selecting a different category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
