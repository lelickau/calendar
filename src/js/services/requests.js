const getData = async (url) => {
    try {
        const fetchData = await fetch(url)
        if (fetchData.status !== 200) throw new Error('Error getting data')
        return fetchData.json()
    } catch (e) {
        console.log("Error getting data: ", e)
    }
}

const sendData = async (url, data) => {
    try {
        const fetchData = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (fetchData.status !== 201) throw new Error('Error poting data')
        return fetchData.json()

    } catch (e) {
        console.log("Error posting data: ", e)
    }
}

export { getData, sendData }