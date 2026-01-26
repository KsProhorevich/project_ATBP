function calculateTicketPrice(
  basePrice,
  baggageWeight,
  serviceClass,
  minBasePrice = 1000
) {
  if (basePrice < minBasePrice) {
    throw new Error(`Базовая стоимость не может быть ниже ${minBasePrice}`);
  }

  if (baggageWeight < 0) {
    throw new Error('Вес багажа не может быть отрицательным');
  }

  if (serviceClass !== 'economy' && serviceClass !== 'business') {
    throw new Error('Некорректный класс обслуживания');
  }

  let totalPrice = basePrice;

  const baggageLimit = 20;
  const overweightFee = 2000;

  if (baggageWeight > baggageLimit) {
    totalPrice += overweightFee;
  }

  const businessCoefficient = 1.5;

  if (serviceClass === 'business') {
    totalPrice *= businessCoefficient;
  }

  return totalPrice;
}

module.exports = calculateTicketPrice;
