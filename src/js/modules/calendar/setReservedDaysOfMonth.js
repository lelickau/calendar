import { setClassForEndReservedDay, setClassForMiddleReservedDay, setClassForStartReservedDay } from "./setClassesReservedDays.js"

// отрисовка периода на календаре (красная линия)
export const setReservedDaysOfMonth = (response) => {
    const calendarTitle = document.querySelector('.calendar__title')
    const calendarMonth = calendarTitle.getAttribute('data-month')
    const calendarYear = calendarTitle.getAttribute('data-year')

    response.forEach(item => {
        const itemFromDate = item.from.split('.')

        if (itemFromDate[1] === calendarMonth && itemFromDate[2] === calendarYear) {
            setClassForStartReservedDay(item.from)
        }

        if (item.to) {
            setClassForEndReservedDay(item.to)
        }
        setClassForMiddleReservedDay(item.from, item.to)
    })
}