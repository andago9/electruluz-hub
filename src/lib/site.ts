export const SITE = {
  name: "Ferretería Electroluz",
  phone: "+57 312 288 1095",
  phoneRaw: "573122881095",
  address: "Calle 11 #7-52, La Dorada, Caldas",
  hours: [
    { d: "Lunes a Viernes", h: "7:00 AM – 6:00 PM" },
    { d: "Sábados", h: "7:00 AM – 1:00 PM" },
    { d: "Domingos", h: "Cerrado" },
  ],
};

export const waLink = (msg = "Hola, quiero solicitar una cotización") =>
  `https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(msg)}`;
