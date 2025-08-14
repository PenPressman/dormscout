import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-dorm-pink to-dorm-orange text-white p-2 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-dorm-pink to-dorm-orange bg-clip-text text-transparent">
              Dorm Scout
            </h1>
          </Link>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-dorm-pink to-dorm-orange bg-clip-text text-transparent">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Effective Date: January 1, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="space-y-6">
              <p>
                This Privacy Policy describes how Dorm Scout LLC ("Company," "we," "our," or "us") collects, uses, discloses, and otherwise processes personal information in connection with our website www.dormscout.com (the "Site") and related services, features, and applications that let students view and share dorm room photos and tips (collectively, the "Services"). Any capitalized terms not defined here have the meanings in our Terms of Service.
              </p>
              
              <p>
                By accessing the Site or using the Services, you acknowledge you've read and agree to this Privacy Policy and the Terms of Service.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1) Personal Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(a) Information You Provide Directly</h3>
              
              <p><strong>Account & Verification.</strong> When you create an account or sign in, we collect your name, .edu email address, school affiliation, and related details needed to verify eligibility.</p>
              
              <p><strong>Profile & Submissions.</strong> If you share a dorm, we collect content you upload: photos (empty and decorated), captions, tags, dimensions, tips, and other text you enter.</p>
              
              <p><strong>Optional Contact Info.</strong> If you choose to display contact info on a post, we'll collect and show the email and first name + last initial you provide. This field is opt-in and hidden by default.</p>
              
              <p><strong>Communications.</strong> We keep messages and support inquiries you send us so we can respond and improve the Services.</p>
              
              <p><strong>Transactions (if applicable).</strong> If we add paid features, our payment processor (e.g., Stripe) will collect payment details. We receive limited transaction metadata (amount, time, status) and do not store full card numbers.</p>

              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(b) Information Collected Automatically</h3>
              
              <p><strong>Device/Usage Data.</strong> We (and service providers) collect IP address, device/browser type, operating system, pages viewed, referring/exit pages, clickstream, and timestamps, to operate, secure, and improve the Services.</p>
              
              <p><strong>Cookies & Similar Tech.</strong> We use cookies, log files, pixels, and web beacons to keep you signed in, remember preferences, analyze usage, and personalize UI. You can block cookies in your browser, but some features may not work.</p>

              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(c) Third-Party Integrations</h3>
              <p>
                Our Services may include analytics (e.g., privacy-respecting product analytics) and email tools. These providers process limited personal information on our behalf under contracts and privacy terms that restrict their use of your data.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2) How We Use Personal Information</h2>
              <p>We use personal information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide & improve the Services (account creation, authentication, school eligibility, search, upload, save/favorite, and share features).</li>
                <li>Operate UGC features, including storing, displaying, and moderating photos and text you submit.</li>
                <li>Communicate with you about verification, updates, security notices, and support.</li>
                <li>Maintain safety & security, detect/prevent fraud and abuse, and enforce our Terms and Community Guidelines.</li>
                <li>Analyze usage to improve design and performance.</li>
                <li>Comply with law and exercise/defend legal claims.</li>
                <li>With your consent, send optional product updates or announcements (you can opt out anytime).</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3) How We Share Personal Information</h2>
              <p className="font-semibold">We do not sell your personal information.</p>
              <p>We may share personal information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers (hosting, storage/CDN, image processing, analytics, email, support, payment processing if enabled) who process it for us under written agreements.</li>
                <li>Other users, when you publish a dorm profile or enable optional contact info (only what you choose to display is shown; we never reveal your email otherwise).</li>
                <li>Law enforcement or authorities if required by law or to protect rights, safety, and security.</li>
                <li>Successors in a merger, acquisition, or asset sale (they'll assume the rights and obligations described here).</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4) Your Choices & Controls</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access/Update.</strong> You can view or update certain account details in your profile.</li>
                <li><strong>Delete Content.</strong> You can delete your posts or request we remove them.</li>
                <li><strong>Account Deletion.</strong> Request account deletion at any time; we'll delete or de-identify personal information unless we must retain it for legal/security reasons.</li>
                <li><strong>Contact Info Display.</strong> Showing contact info on a post is optional; you can toggle it off at any time.</li>
                <li><strong>Cookies/Tracking.</strong> Adjust browser settings to manage cookies. (Blocking may limit features.)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5) Data Retention</h2>
              <p>
                We keep personal information only as long as needed for the purposes above (e.g., to operate the Services, comply with legal obligations, resolve disputes, and enforce agreements). When no longer needed, we delete or de-identify it.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6) Security</h2>
              <p>
                We use reasonable administrative, technical, and physical safeguards (e.g., encrypted transport, access controls, EXIF stripping for images) to protect personal information. No method is 100% secure; you use the Services at your own risk.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7) Student & Children's Privacy</h2>
              <p>
                Dorm Scout is for university/college students and requires a .edu email from an approved school. No one under 13 may use the Services or provide personal information. If we learn a child under 13 has provided data, we'll delete it.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8) U.S. Service; Not for International Use</h2>
              <p>
                The Site and Services are operated in the United States and intended for U.S. residents. If you access the Services from outside the U.S., you understand your information will be processed in the U.S.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9) State Privacy Notices (California and others)</h2>
              <p>
                If you're a California resident (or reside in a state with similar laws), you may have rights to access, delete, correct, or restrict certain personal information and to opt out of targeted advertising or "sales" of personal information.
              </p>
              <p>
                Dorm Scout does not sell personal information and does not engage in cross-context behavioral advertising that would constitute a "sale" under California law.
              </p>
              <p>
                To exercise rights, contact us. We will verify your request and respond consistent with applicable law. We will not discriminate against you for exercising your rights.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">10) Third-Party Links</h2>
              <p>
                Our Services may link to third-party sites/apps. Their practices are governed by their own privacy policies. We're not responsible for those policies or practices.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">11) Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. If we make material changes, we'll update the "Effective Date" and, where required, notify you (e.g., by email or in-app notice). Your continued use means you accept the revised Policy.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">12) Contact Information</h2>
              <p>Questions, requests, or privacy concerns?</p>
              <div className="bg-card p-4 rounded-lg">
                <p className="font-medium">Dorm Scout</p>
                <p>Email: penelope.pressman@gmail.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;