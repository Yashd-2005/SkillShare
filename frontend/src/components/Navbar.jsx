import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlayCircle, FiLogOut, FiPlusCircle, FiSearch } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-50 p-2.5 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <FiPlayCircle className="text-xl text-indigo-600" />
            </div>
            <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              SkillShare
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <FiSearch />
            </div>
            <input 
              type="text" 
              placeholder="Search for courses, skills, or topics..." 
              className="w-full bg-slate-100 border border-transparent rounded-full py-2.5 pl-12 pr-6 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition-all placeholder-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/?search=${encodeURIComponent(e.target.value.trim())}`);
                  e.target.value = '';
                }
              }}
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {user ? (
              <>
                <Link to="/add-video" className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-5 py-2.5 rounded-full transition-all border border-slate-200 hover:border-indigo-200">
                  <FiPlusCircle /> Upload
                </Link>
                <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                <Link title="Dashboard" to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <img src={user.avatar} alt="avatar" className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
                  <span className="hidden sm:block text-sm font-medium text-slate-700">{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-full transition-colors border border-slate-200 hover:border-red-100 ml-1">
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-2">Log in</Link>
                <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full transition-all shadow-md shadow-indigo-600/20">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
