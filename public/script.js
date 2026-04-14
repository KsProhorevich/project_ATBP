document.getElementById('calculate').addEventListener('click', async () => {
    const passport = document.getElementById('passport').value;
    const classType = document.getElementById('class').value;
    const baggageWeight = parseFloat(document.getElementById('baggage').value);
    
    const resultDiv = document.getElementById('result');
    
    // Валидация на клиенте
    if (!passport) {
        resultDiv.innerHTML = '<span class="error">Ошибка: Введите номер паспорта</span>';
        return;
    }
    
    if (!classType || classType === '') {
        resultDiv.innerHTML = '<span class="error">Ошибка: Выберите класс перевозки</span>';
        return;
    }
    
    if (isNaN(baggageWeight)) {
        resultDiv.innerHTML = '<span class="error">Ошибка: Введите корректный вес багажа</span>';
        return;
    }
    
    if (baggageWeight < 0) {
        resultDiv.innerHTML = '<span class="error">Ошибка: Вес багажа не может быть отрицательным</span>';
        return;
    }
    
    resultDiv.innerHTML = 'Расчет...';
    
    try {
        const response = await fetch('/api/tickets/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                basePrice: 1000,
                baggageWeight: baggageWeight,
                classType: classType,
                passport: passport
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'error') {
            resultDiv.innerHTML = `<span class="error">Ошибка: ${data.message}</span>`;
        } else {
            resultDiv.innerHTML = `<span class="success">Цена: ${data.finalPrice}</span>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">Ошибка: ${error.message}</span>`;
    }
});