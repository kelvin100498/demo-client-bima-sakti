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

async function getLawyers(page = 1, limit = 9) {

    const body = new URLSearchParams();

    body.append("action", "getLawyers");
    body.append("page", page);
    body.append("limit", limit);

    const response = await fetch(API_URL, {

        method: "POST",

        body: body

    });

    return await response.json();

}

async function deleteLawyer(id){

    const form = new URLSearchParams();

    form.append("action", "deleteLawyer");
    form.append("id", id);

    const response =
        await fetch(API_URL,{

            method:"POST",

            body:form

        });

    return await response.json();

}

async function addLawyerApi(data) {

    const formData = new FormData();

    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });

    formData.append("action", "addLawyer");

    const response = await fetch(API_URL, {
        method: "POST",
        body: formData
    });

    return await response.json();

}