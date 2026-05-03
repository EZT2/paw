/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type ReactNode, useEffect, type FormEvent } from 'react';
import { Map as MapIcon, Search, User, MessageCircle, Globe, History, Tag, ChevronRight, Heart, Camera, Plus, X, Navigation, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { type Cat, CatStatus, type Comment } from './types';
import { CommentWidget } from './components/CommentWidget';

type View = 'map' | 'discover' | 'profile' | 'cat-detail' | 'check-in';

export default function App() {
  const [activeView, setActiveView] = useState<View>('map');
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [cats, setCats] = useState<Cat[]>(INITIAL_CATS);
  const [commentText, setCommentText] = useState('');

  // Form State for Check-in
  const [newCat, setNewCat] = useState<Partial<Cat>>({
    name: '',
    description: '',
    status: CatStatus.STRAY,
    tags: [],
    comments: [], // Initialize comments array
  });
  const [isLocating, setIsLocating] = useState(false);

  const navigateToCat = (cat: Cat) => {
    setSelectedCat(cat);
    setActiveView('cat-detail');
  };

  const handlePostComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedCat) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      user: '我 (ME)',
      text: commentText,
      language: 'zh',
      timestamp: '刚刚',
    };

    const updatedCat = {
      ...selectedCat,
      comments: [newComment, ...selectedCat.comments],
    };

    setCats(prev => prev.map(c => c.id === selectedCat.id ? updatedCat : c));
    setSelectedCat(updatedCat);
    setCommentText('');
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewCat(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: '当前位置 (Current Location)'
          }
        }));
        setIsLocating(false);
      }, (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
      });
    }
  };

  const handleCheckInSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Add privacy protection - Auto-blur faces or license plates in images
    
    const cat: Cat = {
      ...(newCat as any),
      id: Math.random().toString(36).substr(2, 9),
      photoUrl: newCat.photoUrl || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000',
      checkInDate: new Date().toISOString().split('T')[0],
      location: newCat.location || { lat: 35.6584, lng: 139.7013 }, // Default to Shibuya if no GPS
    };

    setCats(prev => [cat, ...prev]);
    setNewCat({ name: '', description: '', status: CatStatus.STRAY, tags: [] });
    setActiveView('discover');
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-natural-bg overflow-hidden relative shadow-2xl text-natural-text">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-natural-accent rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-natural-dark">PawAtlas</h1>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveView('check-in')}
             className="w-8 h-8 bg-natural-orange rounded-full flex items-center justify-center text-natural-accent"
           >
             <Plus className="w-5 h-5" />
           </button>
           <div className="w-8 h-8 bg-natural-orange rounded-full border-2 border-white overflow-hidden shadow-sm">
             <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 relative">
        <AnimatePresence mode="wait">
          {activeView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full relative bg-natural-map"
            >
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#FFB347_1px,transparent_1px)] bg-[length:30px_30px]" />
              
              {/* Map UI Overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl text-[10px] font-bold shadow-sm border border-natural-orange/20">
                Viewing: Global Network 🌍
              </div>
              
              {/* Custom Map Markers (Paw Icons) */}
              {cats.map((cat) => (
                <motion.div
                  key={cat.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute cursor-pointer"
                  style={{ 
                    top: `${(cat.location.lat % 1) * 100}%`, // Simple visual placement for mockup
                    left: `${(cat.location.lng % 1) * 100}%` 
                  }}
                  onClick={() => navigateToCat(cat)}
                >
                  <div className="bg-natural-accent p-1 rounded-full shadow-lg border-2 border-white transform hover:scale-110 active:scale-95 transition-all">
                    <div className="w-8 h-8 bg-white rounded-full overflow-hidden flex items-center justify-center text-sm">
                      🐾
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center font-bold border border-natural-orange/20">+</button>
                <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center font-bold border border-natural-orange/20">-</button>
              </div>
            </motion.div>
          )}

          {activeView === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-serif">发现猫咪</h2>
                <p className="text-xs text-[#A89078] mt-1">遇见世界各地的治愈瞬间</p>
              </div>

              <div className="grid gap-4">
                {cats.map((cat) => (
                  <motion.div
                    key={cat.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigateToCat(cat)}
                    className="natural-card p-4 flex gap-4 cursor-pointer hover:border-natural-accent transition-colors"
                  >
                    <div className="w-20 h-20 rounded-[20px] bg-natural-orange overflow-hidden flex-shrink-0 border-2 border-natural-orange/30">
                      <img src={cat.photoUrl} alt={cat.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-serif text-lg leading-tight">{cat.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[9px] px-2 py-0.5 bg-natural-orange text-natural-accent font-bold rounded-full uppercase tracking-wider">
                          {cat.status}
                        </span>
                        {cat.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] px-2 py-0.5 bg-natural-cream rounded-full">{tag}</span>
                        ))}
                      </div>
                      <p className="text-[10px] mt-2 opacity-60 flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> {cat.location.address || '未知位置'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 self-center opacity-30" />
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setActiveView('check-in')}
                className="natural-button w-full"
              >
                <Plus className="w-5 h-5" /> 我也要拍猫
              </button>
            </motion.div>
          )}

          {activeView === 'cat-detail' && selectedCat && (
            <motion.div
              key="detail"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white h-full overflow-y-auto"
            >
              <div className="relative h-80">
                <img src={selectedCat.photoUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button 
                  onClick={() => setActiveView('discover')}
                  className="absolute top-6 left-6 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg"
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
              </div>

              <div className="p-8 -mt-10 bg-white rounded-t-[48px] relative border-t border-natural-orange/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-serif">{selectedCat.name}</h2>
                    <p className="text-sm text-[#A89078] mt-1 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {selectedCat.location.address}
                    </p>
                  </div>
                  <button className="p-4 bg-natural-cream rounded-3xl border border-natural-orange/30">
                    <Heart className="w-6 h-6 text-natural-accent" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-natural-orange text-natural-accent text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {selectedCat.status}
                  </span>
                  {selectedCat.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-natural-cream text-natural-text text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-8">
                  <section>
                    <div className="text-sm border-l-4 border-natural-accent pl-4 italic opacity-80 leading-relaxed">
                      {selectedCat.description}
                    </div>
                  </section>

                  <section className="border-t border-natural-orange/10 pt-8 pb-12">
                    <div className="flex items-center justify-between mb-4 font-bold">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-natural-accent" /> 社区动态
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      {selectedCat.comments.length > 0 ? (
                        selectedCat.comments.map((comment) => (
                          <CommentWidget key={comment.id} comment={comment} />
                        ))
                      ) : (
                        <div className="text-center py-8 opacity-30 text-xs">
                          还没有猫友留言，快来占领沙发喵～
                        </div>
                      )}
                    </div>

                    <form onSubmit={handlePostComment} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="留下你的治愈瞬间..." 
                        className="flex-1 bg-natural-bg/50 border-none rounded-xl px-4 text-xs focus:ring-1 focus:ring-natural-accent outline-none"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                      />
                      <button type="submit" className="natural-button py-2 px-4 text-xs">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </section>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'check-in' && (
            <motion.div
              key="check-in"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white h-full p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif">记录这只猫</h2>
                <button onClick={() => setActiveView('discover')} className="p-2 bg-natural-bg rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCheckInSubmit} className="space-y-6 pb-20">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">猫咪称呼</label>
                  <input 
                    required
                    type="text" 
                    placeholder="例如: 芝麻, Mochi..." 
                    className="natural-input"
                    value={newCat.name}
                    onChange={e => setNewCat(prev => ({...prev, name: e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">猫咪魅力描述</label>
                  <textarea 
                    rows={3}
                    placeholder="它有什么特别的性格或习惯吗?" 
                    className="natural-input"
                    value={newCat.description}
                    onChange={e => setNewCat(prev => ({...prev, description: e.target.value}))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">身份状态</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(CatStatus).map(status => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => setNewCat(prev => ({...prev, status}))}
                        className={cn(
                          "px-2 py-3 rounded-xl text-[10px] font-bold border transition-all",
                          newCat.status === status 
                            ? "bg-natural-accent border-natural-accent text-white" 
                            : "bg-white border-natural-orange/50 grayscale opacity-60"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">地理位置</label>
                  <button 
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="w-full p-4 rounded-2xl bg-natural-orange/30 border border-dashed border-natural-accent/50 flex items-center justify-center gap-2 text-xs font-bold text-natural-accent"
                  >
                    {isLocating ? (
                      <span className="animate-pulse">正在获取 GPS...</span>
                    ) : (
                      <>{newCat.location ? '✅ 已锁定位置' : <><Navigation className="w-4 h-4" /> 获取当前位置</>}</>
                    )}
                  </button>
                  {newCat.location && (
                    <div className="text-[10px] text-center opacity-40">
                      {newCat.location.lat.toFixed(4)}, {newCat.location.lng.toFixed(4)}
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button type="submit" className="natural-button w-full">
                    确认打卡并上传
                  </button>
                  <p className="text-[10px] text-center mt-4 opacity-40">
                    * 记录猫咪时请保持距离，不要惊扰它们。
                  </p>
                </div>
              </form>
            </motion.div>
          )}

          {activeView === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-natural-orange rounded-[32px] mx-auto shadow-2xl ring-8 ring-white border-2 border-natural-orange/20 overflow-hidden flex items-center justify-center text-4xl">
                  🐱
                </div>
                <div>
                  <h2 className="text-2xl font-serif">猫咪体验官</h2>
                  <p className="text-xs text-[#A89078]">已记录 {cats.length} 个治愈瞬间</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="natural-card p-6 text-center">
                  <div className="text-2xl font-serif">24</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">地图足迹</div>
                </div>
                <div className="natural-card p-6 text-center">
                  <div className="text-2xl font-serif">156</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">收到的赞</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="px-2 text-[10px] font-bold uppercase tracking-widest opacity-40">设置</div>
                <div className="natural-card p-2">
                  <button className="w-full p-4 flex items-center justify-between text-sm hover:bg-natural-bg/50 transition-colors rounded-2xl">
                    <span>我的收藏</span>
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </button>
                  <button className="w-full p-4 flex items-center justify-between text-sm hover:bg-natural-bg/50 transition-colors rounded-2xl">
                    <span>隐私保护设置</span>
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Navigation */}
      <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-white px-2 py-2 rounded-full shadow-[0_20px_50px_rgba(255,179,71,0.2)] flex items-center gap-1 z-20">
        <NavButton 
          active={activeView === 'map'} 
          onClick={() => setActiveView('map')} 
          icon={<MapIcon className="w-5 h-5" />} 
          label="地图" 
        />
        <NavButton 
          active={activeView === 'discover' || activeView === 'cat-detail' || activeView === 'check-in'} 
          onClick={() => setActiveView('discover')} 
          icon={<Search className="w-5 h-5" />} 
          label="发现" 
        />
        <NavButton 
          active={activeView === 'profile'} 
          onClick={() => setActiveView('profile')} 
          icon={<User className="w-5 h-5" />} 
          label="档案" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "flex flex-col items-center gap-1 px-5 py-2 rounded-full transition-all duration-300",
        active ? "bg-natural-accent text-white scale-105 shadow-lg shadow-orange-200" : "text-natural-text opacity-40 hover:opacity-60"
      )}
    >
      {icon}
      <span className={cn("text-[9px] font-bold uppercase tracking-widest")}>{label}</span>
    </button>
  );
}

const INITIAL_CATS: Cat[] = [
  {
    id: '1',
    name: 'Mochi (麻糬)',
    photoUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=1000',
    description: '经常出现在西湖边的断桥附近。非常温柔，如果你有小鱼干，它会一直跟着你。',
    location: { lat: 30.2520, lng: 120.1550, address: '杭州 · 西湖 · 断桥' },
    status: CatStatus.STRAY,
    checkInDate: '2024-04-20',
    tags: ['温柔', '断桥常客', '吃货'],
    comments: [
      { id: 'c1', user: 'CatLover_Yuki', text: 'Mochi is so fluffy! I saw him yesterday.', language: 'en', timestamp: '2小时前' },
      { id: 'c2', user: '杭州小汤圆', text: '昨天断桥边没看到它，原来在这里晒太阳。', language: 'zh', timestamp: '5小时前' }
    ]
  },
  {
    id: '2',
    name: 'Sushi (寿司)',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000',
    description: '涩谷的深夜守护者，总是带着一种高冷的武士气质。',
    location: { lat: 35.6584, lng: 139.7013, address: '东京 · 涩谷 · Hachiko' },
    status: CatStatus.STRAY,
    checkInDate: '2024-03-12',
    tags: ['高冷', '日本', '黑猫'],
    comments: [
      { id: 'c3', user: 'NeoTokyo', text: 'とても可愛い猫ですね。涩谷の看板猫です。', language: 'ja', timestamp: '1天前' }
    ]
  }
];
