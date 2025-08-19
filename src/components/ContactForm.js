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

    const whatsappUrl = `https://wa.me/201272725988?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <section className="py-16 bg-light-gray">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-dark">
            Send Your Complaint
          </h2>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-dark mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
              
              {/* Message Input */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-dark mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark focus:border-transparent resize-none"
                  placeholder="Write your message here..."
                />
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-dark text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-semibold"
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
