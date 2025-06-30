import React from 'react';
import { HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';

const Help: React.FC = () => {
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "You can book an appointment by first creating an account or logging in. Then, browse through our list of doctors, select your preferred doctor, and choose an available time slot that works for you."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time. Simply go to your dashboard, find the appointment, and click on the cancel or reschedule option."
    },
    {
      question: "How do I access my medical records?",
      answer: "Your medical records are available in your patient dashboard under the 'Medical Records' section. All your prescriptions and medical history are stored securely and can be accessed anytime."
    },
    {
      question: "What should I do in case of an emergency?",
      answer: "In case of an emergency, click on the 'Emergency' button at the top of the page. Fill in the required details, and our team will arrange immediate medical assistance."
    },
    {
      question: "How do I update my profile information?",
      answer: "Log in to your account, go to your profile settings, and click on the 'Edit Profile' button. You can update your personal information, contact details, and medical history there."
    },
    {
      question: "Is my medical information secure?",
      answer: "Yes, we take data security very seriously. All your medical information is encrypted and stored securely following the highest standards of data protection and privacy."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-lg text-gray-600">
          We're here to help you with any questions or concerns you may have.
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Phone className="h-8 w-8 text-cyan-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
          <p className="text-gray-600 mb-4">Available 24/7 for emergencies</p>
          <p className="text-cyan-600 font-semibold">+91 1800 123 4567</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Mail className="h-8 w-8 text-cyan-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">Get response within 24 hours</p>
          <p className="text-cyan-600 font-semibold">help@aarogyabharat.com</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <MessageCircle className="h-8 w-8 text-cyan-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
          <p className="text-gray-600 mb-4">Chat with our support team</p>
          <button className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 transition duration-150">
            Start Chat
          </button>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <HelpCircle className="h-6 w-6 text-cyan-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send Us a Message</h2>
        <form className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Your email"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Message subject"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Your message"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-8 py-3 rounded-md hover:bg-cyan-700 transition duration-150"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Help;