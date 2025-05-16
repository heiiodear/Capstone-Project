import React, { useState } from "react";
import Header from "./../components/Header";
import ConfirmationModal from "./../components/ConfirmationModal"; 
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Twitter } from "lucide-react";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendFormData = async () => {
    try {
      const response = await fetch("http://localhost:5000/send-contect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        const data = await response.json();
        alert("Error: " + (data.message || "Failed to send message"));
      }
    } catch (error) {
      alert("Error sending message: " + error.message);
    }
  };

  const confirmSubmit = (e) => {
    e.preventDefault();
    setShowConfirmPopup(true);
  };

  const cancelSubmit = () => {
    setShowConfirmPopup(false);
  };

  const proceedSubmit = async () => {
    setShowConfirmPopup(false);
    await sendFormData();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {showConfirmPopup && (
        <ConfirmationModal
          title="Confirm Submission"
          message="Are you sure you want to send this message?"
          confirmText="Yes, Send"
          confirmColor="bg-indigo-900 hover:bg-indigo-800"
          onConfirm={proceedSubmit}
          onCancel={cancelSubmit}
        />
      )}

      <div className="container mx-auto py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-indigo-900 mb-3">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have questions about Secura? We're here to help.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white shadow-lg rounded-lg border-2 border-gray-200 p-6">
                <h2 className="text-xl font-medium text-indigo-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full">
                      <Phone className="h-5 w-5 text-indigo-900" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg text-indigo-900">Call Us</h4>
                      <p className="text-gray-600">Our support team is available 24/7</p>
                      <p className="hover:underline">(+66) 63 545 1915</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full">
                      <Mail className="h-5 w-5 text-indigo-900" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg text-indigo-900">Email Us</h4>
                      <p className="text-gray-600">We'll respond within 24 hours</p>
                      <p className="hover:underline">acssecura2025@gmail.com</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-indigo-900" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg text-indigo-900">Visit Us</h4>
                      <p className="hover:underline">
                        126 Pracha Uthit Rd.
                        <br />
                        Bang Mod, Thung Khru,
                        <br />
                        Bangkok 10140, Thailand
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full">
                      <Clock className="h-5 w-5 text-indigo-900" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg text-indigo-900">Business Hours</h4>
                      <div className="text-navy">
                        <div>Monday - Friday: 9 AM - 6 PM</div>
                        <div>Saturday: 10AM - 4 PM</div>
                        <div>Sunday: Closed</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-xl mb-4 text-indigo-900">Connect With Us</h4>

                  <div className="grid grid-cols-3 gap-y-4">
                    {[
                      { icon: Facebook, label: "Facebook", detail: "ACSSecura" },
                      { icon: Instagram, label: "Instagram", detail: "ACSSecura_official" },
                      { icon: Twitter, label: "Twitter", detail: "@ACSSecura_official" },
                    ].map(({ icon: Icon, label, detail }) => (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <div className="p-2 rounded-full border-2 border-indigo-900 text-indigo-900">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="my-6 border-gray-300" />
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">Follow us for updates, tips, and promotions</p>
                    <p className="text-indigo-900 font-medium">Secura.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className="bg-white shadow-lg p-8 rounded-lg text-center border-2 border-gray-200">
                  <h3 className="text-2xl font-medium mb-4 text-indigo-900">Thank You!</h3>
                  <p className="text-gray-600 mb-4">
                    Your message has been received. We'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-indigo-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="bg-white shadow-lg rounded-lg border-2 border-gray-200 p-6">
                  <h3 className="text-xl text-indigo-900 font-semibold text-navy mb-6">
                    Send Us a Message
                  </h3>
                  <form onSubmit={confirmSubmit} className="space-y-4">
                    <div>
                      <label className="block font-medium">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-lg border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Message</label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-lg border-gray-300 h-36"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="flex w-full justify-center bg-indigo-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-800 cursor-pointer"
                    >
                      Send us a message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
