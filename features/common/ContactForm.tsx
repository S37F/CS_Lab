import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface ContactFormProps {
    categories: string[];
}

const ContactForm: React.FC<ContactFormProps> = ({ categories }) => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
        selectedCategories: new Set<string>(),
        honeypot: ''
    });
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; form?: string }>({});
    const maxMessageLength = 500;

    const validate = () => {
        const newErrors: { name?: string; email?: string; message?: string } = {};
        if (!formData.name) newErrors.name = 'Name is required.';
        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (!formData.message) {
            newErrors.message = 'Message is required.';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters long.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (category: string) => {
        setFormData(prev => {
            const newCategories = new Set(prev.selectedCategories);
            if (newCategories.has(category)) {
                newCategories.delete(category);
            } else {
                newCategories.add(category);
            }
            return { ...prev, selectedCategories: newCategories };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.honeypot) { // Bot check
            setStatus('sent'); // Silently "succeed"
            return;
        }
        if (!validate()) return;
        
        setStatus('sending');
        setErrors({});

        // Simulate a successful form submission
        setTimeout(() => {
            setStatus('sent');
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '', selectedCategories: new Set(), honeypot: '' });
            setErrors({});
        }, 500);
    };

    if (status === 'sent') {
        return (
            <div className="text-center p-8 bg-accent-success/10 rounded-lg">
                <h3 className="font-semibold text-accent-success text-lg">Thank you!</h3>
                <p className="text-text-secondary mt-2">Your message has been received. I'll get back to you shortly.</p>
                 <Button onClick={() => setStatus('idle')} variant="secondary" size="sm" className="mt-4">Send another message</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             {/* Honeypot field for spam protection */}
            <div className="absolute w-0 h-0 overflow-hidden">
                <label htmlFor="bot-field">Do not fill this if you are human</label>
                <input name="honeypot" id="bot-field" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Name</label>
                    <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                    <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com"/>
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
            </div>
             <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-1">Subject</label>
                <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="block w-full bg-background-elevated border border-border rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary sm:text-sm transition-colors duration-200">
                    <option>General Inquiry</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Educational Partnership</option>
                </select>
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message</label>
                 <div className="relative">
                    <textarea
                        name="message"
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={maxMessageLength}
                        placeholder="Your feedback, questions, or suggestions are welcome!"
                        className="block w-full bg-background-elevated border border-border rounded-md shadow-sm py-2 px-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary sm:text-sm transition-colors duration-200"
                    />
                    <span className="absolute bottom-2 right-2 text-xs text-text-tertiary">
                        {formData.message.length} / {maxMessageLength}
                    </span>
                 </div>
                 {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Algorithm Category of Interest (Optional)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-3 bg-background-elevated rounded-md border border-border">
                    {categories.map(category => (
                        <label key={category} className="flex items-center space-x-2 text-sm cursor-pointer hover:text-text-primary transition-colors">
                            <input 
                                type="checkbox"
                                checked={formData.selectedCategories.has(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="h-4 w-4 rounded bg-background-primary border-border text-accent-primary focus:ring-accent-primary"
                            />
                            <span>{category}</span>
                        </label>
                    ))}
                </div>
            </div>
            
            {errors.form && <p className="text-red-400 text-sm text-center">{errors.form}</p>}
            <Button type="submit" className="w-full" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
};

export default ContactForm;