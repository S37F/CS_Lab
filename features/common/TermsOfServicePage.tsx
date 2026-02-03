import React from 'react';
import Card from '../../components/ui/Card';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary border-b border-border pb-2 mb-4">{title}</h2>
        <div className="text-text-secondary space-y-4">{children}</div>
    </section>
);

const TermsOfServicePage: React.FC = () => {
  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background-primary w-full">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
                 <h1 className="text-4xl font-bold text-text-primary">Terms of Service</h1>
                 <p className="text-text-tertiary mt-2">Last updated: {new Date().toLocaleDateString()}</p>
            </header>
            <Card>
                <div className="p-4 prose prose-invert max-w-none">
                     <Section title="1. Acceptance of Terms">
                        <p>By accessing and using CSLab (the "Platform"), you accept and agree to be bound by the terms and provision of this agreement. This Platform is provided for educational purposes only.</p>
                    </Section>
                    <Section title="2. Use of the Platform">
                        <p>CSLab is a free educational tool. You are granted a non-exclusive, non-transferable, revocable license to access and use the Platform strictly in accordance with these terms of use.</p>
                        <p>You agree not to use the Platform for any purpose that is unlawful or prohibited by these terms. You may not use the Platform in any manner that could damage, disable, overburden, or impair the Platform.</p>
                    </Section>
                    <Section title="3. Disclaimer of Warranties">
                        <p>The Platform is provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </Section>
                    <Section title="4. Limitation of Liability">
                         <p>In no event shall CSLab or its developers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Platform.</p>
                    </Section>
                    <Section title="5. Changes to Terms">
                        <p>We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically.</p>
                    </Section>
                </div>
            </Card>
        </div>
    </main>
  );
};

export default TermsOfServicePage;
