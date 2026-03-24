interface AboutBlockProps {
  heading: string;
  body: string;
  className?: string;
}

export default function AboutBlock({ heading, body, className = "" }: AboutBlockProps) {
  return (
    <div className={`py-16 bg-gray-50 ${className}`} data-testid="about-block">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}