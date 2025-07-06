
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/AuthLayout';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <AuthLayout title="Privacy Policy">
      <div className="space-y-6 max-h-96 overflow-y-auto">
        <div className="space-y-4 text-sm text-gray-600">
          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you create an account, send messages, or contact us for support.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">How We Use Your Information</h3>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Information Sharing</h3>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Data Security</h3>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Message Encryption</h3>
            <p>
              All messages are encrypted end-to-end, meaning only you and the intended recipient can read them. We cannot access the content of your messages.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Data Retention</h3>
            <p>
              We retain your information only as long as necessary to provide our services and fulfill the purposes outlined in this policy.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-gray-800 mb-2">Your Rights</h3>
            <p>
              You have the right to access, update, or delete your personal information. Contact us if you wish to exercise these rights.
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

export default Privacy;
