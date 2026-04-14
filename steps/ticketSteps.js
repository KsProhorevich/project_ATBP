const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../server');

let payload = {};
let response;
let discount = 0;

Given('сервис доступен по адресу {string}', async function (path) {
    const res = await request(app).get(path);
    if (res.status !== 200) {
        throw new Error('Сервис недоступен');
    }
});

Given('получен уровень лояльности для паспорта {string}', async function (passport) {
    const res = await request(app).get(`/api/loyalty/${passport}`);
    discount = res.body.discount;
});

When('я рассчитываю билет с параметрами:', async function (table) {
    const data = table.hashes()[0];

    payload = {
        basePrice: Number(data.basePrice),
        baggageWeight: Number(data.baggage),
        serviceClass: data.class,
        passport: "1234"
    };

    response = await request(app)
        .post('/api/tickets/calculate')
        .send(payload);
});

Then('API возвращает статус-код {int}', function (code) {
    if (response.status !== code) {
        throw new Error(`Ожидался ${code}, получен ${response.status}`);
    }
});

Then('итоговая стоимость рассчитана корректно', function () {
    if (typeof response.body.finalPrice !== 'number') {
        throw new Error('Цена не число');
    }
});