export const appName="carhub"

export const sellingPoints = ["Certified quality and inspection guarantee", "Transparent Pricing with No Hidden Fees", "24/7 Customer Support Team Available", "Easy-to-use website to compare vehicles"]

export const brands = [
  { name: "Mercedes-Benz", image: "/mercedes log.webp" },
  {
    name: "Lexus",
    image: "/lexus logo.webp",
  },
  {
    name: "Toyota",
    image: "/Toyota logo.webp",
  },

  {
    name: "Rolls-Royce",
    image: "/Roll royce lgog.webp",
  },
  {
    name: "Range-Rover",
    image: "/land rover logo.webp",
  },
  {
    name: "Bentley",
    image: "/bentley logo.webp",
  },
  {
    name: "Ford",
    image: "/ford logo.webp",
  },
  {
    name: "BMW",
    image: "/bmw logo.webp",
  },
  {
    name: "GAC",
    image: "/GAC logo.webp",
  },
  {
    name: "Innoson",
    image: "/innoson logo.webp",
  },
  {
    name: "NORD",
    image: "/nord logo.webp",
  },
  {
    name: "Peugeot",
    image: "/peugeot logo.webp",
  },
];

export const manufacturers = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MINI",
  "Mitsubishi",
  "Nissan",
  "Porsche",
  "Ram",
  "Rolls-Royce",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
  "Volvo",
  "GAC",
  "Innoson",
  "Nord",
  "Peugeot",
];

export const yearsOfProduction = [
  { title: "Year", value: "" },
  
  { title: "1990", value: "1990" },
  { title: "1991", value: "1991" },
  { title: "1992", value: "1992" },
  { title: "1993", value: "1993" },
  { title: "1994", value: "1994" },
  { title: "1995", value: "1995" },
  { title: "1996", value: "1996" },
  { title: "1997", value: "1997" },
  { title: "1998", value: "1998" },
  { title: "1999", value: "1999" },
  { title: "2000", value: "2000" },
  { title: "2001", value: "2001" },
  { title: "2002", value: "2002" },
  { title: "2003", value: "2003" },
  { title: "2004", value: "2004" },
  { title: "2005", value: "2005" },
  { title: "2006", value: "2006" },
  { title: "2007", value: "2007" },
  { title: "2008", value: "2008" },
  { title: "2009", value: "2009" },
  { title: "2010", value: "2010" },
  { title: "2011", value: "2011" },
  { title: "2012", value: "2012" },
  { title: "2013", value: "2013" },
  { title: "2014", value: "2014" },
  { title: "2015", value: "2015" },
  { title: "2016", value: "2016" },
  { title: "2017", value: "2017" },
  { title: "2018", value: "2018" },
  { title: "2019", value: "2019" },
  { title: "2020", value: "2020" },
  { title: "2021", value: "2021" },
  { title: "2022", value: "2022" },
  { title: "2023", value: "2023" },
  {title: "2024", value: "2024"},
  {title: "2025", value: "2025"}
];

export const fuels = [
  {
    title: "Petrol",
    value: "Petrol",
  },
  {
    title: "Gas",
    value: "Gas",
  },
  {
    title: "Electricity",
    value: "Electricity",
  },
];

// price ranges array
  export const priceRanges = [
    { label: "Below ₦1M", value: "0-1" },
    { label: "₦1M - ₦5M", value: "1-5" },
    { label: "₦5M - ₦10M", value: "5-10" },
    { label: "₦10M - ₦20M", value: "10-20" },
    { label: "₦20M - ₦50M", value: "20-50" },
    { label: "₦50M - ₦100M", value: "50-100" },
    { label: "₦100M - ₦200M", value: "100-200" },
    { label: "₦200M - ₦500M", value: "200-500" },
    { label: "Above ₦500M", value: "500+" },
  ];

export const footerLinks = [
  {
    title: "About",
    links: [
      { title: "How it works", url: "/" },
      { title: "Featured", url: "/" },
      { title: "Partnership", url: "/" },
      { title: "Bussiness Relation", url: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "Events", url: "/" },
      { title: "Blog", url: "/" },
      { title: "Podcast", url: "/" },
      { title: "Invite a friend", url: "/" },
    ],
  },
  {
    title: "Socials",
    links: [
      { title: "TikTok", url: "/" },
      { title: "Instagram", url: "/" },
      { title: "Twitter", url: "/" },
      { title: "Facebook", url: "/" },
    ],
  },
];

export const cars = [
  {
    "id": 1,
    "name": "Toyota Camry XSE",
    "images": [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop", // Front angle
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&auto=format&fit=crop", // Side angle
      "https://images.unsplash.com/photo-1547038577-da80abbc4f19?w=800&auto=format&fit=crop" // Rear angle
    ],
    "overview": "Reliable midsize sedan with premium features",
    "body": "Sedan",
    "mileage": 45000,
    "fuelType": "Petrol",
    "year": 2013,
    "transmission": "Automatic",
    "driveType": "All-Wheel Drive (AWD/4WD)",
    "condition": "Foreign Used",
    "engineSize": 2.5,
    "doors": 4,
    "cylinders": 4,
    "color": "Red",
    "price": 14000000,
    "manufacturer": "Toyota"
 
  },
  {
    "id": 2,
    "name": "Honda Accord EX-L",
    "images": [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605559424935-7382a1e0396c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605559424865-c3d1e8f9f932?w=800&auto=format&fit=crop"
    ],
    "overview": "Comfortable and efficient family sedan",
    "body": "Sedan",
    "mileage": 68000,
    "fuelType": "Petrol",
    "year": 2013,
    "transmission": "Automatic",
    "driveType": "Front-Wheel Drive",
    "condition": "Foreign Used",
    "engineSize": 2.4,
    "doors": 4,
    "cylinders": 4,
    "color": "Silver",
  "price": 14000000,
  "manufacturer": "Honda",
    
  },
  {
    "id": 3,
    "name": "Subaru Outback 2.5i",
    "images": [
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616788494707-ec28f08fd05a?w=800&auto=format&fit=crop"
    ],
    "overview": "Versatile all-weather wagon",
    "body": "Wagon",
    "mileage": 52000,
    "fuelType": "Petrol",
    "year": 2013,
    "transmission": "Automatic",
    "driveType": "All-Wheel Drive (AWD/4WD)",
    "condition": "Foreign Used",
    "engineSize": 2.5,
    "doors": 4,
    "cylinders": 4,
    "color": "Blue",
     "price": 14000000,
     "manufacturer": "Subaru",
    
  }
]