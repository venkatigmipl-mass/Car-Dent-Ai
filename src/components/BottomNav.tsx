import { Home, ScanLine, Calculator, CarFront, User } from 'lucide-react';

export type NavTab = 'Home' | 'Scan' | 'Estimate' | 'My Cars' | 'Profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

const NAV_ITEMS: Array<{ id: NavTab; label: string; icon: typeof Home }> = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Scan', label: 'Scan', icon: ScanLine },
  { id: 'Estimate', label: 'Estimate', icon: Calculator },
  { id: 'My Cars', label: 'My Cars', icon: CarFront },
  { id: 'Profile', label: 'Profile', icon: User },
];

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-white/10"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-5 h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`min-h-[44px] px-1 flex flex-col items-center justify-center gap-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#FF6B35] ${
                isActive
                  ? 'text-[#FF6B35]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
              <span className="text-[10px] sm:text-[11px] leading-none font-medium tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
