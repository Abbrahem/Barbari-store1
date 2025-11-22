import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = `New complaint from:\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;

    const whatsappUrl = `https://wa.me/201016233802?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <section className="py-20 bg-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Send Your Complaint
          </h2>
          
          <form onSubmit={handleSubmit} className="bg-dark-card rounded-xl shadow-2xl p-8 border border-gray-800">
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
              
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your phone number"
                />
              </div>
              
              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent resize-none text-white placeholder-gray-400"
                  placeholder="Write your message here..."
                />
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
