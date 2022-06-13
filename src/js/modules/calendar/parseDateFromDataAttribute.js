export const parseDateFromDataAttribute = (dateString) => {
    return Date.parse(dateString.split('.').reverse().join('-'))
}