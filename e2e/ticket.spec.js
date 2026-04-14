const { test, expect } = require('@playwright/test');
const TicketPage = require('./pages/TicketPage');

test.describe('Расчет авиабилета UI', () => {
    
    test('Позитивный сценарий', async ({ page }) => {
        const ticket = new TicketPage(page);
        
        await ticket.navigate();
        await ticket.fillPassport('1234');
        await ticket.selectClass('economy');
        await ticket.fillBaggage('10');
        await ticket.submit();
        
        const result = await ticket.getResult();
        expect(result).toContain('Цена:');
    });
    
    test('Бизнес класс', async ({ page }) => {
        const ticket = new TicketPage(page);
        
        await ticket.navigate();
        await ticket.fillPassport('1234');
        await ticket.selectClass('business');
        await ticket.fillBaggage('10');
        await ticket.submit();
        
        const result = await ticket.getResult();
        expect(result).toContain('Цена:');
    });
    
    test('Перевес багажа', async ({ page }) => {
        const ticket = new TicketPage(page);
        
        await ticket.navigate();
        await ticket.fillPassport('1234');
        await ticket.selectClass('economy');
        await ticket.fillBaggage('30');
        await ticket.submit();
        
        const result = await ticket.getResult();
        expect(result).toContain('Цена:');
    });
    
    test('Неверный паспорт', async ({ page }) => {
        const ticket = new TicketPage(page);
        
        await ticket.navigate();
        await ticket.fillPassport('0000');
        await ticket.selectClass('economy');
        await ticket.fillBaggage('10');
        await ticket.submit();
        
        const result = await ticket.getResult();
        expect(result).toContain('Ошибка: неверный паспорт');
    });
});