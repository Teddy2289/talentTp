import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  MapPinHouse,
  Phone,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Traitement du formulaire ici
    console.log("Formulaire soumis:", formData);
    // Réinitialiser le formulaire après soumission
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0c0c0c] text-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contactez-<span className="text-[#e1af30]">nous</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Nous sommes là pour répondre à toutes vos questions. Envoyez-nous un
            message et nous vous répondrons dans les plus brefs délais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-800/50">
            <h2 className="text-2xl font-semibold mb-6 text-[#e1af30]">
              Informations de contact
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4">
                  <Phone className="h-6 w-6 text-[#e1af30]" />
                </div>
                <div>
                  <h3 className="font-medium">Téléphone</h3>
                  <p className="text-gray-400">+1 (234) 567-8901</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4">
                  <Mail className="h-6 w-6 text-[#e1af30]" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-400">contact@nathierose.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4">
                  <MapPinHouse className="h-6 w-6 text-[#e1af30]" />
                </div>
                <div>
                  <h3 className="font-medium">Adresse</h3>
                  <p className="text-gray-400">123 Avenue de la Rose, Paris</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-medium mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <Link
                  to="#"
                  className="p-3 bg-gray-800 hover:bg-[#e1af30] transition-colors rounded-full">
                  <Facebook />
                </Link>
                <Link
                  to="#"
                  className="p-3 bg-gray-800 hover:bg-[#e1af30] transition-colors rounded-full">
                  <Instagram />
                </Link>
                <Link
                  to="#"
                  className="p-3 bg-gray-800 hover:bg-[#e1af30] transition-colors rounded-full">
                  <Youtube />
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-800/50">
            <h2 className="text-2xl font-semibold mb-6 text-[#e1af30]">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2">
                    Votre email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all"
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-300 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all"
                  placeholder="Objet de votre message"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-300 mb-2">
                  Votre message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all"
                  placeholder="Décrivez-nous votre demande..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Envoyer le message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
