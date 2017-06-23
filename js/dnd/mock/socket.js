const ws = new WebSocket("ws://localhost:8080/")

ws.onopen = (event) => {
    console.log('Browser in sync')
}

ws.onmessage = ({ data: rawData }) => {
    const parsed = JSON.parse(rawData)
    console.log(parsed)
    reload(0)
}

ws.onclose = (event) => {
    console.log(event)
    reload(2000)
}

ws.onerror = (err) => {
    console.log(err)
}

function reload(timeout) {
    setTimeout(() => location.reload(), timeout)
}
