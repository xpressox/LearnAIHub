import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  return (
    <div className="mb-6" data-tabs>
      <div className="border-b">
        <div className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "text-gray-500 border-b-2 border-transparent py-2 px-4 font-medium",
                activeTab === tab.id && "text-primary border-primary"
              )}
              onClick={() => setActiveTab(tab.id)}
              data-tab-target={tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          data-tab-content={tab.id}
          className={cn("py-4", activeTab !== tab.id && "hidden")}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
