export const setStartEventDay = (startDay) => {
    const startYear = new Date(startDay).getFullYear()
    const startMonth = new Date(startDay).getMonth()+1
    const startMonthDay = new Date(startDay).getDate()

    document.querySelector('.form__from input').value = `${startYear}-${startMonth < 10 ? '0'+startMonth : startMonth}-${startMonthDay < 10 ? '0'+startMonthDay : startMonthDay}`
}