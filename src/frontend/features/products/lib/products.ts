export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  images: string[];
};

export const categories: Category[] = [
  { id: "tejidos", name: "Tejidos", description: "Lanas, hilos y agujas" },
  { id: "pinturas", name: "Pinturas", description: "Acrílicos y acuarelas" },
  {
    id: "herramientas",
    name: "Herramientas",
    description: "Tijeras, pistolas y más",
  },
  { id: "papeleria", name: "Papelería", description: "Cartulinas y stickers" },
  { id: "bisuteria", name: "Bisutería", description: "Cuentas y dijes" },
];

export const categoryName = (id: string): string =>
  categories.find((c) => c.id === id)?.name ?? id;

export const products: Product[] = [
  {
    id: "p1",
    name: "Madeja de Lana Merino",
    price: 8.5,
    category: "tejidos",
    description:
      "Lana 100% merino suave al tacto, ideal para bufandas, gorros y prendas de invierno. Disponible en una amplia gama de colores pastel.",
    stock: 42,
    images: ["/products/p1-a.png", "/products/p1-b.png"],
  },
  {
    id: "p2",
    name: "Set de Ganchillos de Bambú",
    price: 12.9,
    category: "tejidos",
    description:
      "Juego de 9 ganchillos de bambú natural con mango ergonómico. Ligeros, resistentes y perfectos para sesiones largas de crochet.",
    stock: 18,
    images: ["/products/p2-a.png", "/products/p2-b.png"],
  },
  {
    id: "p3",
    name: "Set de Acrílicos Vibrantes",
    price: 19.99,
    category: "pinturas",
    description:
      "Caja de 24 pinturas acrílicas de alta pigmentación y secado rápido. Colores intensos que no se decoloran, aptas para lienzo, madera y cerámica.",
    stock: 30,
    images: ["/products/p3-a.png", "/products/p3-b.png"],
  },
  {
    id: "p4",
    name: "Acuarelas Profesionales",
    price: 24.5,
    category: "pinturas",
    description:
      "Paleta de 36 acuarelas profesionales en pastillas. Colores luminosos y mezclables, incluye pincel de viaje recargable.",
    stock: 0,
    images: ["/products/p4-a.png", "/products/p4-b.png"],
  },
  {
    id: "p5",
    name: "Pistola de Silicona Caliente",
    price: 14.0,
    category: "herramientas",
    description:
      "Pistola de silicona de calentamiento rápido con soporte plegable. Incluye 10 barras de pegamento transparente. Esencial para manualidades y decoración.",
    stock: 25,
    images: ["/products/p5-a.png", "/products/p5-b.png"],
  },
  {
    id: "p6",
    name: "Kit de Tijeras y Cutter",
    price: 16.75,
    category: "herramientas",
    description:
      "Set de precisión con tijeras de bordes decorativos, cutter de seguridad y base de corte autorreparable A5. Para scrapbooking y proyectos de papel.",
    stock: 12,
    images: ["/products/p6-a.png", "/products/p6-b.png"],
  },
  {
    id: "p7",
    name: "Cartulinas de Colores",
    price: 6.25,
    category: "papeleria",
    description:
      "Paquete de 50 cartulinas de doble cara en 25 tonos surtidos. Papel grueso de 250g, perfecto para origami, tarjetas y collages.",
    stock: 60,
    images: ["/products/p7-a.png", "/products/p7-b.png"],
  },
  {
    id: "p8",
    name: "Cuentas y Mostacillas",
    price: 9.4,
    category: "bisuteria",
    description:
      "Organizador con más de 1200 cuentas de colores en distintos tamaños y formas. Incluye hilo elástico para crear pulseras y collares.",
    stock: 8,
    images: ["/products/p8-a.png", "/products/p8-b.png"],
  },
];
