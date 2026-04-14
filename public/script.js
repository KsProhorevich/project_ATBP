document.getElementById('calculate').addEventListener('click', async () => {

    const passport = document.getElementById('passport').value;
    const serviceClass = document.getElementById('class').value;
    const baggage = document.getElementById('baggage').value;

    const result = document.getElementById('result');

    try {
        const response = await fetch('/api/tickets/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                passport,
                serviceClass,
                baggageWeight: Number(baggage),
                basePrice: 2000
            })
        });

        const data = await response.json();

        if (response.status !== 200) {
            result.innerHTML = `<div class="error">${data.error}</div>`;
        } else {
            result.innerHTML = `<div class="success">Цена: ${data.finalPrice}</div>`;
        }

    } catch (e) {
        result.innerHTML = `<div class="error">Ошибка сервера</div>`;
    }

});