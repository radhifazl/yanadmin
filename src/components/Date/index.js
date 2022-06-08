export const getDate = (date) => {
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }

    const ddmmyyy = padTo2Digits(date.getDate()) + '/' + padTo2Digits(date.getMonth()+1) + '/' + date.getFullYear()
    const now = ddmmyyy 
    return now
}