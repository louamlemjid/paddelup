'use client'; // This directive is necessary for client-side components in Next.js App Router

import React, { useState, useEffect } from 'react'; // Import useEffect

// Define the custom green color for Tailwind CSS
// This would typically be in tailwind.js, but for a self-contained immersive,
// we'll use a direct hex code or a standard Tailwind green.
// Let's use a standard Tailwind green tint like 'green-500' and 'green-600'.

function Book() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    price: 0,
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(2024); // Initialize with a default year

  // Use useEffect to set the current year only on the client side after mounting
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []); // Empty dependency array ensures this runs only once after initial render

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [service, price] = e.target.value.split('|');
    setFormData({
      ...formData,
      service: service,
      price: parseFloat(price),
    });
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = () => {
    if (!formData.service) {
      setMessage('Please select a service option.');
      setMessageType('error');
      return false;
    }
    setMessage('');
    setMessageType('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.date || !formData.time) {
      setMessage('Please select both a date and a time.');
      setMessageType('error');
      return false;
    }
    setMessage('');
    setMessageType('');
    return true;
  };

  const validateStep3 = () => {
    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      setMessage('All contact fields are required.');
      setMessageType('error');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      setMessageType('error');
      return false;
    }
    // Basic phone number validation (digits only, optional + at start)
    const phoneRegex = /^\+?[0-9\s-]{7,15}$/; // Allows +, digits, spaces, hyphens
    if (!phoneRegex.test(phone)) {
      setMessage('Please enter a valid phone number.');
      setMessageType('error');
      return false;
    }
    setMessage('');
    setMessageType('');
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setMessage(''); // Clear message when going back
    setMessageType('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    // Construct the payload for Grist.
    // This payload will be sent to our Next.js API route, which then forwards it to Grist.
    const payload = {
      records: [
        {
          fields: {
            service: formData.service,
            price: formData.price,
            date: formData.date,
            time: formData.time,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }
        }
      ]
    };

    try {
      // Call our internal Next.js API route
      const response = await fetch('/api/book', { // This is the endpoint for your new API route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Corrected typo here
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // The error message from our API route will be in errorData.message
        throw new Error(errorData.message || 'Something went wrong with the booking submission.');
      }

      const result = await response.json();
      console.log('Booking API response:', result);
      setMessage('Booking successfully submitted!');
      setMessageType('success');
      // Optionally reset form or navigate to a success page
      setFormData({
        service: '',
        price: 0,
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
      });
      setStep(1); // Reset to first step after successful submission
    } catch (error: any) {
      console.error('Error submitting booking:', error);
      setMessage(`Failed to submit booking: ${error.message}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-inter flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-500 mb-4">
          PaddelUp Booking
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300">
          Book your padel session in just a few steps!
        </p>
      </header>

      {/* Main Content - Booking Form */}
      <main className="w-full max-w-xl bg-neutral-800 p-6 sm:p-8 rounded-xl shadow-lg border border-green-600">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-green-500">
            Step {step} of 3
          </h2>
          {message && (
            <div
              className={`p-3 rounded-lg text-sm sm:text-base ${
                messageType === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <fieldset className="mb-6">
              <legend className="text-xl font-medium mb-4 text-neutral-200">Choose Your Session Type:</legend>
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-600 transition-colors duration-200 border border-transparent has-checked:border-green-500">
                  <input
                    type="radio"
                    name="serviceOption"
                    value="1 hour without training|20"
                    checked={formData.service === '1 hour without training'}
                    onChange={handleServiceChange}
                    className="form-radio h-5 w-5 text-green-500 focus:ring-green-500 rounded-full"
                  />
                  <span className="ml-3 text-lg text-neutral-100">1 hour without training - 20dt</span>
                </label>
                <label className="flex items-center p-4 bg-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-600 transition-colors duration-200 border border-transparent has-checked:border-green-500">
                  <input
                    type="radio"
                    name="serviceOption"
                    value="1 hour with training|35"
                    checked={formData.service === '1 hour with training'}
                    onChange={handleServiceChange}
                    className="form-radio h-5 w-5 text-green-500 focus:ring-green-500 rounded-full"
                  />
                  <span className="ml-3 text-lg text-neutral-100">1 hour with training - 35dt</span>
                </label>
                <label className="flex items-center p-4 bg-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-600 transition-colors duration-200 border border-transparent has-checked:border-green-500">
                  <input
                    type="radio"
                    name="serviceOption"
                    value="1 hour with training and suivi|45"
                    checked={formData.service === '1 hour with training and suivi'}
                    onChange={handleServiceChange}
                    className="form-radio h-5 w-5 text-green-500 focus:ring-green-500 rounded-full"
                  />
                  <span className="ml-3 text-lg text-neutral-100">1 hour with training and suivi - 45dt</span>
                </label>
              </div>
            </fieldset>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
            >
              Next
            </button>
          </form>
        )}

        {/* Step 2: Date and Time */}
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
            <div className="mb-6">
              <label htmlFor="date" className="block text-neutral-200 text-lg font-medium mb-2">Select Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleDateTimeChange}
                className="w-full p-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="time" className="block text-neutral-200 text-lg font-medium mb-2">Select Time:</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleDateTimeChange}
                className="w-full p-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-neutral-600 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-75"
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-neutral-200 text-lg font-medium mb-2">Your Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleContactChange}
                className="w-full p-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-neutral-200 text-lg font-medium mb-2">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleContactChange}
                className="w-full p-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-neutral-200 text-lg font-medium mb-2">Phone Number:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleContactChange}
                className="w-full p-3 bg-neutral-700 text-white rounded-lg border border-neutral-600 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="bg-neutral-600 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-opacity-75"
              >
                Previous
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center mt-8 p-4 bg-neutral-800 rounded-xl shadow-lg border border-green-600">
        <p className="text-neutral-300 text-sm sm:text-base mb-2">
          &copy; {currentYear} PaddelUp. All rights reserved.
        </p>
        <p className="text-neutral-300 text-sm sm:text-base">
          Contact us: <a href="mailto:info@paddelup.com" className="text-green-400 hover:text-green-300 transition-colors duration-200">info@paddelup.com</a> | Phone: <a href="tel:+1234567890" className="text-green-400 hover:text-green-300 transition-colors duration-200">+1 (234) 567-890</a>
        </p>
        <p className="text-neutral-300 text-sm sm:text-base">
          Address: 123 Padel Court, Sport City, Country
        </p>
      </footer>
    </div>
  );
}

export default Book;
