import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const form = useRef();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_21k6w3t',     // replace with your service ID
        'template_61rltkt',    // replace with your template ID
        form.current,
        '8x3VZkPafeyBrya1B'      // replace with your public key
      )
      .then(
        () => {
          setSuccessMsg('Message sent successfully!');
          setErrorMsg('');
          form.current.reset(); // clear the form after sending
        },
        (error) => {
          console.error(error.text);
          setErrorMsg('Failed to send message. Please try again later.');
          setSuccessMsg('');
        }
      );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Contact Us</h2>
        <form ref={form} onSubmit={sendEmail} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              name="message"
              rows="4"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-orange-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
          >
            Send Message
          </button>
        </form>

        {successMsg && <p className="text-green-600 mt-4 text-center">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 mt-4 text-center">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default ContactUs;

