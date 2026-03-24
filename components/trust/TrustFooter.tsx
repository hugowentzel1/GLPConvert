interface TrustFooterProps {
  email: string;
  address: string;
  guarantee: string;
}

export default function TrustFooter({ email, address, guarantee }: TrustFooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <p className="text-gray-300 mb-2">
              <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                {email}
              </a>
            </p>
            <p className="text-sm text-gray-400">
              {address}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Guarantee</h3>
            <p className="text-gray-300 text-sm">
              {guarantee}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <a href="/privacy" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="/security" className="block text-gray-300 hover:text-white transition-colors text-sm">
                Security
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Sunspire. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
