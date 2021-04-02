let token = null

const setGlobalHeaders = () => {
    $.ajaxSetup({
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

const login = () => {
    let username = $('#username').val()
    let password = $('#password').val()
    let data = {
        username: username,
        password: password
    }
    $.ajax('/api/login',{
        method:"POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: (msg) => {
            token = msg
            setGlobalHeaders()
        }
    })
}