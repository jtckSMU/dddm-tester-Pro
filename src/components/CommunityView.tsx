import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, TrendingUp, Sparkles, User, Filter, Share2 } from 'lucide-react';
import { TradingIdea } from '../types';
import { communityIdeas } from '../data/marketData';

interface CommunityViewProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ onOpenAuth }) => {
  const [ideas, setIdeas] = useState<TradingIdea[]>(communityIdeas);
  const [filter, setFilter] = useState<'all' | 'Long' | 'Short' | 'Neutral'>('all');
  const [newIdeaText, setNewIdeaText] = useState('');
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaSymbol, setNewIdeaSymbol] = useState('SPX');
  const [isPosting, setIsPosting] = useState(false);

  const filteredIdeas = ideas.filter(i => filter === 'all' || i.direction === filter);

  const handleLike = (id: string) => {
    setIdeas(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    }));
  };

  const handlePublishIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle || !newIdeaText) return;

    const newEntry: TradingIdea = {
      id: `idea-${Date.now()}`,
      title: newIdeaTitle,
      author: 'You (Trader)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      symbol: newIdeaSymbol,
      direction: 'Long',
      timeframe: 'Daily',
      likes: 1,
      comments: 0,
      publishedAt: 'Just now',
      description: newIdeaText,
    };

    setIdeas([newEntry, ...ideas]);
    setNewIdeaTitle('');
    setNewIdeaText('');
    setIsPosting(false);
  };

  return (
    <div id="community-view" className="w-full py-8 md:py-12 bg-[#f7f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-bold text-3xl text-[#181c21] tracking-tight">
              Trader Community & Market Ideas
            </h2>
            <p className="text-sm text-[#6A6D78] mt-1">
              Read technical analysis, trade breakdowns, and quantitative strategies shared by top analysts.
            </p>
          </div>

          <button
            onClick={() => setIsPosting(!isPosting)}
            className="bg-[#2962ff] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0049db] transition-colors self-start md:self-auto shadow-xs"
          >
            {isPosting ? 'Cancel' : '+ Share Trading Idea'}
          </button>
        </div>

        {/* Post new idea box */}
        {isPosting && (
          <form onSubmit={handlePublishIdea} className="bg-white p-6 rounded-2xl border border-[#E0E3EB] shadow-md mb-8 animate-in fade-in duration-150 space-y-4">
            <h3 className="font-bold text-lg text-[#181c21]">Publish New Market Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                placeholder="Idea headline (e.g., S&P 500 Daily Bull Flag Breakout)"
                className="w-full px-3.5 py-2 text-sm bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg focus:outline-none focus:border-[#2962ff]"
              />
              <select
                value={newIdeaSymbol}
                onChange={(e) => setNewIdeaSymbol(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg focus:outline-none"
              >
                <option value="SPX">S&P 500 (SPX)</option>
                <option value="NDX">Nasdaq 100 (NDX)</option>
                <option value="AAPL">Apple (AAPL)</option>
                <option value="NVDA">NVIDIA (NVDA)</option>
                <option value="BTCUSD">Bitcoin (BTCUSD)</option>
              </select>
            </div>
            <textarea
              required
              rows={3}
              value={newIdeaText}
              onChange={(e) => setNewIdeaText(e.target.value)}
              placeholder="Describe your thesis, support/resistance levels, indicators used..."
              className="w-full px-3.5 py-2 text-sm bg-[#f7f9ff] border border-[#E0E3EB] rounded-lg focus:outline-none focus:border-[#2962ff]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-4 py-2 text-xs font-semibold text-[#6A6D78] hover:bg-[#f1f4fb] rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#0049db] text-white px-5 py-2 text-xs font-semibold rounded-lg hover:bg-[#003ab3]"
              >
                Publish to Feed
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A6D78] mr-2">Bias:</span>
          {(['all', 'Long', 'Short', 'Neutral'] as const).map((bias) => (
            <button
              key={bias}
              onClick={() => setFilter(bias)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === bias 
                  ? 'bg-[#0049db] text-white shadow-2xs' 
                  : 'bg-white text-[#434656] border border-[#E0E3EB] hover:bg-[#f1f4fb]'
              }`}
            >
              {bias === 'all' ? 'All Directions' : bias}
            </button>
          ))}
        </div>

        {/* Ideas Feed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-2xl p-6 border border-[#E0E3EB] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={idea.authorAvatar} 
                      alt={idea.author} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#E0E3EB]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#181c21]">{idea.author}</div>
                      <div className="text-[11px] text-[#6A6D78]">{idea.publishedAt}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    idea.direction === 'Long' ? 'bg-emerald-100 text-[#089981]' :
                    idea.direction === 'Short' ? 'bg-red-100 text-[#F23645]' :
                    'bg-gray-100 text-[#434656]'
                  }`}>
                    {idea.direction}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#f1f4fb] text-[#0049db]">
                    {idea.symbol}
                  </span>
                  <span className="text-xs text-[#6A6D78]">{idea.timeframe}</span>
                </div>

                <h3 className="font-bold text-base text-[#181c21] leading-snug mb-2 hover:text-[#0049db] cursor-pointer transition-colors">
                  {idea.title}
                </h3>
                <p className="text-xs text-[#434656] leading-relaxed line-clamp-3 mb-4">
                  {idea.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E0E3EB] text-xs text-[#6A6D78]">
                <button
                  onClick={() => handleLike(idea.id)}
                  className="flex items-center gap-1.5 hover:text-[#0049db] transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{idea.likes}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{idea.comments} comments</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
