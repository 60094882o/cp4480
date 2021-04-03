let token = null

if (!token && window.location.pathname !== "/") window.location.replace("/");

if (token && window.location.pathname === "/user.html") {
    getYourMessages()
}

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
            console.log("Token", token)
            setGlobalHeaders()
            window.location.replace("/user.html");
        }
    })
}

const getYourMessages = () => {
    $.ajax('/api/messages',{
        method:"GET",
        contentType: "application/json; charset=utf-8",
        success: (messages) => {
            setInbox(messages)
            // setSent(messages)
        }
    })
}

function setInbox(messages) {
    $('#inbox').html('')
    messages.map(message => {
    
    $('#inbox').append(`
    <div class="card">
        <div class="card-body">
            From: <div id="user${message.from_id}"></div>
            Message: ${message.message}
        </div>
    </div>
    `)
    })
}