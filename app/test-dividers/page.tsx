// Test page to show all divider variants
import DataSourcesVariants from '@/components/DataSourcesVariants';

export default function TestDividers() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <h1 className="text-3xl font-bold text-center mb-8">Data Source Divider Options</h1>
        
        {[1,2,3,4,5,6,7,8,9,10].map(variant => (
          <div key={variant} className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Variant {variant}</h2>
            <DataSourcesVariants variant={variant as any} />
          </div>
        ))}
      </div>
    </div>
  );
}
