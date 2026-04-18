import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiLink, FiCloud, FiUpload } from 'react-icons/fi';

const AddVideo = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [uploadMethod, setUploadMethod] = useState('cloudinary'); // 'cloudinary' or 'telegram'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    tags: '',
    thumbnailUrl: '', // For telegram
    videoUrl: ''      // For telegram
  });
  
  const [fileData, setFileData] = useState({
    video: null,
    thumbnail: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFileData({ ...fileData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Publishing your video...');

    try {
      const token = localStorage.getItem('token');
      
      if (uploadMethod === 'telegram') {
        const payload = { ...formData, sourceType: 'telegram' };
        await axios.post('http://localhost:5000/api/videos', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Cloudinary Method (FormData)
        if (!fileData.video || !fileData.thumbnail) {
            toast.error('Both video and thumbnail files are required!', { id: toastId });
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('tags', formData.tags);
        data.append('sourceType', 'cloudinary');
        data.append('video', fileData.video);
        data.append('thumbnail', fileData.thumbnail);

        await axios.post('http://localhost:5000/api/videos', data, {
          headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
          }
        });
      }

      toast.success('Video published successfully!', { id: toastId });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload video', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Upload Content</h1>
        <p className="text-slate-500 mb-8 font-medium">Share your knowledge with the SkillShare community.</p>

        {/* Upload Method Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button 
                type="button"
                onClick={() => setUploadMethod('cloudinary')}
                className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all ${uploadMethod === 'cloudinary' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <FiCloud size={18}/> Native Upload
            </button>
            <button 
                type="button"
                onClick={() => setUploadMethod('telegram')}
                className={`flex-1 flex justify-center items-center gap-2 py-3 text-sm font-semibold rounded-xl transition-all ${uploadMethod === 'telegram' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <FiLink size={18}/> Telegram Link
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Course Title</label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleTextChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
              placeholder="e.g. Complete React.js Course for Beginners"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea 
              name="description" required value={formData.description} onChange={handleTextChange} rows="4"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all resize-none"
              placeholder="What will students learn in this video?"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <select 
                name="category" value={formData.category} onChange={handleTextChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
              >
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="DSA">DSA</option>
                <option value="Design">Design</option>
                <option value="Interview Prep">Interview Prep</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tags <span className="font-normal text-slate-400">(comma separated)</span></label>
              <input 
                type="text" name="tags" value={formData.tags} onChange={handleTextChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                placeholder="react, frontend, javascript"
              />
            </div>
          </div>

          {/* Conditional Media Inputs */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-6">
              {uploadMethod === 'telegram' ? (
                  <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Thumbnail URL</label>
                        <input 
                          type="url" name="thumbnailUrl" required={uploadMethod === 'telegram'} value={formData.thumbnailUrl} onChange={handleTextChange}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Telegram Video Link</label>
                        <input 
                          type="url" name="videoUrl" required={uploadMethod === 'telegram'} value={formData.videoUrl} onChange={handleTextChange}
                          className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all"
                          placeholder="https://t.me/your_channel/123"
                        />
                      </div>
                  </>
              ) : (
                  <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Thumbnail Image File</label>
                        <input 
                          type="file" name="thumbnail" accept="image/*" required={uploadMethod === 'cloudinary'} onChange={handleFileChange}
                          className="w-full block text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Video File</label>
                        <input 
                          type="file" name="video" accept="video/*" required={uploadMethod === 'cloudinary'} onChange={handleFileChange}
                          className="w-full block text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                        />
                        <p className="text-xs text-slate-500 mt-2">Max limit defined by your Cloudinary plan (default 100MB).</p>
                      </div>
                  </>
              )}
          </div>

          <div className="pt-6">
            <button 
              type="submit" disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                 <div className="animate-spin h-5 w-5 border-2 border-white/40 border-t-white rounded-full"></div>
              ) : (
                 <><FiUpload size={18}/> Publish Content</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVideo;
