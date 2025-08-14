import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building } from 'lucide-react';

const TermsOfService = () => {
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
              Terms of Service
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Effective Date: January 1, 2025
            </p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="space-y-6">
              <p>
                Dorm Scout ("Company," "we," "our," or "us") provides access to our website located at www.dormscout.com ("Site") and related features, functionalities, services, and applications that allow users to upload and view dorm room photos, details, and tips from other students (collectively, the "Service(s)").
              </p>
              
              <p>
                These Terms of Service ("Terms") govern your access to, use of, participation in, and interaction with the Service. By accessing or using the Site or Service, you agree to be bound by these Terms. If you do not agree, you may not access or use the Service.
              </p>
              
              <p>
                If you are entering into these Terms on behalf of another person, group, or entity, you represent and warrant that you have authority to bind them to these Terms, and we are entitled to rely on that fact.
              </p>
              
              <p>
                The terms "you," "your," and "User" refer to any person who uses or accesses the Service. You are responsible for all activity under your account ("Account"). These Terms incorporate our Privacy Policy and any other guidelines or terms we present.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Our Services</h2>
              
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(a) Purpose of the Service</h3>
              <p>
                Dorm Scout is a web-based platform where students can search for and share dorm room photos, descriptions, and related information for educational purposes. We do not verify or guarantee the accuracy of any content and are not affiliated with or endorsed by any university.
              </p>

              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(b) Nature of User-Generated Content (UGC)</h3>
              <p>
                All dorm information, photos, and tips are submitted by other users ("Contributors"). We do not guarantee the accuracy, completeness, legality, or safety of such content. You use all content at your own risk.
              </p>

              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(c) No University Involvement</h3>
              <p>
                We are not responsible for housing assignments, university housing policies, or any disputes between you and your school.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Account Registration</h2>
              <p>To use the Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Have a valid .edu email address from an approved school.</li>
                <li>Be at least 13 years old.</li>
                <li>Provide accurate information during registration and keep it updated.</li>
              </ul>
              <p>
                You are responsible for maintaining the confidentiality of your Account credentials and for all activities under your Account.
              </p>
              <p>
                By signing this, you agree that you meet the conditions above.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Acceptable Use</h2>
              <p>You agree not to:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Upload or share photos of individuals without their consent.</li>
                <li>Post content that is obscene, defamatory, harassing, hateful, discriminatory, or unlawful.</li>
                <li>Upload copyrighted material without permission from the copyright owner.</li>
                <li>Attempt to bypass security measures or access restricted areas.</li>
                <li>Misrepresent your identity, affiliation, or the accuracy of your content.</li>
              </ol>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Ownership & License</h2>
              
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(a) Your Content</h3>
              <p>
                You retain ownership of all content you submit. By uploading, you grant us an irrevocable, worldwide, royalty-free license to use, display, reproduce, and distribute your content for operating and promoting the Service.
              </p>

              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(b) Our Content</h3>
              <p>
                The Site, the Service, and all related content, designs, and software are owned by us or our licensors. All rights not expressly granted are reserved.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Fees</h2>
              <p>
                The Service is currently free. If we introduce paid features, we will notify you and update these terms.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Hold Harmless & Limited Liability</h2>
              
              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(a) Use at Your Own Risk</h3>
              <p>
                You agree to use the Service at your sole risk and to indemnify and hold harmless Dorm Scout, its affiliates, and licensors from any and all liability, damages, costs, expenses, or claims arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of the Service,</li>
                <li>Your content, or</li>
                <li>Your violation of these Terms or applicable law.</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(b) As-Is Service</h3>
              <p className="uppercase font-semibold">
                THE SERVICE AND ALL INFORMATION PROVIDED ARE OFFERED "AS IS" AND "AS AVAILABLE." WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h3 className="text-xl font-medium text-foreground mt-6 mb-3">(c) No Liability</h3>
              <p className="uppercase font-semibold">
                TO THE FULLEST EXTENT PERMITTED BY LAW, NEITHER WE NOR OUR AFFILIATES SHALL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY. OUR TOTAL LIABILITY TO YOU SHALL NOT EXCEED $100.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. DMCA Policy</h2>
              <p>
                If you believe content on the Service infringes your copyright, please contact us to submit a takedown request.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">8. Termination</h2>
              <p>
                We may suspend or terminate your Account and/or access to the Service at any time, with or without notice, for any reason, including violation of these Terms.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">9. Modifications</h2>
              <p>
                We may update these Terms at any time by posting the revised version on the Site. Continued use of the Service after changes constitutes your acceptance.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">10. Governing Law & Dispute Resolution</h2>
              <p>
                These Terms are governed by the laws of [Your State], without regard to conflicts of law principles. Any disputes will be resolved exclusively in the courts of [Your State], unless otherwise required by law.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">11. Miscellaneous</h2>
              <p>
                If any part of these Terms is found unenforceable, the rest will remain in effect. Our failure to enforce any provision shall not be considered a waiver. You may not assign your rights without our consent.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Information</h2>
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

export default TermsOfService;