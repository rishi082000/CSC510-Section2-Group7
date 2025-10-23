// src/data/Restaurants.jsx
import cozyCorner from "../assets/Cozy Corner.jpg";
import greengarden from "../assets/Green Garden.jpg";
import spicehub from "../assets/Spice Hub.jpg"; 
const restaurants = [
  {
    id: 101,
    name: "Green Garden",
    owner_id: "GG001",
    address: "123 Eco Street, Bangalore",
    phone: "+91 98765 43210",
    image: greengarden,
  },
  {
    id: 102,
    name: "Spice Hub",
    owner_id: "SH002",
    address: "56 Flavor Avenue, Hyderabad",
    phone: "+91 91234 56789",
    image: spicehub,
  },
  {
    id: 103,
    name: "Cozy Corner",
    owner_id: "CC003",
    address: "78 Comfort Lane, Chennai",
    phone: "+91 99876 54321",
    image: cozyCorner,
  },
];

export default restaurants;
