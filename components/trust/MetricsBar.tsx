interface Metric {
  label: string;
  value: string;
}

interface MetricsBarProps {
  items: Metric[];
  className?: string;
}

export default function MetricsBar({ items, className = "" }: MetricsBarProps) {
  return (
    <div className={`py-12 bg-white border-t border-gray-200 ${className}`} data-testid="metrics-bar">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto section-spacing" role="list">
        {items.map((item, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-200/50 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center" data-testid="metric-item">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {item.value}
            </div>
            <div className="text-sm font-medium text-gray-600">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}