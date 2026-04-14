const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const PORT = 3000;

const loyaltyDB = {
  "1234": { level: "silver", discount: 10 },
  "9999": { level: "gold", discount: 20 }
};

app.get('/api/loyalty/:passport', (req, res) => {
  const { passport } = req.params;
  const client = loyaltyDB[passport];

  if (!client) {
    return res.status(404).json({
      status: "error",
      message: "Клиент не найден"
    });
  }

  res.status(200).json({
    status: "success",
    level: client.level,
    discount: client.discount
  });
});

// POST — расчет билета
app.post('/api/tickets/calculate', (req, res) => {
  try {
    const { basePrice, baggageWeight, classType, passport } = req.body;

    if (basePrice < 1000)
      throw new Error("Минимальная стоимость билета — 1000");

    if (baggageWeight < 0)
      throw new Error("Вес багажа не может быть отрицательным");

    let total = basePrice;

    // Перевес
    if (baggageWeight > 20) {
      total += 2000;
    }

    // Коэффициент бизнес-класса
    if (classType === "business") {
      total *= 1.5;
    }

    if (passport === '0000') {
      return res.status(400).json({
        status: "error",
        message: "Ошибка: неверный паспорт"
      });
    }

    // Скидка
    const client = loyaltyDB[passport];
    if (client) {
      total -= total * client.discount / 100;
    }

    total = Math.round(total * 100) / 100;

    res.status(200).json({
      status: "success",
      finalPrice: total
    });

  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message
    });
  }
});

app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: "online",
        timestamp: new Date()
    });
});

// запуск только при прямом старте
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}

// экспорт для Supertest
module.exports = app;
