export function formatKSh(amount: number): string {
  if (isNaN(amount)) return 'KSh 0';
  return 'KSh ' + Math.round(amount).toLocaleString('en-KE');
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return Math.round(val).toLocaleString('en-KE');
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  // Strip non-digits
  let cleanNumber = phone.replace(/\D/g, '');
  // If starts with 07..., convert to Kenyan country code 2547...
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '254' + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith('254') && cleanNumber.length === 9) {
    cleanNumber = '254' + cleanNumber;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildTelUrl(phone: string): string {
  const cleanNumber = phone.replace(/\s+/g, '');
  return `tel:${cleanNumber}`;
}

export function calculateMonthlyPayment(price: number, depositPercent: number, months: number, annualInterestRatePercent: number): {
  depositAmount: number;
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
} {
  const depositAmount = (price * depositPercent) / 100;
  const loanAmount = Math.max(0, price - depositAmount);

  if (loanAmount <= 0 || months <= 0) {
    return {
      depositAmount,
      loanAmount: 0,
      monthlyPayment: 0,
      totalInterest: 0,
      totalRepayment: 0
    };
  }

  // Monthly interest rate
  const monthlyRate = (annualInterestRatePercent / 100) / 12;

  // Standard amortized loan formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / months;
  } else {
    const factor = Math.pow(1 + monthlyRate, months);
    monthlyPayment = (loanAmount * monthlyRate * factor) / (factor - 1);
  }

  const totalRepayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  return {
    depositAmount,
    loanAmount,
    monthlyPayment: Math.round(monthlyPayment),
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalRepayment)
  };
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
