import React, { useState, useEffect } from 'react';
import { ExternalLink, DollarSign, TrendingUp, ArrowRight, RefreshCcw } from 'lucide-react';
import type { FantasyPlayer } from '../fantasyData';

interface FreeAgencyNews {
  id: string;
  type: 'signed' | 'traded' | 'released' | 'rumored';
  playerName: string;
  position: string;
  oldTeam: string;
  newTeam: string;
  sport: string;
  details: string;
  contractValue?: string;
  date: string;
  source: string;
}

const FA_NEWS: FreeAgencyNews[] = [
  { id: 'fa-1', type: 'signed', playerName: 'Kirk Cousins', position: 'QB', oldTeam: 'MIN', newTeam: 'ATL', sport: 'NFL', details: '4-year, $180M deal with $100M guaranteed. Bringing veteran leadership to Atlanta\'s offense.', contractValue: '$180M/4yr', date: '2 days ago', source: 'ESPN' },
  { id: 'fa-2', type: 'signed', playerName: 'Saquon Barkley', position: 'RB', oldTeam: 'NYG', newTeam: 'PHI', sport: 'NFL', details: '3-year, $37.75M deal. Eagles add a dynamic weapon to their backfield.', contractValue: '$37.75M/3yr', date: '3 days ago', source: 'NFL Network' },
  { id: 'fa-3', type: 'traded', playerName: 'Justin Fields', position: 'QB', oldTeam: 'CHI', newTeam: 'PIT', sport: 'NFL', details: 'Traded for a conditional 6th-round pick. Steelers take a flier on the young QB.', date: '1 week ago', source: 'ESPN' },
  { id: 'fa-4', type: 'released', playerName: 'Odell Beckham Jr.', position: 'WR', oldTeam: 'BAL', newTeam: 'FA', sport: 'NFL', details: 'Released after underwhelming season. Multiple teams showing interest.', date: '5 days ago', source: 'CBS Sports' },
  { id: 'fa-5', type: 'rumored', playerName: 'Davante Adams', position: 'WR', oldTeam: 'LV', newTeam: 'NYJ', sport: 'NFL', details: 'Trade rumors swirling. Jets reportedly willing to offer a 2nd-round pick.', date: '1 day ago', source: 'The Athletic' },
  { id: 'fa-6', type: 'signed', playerName: 'Derrick Henry', position: 'RB', oldTeam: 'TEN', newTeam: 'BAL', sport: 'NFL', details: '2-year, $16M deal. Ravens add a power runner to complement Lamar Jackson.', contractValue: '$16M/2yr', date: '4 days ago', source: 'ESPN' },
  { id: 'fa-7', type: 'traded', playerName: 'Kyler Murray', position: 'QB', oldTeam: 'ARI', newTeam: 'MIN', sport: 'NFL', details: 'Blockbuster trade sending Murray to Vikings for two 1st-round picks.', date: '1 week ago', source: 'NFL Network' },
  // College football transfers
  { id: 'fa-8', type: 'signed', playerName: 'Caleb Downs', position: 'S', oldTeam: 'ALA', newTeam: 'OSU', sport: 'College FB', details: 'Top transfer portal pickup. Downs immediately becomes a leader for Ohio State defense.', date: '2 weeks ago', source: '247Sports' },
  { id: 'fa-9', type: 'traded', playerName: 'Dante Moore', position: 'QB', oldTeam: 'UCLA', newTeam: 'ORE', sport: 'College FB', details: 'Former 5-star QB enters transfer portal, lands at Oregon with 3 years eligibility.', date: '1 week ago', source: 'On3' },
  // College basketball
  { id: 'fa-10', type: 'signed', playerName: 'Hunter Dickinson', position: 'C', oldTeam: 'MICH', newTeam: 'KU', sport: 'College BB', details: 'Major transfer portal win for Kansas. All-American center fills a huge need.', date: '3 weeks ago', source: 'The Athletic' },
];

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  signed: { label: 'SIGNED', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  traded: { label: 'TRADED', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  released: { label: 'RELEASED', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  rumored: { label: 'RUMOR', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
};

export const FreeAgency: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [sportFilter, setSportFilter] = useState<string>('all');

  const filtered = FA_NEWS.filter(n => {
    if (filter !== 'all' && n.type !== filter) return false;
    if (sportFilter !== 'all' && n.sport !== sportFilter) return false;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Free Agency & Transfers</h3>
          <p className="text-[9px] text-neutral-500">Latest signings, trades, and rumors</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {[{ id: 'all', label: 'All' }, { id: 'signed', label: 'Signed' }, { id: 'traded', label: 'Traded' }, { id: 'released', label: 'Released' }, { id: 'rumored', label: 'Rumors' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={`text-[9px] font-bold px-2.5 py-1 rounded-full transition-all ${filter === f.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-neutral-500 border border-white/10 hover:text-neutral-300'}`}>{f.label}</button>
        ))}
        <span className="mx-1 text-neutral-700">|</span>
        {[{ id: 'all', label: 'All Sports' }, { id: 'NFL', label: 'NFL' }, { id: 'College FB', label: 'College FB' }, { id: 'College BB', label: 'College BB' }].map(s => (
          <button key={s.id} onClick={() => setSportFilter(s.id === 'all' ? 'all' : s.id)} className={`text-[9px] font-bold px-2.5 py-1 rounded-full transition-all ${sportFilter === s.id ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-white/5 text-neutral-500 border border-white/10 hover:text-neutral-300'}`}>{s.label}</button>
        ))}
      </div>

      {/* News items */}
      <div className="space-y-2">
        {filtered.map(item => {
          const style = TYPE_STYLES[item.type];
          return (
            <div key={item.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/5 hover:bg-white/[0.06] transition-all">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${style.color}`}>{style.label}</span>
                    <span className="text-[9px] text-neutral-500">{item.sport}</span>
                    <span className="text-[8px] text-neutral-700">{item.date}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{item.playerName}</p>
                  <p className="text-[11px] text-neutral-300 mt-0.5">{item.details}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-bold text-neutral-500">{item.position}</span>
                    <span className="text-[9px] text-neutral-700">·</span>
                    <span className="text-[9px] text-neutral-400">{item.oldTeam}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-[9px] font-bold text-emerald-400">{item.newTeam}</span>
                    {item.contractValue && (
                      <>
                        <span className="text-[9px] text-neutral-700">·</span>
                        <span className="text-[9px] text-amber-400 font-bold">{item.contractValue}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-[8px] text-neutral-600 shrink-0">{item.source}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-6">
          <p className="text-xs text-neutral-500">No matching transactions</p>
        </div>
      )}
    </div>
  );
};