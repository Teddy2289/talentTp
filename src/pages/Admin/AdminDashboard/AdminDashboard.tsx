import React from "react";
import {
  BarChart3,
  Users,
  Image,
  Folder,
  Shield,
  Settings,
  TrendingUp,
  ArrowUp,
  Eye,
  Download,
} from "lucide-react";

function AdminDashboard() {
  // Données statistiques (simulées)
  const stats = [
    {
      label: "Utilisateurs actifs",
      value: "2,456",
      change: "+12%",
      icon: Users,
      trend: "up",
    },
    {
      label: "Photos téléchargées",
      value: "14,223",
      change: "+8%",
      icon: Image,
      trend: "up",
    },
    {
      label: "Catégories créées",
      value: "86",
      change: "+3%",
      icon: Folder,
      trend: "up",
    },
    {
      label: "Modèles disponibles",
      value: "24",
      change: "0%",
      icon: Shield,
      trend: "neutral",
    },
  ];

  // Activités récentes (simulées)
  const recentActivities = [
    {
      user: "Marie Dupont",
      action: "a téléchargé 5 photos",
      time: "Il y a 10 min",
    },
    {
      user: "Jean Martin",
      action: "a créé une nouvelle catégorie",
      time: "Il y a 30 min",
    },
    {
      user: "Admin System",
      action: "a effectué une sauvegarde",
      time: "Il y a 2 heures",
    },
    {
      user: "Sophie Leroy",
      action: "a modifié ses paramètres",
      time: "Il y a 5 heures",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">
            Bienvenue dans votre espace administrateur
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
            <Download className="h-4 w-4 mr-2" />
            Exporter le rapport
          </button>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </h3>
                  <div
                    className={`flex items-center mt-2 text-sm ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}>
                    {stat.trend === "up" && (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique principal */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Activité du site
            </h2>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Période:</span>
              <select className="border border-gray-200 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option>3 derniers mois</option>
              </select>
            </div>
          </div>

          {/* Espace pour graphique (simulé) */}
          <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-indigo-400 mx-auto mb-2" />
              <p className="text-gray-500">Visualisation du graphique</p>
              <p className="text-sm text-gray-400">
                (Intégration avec bibliothèque de graphiques)
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
              <span className="text-sm text-gray-600">Visites</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-sm text-gray-600">Téléchargements</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">Inscriptions</span>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Activité récente
            </h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              Voir tout
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Eye className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section inférieure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prochaines tâches */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Tâches à venir
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white shadow-sm mr-3">
                  <Settings className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Mise à jour système
                  </p>
                  <p className="text-xs text-gray-500">Demain à 10:00</p>
                </div>
              </div>
              <button className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-md">
                Démarrer
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white shadow-sm mr-3">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Vérification de sécurité
                  </p>
                  <p className="text-xs text-gray-500">Dans 3 jours</p>
                </div>
              </div>
              <button className="text-xs bg-amber-600 text-white px-2 py-1 rounded-md">
                Planifier
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-white shadow-sm mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Rapport mensuel
                  </p>
                  <p className="text-xs text-gray-500">Dans 1 semaine</p>
                </div>
              </div>
              <button className="text-xs bg-green-600 text-white px-2 py-1 rounded-md">
                Préparer
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Statistiques rapides
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">78%</div>
              <div className="text-sm text-gray-600 mt-1">
                Taux de rétention
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">2.3x</div>
              <div className="text-sm text-gray-600 mt-1">Engagement moyen</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">4.7</div>
              <div className="text-sm text-gray-600 mt-1">
                Satisfaction (sur 5)
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-600">12.5s</div>
              <div className="text-sm text-gray-600 mt-1">
                Temps moyen session
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Performance globale</span>
              <span className="font-semibold text-green-600">Excellent</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "92%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
