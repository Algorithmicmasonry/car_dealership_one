import { CarProps} from "@/types";


// export async function fetchCars () {
//   const headers = {
  
//       'x-rapidapi-key': 'e835c4a71fmshc0714cb5928a8f3p1ac50djsn332b1be8b92f',
//       'x-rapidapi-host': 'cars-by-api-ninjas.p.rapidapi.com'
//   }

//      const response = await fetch ('https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?model=carrera', {
//       headers: headers
//      });
  
//   const result = await response.json();
//   return result;
// }

export const formatCurrency = (value: string) => {
  // Remove any non-numeric characters except for digits
  const numericValue = value.replace(/[^\d]/g, '');
  
  // Don't process empty strings
  if (!numericValue) return '';
  
  // Format with commas but no currency symbol or decimal places
  return new Intl.NumberFormat('en-NG', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(Number(numericValue) || 0);
};


export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  console.log("Worthy")
} 

export const phoneNumber = "+2347048268704"
export const phoneNumberWithoutFormatting="2347048268704"