import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UploadCloud, 
  CheckSquare, 
  Archive, 
  Menu, 
  Moon, 
  LogOut,
  ChevronDown,
  FileText,
  Star,
  BarChart3,
  Search,
  Bell,
  MoreVertical,
  X
} from 'lucide-react';

const App = () => {
  // Separate states for desktop and mobile sidebar handling
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle header styling on scroll for a premium feel
  useEffect(() => {
    const handleScroll = (e) => {
      setScrolled(e.target.scrollTop > 10);
    };
    const mainArea = document.getElementById('main-scroll-area');
    if (mainArea) {
      mainArea.addEventListener('scroll', handleScroll);
      return () => mainArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Mock Data
  const stats = [
    { title: 'Total Guru', value: '2', subtitle: 'Guru terdaftar', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Dokumen Terkumpul', value: '69%', subtitle: 'Kelengkapan dokumen', icon: FileText, color: 'text-amber-500', bgColor: 'bg-amber-50' },
    { title: 'Rata-rata Nilai', value: '3.81', subtitle: 'Skala 1-5', icon: Star, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { title: 'Evaluasi Selesai', value: '2', subtitle: '2 guru total', icon: BarChart3, color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
  ];

  const teachers = [
    { id: 1, name: 'Sandi', docs: '3/8', progress: 38, score: '3.00', category: 'Baik', status: 'Belum' },
    { id: 2, name: 'Andika Prasetiyo', docs: '8/8', progress: 100, score: '4.63', category: 'Sangat Baik', status: 'Lengkap' },
  ];

  const quickActions = [
    { 
      title: 'Kelola Pengguna', desc: 'Manajemen akun', icon: Users,
      colorClass: 'text-blue-600', bgClass: 'bg-blue-100', 
      hoverBorder: 'hover:border-blue-300', hoverBg: 'hover:bg-blue-50/50', textHover: 'group-hover:text-blue-700'
    },
    { 
      title: 'Semester', desc: 'Atur periode', icon: Calendar,
      colorClass: 'text-violet-600', bgClass: 'bg-violet-100', 
      hoverBorder: 'hover:border-violet-300', hoverBg: 'hover:bg-violet-50/50', textHover: 'group-hover:text-violet-700'
    },
    { 
      title: 'Progress Upload', desc: 'Pantau dokumen', icon: FileText,
      colorClass: 'text-amber-600', bgClass: 'bg-amber-100', 
      hoverBorder: 'hover:border-amber-300', hoverBg: 'hover:bg-amber-50/50', textHover: 'group-hover:text-amber-700'
    },
    { 
      title: 'Evaluasi', desc: 'Penilaian kinerja', icon: BarChart3,
      colorClass: 'text-emerald-600', bgClass: 'bg-emerald-100', 
      hoverBorder: 'hover:border-emerald-300', hoverBg: 'hover:bg-emerald-50/50', textHover: 'group-hover:text-emerald-700'
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR (Responsive: Drawer on Mobile, Collapsible on Desktop) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col justify-between
          transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
          lg:static lg:translate-x-0 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-[280px] // Mobile width
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
                E
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'}`}>
                <h1 className="font-bold text-sm leading-tight text-slate-900 tracking-tight whitespace-nowrap">E-KINERJA GURU</h1>
                <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">SD N 1 Pancor</p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button 
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" isActive={true} isCollapsed={isDesktopCollapsed} />
            <NavItem icon={Users} label="Manajemen Pengguna" isCollapsed={isDesktopCollapsed} />
            <NavItem icon={Calendar} label="Semester" isCollapsed={isDesktopCollapsed} />
            <NavItem icon={UploadCloud} label="Progress Upload" isCollapsed={isDesktopCollapsed} />
            <NavItem icon={CheckSquare} label="Evaluasi" isCollapsed={isDesktopCollapsed} />
            <NavItem icon={Archive} label="Arsip" isCollapsed={isDesktopCollapsed} />
          </nav>

          {/* User Profile Mini */}
          <div className="p-4 border-t border-slate-100 shrink-0">
             <div className={`flex items-center gap-3 ${isDesktopCollapsed ? 'lg:justify-center' : ''} p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group`}>
                <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-medium text-sm shrink-0 ring-2 ring-transparent group-hover:ring-slate-200 transition-all">
                  A
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'}`}>
                  <p className="text-sm font-semibold text-slate-900 truncate whitespace-nowrap">Administrator</p>
                  <p className="text-[11px] text-slate-500 whitespace-nowrap">Super Admin</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        
        {/* HEADER */}
        <header 
          className={`h-16 shrink-0 bg-white/80 backdrop-blur-xl border-b transition-all duration-200 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8
            ${scrolled ? 'border-slate-200 shadow-sm' : 'border-transparent'}
          `}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button 
              onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
              className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            
            {/* Search - Decorative */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2 w-48 lg:w-72 border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Cari menu atau guru..." 
                className="bg-transparent border-none outline-none pl-2.5 text-sm w-full placeholder-slate-400 text-slate-700" 
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search icon for mobile only */}
            <button className="sm:hidden p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <Search size={20} />
            </button>
            
            <button className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Mode Gelap">
              <Moon size={20} />
            </button>
            <button className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative" title="Notifikasi">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-1 sm:mx-2 hidden sm:block"></div>
            
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* MAIN SCROLLABLE AREA */}
        <main id="main-scroll-area" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            
            {/* Page Title & Semester Selector */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dashboard Admin</h2>
                <p className="text-sm text-slate-500 mt-1 sm:mt-1.5">Pantau ringkasan kinerja dan kelengkapan dokumen guru.</p>
              </div>
              <button className="flex justify-between items-center w-full sm:w-auto gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow transition-all group">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-slate-700">Semester Ganjil 25/26</span>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Aktif</span>
                </div>
                <ChevronDown size={16} className="text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1.5">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{stat.value}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                      <stat.icon size={24} className={stat.color} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-medium text-slate-400">
                    <span>{stat.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Section: Chart & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart Card */}
              <div className="lg:col-span-1 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="mb-6">
                  <h3 className="text-base font-bold text-slate-900">Distribusi Kategori</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Hasil evaluasi berdasarkan kategori</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                  <div className="relative w-40 h-40">
                    {/* Minimalist & Clean SVG Donut Chart */}
                    <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90">
                      {/* Background Track */}
                      <circle cx="21" cy="21" r="15.91549431" fill="transparent" stroke="#F8FAFC" strokeWidth="3.5"></circle>
                      
                      {/* B - Baik Segment (Blue) */}
                      <circle cx="21" cy="21" r="15.91549431" fill="transparent" stroke="#3B82F6" strokeWidth="3.5" 
                              strokeDasharray="48.5 51.5" strokeDashoffset="0" className="transition-all duration-1000 ease-out"></circle>
                              
                      {/* A - Sangat Baik Segment (Emerald) */}
                      <circle cx="21" cy="21" r="15.91549431" fill="transparent" stroke="#10B981" strokeWidth="3.5" 
                              strokeDasharray="48.5 51.5" strokeDashoffset="-50" className="transition-all duration-1000 ease-out"></circle>
                    </svg>
                    
                    {/* Inner Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-slate-800 tracking-tight">2</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</span>
                    </div>
                  </div>

                  {/* Premium Legend */}
                  <div className="flex items-center justify-center gap-5 sm:gap-6 mt-8 w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                      <span className="text-xs text-slate-600 font-medium">A - Sangat Baik</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                      <span className="text-xs text-slate-600 font-medium">B - Baik</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Aksi Cepat</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Pintasan operasional E-KINERJA</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
                  {quickActions.map((action, index) => (
                    <div key={index} className={`group p-4 rounded-xl border border-slate-100 ${action.hoverBorder} ${action.hoverBg} cursor-pointer transition-all duration-200 flex items-start gap-4 active:scale-[0.98]`}>
                      <div className={`w-12 h-12 rounded-xl ${action.bgClass} group-hover:bg-white group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all duration-200`}>
                        <action.icon size={22} className={`${action.colorClass} transition-colors group-hover:scale-110`} />
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className={`text-sm font-bold text-slate-800 ${action.textHover} transition-colors`}>{action.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{action.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section: Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white relative z-10">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Monitoring Kinerja Guru</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Pantau kelengkapan dokumen dan evaluasi</p>
                </div>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors active:scale-95 w-full sm:w-auto">
                  Lihat Semua Data
                </button>
              </div>
              
              {/* Responsive Table Wrapper with shadow cue on scroll */}
              <div className="overflow-x-auto relative shadow-[inset_-12px_0_15px_-10px_rgba(0,0,0,0.05)] sm:shadow-none">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 pl-5 sm:pl-6">Nama Guru</th>
                      <th className="p-4">Dokumen</th>
                      <th className="p-4">Progress Upload</th>
                      <th className="p-4">Nilai</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-5 sm:pr-6 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-4 pl-5 sm:pl-6">
                          <span className="font-semibold text-slate-800">{teacher.name}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                            <FileText size={14} /> {teacher.docs}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-full max-w-[120px] h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${teacher.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                                style={{ width: `${teacher.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold text-slate-600 w-8">{teacher.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-700">{teacher.score}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                            teacher.category === 'Sangat Baik' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {teacher.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            teacher.status === 'Lengkap' 
                              ? 'bg-slate-50 text-slate-700 border-slate-200' 
                              : 'bg-red-50 text-red-700 border-red-100'
                          }`}>
                            {teacher.status === 'Lengkap' ? (
                              <><CheckSquare size={12} className="mr-1.5 text-slate-500" /> Lengkap</>
                            ) : (
                              <><div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse"></div> Belum</>
                            )}
                          </span>
                        </td>
                        <td className="p-4 pr-5 sm:pr-6 text-center">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-indigo-50 active:scale-95" aria-label="More options">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Item Component
const NavItem = ({ icon: Icon, label, isActive, isCollapsed }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
        isActive 
          ? 'bg-indigo-50 text-indigo-700 font-bold' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
      }`}
      title={isCollapsed ? label : ""}
    >
      <Icon size={20} className={`${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} shrink-0`} />
      <span className={`text-sm truncate transition-all duration-300 ${isCollapsed ? 'lg:opacity-0 lg:w-0' : 'opacity-100 w-auto'}`}>
        {label}
      </span>
      
      {/* Active Indicator Line */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-indigo-600 rounded-r-full hidden lg:block"></div>
      )}
    </a>
  );
};

export default App;