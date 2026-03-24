interface TrustFooterLineProps {
  email: string;
  address: string;
  guarantee: string;
  className?: string;
}

export default function TrustFooterLine({ email, address, guarantee, className = "" }: TrustFooterLineProps) {
  // Don't render if no footer data
  if (!email && !address && !guarantee) {
    return null;
  }

  return (
    <div className={`border-t border-gray-200 pt-6 ${className}`} data-testid="trust-footer-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            {email && (
              <p className="text-sm text-gray-600">
                <a href={`mailto:${email}`} className="hover:text-gray-900 transition-colors">
                  {email}
                </a>
              </p>
            )}
            {address && (
              <p className="text-xs text-gray-500 mt-1">
                {address}
              </p>
            )}
          </div>
          <div className="text-center md:text-right">
            {guarantee && (
              <p className="text-sm text-gray-600">
                {guarantee}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
