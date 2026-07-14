async function loginApi(username, password) {

    const formData = new FormData();

    formData.append("action", "login");
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    return await response.json();

}

async function checkTokenApi(token) {

    const formData = new FormData();

    formData.append("action", "checkToken");
    formData.append("token", token);

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    return await response.json();

}

async function logoutApi(token) {

    const formData = new FormData();

    formData.append("action", "logout");
    formData.append("token", token);

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    return await response.json();

}

async function totalVisitorApi() {

    const formData = new FormData();

    formData.append("action", "totalVisitor");

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    return await response.json();

}

async function addVisitorApi() {

    const formData = new FormData();

    formData.append("action", "addVisitor");

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    return await response.json();

}