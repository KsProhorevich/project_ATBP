Feature: Расчет стоимости авиабилета

Scenario Outline: Расчет стоимости билета с учетом лояльности
  Given сервис доступен по адресу "/api/status"
  And получен уровень лояльности для паспорта "<passport>"
  When я рассчитываю билет с параметрами:
    | basePrice | baggage | class |
    | <price>   | <bag>   | <class> |
  Then API возвращает статус-код 200
  And итоговая стоимость рассчитана корректно

Examples:
  | passport | price | bag | class    |
  | 1234     | 2000  | 10  | economy  |
  | 1234     | 2000  | 25  | economy  |
  | 1234     | 2000  | 10  | business |
  | 1234     | 2000  | 25  | business |