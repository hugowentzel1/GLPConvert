import Image from 'next/image';

interface Logo {
  name: string;
  src: string;
  href?: string;
}

interface LogoWallProps {
  logos: Logo[];
  className?: string;
}

export default function LogoWall({ logos, className = "" }: LogoWallProps) {
  // Don't render if no logos
  if (!logos || logos.length === 0) {
    return null;
  }

  return (
    <div className={`py-12 bg-white ${className}`} data-testid="logo-wall">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Trusted by leading solar installers
          </p>
        </div>
        <div className="flex justify-center items-center space-x-8 md:space-x-12 flex-wrap">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
              data-testid="logo-item"
            >
              {logo.href ? (
                <a href={logo.href} target="_blank" rel="noopener noreferrer">
                  <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">
                      {logo.name}
                    </span>
                  </div>
                </a>
              ) : (
                <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">
                    {logo.name}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}