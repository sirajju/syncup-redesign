
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/AuthLayout';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <AuthLayout title="Terms of Service">
      <div className="space-y-6 max-h-96 overflow-y-auto">
        <div className="space-y-4 text-sm text-gray-600">
          <section>
            <h3 className="font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h3>
            <p>
              By accessing and using this messaging application, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">2. Use License</h3>
            <p>
              Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">3. Privacy and Data</h3>
            <p>
              We respect your privacy and are committed to protecting your personal data. All messages are encrypted and we do not store or share your personal information without consent.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">4. User Conduct</h3>
            <p>
              Users agree not to use the service for any unlawful purpose or to transmit any material that is harmful, threatening, abusive, or otherwise objectionable.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">5. Service Availability</h3>
            <p>
              We strive to keep the service available at all times, but we cannot guarantee uninterrupted access and may suspend service for maintenance or other reasons.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">6. Modifications</h3>
            <p>
              We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or in-app notification.
            </p>
          </section>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <Link 
            to="/register"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            <ArrowLeft size={16} />
            <span>Back to registration</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Terms;
