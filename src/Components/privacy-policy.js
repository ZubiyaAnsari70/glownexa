import React from "react";
import { Shield, Lock, Trash2, Eye, Cloud } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-slate-800">
      <div className="text-center mb-10">
        <Shield className="w-10 h-10 text-green-600 mx-auto mb-2" />
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-slate-500 mt-2">
          Last updated on October 29, 2025
        </p>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">1. Introduction</h2>
          <p>
            This Privacy Policy explains how we collect, use, and protect your
            information while using our AI-based Skin & Hair Analysis Platform.
            We value your privacy and ensure your personal data is handled
            securely and responsibly.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Uploaded images for skin or hair analysis</li>
            <li>Basic user information (like name or email, if provided)</li>
            <li>System-generated results or recommendations</li>
            <li>Metadata such as date and time of uploads</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">3. How We Use Your Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To analyze images and generate AI-based results</li>
            <li>To improve accuracy and performance of the system</li>
            <li>To allow users to view or delete their previous analyses</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">4. Data Storage & Security</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-green-600 mt-1" />
              <p>
                All uploaded images are securely stored on <strong>Cloudinary</strong>
                , which uses <strong>HTTPS</strong> for data transfer and
                <strong> AES-256 encryption</strong> for data at rest.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <Cloud className="w-5 h-5 text-green-600 mt-1" />
              <p>
                We do not share or sell your data to any third party. Your data
                is used solely for analysis and system improvement.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">5. User Control</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-green-600 mt-1" />
              <p>
                You can view all your past analyses from the <strong>History</strong> section.
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <Trash2 className="w-5 h-5 text-green-600 mt-1" />
              <p>
                You can permanently delete any record or image anytime — this action
                immediately removes your data from our system.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">6. Cookies & Tracking</h2>
          <p>
            This project does not use cookies or third-party tracking services.
            Basic analytics may be used only to monitor site performance.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">7. Your Consent</h2>
          <p>
            By using our platform, you agree to this Privacy Policy and consent
            to the collection and use of data as described here.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Any major changes
            will be reflected with an updated “Last Updated” date at the top of
            this page.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-green-700">9. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, feel free to contact
            us at <strong>support@glownexa.com</strong>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
