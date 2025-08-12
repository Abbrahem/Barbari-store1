import React from 'react';
import Navbar from '../components/Navbar';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default ContactPage;
