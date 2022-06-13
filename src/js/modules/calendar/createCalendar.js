const monthArr = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

export function createCalendar(id, year, month) {
    // последнее число месяца (30)
    let Dlast = new Date(year, month + 1, 0).getDate(),
    // последнее число мес с полными данными (Thu Sep 30 2021 00:00:00 GMT+0200 (Восточная Европа, стандартное время))
        D = new Date(year, month, Dlast),
        // день недели последн дня мес (от-до: 1 2 3 4 5 6 0 )
        DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
        // день недели первого дня мес (от-до: 1 2 3 4 5 6 0 )
        DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
        calendar = '<tr>';

        // пустые клетки начала календаря
    if (DNfirst != 0) {
        for (let i = 1; i < DNfirst; i++) calendar += '<td>';
    } else {
        for (let i = 0; i < 6; i++) calendar += '<td>';
    }

    for (let i = 1; i <= Dlast; i++) {

        if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
            // создание today
            calendar += `<td class="today future__day month__day" data-date='${i}.${D.getMonth()+1}.${D.getFullYear()}'>` + i;
        } else {
            // создание остальных чисел лесяца
            calendar += `<td class="month__day" data-date='${i}.${D.getMonth()+1}.${D.getFullYear()}'>` + i;
        }
        // новая строка таблицы
        if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
            calendar += '<tr>';
        }
    }

    // пустые ячейки в конце календаря
    for (let i = DNlast; i < 7; i++) calendar += '<td>&nbsp;';

    // вывод тела таблицы
    document.querySelector(`#${id} tbody`).innerHTML = calendar;

    // вывод шапки таблицы месяц и год
    document.querySelector(`.calendar__title`).innerHTML = `${monthArr[D.getMonth()]} ${D.getFullYear()}`;

    // добавление атрибутов
    document.querySelector(`.calendar__title`).dataset.month = D.getMonth() +1;
    document.querySelector(`.calendar__title`).dataset.year = D.getFullYear();

    // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
    if (document.querySelectorAll(`#${id} tbody tr`).length < 6) {
        document.querySelector(`#${id} tbody`).innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
    }
}