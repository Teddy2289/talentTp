import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Apropos() {
  return (
    <section
      id="about"
      className="py-20 my-20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#e1af30] mb-6">
            À propos de Nous
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez une expérience de conversation unique où l'attention,
            l'empathie et la confidentialité sont nos priorités absolues.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-800/50">
            <div className="flex items-center mb-6">
              <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#e1af30]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 极速赛车开奖结果 极速赛车开奖直播 极速赛车开奖记录A11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold">
                Notre engagement sécurité
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              Chez Nathie Rose, votre sécurité et votre confidentialité sont au
              cœur de nos préoccupations. Nous utilisons des technologies de
              chiffrement de pointe pour garantir que toutes vos conversations
              restent privées et sécurisées.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#e1af30] mt-1 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300">
                  Chiffrement de bout en bout pour toutes les conversations
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#e1af30] mt-1 mr-3"
                  viewBox="0 极速赛车开奖结果 极速赛车开奖直播 极速赛车开奖记录0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8极速赛车开奖结果 极速赛车开奖直播 极速赛车开奖记录 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300">
                  Aucune donnée de conversation stockée sur nos serveurs
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#e1af30] mt-1 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414极速赛车开奖结果 极速赛车开奖直播 极速赛车开奖记录L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0极速赛车开奖结果 极速赛车开奖直播 极速赛车开奖记录l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300">
                  Protection avancée contre les violations de données
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#e1af30] mt-1 mr-3"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300">
                  Anonymat garanti pour tous les utilisateurs
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-800/50">
            <div className="flex items-center mb-6">
              <div className="bg-[#e1af30]/10 p-3 rounded-lg mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#e1af30]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold">
                Vie privée et confidentialité
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              Nous croyons fermement au droit à la vie privée. C'est pourquoi
              nous avons conçu Nathie Rose avec des principes stricts de
              protection des données et de respect de votre anonymat.
            </p>
            <div className="bg-[#e1af30]/10 border border-[#e1af30]/20 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-[#e1af30] mb-2">
                Notre politique de confidentialité
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-[#e1af30] mr-2">•</span>
                  <span>
                    Nous ne vendons ni ne partageons vos données personnelles
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e1af30] mr-2">•</span>
                  <span>
                    Vous pouvez supprimer toutes vos données à tout moment
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e1af30] mr-2">•</span>
                  <span>Aucune trace de vos conversations n'est conservée</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#e1af30] mr-2">•</span>
                  <span>
                    Option de conversation anonyme sans inscription requise
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gray-900/70 backdrop-blur-lg p-8 rounded-2xl border border-gray-700/50 max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <div className="bg-red-500/10 p-3 rounded-lg mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white">
              Avertissement important
            </h3>
          </div>

          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-red-400 mb-3 text-lg">
              ⚠️ ACCÈS RÉSERVÉ AUX PERSONNES Majeures
            </h4>
            <p className="text-gray-300">
              Ce service est strictement réservé aux personnes âgées de 18 ans
              et plus. En accédant à nos services, vous certifiez avoir atteint
              l'âge légal de la majorité dans votre pays de résidence et
              comprenez le caractère adulte des interactions proposées.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6">
            <h4 className="font-semibold text-[#e1af30] mb-3">
              Mentions légales
            </h4>
            <p className="text-gray-300 mb-4">
              <strong>Éditeur du site :</strong> Nathie Rose SAS
              <br />
              <strong>Capital social :</strong> 50 000 €<br />
              <strong>Siège social :</strong> 123 Avenue de la Rose, 75000 Paris
              <br />
              <strong>RCS :</strong> Paris 123 456 789
              <br />
              <strong>Numéro de TVA intracommunautaire :</strong> FR 12
              123456789
              <br />
              <strong>Email :</strong> legal@nathierose.com
            </p>
            <p className="text-gray-300">
              <strong>Hébergeur :</strong> Secure Hosting Ltd.
              <br />
              <strong>Adresse :</strong> Data Center, 456 Cloud Street, Dublin,
              Irlande
              <br />
              <strong>Téléphone :</strong> +353 1 234 5678
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16">
          <h3 className="text-2xl font-semibold text-[#e1af30] mb-6">
            Des questions sur notre politique de sécurité ?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos
            interrogations concernant la protection de vos données et notre
            engagement en matière de confidentialité.
          </p>
          <Link
            to="/#contact"
            className="bg-gradient-to-r from-[#e1af30] to-[#f3c754] text-gray-900 font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all">
            Contactez notre équipe
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Apropos;
