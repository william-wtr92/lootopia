export const cities = [
  {
    name: "Paris",
    position: { lat: 48.8566, lng: 2.3522 },
  },
  {
    name: "Marseille",
    position: { lat: 43.2965, lng: 5.3698 },
  },
  {
    name: "Lyon",
    position: { lat: 45.7578, lng: 4.832 },
  },
  {
    name: "Toulouse",
    position: { lat: 43.6047, lng: 1.4442 },
  },
  {
    name: "Nice",
    position: { lat: 43.7102, lng: 7.262 },
  },
  {
    name: "Nantes",
    position: { lat: 47.2184, lng: -1.5536 },
  },
  {
    name: "Montpellier",
    position: { lat: 43.6109, lng: 3.8772 },
  },
  {
    name: "Strasbourg",
    position: { lat: 48.5734, lng: 7.7521 },
  },
  {
    name: "Bordeaux",
    position: { lat: 44.8378, lng: -0.5792 },
  },
  {
    name: "Lille",
    position: { lat: 50.6292, lng: 3.0573 },
  },
  {
    name: "Rennes",
    position: { lat: 48.1173, lng: -1.6777 },
  },
  {
    name: "Reims",
    position: { lat: 49.2583, lng: 4.0319 },
  },
  {
    name: "Le Havre",
    position: { lat: 49.4938, lng: 0.1077 },
  },
  {
    name: "Saint-Étienne",
    position: { lat: 45.4397, lng: 4.3872 },
  },
  {
    name: "Toulon",
    position: { lat: 43.1242, lng: 5.928 },
  },
  {
    name: "Grenoble",
    position: { lat: 45.1885, lng: 5.7245 },
  },
  {
    name: "Dijon",
    position: { lat: 47.3216, lng: 5.0415 },
  },
  {
    name: "Angers",
    position: { lat: 47.4784, lng: -0.5632 },
  },
  {
    name: "Nîmes",
    position: { lat: 43.8367, lng: 4.3601 },
  },
  {
    name: "Villeurbanne",
    position: { lat: 45.7719, lng: 4.8902 },
  },
  {
    name: "Clermont-Ferrand",
    position: { lat: 45.7772, lng: 3.087 },
  },
  {
    name: "Le Mans",
    position: { lat: 48.0061, lng: 0.1996 },
  },
  {
    name: "Aix-en-Provence",
    position: { lat: 43.5297, lng: 5.4474 },
  },
  {
    name: "Brest",
    position: { lat: 48.3904, lng: -4.4861 },
  },
  {
    name: "Tours",
    position: { lat: 47.3941, lng: 0.6848 },
  },
  {
    name: "Amiens",
    position: { lat: 49.8941, lng: 2.2957 },
  },
  {
    name: "Limoges",
    position: { lat: 45.8336, lng: 1.2611 },
  },
  {
    name: "Annecy",
    position: { lat: 45.8992, lng: 6.1289 },
  },
  {
    name: "Perpignan",
    position: { lat: 42.6887, lng: 2.8947 },
  },
  {
    name: "Metz",
    position: { lat: 49.1193, lng: 6.1757 },
  },
  {
    name: "Nancy",
    position: { lat: 48.6921, lng: 6.1844 },
  },
  {
    name: "Rouen",
    position: { lat: 49.4432, lng: 1.0999 },
  },
  {
    name: "Orléans",
    position: { lat: 47.9029, lng: 1.9093 },
  },
  {
    name: "Saint-Denis (La Réunion)",
    position: { lat: -20.8789, lng: 55.4481 },
  },
  {
    name: "Avignon",
    position: { lat: 43.9493, lng: 4.8055 },
  },
  {
    name: "Bayonne",
    position: { lat: 43.4939, lng: -1.4748 },
  },
  {
    name: "Béziers",
    position: { lat: 43.3442, lng: 3.2158 },
  },
  {
    name: "Pau",
    position: { lat: 43.2951, lng: -0.3708 },
  },
  {
    name: "La Rochelle",
    position: { lat: 46.1591, lng: -1.152 },
  },
  {
    name: "Mulhouse",
    position: { lat: 47.7508, lng: 7.3359 },
  },
  {
    name: "Chambéry",
    position: { lat: 45.5646, lng: 5.9178 },
  },
  {
    name: "Troyes",
    position: { lat: 48.297, lng: 4.0744 },
  },
  {
    name: "Caen",
    position: { lat: 49.1829, lng: -0.3707 },
  },
  {
    name: "Bourges",
    position: { lat: 47.081, lng: 2.3986 },
  },
  {
    name: "Poitiers",
    position: { lat: 46.5802, lng: 0.3404 },
  },
] as const

export type City = (typeof cities)[number]
export const OTHER_CITY_OPTION = "other"
