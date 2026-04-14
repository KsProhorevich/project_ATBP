const calculateTicket = require('./ticketCalculator');
const LoyaltyService = require('./loyaltyService');

jest.mock('./loyaltyService', () => ({
  getDiscount: jest.fn()
}));

describe('calculateTicket — тестирование с Mock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('LoyaltyService.getDiscount возвращает объект со скидкой', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 15 });
    
    const result = await LoyaltyService.getDiscount('12345');
    
    expect(result).toEqual({ discount: 15 });
    expect(result).toHaveProperty('discount');
    expect(typeof result.discount).toBe('number');
  });

  test('LoyaltyService.getDiscount может вернуть коэффициент бизнес-класса', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ 
      discount: 10,
      businessCoefficient: 1.8 
    });
    
    const result = await LoyaltyService.getDiscount('67890');
    
    expect(result).toHaveProperty('discount', 10);
    expect(result).toHaveProperty('businessCoefficient', 1.8);
  });

  test('LoyaltyService.getDiscount выбрасывает ошибку', async () => {
    LoyaltyService.getDiscount.mockRejectedValue(new Error('API Error'));
    
    await expect(LoyaltyService.getDiscount('error')).rejects.toThrow('API Error');
  });

  test('Должен корректно рассчитать билет со скидкой', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 10 });

    const result = await calculateTicket(
      2000,
      10,
      'economy',
      '1234'
    );

    expect(result.finalPrice).toBe(1800);
    expect(result.appliedDiscount).toBe(10);
    expect(LoyaltyService.getDiscount).toHaveBeenCalledWith('1234');
  });

  test('Бизнес-класс с перевесом и 20% скидкой', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 20 });

    const result = await calculateTicket(
      2000,
      25,
      'business',
      '9999'
    );
    expect(result.finalPrice).toBe(4800);
  });

  test('Бизнес-класс с кастомным коэффициентом из сервиса лояльности', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ 
      discount: 15,
      businessCoefficient: 2.0 
    });

    const result = await calculateTicket(
      2000,
      15,
      'business',
      '5555'
    );
    expect(result.finalPrice).toBe(3400);
  });

  test('Бизнес-класс с перевесом и кастомным коэффициентом', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ 
      discount: 10,
      businessCoefficient: 1.8 
    });

    const result = await calculateTicket(
      2000,
      25,
      'business',
      '6666'
    );

    expect(result.finalPrice).toBe(6480);
  });

  test('Обрабатывает отсутствие поля discount в ответе', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ 
      businessCoefficient: 1.5 
    });

    const result = await calculateTicket(
      2000,
      10,
      'economy',
      '7777'
    );

    expect(result.finalPrice).toBe(2000);
    expect(result.appliedDiscount).toBe(0);
  });

  test('Бизнес-класс с отсутствием поля discount в ответе', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ 
      businessCoefficient: 1.8 
    });

    const result = await calculateTicket(
      2000,
      10,
      'business',
      '7777'
    );

    expect(result.finalPrice).toBe(3600);
    expect(result.appliedDiscount).toBe(0);
  });

  test('Если LoyaltyService возвращает ошибку — скидка 0% и стандартный коэффициент', async () => {
    LoyaltyService.getDiscount.mockRejectedValue(
      new Error('Service unavailable')
    );

    const result = await calculateTicket(
      2000,
      25,
      'business',
      '0000'
    );
    expect(result.finalPrice).toBe(6000);
    expect(result.appliedDiscount).toBe(0);
  });

  test('Обрабатывает некорректный ответ сервиса (строка вместо объекта)', async () => {
    LoyaltyService.getDiscount.mockResolvedValue('10%');

    const result = await calculateTicket(
      2000,
      10,
      'economy',
      '8888'
    );

    expect(result.finalPrice).toBe(2000);
    expect(result.appliedDiscount).toBe(0);
  });

  test('Ошибка при минимальной цене', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 10 });
    
    await expect(
      calculateTicket(500, 10, 'economy', '1')
    ).rejects.toThrow('Минимальная стоимость билета — 1000');
  });

  test('Ошибка при отрицательном багаже', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 10 });
    
    await expect(
      calculateTicket(2000, -5, 'economy', '1')
    ).rejects.toThrow('Вес багажа не может быть отрицательным');
  });

  test('Ошибка при некорректном классе', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 10 });
    
    await expect(
      calculateTicket(2000, 10, 'vip', '1')
    ).rejects.toThrow('Некорректный класс обслуживания');
  });

  test('Корректно округляет цену до копеек', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 33.33 });
    
    const result = await calculateTicket(
      1000,
      10,
      'economy',
      '123'
    );
    
    expect(result.finalPrice).toBe(666.7);
  });

  test('Пассажир без перевеса багажа', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 5 });
    
    const result = await calculateTicket(
      2000,
      15,
      'economy',
      '111'
    );
    
    expect(result.finalPrice).toBe(1900);
  });

  test('Бизнес-класс без перевеса', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 0 });
    
    const result = await calculateTicket(
      2000,
      10,
      'business',
      '222'
    );
    expect(result.finalPrice).toBe(3000);
  });

  test('Бизнес-класс с очень маленькой скидкой', async () => {
    LoyaltyService.getDiscount.mockResolvedValue({ discount: 0.1 });
    
    const result = await calculateTicket(
      2000,
      10,
      'business',
      '333'
    );
    
    expect(result.finalPrice).toBe(2997);
  });
});