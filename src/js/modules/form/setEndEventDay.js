export const setEndEventDay = (endDay) => {
    const endYear = new Date(endDay).getFullYear()
    const endMonth = new Date(endDay).getMonth()+1
    const endMonthDay = new Date(endDay).getDate()

    document.querySelector('.form__to input').value = `${endYear}-${endMonth < 10 ? '0'+endMonth : endMonth}-${endMonthDay < 10 ? '0'+endMonthDay : endMonthDay}`
}