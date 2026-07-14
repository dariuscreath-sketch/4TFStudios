import React from 'react';
import { Phone, Heart, Shield } from 'lucide-react';

export const ResponsibleGaming: React.FC<{ variant?: 'footer' | 'banner' | 'inline' }> = ({ variant = 'footer' }) => {
  if (variant === 'banner') {
    return (
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-center">
        <p className="text-[10px] text-neutral-400 leading-relaxed">
          <span className="text-amber-400 font-bold">⚠️ Play Responsibly.</span> Sports betting should be fun, not a problem. 
          If you or someone you know has a gambling problem, help is available 24/7.
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <span className="text-[11px] font-bold text-emerald-400">1-800-GAMBLER</span>
          <span className="text-[11px] font-bold text-emerald-400">text CONNECT to 741741</span>
        </div>
      </div>
    );
  }

  return (
    <footer className="border-t border-white/5 mt-8 pt-6 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> ScoreVerse
            </h4>
            <p className="text-[10px] text-neutral-500 leading-relaxed">
              AI-powered sports scores, news, predictions, and community. Not affiliated with ESPN, NFL, NBA, or any sports league.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-400" /> Responsible Gaming
            </h4>
            <p className="text-[10px] text-neutral-500 leading-relaxed mb-2">
              All predictions are for informational purposes only. We do not guarantee outcomes. 
              Gambling problems? Help is available.
            </p>
            <div className="space-y-1">
              <a href="tel:18005224700" className="block text-[11px] text-emerald-400 hover:text-emerald-300 font-bold">📞 1-800-522-4700</a>
              <a href="tel:1800GAMBLER" className="block text-[11px] text-emerald-400 hover:text-emerald-300 font-bold">📞 1-800-GAMBLER</a>
              <a href="https://www.ncpgambling.org/chat" target="_blank" className="block text-[11px] text-emerald-400 hover:text-emerald-300 font-bold">💬 National Problem Gambling Helpline Chat</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" /> Crisis Resources
            </h4>
            <div className="space-y-1">
              <a href="tel:988" className="block text-[11px] text-blue-400 hover:text-blue-300 font-bold">📞 988 — Suicide & Crisis Lifeline</a>
              <a href="tel:741741" className="block text-[11px] text-blue-400 hover:text-blue-300 font-bold">📱 Text CONNECT to 741741</a>
              <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" className="block text-[11px] text-blue-400 hover:text-blue-300 font-bold">🏥 SAMHSA Helpline 1-800-662-4357</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-4 text-center">
          <p className="text-[9px] text-neutral-600">
            © 2026 ScoreVerse. All sports data provided by ESPN. All predictions are AI-generated and for entertainment only. 
            Must be 21+ to gamble. If you or someone you know has a gambling problem, call 1-800-GAMBLER.
          </p>
        </div>
      </div>
    </footer>
  );
};