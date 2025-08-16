import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Header from './Header';
import './ContactUs.css'; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const form = useRef();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

   const ADD_ITEM_TOAST_ID = "add-item-toast";

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_21k6w3t',     // service ID
        'template_61rltkt',    // template ID
        form.current,
        '8x3VZkPafeyBrya1B'      // public key
      )
      .then(
        () => {


if (!toast.isActive(ADD_ITEM_TOAST_ID)) {
              toast.success(`Message sent successfully!.`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                toastId: ADD_ITEM_TOAST_ID,
              });
            }

          // setSuccessMsg('Message sent successfully!');
          setErrorMsg('');
          form.current.reset(); // clear the form after sending
        },


            
        (error) => {
          if (!toast.isActive(ADD_ITEM_TOAST_ID)) {
              toast.error(`Message sent successfully!.`, {
                position: "top-right",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                toastId: ADD_ITEM_TOAST_ID,
              });
            }
          console.error(error.text);
          setSuccessMsg('');
        }
      );
  };

  return (
    <>
    <ToastContainer/>
    <Header/>
     <div className="contact-container">
      <div className="contact-box">
        <h2 className="contact-heading">Contact Us</h2>
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <div>
            <label className="contact-label">First Name</label>
            <input type="text" name="firstName" required className="contact-input" />
          </div>

          <div>
            <label className="contact-label">Last Name</label>
            <input type="text" name="lastName" required className="contact-input" />
          </div>

          <div>
            <label className="contact-label">Email</label>
            <input type="email" name="email" required className="contact-input" />
          </div>

          <div>
            <label className="contact-label">Phone</label>
            <input type="tel" name="phone" required className="contact-input" />
          </div>

          <div>
            <label className="contact-label">Message</label>
            <textarea name="message" rows="4" required className="contact-input"></textarea>
          </div>

          <button type="submit" className="contact-button">
            Send Message
          </button>
        </form>

        {successMsg && <p className="contact-success">{successMsg}</p>}
        {errorMsg && <p className="contact-error">{errorMsg}</p>}
      </div>
    </div>
    </>
   
  );
};

export default ContactUs;

