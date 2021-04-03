let token = localStorage.getItem("token")

if (!token && window.location.pathname !== "/") window.location.replace("/");

if (token && window.location.pathname === "/user.html") {
    getYourMessages()
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
            localStorage.setItem("token", msg);
            console.log("Token", localStorage.getItem("token"))
            window.location.replace("/user.html");
        }
    })
}

function getYourMessages() {
    $.ajax('/api/messages',{
        method:"GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: (messages) => {
            console.log("messages", messages)
            setInbox(messages)
            setSent(messages)
            setSelect()
        }
    })
}

function setInbox(messages) {
    $.ajax('/api/me',{
        method:"POST",
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: (name) => {
            let me = name
            console.log("me", me)
            $('#inbox').html('')
            messages.map(message => {
            if (message.to === me) {
                $('#inbox').append(`
                <div class="card">
                    <div class="card-body">
                        From: ${message.sender}
                        Message: ${message.message}
                    </div>
                </div>
                `)
            }
            })
        }
    })
}

function setSent(messages) {
    $.ajax('/api/me',{
        method:"POST",
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: (name) => {
            me = name
            $('#sent').html('')
            messages.map(message => {
            if (message.sender === me) {
            $('#sent').append(`
            <div class="card">
                <div class="card-body">
                    To: ${message.to}
                    Message: ${message.message}
                </div>
            </div>
            `)
            }
            })
        }
    })
}

function setSelect(messages) {
    $.ajax('/api/users',{
        method:"GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: (users) => {
            $('#select').html('')
            users.map(user => {
            $('#select').append(`<option value="${user.id}">${user.username}</option>`)
            })
        }
    })
}

function sendMessage() {
    let message = $('#message').val()
    let userid = $('#select').val()
    let data = {
        to: userid,
        message: message
    }
    $.ajax('/api/messages',{
        method:"POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        success: () => {
            console.log("ok")
            $('#message').val("")
        }
    })
}