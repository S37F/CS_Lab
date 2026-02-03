import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const PrivacyPolicyPage: React.FC = () => {
  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background-primary w-full">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
                 <h1 className="text-4xl font-bold text-text-primary">Privacy Policy</h1>
                 <p className="text-text-tertiary mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </header>
            <Card>
                <div className="p-4 prose prose-invert max-w-none">
                     <Section title="1. Introduction">
                        <p>Welcome to CSLab. This Privacy Policy explains how we collect, use, and disclose information about you when you use our platform. As this is a purely educational, client-side application, our data collection is extremely minimal.</p>
                    </Section>
                    <Section title="2. Information We Collect">
                        <p>We do not collect any personal information. This application runs entirely in your browser.</p>
                        <ul className="list-disc list-inside">
                            <li><strong>No User Accounts:</strong> We do not have user accounts, so we do not store names, email addresses, or passwords.</li>
                            <li><strong>No Server-Side Analytics:</strong> We do not use server-side analytics to track your behavior.</li>
                            <li><strong>Local Data:</strong> Any data you input into the simulators (e.g., arrays to be sorted, text to be encrypted) is processed locally on your device and is not sent to our servers.</li>
                        </ul>
                    </Section>
                    <Section title="3. How We Use Information">
                        <p>Since we do not collect personal information, we do not use it for any purpose.</p>
                    </Section>
                    <Section title="4. Information Sharing">
                         <p>We do not have any personal information to share.</p>
                    </Section>
                    <Section title="5. Contact Us">
                        <p>If you have any questions about this Privacy Policy, please contact us using the information on our Contact page.</p>
                    </Section>
                </div>
            </Card>
        </div>
    </main>
  );
};

export default PrivacyPolicyPage;
