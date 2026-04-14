const LoyaltyService = require('./loyaltyService');

async function calculateTicket(
  basePrice,
  baggageWeight,
  classType,
  passport
) {
  if (basePrice < 1000) {
    throw new Error('Минимальная стоимость билета — 1000');
  }

  if (baggageWeight < 0) {
    throw new Error('Вес багажа не может быть отрицательным');
  }

  if (!['economy', 'business'].includes(classType)) {
    throw new Error('Некорректный класс обслуживания');
  }

  let total = basePrice;

  if (baggageWeight > 20) {
    total += 2000;
  }

  let discountValue = 0;
  let businessCoefficient = 1.5; 

  try {
    const response = await LoyaltyService.getDiscount(passport);
    
    if (response && typeof response === 'object') {
      if (typeof response.discount === 'number') {
        discountValue = response.discount;
      }
      
      if (classType === 'business' && typeof response.businessCoefficient === 'number') {
        businessCoefficient = response.businessCoefficient;
      }
    }
  } catch (error) {
    discountValue = 0;
    businessCoefficient = 1.5;
  }

  if (classType === 'business') {
    total *= businessCoefficient;
  }

  total = total - (total * discountValue) / 100;
  
  total = Number(total.toFixed(2));

  return {
    finalPrice: total,
    appliedDiscount: discountValue
  };
}

module.exports = calculateTicket;