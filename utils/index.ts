import { CarProps} from "@/types";



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


export const phoneNumber = "+2347048268704"
export const phoneNumberWithoutFormatting="2347048268704"