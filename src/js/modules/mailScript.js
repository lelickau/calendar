import {getData, sendData} from '../services/requests.js'
import {createCalendar} from './calendar/createCalendar.js';
import {parseDateFromDataAttribute} from './calendar/parseDateFromDataAttribute.js'
import {createHtmlForReservedDay} from './calendar/createHtmlForReservedDay.js'
import {setReservedDaysOfMonth} from './calendar/setReservedDaysOfMonth.js'
import {setStartEventDay} from './form/setStartEventDay.js'
import {setEndEventDay} from './form/setEndEventDay.js'

const mainScript = () => {
    // вызов ф-ции (id, год сегодня, месяц сегодня)
    createCalendar("calendar", new Date().getFullYear(), new Date().getMonth())

    const url = "http://localhost:3000/services"
    let isSelect = false
    let startDay = ''
    let endDay = ''

    let btnsDays = document.querySelectorAll('.month__day')

    // get data
    getData(url).then(res => {
        setReservedDaysOfMonth(res)

        // переключатель минус месяц
        document.querySelector('.arr__left').addEventListener('click', () => {
            createCalendar(
                "calendar",
                document.querySelector('.calendar__title').dataset.year,
                parseFloat(document.querySelector('.calendar__title').dataset.month -1) - 1
            )
            setReservedDaysOfMonth(res)
            btnsDays = document.querySelectorAll('.month__day')
        })

        // переключатель плюс месяц
        document.querySelector('.arr__right').addEventListener('click', () => {
            createCalendar(
                "calendar",
                document.querySelector('.calendar__title').dataset.year,
                parseFloat(document.querySelector('.calendar__title').dataset.month -1) + 1
            )
            setReservedDaysOfMonth(res)
            btnsDays = document.querySelectorAll('.month__day')
        })
    })

    // send
    const {form} = document.forms
    const isCheckboxOrRadio = type => ['checkbox', 'radio'].includes(type)
    const checkName = name => ["monday", "tuesday", "wendsday", "thursday", "friday", "saturday", "sunday"].includes(name)

    function handleFormSubmit(event) {
        event.preventDefault()
        const data = {}
        let tariffs = {}
        let week = []

        for (const field of form) {
            const {name} = field
            if (name) {
                const {type, checked, value} = field

                const m = name.split('_')
                if (m.length > 1) {
                    if (tariffs.hasOwnProperty(`${m[1]}`)) {
                        tariffs = {
                            ...tariffs,
                            [m[1]]: {
                                ...tariffs[m[1]],
                                [m[0]]: isCheckboxOrRadio(type) ? checked : value
                            }
                        }
                    } else {
                        tariffs[m[1]] = {
                            [m[0]]: isCheckboxOrRadio(type) ? checked : value
                        }
                    }

                } else if (checkName(name)) {
                    if (checked) week.push(value)
                } else {
                    data[name] = isCheckboxOrRadio(type) ? checked : value
                }
            }
        }

        const fromDay = data.from.split('-').reverse()
        fromDay[0] = fromDay[0]*1
        fromDay[1] = fromDay[1]*1
        data.from = fromDay.join('.')

        const toDay = data.to ? data.to.split('-').reverse() : null
        if (toDay) {
            toDay[0] = toDay[0]*1
            toDay[1] = toDay[1]*1
            data.to = toDay.join('.')
        } else {
            data.to = toDay
        }

        const postData = {...data, ['tariffs']: Object.values(tariffs), ...week}
        sendData(url, postData)
            .then(_ => {
                document.querySelectorAll('.select-day').forEach((day, idx, arr) => {
                    if (idx === 0) {
                        const html = createHtmlForReservedDay("active__start")
                        day.insertAdjacentHTML('beforeend', html)
                        day.classList.remove('select-day', 'select-day--start')
                    } else if (idx == arr.length -1) {
                        const html = createHtmlForReservedDay("active__end")
                        day.insertAdjacentHTML('beforeend', html)
                        day.classList.remove('select-day', 'select-day--end')
                    } else {
                        const html = createHtmlForReservedDay("active__middle")
                        day.insertAdjacentHTML('beforeend', html)
                        day.classList.remove('select-day', 'select-day--active')
                    }
                })
            })
    }

    form.addEventListener('submit', handleFormSubmit)

    document.querySelector('body').addEventListener('click', (e) => {
        if (e.target.classList.contains('month__day')) {
            document.querySelectorAll('.month__day').forEach(day => {
                day.classList.remove('select-day')
            })

            e.target.classList.add('select-day')
            startDay = parseDateFromDataAttribute(e.target.getAttribute('data-date'))
            endDay = startDay
            setStartEventDay(startDay)
            setEndEventDay(startDay)
        }
    })

    document.addEventListener('mousemove', (e) => {
        if (isSelect) {
            if (e.target.classList.contains('month__day')) {
                e.target.classList.add('select-day')
                const day = parseDateFromDataAttribute(e.target.getAttribute('data-date'))
                if (day < startDay) {
                    setStartEventDay(day)
                    btnsDays.forEach((item) => {
                        if (parseDateFromDataAttribute(item.getAttribute('data-date')) > day && parseDateFromDataAttribute(item.getAttribute('data-date')) < endDay) {
                            item.classList.add('select-day', 'select-day--active')
                        }
                    })
                } else {
                    setEndEventDay(day)
                    btnsDays.forEach((item) => {
                        if (parseDateFromDataAttribute(item.getAttribute('data-date')) < day && parseDateFromDataAttribute(item.getAttribute('data-date')) > startDay) {
                            item.classList.add('select-day', 'select-day--active')
                        }
                    })
                }

            }
        }
    })

    document.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('select-day')) {
            isSelect = true
        }
    })

    document.addEventListener('mouseup', (e) => {
        isSelect = false
        if (startDay && e.target.classList.contains('month__day')) {
            const selectDays = document.querySelectorAll('.select-day')

            selectDays.forEach((day, idx, arr) => {
                if (idx === 0) {
                    day.classList.add('select-day--start')
                    const start = parseDateFromDataAttribute(day.getAttribute('data-date'))
                    setStartEventDay(start)
                    document.querySelector('#date-from').innerHTML = day.getAttribute('data-date')
                } else if (idx === arr.length -1) {
                    day.classList.add('select-day--end')
                    const end = parseDateFromDataAttribute(day.getAttribute('data-date'))
                    setEndEventDay(end)
                    document.querySelector('#date-to').innerHTML = day.getAttribute('data-date')
                } else {
                    day.classList.add('select-day--active')
                }
            })
        }
    })

    // weekall checkbox
    const weeksall = document.querySelector('#weeksall')
    weeksall.addEventListener('change', function(e){
        if (this.checked) triggerWeeks()
    })

    function triggerWeeks () {
        document.querySelectorAll('.form__weekday-input').forEach(week => {
            week.checked = true
        })
    }

    // reset "to" date
    const notend = document.querySelector('#notend')
    const toDate = document.querySelector('#to-date')
    notend.addEventListener('change', function(e){
        if (this.checked) toDate.value = ''
    })
}
export default mainScript
