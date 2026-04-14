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
    }

    async getResult() {
        return this.page.locator(this.result).textContent();
    }
}

module.exports = TicketPage;