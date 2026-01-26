const calculateTicketPrice = require('./ticketPrice');

describe('Функция calculateTicketPrice', () => {

  describe('Позитивные сценарии', () => {

    test('Эконом-класс без перевеса', () => {
      const result = calculateTicketPrice(5000, 15, 'economy');
      expect(result).toBe(5000);
    });

    test('Эконом-класс с перевесом', () => {
      const result = calculateTicketPrice(5000, 25, 'economy');
      expect(result).toBe(7000);
    });

    test('Бизнес-класс без перевеса', () => {
      const result = calculateTicketPrice(4000, 10, 'business');
      expect(result).toBe(6000);
    });

    test('Бизнес-класс с перевесом', () => {
      const result = calculateTicketPrice(4000, 30, 'business');
      expect(result).toBe(9000);
    });

  });

  describe('Граничные значения', () => {

    test('Вес багажа ровно 20 кг (без доплаты)', () => {
      const result = calculateTicketPrice(3000, 20, 'economy');
      expect(result).toBe(3000);
    });

    test('Базовая стоимость равна минимальному тарифу', () => {
      const result = calculateTicketPrice(1000, 10, 'economy', 1000);
      expect(result).toBe(1000);
    });

  });

  describe('Негативные сценарии', () => {

    test('Ошибка при базовой стоимости ниже минимальной', () => {
      expect(() => {
        calculateTicketPrice(500, 10, 'economy');
      }).toThrow('Базовая стоимость не может быть ниже');
    });

    test('Ошибка при отрицательном весе багажа', () => {
      expect(() => {
        calculateTicketPrice(3000, -5, 'economy');
      }).toThrow('Вес багажа не может быть отрицательным');
    });

    test('Ошибка при некорректном классе обслуживания', () => {
      expect(() => {
        calculateTicketPrice(3000, 10, 'vip');
      }).toThrow('Некорректный класс обслуживания');
    });

  });

});
