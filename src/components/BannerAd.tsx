import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * Renders the 320x50 Banner Ad at the bottom of the Home screen.
 */
export function showBannerAd(): React.ReactElement {
  return (
    <aside
      aria-label="Sponsored automotive partner banner"
      className="w-full flex justify-center pt-2 pb-1"
    >
      <div className="w-[320px] h-[50px] rounded-xl bg-[#13131C] border border-white/10 px-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              Certified Body Shop Network
            </p>
            <p className="text-[11px] text-zinc-400 truncate">
              2-Year Paint &amp; Dent Warranty
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono-num text-zinc-500 shrink-0">
          Sponsored
        </span>
      </div>
    </aside>
  );
}
