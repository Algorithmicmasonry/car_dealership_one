"use client";
import { phoneNumberWithoutFormatting } from "@/utils";
import Link from "next/link";
import React, { useState } from "react";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the form data to your backend
  };

  return (
    <section id="contact-us" className="bg-gray-100 py-16 px-4 mt-[40px]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl lg:text-5xl font-bold text-primary-blue mb-2">
          Get In Touch
        </h2>
        <p className="text-gray-600 mb-8 pb-4">
          Streamline your processes and empower your team with our products.
          Effortlessly manage employee data, and more.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <div className="bg-primary-blue text-white p-6 rounded-2xl">
              <h3 className="font-semibold text-xl mb-2">
                Speak to someone in sales
              </h3>
              <p className="text-sm mb-4 py-4">
                To create a more value-added solution, is essential to an
                analysis of the possibilities of improvement.
              </p>
              <a
                href="mailto:oamenemmanuel22@gmail.com?subject=Car%20Purchase%20Inquiry&body=Hi%2C%20I%27m%20interested%20in%20buying%20a%20car%20I%20saw%20on%20your%20website.%20My%20offer%20price%20is%20%3A"
                className="bg-white text-primary-blue px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition duration-300"
              >
                Send an Email
              </a>
            </div>
            <div className="bg-white p-6 rounded-2xl text-gray-900 font-md">
              <h3 className="font-semibold mb-2 text-xl">
                Contact to our team
              </h3>
              <p className="text-sm mb-4 py-4">
                To create a more value-added solution, is essential to an
                analysis of the possibilities of improvement.
              </p>
              <Link
                href={`https://wa.me/${phoneNumberWithoutFormatting}?text=${encodeURIComponent(
                  `Hello, I'm interested in making an offer for a car `
                )}`}
                target="_blank"
                className="bg-primary-blue text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition duration-300"
              >
                Message Us on Whatsapp
              </Link>
            </div>
          </div>

          <div className="col-span-2 bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="p-2 border border-gray-300 rounded"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="p-2 border border-gray-300  rounded"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full border-gray-300  p-2 border rounded mb-4"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full border-gray-300  p-2 border rounded mb-4"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                className="w-full border-gray-300  p-2 border rounded mb-4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button
                type="submit"
                className="bg-primary-blue text-white px-6 py-2.5 rounded-full font-semibold hover:bg-white hover:text-primary-blue hover:border-2 border-primary-blue transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
