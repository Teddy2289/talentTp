import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
  Send,
  Clock,
  MessageCircle,
  Heart,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  // Animation variants pour Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen  text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-[#e1af30] rounded-full mr-2"></div>
            <div className="text-sm text-[#e1af30] font-medium">CONTACT</div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dis nous comment nous pouvons{" "}
            <span className="text-[#e1af30]">vous aider</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Nous sommes à votre écoute pour discuter et répondre à toutes vos
            questions.
          </p>
        </motion.div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne informations de contact */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-8">
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <MessageCircle className="mr-2 text-[#e1af30]" size={24} />
                <span className="text-[#e1af30]">Informations</span> de contact
              </h2>

              <div className="space-y-6">
                <motion.div
                  variants={itemVariants}
                  className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4 flex-shrink-0 mt-0.5">
                    <Phone className="h-5 w-5 text-[#e1af30]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Téléphone</h3>
                    <p className="text-gray-400 mt-1">+1 (234) 567-8901</p>
                    <p className="text-gray-400 text-sm">Lun-Ven, 9h-18h</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4 flex-shrink-0 mt-0.5">
                    <Mail className="h-5 w-5 text-[#e1af30]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Email</h3>
                    <p className="text-gray-400 mt-1">contact@nathierose.com</p>
                    <p className="text-gray-400 text-sm">Réponse sous 24h</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4 flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5 text-[#e1af30]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Adresse</h3>
                    <p className="text-gray-400 mt-1">123 Avenue de la Rose</p>
                    <p className="text-gray-400">75000 Paris, France</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-start group hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4 flex-shrink-0 mt-0.5">
                    <Clock className="h-5 w-5 text-[#e1af30]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-200">Horaires</h3>
                    <p className="text-gray-400 mt-1">Lundi - Vendredi</p>
                    <p className="text-gray-400">9h00 - 18h00</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Réseaux sociaux */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-800 shadow-lg">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <span>Suivez-</span>
                <span className="text-[#e1af30] mx-1">nous</span>
              </h3>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: "hover:bg-blue-600" },
                  { icon: Instagram, color: "hover:bg-pink-600" },
                  { icon: Youtube, color: "hover:bg-red-600" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 bg-gray-700 ${social.color} transition-all duration-300 rounded-full`}>
                    <social.icon size={18} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Note */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-[#e1af30]/10 to-[#e1af30]/5 p-6 rounded-2xl border border-[#e1af30]/20">
              <div className="flex items-start">
                <Heart className="h-5 w-5 text-[#e1af30] mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Nous prenons chaque demande au sérieux et nous engageons à
                  vous répondre dans les plus brefs délais.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Formulaire de contact - Prend 2 colonnes sur desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-800 shadow-lg h-full">
              <h2 className="text-2xl font-semibold mb-2 flex items-center">
                <Send className="mr-2 text-[#e1af30]" size={24} />
                <span className="text-[#e1af30]">Envoyez</span>-nous un message
              </h2>
              <p className="text-gray-400 mb-8">
                Remplissez le formulaire ci-dessous et nous vous recontacterons
                rapidement.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-900/20 border border-green-800/50 p-6 rounded-xl text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-green-400 mb-2">
                    Message envoyé avec succès!
                  </h3>
                  <p className="text-gray-300">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-300 mb-2">
                        Votre nom *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all placeholder-gray-500"
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2">
                        Votre email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all placeholder-gray-500"
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-2">
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all placeholder-gray-500"
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-2">
                      Votre message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#e1af30] focus:border-transparent outline-none transition-all placeholder-gray-500 resize-none"
                      placeholder="Décrivez-nous votre demande en détail..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
                    <Send className="mr-2" size={18} />
                    Envoyer le message
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
