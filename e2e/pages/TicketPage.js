class TicketPage {
    constructor(page) {
        this.page = page;
        this.passport = '#passport';
        this.class = '#class';
        this.baggage = '#baggage';
        this.button = '#calculate';
        this.result = '#result';
    }

    async navigate() {
        await this.page.goto('http://localhost:3000');
    }

    async fillPassport(value) {
        await this.page.fill(this.passport, value);
    }

    async selectClass(value) {
        await this.page.selectOption(this.class, value);
    }

    async fillBaggage(value) {
        await this.page.fill(this.baggage, value);
    }

    async submit() {
        await this.page.click(this.button);
        // Ждем, пока результат не появится и не станет не пустым
        await this.page.waitForSelector('#result:not(:empty)');
    }

    async getResult() {
        const resultElement = this.page.locator(this.result);
        await resultElement.waitFor({ state: 'visible' });
        return resultElement.textContent();
    }
}

module.exports = TicketPage;