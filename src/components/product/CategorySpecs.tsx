import React from 'react';
import { SPEC_LABELS } from '@/types/product';

interface CategorySpecsProps {
  category: string;
  specs: Record<string, string>;
}

const CategorySpecs: React.FC<CategorySpecsProps> = ({ category, specs }) => {
  const labelMap = SPEC_LABELS[category] ?? {};
  const entries = Object.entries(specs).filter(([, v]) => v);

  if (entries.length === 0) return null;

  return (
    <div className="border border-border rounded overflow-hidden mb-6">
      <div className="bg-brand-black text-white px-4 py-2.5 flex items-center gap-2">
        <span className="text-xs font-extrabold uppercase tracking-widest">Technical Specifications</span>
      </div>
      <div className="divide-y divide-border">
        {entries.map(([key, value]) => {
          const label = labelMap[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          return (
            <div key={key} className="flex items-start gap-4 px-4 py-2.5 hover:bg-muted/30 transition-colors">
              <span className="text-xs font-semibold text-muted-foreground w-36 shrink-0 pt-0.5">{label}</span>
              <span className="text-xs text-foreground flex-1 min-w-0">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySpecs;
