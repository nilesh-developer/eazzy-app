"use client"
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    // <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden"
    >

      {/* Navigation */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="bg-white shadow-sm fixed w-full z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href={"/"}>
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={110}
                    height={110}
                    className=""
                  />
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex lg:items-center lg:space-x-8">
                <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150">Home</a>
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150">How It Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150">Success Stories</a>
                <a href="#faq" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150">FAQ</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition duration-150">Contact</a>
              </div>
              <div className="lg:flex items-center hidden">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition duration-150">
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-blue-600 focus:outline-none transition"
                >
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    {isOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {isOpen && (
            <div className="lg:hidden bg-white shadow-lg z-30">
              <div className="px-4 pt-2 pb-4 space-y-2">
                {['Features', 'How It Works', 'Testimonials', 'FAQ', 'Contact'].map((item, i) => (
                  <a
                    key={i}
                    href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                    onClick={() => setIsOpen(false)}
                    className="block text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition"
                  >
                    {item}
                  </a>
                ))}
                <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </nav>
      </motion.div>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
              >
                <span className="block">Empowering Local</span>
                <span className="block text-blue-600">Businesses Online</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl"
              >
                Transform your local business into an online store in minutes. No coding. No investment. Just pure growth with hyperlocal delivery.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0"
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                  <a
                    href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-app/Eazzy.apk"
                    className="px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:text-lg shadow-md flex items-center justify-center gap-2 transition duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="lg:h-14 lg:w-14 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6.2 5l.8 2h12.3a1 1 0 0 1 .95 1.3l-1.6 5.1a2 2 0 0 1-1.9 1.4H9.1a2 2 0 0 1-1.9-1.3L5 4H2V2h3.6a1 1 0 0 1 .94.7z" />
                    </svg>
                    Download Eazzy Customer App
                  </a>
                  <a
                    href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-business-app/Eazzy-Business.apk"
                    className="px-8 py-3 text-base font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 md:text-lg shadow-sm flex items-center justify-center gap-2 transition duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="lg:h-14 lg:w-14 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9V7l1.5-4h15L21 7v2c0 .7-.2 1.4-.5 2H20v9a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9h-.5A3 3 0 0 1 3 9zm2 0h14V7.2l-1.3-3.2H6.3L5 7.2V9z" />
                    </svg>

                    Download Eazzy Business App
                  </a>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            >
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <Image
                      className="w-full h-full" // object-cover
                      src="/eazzy-banner.png"
                      fill
                      alt="App screenshot"
                    />
                  </div>
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <svg className="h-20 w-20 text-blue-500" fill="currentColor" viewBox="0 0 84 84">
                      <circle opacity="0.9" cx="42" cy="42" r="42" fill="white" />
                      <path d="M55 42L35 55V29L55 42Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="mt-5 text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to sell online
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Eazzy App provides all the tools local businesses need to create, manage, and grow their online presence.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <motion.div
                whileHover={{ y: -10 }}
                className="flex flex-col bg-blue-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Instant Store Creation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Set up your online store in minutes without any coding knowledge or upfront investment.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="flex flex-col bg-blue-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">QR Code Sharing</h3>
                <p className="mt-2 text-base text-gray-500">
                  Share your store&apos;s unique QR code with local customers for easy access to your products.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="flex flex-col bg-blue-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Doorstep Delivery</h3>
                <p className="mt-2 text-base text-gray-500">
                  Customers place orders through the app and receive their purchases right at their doorstep.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                className="flex flex-col bg-blue-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Hyperlocal Commerce</h3>
                <p className="mt-2 text-base text-gray-500">
                  Focus on nearby customers to provide faster deliveries and build a loyal customer base.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="mt-5 text-base text-blue-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple steps to get started
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Getting your business online has never been easier with our intuitive platform.
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              {/* Connection line */}
              <div className="hidden md:block absolute top-8 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>

              <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                    1
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Download &amp; Register</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Download the Eazzy Business App and create your business account in minutes.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                    2
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Create Your Store</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Add your products, set prices, and customize your online store.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                    3
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Share Your QR Code</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Display your store&apos;s QR code for customers to scan and add store.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold mb-6">
                    4
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Start Selling</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Receive orders, manage deliveries, and grow your business online!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {/* Customer App */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-extrabold text-gray-900">Customer App</h2>
              <p className="text-lg text-gray-600">
                Browse local stores, order products, and get them delivered right to your doorstep &ndash; all from one easy-to-use app.
              </p>
              <a
                href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-app/Eazzy.apk"
                className="inline-flex items-center px-4 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                Download Customer App
              </a>
              <div className="grid grid-cols-2 gap-4 border-t pt-6 mt-6 border-gray-200">
                {[
                  'Discover local shops',
                  'Easy checkout process',
                  'Real-time order tracking',
                  'Secure payment options',
                ].map((text, i) => (
                  <div key={i} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="ml-3 text-base text-gray-500">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 lg:mt-0 flex justify-center"
            >
              <Image
                src="/eazzy-customer.png"
                alt="Customer app interface"
                width={400}
                height={600}
                className="rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 object-contain"
              />
            </motion.div>
          </div>

          {/* Business App */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center lg:grid-flow-col-dense">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-10 lg:mt-0 flex justify-center"
            >
              <Image
                src="/eazzy-business.png"
                alt="Business app interface"
                width={400}
                height={600}
                className="rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 object-contain"
              />
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl mt-5 font-extrabold text-gray-900">Business App</h2>
              <p className="text-lg text-gray-600">
                Create and manage your online store, process orders, and grow your business with powerful yet simple tools.
              </p>
              <a
                href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-business-app/Eazzy-Business.apk"
                className="inline-flex items-center px-4 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md"
              >
                Download Business App
              </a>
              <div className="grid grid-cols-2 gap-4 border-t pt-6 mt-6 border-gray-200">
                {[
                  'Easy inventory management',
                  'Order processing',
                  'Business analytics',
                  'QR code generator',
                ].map((text, i) => (
                  <div key={i} className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="ml-3 text-base text-gray-500">{text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="mt-5 text-base text-blue-600 font-semibold tracking-wide uppercase">Success Stories</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by local businesses
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              See how Eazzy App has transformed local businesses across the country.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-blue-600">
                      SB
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Sarah Baker</h3>
                      <p className="text-sm text-gray-500">Sweet Delights Bakery</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    &quot;Eazzy App transformed my small bakery. I now receive orders online and have expanded my customer base by 70% in just three months!&quot;
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-blue-600">
                      MC
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Michael Chen</h3>
                      <p className="text-sm text-gray-500">Handcrafted Treasures</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    &quot;As a local artisan, I struggled to reach customers beyond my neighborhood. With Eazzy App, I&apos;ve connected with buyers across the city without any technical knowledge.&quot;
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-blue-600">
                      PP
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Priya Patel</h3>
                      <p className="text-sm text-gray-500">Fresh Market Groceries</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    &quot;Setting up an online store seemed overwhelming until I found Eazzy App. The QR code feature has been a game-changer for my small grocery shop!&quot;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="mt-5 text-base text-blue-600 font-semibold tracking-wide uppercase">FAQ</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to know about Eazzy App.
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">How much does it cost to use Eazzy App?</h3>
                <p className="mt-2 text-gray-600">
                  Eazzy App is free to download and set up. We charge a small commission on successful sales, so you only pay when you make money.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">Do I need technical knowledge to create my store?</h3>
                <p className="mt-2 text-gray-600">
                  Absolutely not! Our intuitive interface is designed for everyone. If you can take photos of your products and fill out simple forms, you can create your online store.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">How does the delivery process work?</h3>
                <p className="mt-2 text-gray-600">
                  You can either handle deliveries yourself or use our network of delivery partners. The app provides real-time tracking and notifications for both you and your customers.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">How do I receive payments from customers?</h3>
                <p className="mt-2 text-gray-600">
                  Eazzy App supports multiple payment methods including credit/debit cards, digital wallets, and cash on delivery. Payments are securely processed and transferred to your linked bank account.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900">Can I integrate Eazzy App with my existing systems?</h3>
                <p className="mt-2 text-gray-600">
                  Yes, Eazzy App provides API integration options for businesses that want to connect with their existing inventory management, POS, or accounting systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download-section" className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Ready to transform your business?
              </h2>
              <p className="mt-4 text-lg">
                Download Eazzy App today and start selling online in minutes. No coding skills or large investments required.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div>
                  <a href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-app/Eazzy.apk" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 shadow-lg transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Download Eazzy Customer App
                  </a>
                </div>

                <div>
                  <a href="https://github.com/nilesh-developer/eazzy-app/releases/download/eazzy-business-app/Eazzy-Business.apk" className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-700 transition duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Download Eazzy Business App
                  </a>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">10k+</div>
                  <div className="text-sm">Active Users</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">5k+</div>
                  <div className="text-sm">Businesses</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">50k+</div>
                  <div className="text-sm">Orders Processed</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold">15+</div>
                  <div className="text-sm">Cities Covered</div>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="relative z-10 flex items-center justify-center">
                    <div className="flex flex-col space-y-4">
                      <div className='h-96 w-full'>
                      <Image
                        src="/eazzy-icon.jpg"
                        alt="Eazzy App on mobile phone"
                        fill
                        className="object-cover rounded-xl shadow-2xl"
                      />
                      </div>
                      <div className="bg-white rounded-lg shadow-2xl p-4 transform -rotate-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-800">Available on Google Play & App Store</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="mt-5 text-base text-blue-600 font-semibold tracking-wide uppercase">Contact</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get in touch with us
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Have questions about Eazzy App? Our team is here to help.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Email Us</h3>
              <p className="text-gray-500 mb-3">For general inquiries and support</p>
              <a href="mailto:mail.eazzystore@gmail.com" className="text-blue-600 font-medium hover:text-blue-700">mail.eazzystore@gmail.com</a>
            </div>

            <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Call Us</h3>
              <p className="text-gray-500 mb-3">Mon-Fri from 9am to 6pm</p>
              <a href="tel:+1234567890" className="text-blue-600 font-medium hover:text-blue-700">+91 99204 75160</a>
            </div>

            <div className="bg-blue-50 rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Chat With Us</h3>
              <p className="text-gray-500 mb-3">Live chat support available</p>
              <a href="#" className="text-blue-600 font-medium hover:text-blue-700">Open Live Chat</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Eazzy</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <p>© 2025 Eazzy. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add animation style */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: scale(1);
          }
          33% {
            transform: scale(1.1);
          }
          66% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      {/* </div> */}
    </motion.div>
  );
};