import { createHtmlForReservedDay } from "./createHtmlForReservedDay.js"
import { parseDateFromDataAttribute } from "./parseDateFromDataAttribute.js"

export const setClassForStartReservedDay = (fromDate) => {
    document.querySelectorAll('.month__day').forEach(day => {
        if (day.getAttribute('data-date') === fromDate) {
            const html = createHtmlForReservedDay("active__start")
            day.insertAdjacentHTML('beforeend', html)
        }
    })
}

export const setClassForEndReservedDay = (toDate) => {
    document.querySelectorAll('.month__day').forEach(day => {
        if (day.getAttribute('data-date') === toDate) {
            const html = createHtmlForReservedDay("active__end")
            day.insertAdjacentHTML('beforeend', html)
        }
    })
}

export const setClassForMiddleReservedDay = (fromDate, toDate) => {
    const start = parseDateFromDataAttribute(fromDate)
    const end = toDate ? parseDateFromDataAttribute(toDate) : null

    document.querySelectorAll('.month__day').forEach(day => {
        const dayParse = parseDateFromDataAttribute(day.getAttribute('data-date'))
        const dayOfWeek = new Date(dayParse).getDay()

        if (end) {
            if (dayParse > start && dayParse < end) {
                if (dayOfWeek === 1) {
                    const html = createHtmlForReservedDay("active__middle-start-week")
                    day.insertAdjacentHTML('beforeend', html)
                } else {
                    const html = createHtmlForReservedDay("active__middle")
                    day.insertAdjacentHTML('beforeend', html)
                }
            }
        } else {
            if (dayParse > start) {
                if (dayOfWeek === 1) {
                    const html = createHtmlForReservedDay("active__middle-start-week")
                    day.insertAdjacentHTML('beforeend', html)
                } else {
                    const html = createHtmlForReservedDay("active__middle")
                    day.insertAdjacentHTML('beforeend', html)
                }
            }
        }
    })
}