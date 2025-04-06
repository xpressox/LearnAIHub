import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  link?: {
    text: string;
    url: string;
  };
}

export default function StatsCard({
  title,
  value,
  icon,
  borderColor,
  iconBgColor,
  iconColor,
  trend,
  link
}: StatsCardProps) {
  return (
    <Card className={cn("p-5 border-l-4", borderColor)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={cn("p-3 rounded-full", iconBgColor)}>
          <div className={cn(iconColor)}>{icon}</div>
        </div>
      </div>
      {trend && (
        <p className={cn("text-sm mt-2", trend.isPositive ? "text-green-500" : "text-red-500")}>
          {trend.isPositive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1 lucide lucide-trending-up">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1 lucide lucide-trending-down">
              <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/>
              <polyline points="16 17 22 17 22 11"/>
            </svg>
          )}
          {trend.value}
        </p>
      )}
      {link && (
        <div className="mt-4">
          <a href={link.url} className={cn("text-sm hover:underline", iconColor)}>{link.text}</a>
        </div>
      )}
    </Card>
  );
}
