import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import ContactForm from './ContactForm';
import Accordion from '../../components/ui/Accordion';
import { MailIcon, HeadphonesIcon, GraduationCapIcon, NewspaperIcon } from '../../components/Icons';

const ContactInfoCard: React.FC<{ icon: React.ReactNode, title: string, email: string, description: string }> = ({ icon, title, email, description }) => (
    <div className="bg-background-secondary p-6 rounded-lg border border-border">
        <div className="flex items-center mb-3">
            <div className="mr-4 text-accent-primary">{icon}</div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <a href={`mailto:${email}`} className="text-accent-primary hover:underline font-mono text-sm">{email}</a>
        <p className="text-text-tertiary text-sm mt-2">{description}</p>
    </div>
);

interface ContactPageProps {
    categories: string[];
}

const ContactPage: React.FC<ContactPageProps> = ({ categories }) => {
    const faqItems = [
        { title: 'Is CSLab free to use?', children: 'Yes, CSLab is completely free for educational use. My goal is to provide accessible learning tools for everyone passionate about computer science.' },
        { title: 'How accurate are the algorithm simulations?', children: 'All algorithms are implemented with precision and are thoroughly tested to reflect their true behavior. They are designed for educational clarity, showing step-by-step execution.' },
        { title: 'Can I use CSLab for teaching?', children: 'Absolutely! CSLab is designed as a supplementary tool for educators. The visual simulations can help students grasp complex topics more easily in a classroom setting.' },
        { title: 'Do you accept algorithm suggestions?', children: 'Yes! I welcome suggestions for new algorithms or topics to implement. Please use the contact form to send your feature requests.' },
    ];
    
    return (
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-background-primary w-full">
            <div className="max-w-5xl mx-auto space-y-16">
                {/* Hero Section */}
                <motion.section
                    className="text-center py-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">Get In Touch With CSLab</h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Questions, feedback, or educational partnerships? I'd love to hear from you.
                    </p>
                </motion.section>

                {/* Contact Grid */}
                <section className="grid md:grid-cols-2 gap-8 items-start">
                    <Card title="Send a Message">
                        <ContactForm categories={categories} />
                    </Card>
                    <div className="space-y-6">
                        <ContactInfoCard 
                            icon={<MailIcon className="w-6 h-6" />}
                            title="General Inquiries"
                            email="hello@cslab.dev"
                            description="For general questions and feedback."
                        />
                        <ContactInfoCard 
                            icon={<HeadphonesIcon className="w-6 h-6" />}
                            title="Technical Support"
                            email="support@cslab.dev"
                            description="Report a bug or get help with the simulators."
                        />
                         <ContactInfoCard 
                            icon={<GraduationCapIcon className="w-6 h-6" />}
                            title="Educational Partnerships"
                            email="partnerships@cslab.dev"
                            description="Collaborate with us for educational initiatives."
                        />
                         <ContactInfoCard 
                            icon={<NewspaperIcon className="w-6 h-6" />}
                            title="Press & Media"
                            email="press@cslab.dev"
                            description="Media inquiries and press releases."
                        />
                    </div>
                </section>
                
                {/* FAQ Section */}
                <section>
                    <h2 className="text-3xl font-bold text-center text-text-primary mb-8">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto">
                        <Accordion items={faqItems} />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ContactPage;