import React from 'react';
import type { ProductVariant } from '@/types/product';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selected: Record<string, string>;
  onChange: (label: string, option: string) => void;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ variants, selected, onChange }) => {
  if (variants.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
        Configuration Options
      </h3>
      {variants.map((variant) => (
        <div key={variant.label}>
          <p className="text-sm font-bold mb-2">
            {variant.label}
            {selected[variant.label] && (
              <span className="ml-2 text-primary font-semibold">{selected[variant.label]}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((opt) => {
              const isSelected = selected[variant.label] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => onChange(variant.label, opt)}
                  className={`px-3 py-1.5 text-xs font-semibold border rounded transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Configuration summary */}
      {Object.keys(selected).length > 0 && (
        <div className="bg-muted/50 border border-border rounded p-3 mt-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1.5">
            Selected Configuration
          </p>
          <ul className="space-y-0.5">
            {Object.entries(selected).map(([label, value]) => (
              <li key={label} className="flex gap-2 text-xs">
                <span className="text-muted-foreground w-28 shrink-0">{label}:</span>
                <span className="font-semibold text-foreground">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
