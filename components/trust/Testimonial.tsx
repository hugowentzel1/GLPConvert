import Image from 'next/image';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  metric?: string;
  avatarSrc?: string;
  className?: string;
}

export default function Testimonial({ 
  quote, 
  name, 
  title, 
  company, 
  metric, 
  avatarSrc,
  className = "" 
}: TestimonialProps) {
  // Don't render if no testimonial data
  if (!quote || !name || !title || !company) {
    return null;
  }

  return (
    <div className={`py-16 bg-gray-50 ${className}`} data-testid="hero-testimonial">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <blockquote className="text-xl md:text-2xl font-medium text-gray-900 mb-8 italic">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-4">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={`${name} avatar`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-lg">
                    {name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              <div className="text-left">
                <div className="font-semibold text-gray-900">{name}</div>
                <div className="text-sm text-gray-600">{title}, {company}</div>
              </div>
            </div>
            {metric && (
              <div className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {metric}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}