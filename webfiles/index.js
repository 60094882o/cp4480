let token = null

const setGlobalHeaders = () => {
    $.ajaxSetup({
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

const login = () => {
    let email = $('#email').val()
    let password = $('#password').val()
    let data = {
        username: email,
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