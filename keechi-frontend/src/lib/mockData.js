// src/lib/mockData.js
// Mock salon data for frontend testing/demonstration

export const MOCK_SALONS = [
  {
    id: 1,
    name: "Glamour Dhaka",
    area: "Banani",
    phone: "+880 1700 000001",
    address: "123 Banani Lane, Dhaka",
    services: "Haircut, Coloring, Spa Treatment, Facial",
    imageUrl: "https://images.unsplash.com/photo-1633374715981-1d82403d3ee7?w=500&h=400&fit=crop",
    rating: 4.8,
    description: "Premium salon offering professional services with experienced stylists and modern amenities.",
    timeSlots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"],
  },
  {
    id: 2,
    name: "Beauty Parlour Elite",
    area: "Dhanmondi",
    phone: "+880 1700 000002",
    address: "456 Dhanmondi Circle, Dhaka",
    services: "Makeup, Threading, Henna, Bridal Packages",
    imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop",
    rating: 4.6,
    description: "Specialized in makeup and bridal services. Expert team for all your beauty needs.",
    timeSlots: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"],
  },
  {
    id: 3,
    name: "Style Hub",
    area: "Uttara",
    phone: "+880 1700 000003",
    address: "789 Uttara Street, Dhaka",
    services: "Men's Haircut, Beard Grooming, Hair Wash, Massage",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-cd4628902d4a?w=500&h=400&fit=crop",
    rating: 4.7,
    description: "Men's grooming center with experienced barbers and modern tools.",
    timeSlots: ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"],
  },
];

export const getSalonById = (id) => {
  return MOCK_SALONS.find((salon) => salon.id === parseInt(id));
};

export const getSalonsByArea = (area) => {
  if (!area) return MOCK_SALONS;
  return MOCK_SALONS.filter((salon) =>
    salon.area.toLowerCase().includes(area.toLowerCase())
  );
};

export const getSalonsByService = (service) => {
  if (!service) return MOCK_SALONS;
  return MOCK_SALONS.filter((salon) =>
    salon.services.toLowerCase().includes(service.toLowerCase())
  );
};
