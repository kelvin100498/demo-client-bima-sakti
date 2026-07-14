document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*
        =====================
        SIDEBAR
        =====================
        */

        await loadSidebar("article");

        /*
        =====================
        AUTH
        =====================
        */

        const valid = await Auth.check();

        if (!valid) {

            window.location.href = "index.html";

            return;

        }


        /*
        =====================
        INIT
        =====================
        */

        initWebsite();

        await loadArticles();

        initSearch();

        initLogout();

    }
);



/*
=====================
GLOBAL DATA
=====================
*/

let articles = [];



/*
=====================
LOAD ARTICLE
=====================
*/

async function loadArticles() {

    // sementara dummy
    // nanti diganti API

    articles = [

        {

            id: 1,

            title: "Pentingnya Bantuan Hukum",

            status: "Publish",

            date: "14 Juli 2026",

            image: "https://placehold.co/80x60"

        },

        {

            id: 2,

            title: "Hak Korban Kekerasan",

            status: "Draft",

            date: "13 Juli 2026",

            image: "https://placehold.co/80x60"

        }

    ];

    loadStatistic(articles);

    renderTable(articles);

}



/*
=====================
STATISTIC
=====================
*/

function loadStatistic(data) {

    document.getElementById("totalArticle").innerHTML =
        data.length;

    document.getElementById("totalPublish").innerHTML =
        data.filter(x => x.status === "Publish").length;

    document.getElementById("totalDraft").innerHTML =
        data.filter(x => x.status === "Draft").length;

}



/*
=====================
RENDER TABLE
=====================
*/

function renderTable(data) {

    const tbody =
        document.getElementById("articleTableBody");

    const empty =
        document.getElementById("emptyArticle");

    if (data.length === 0) {

        tbody.innerHTML = "";

        empty.style.display = "block";

        return;

    }

    empty.style.display = "none";

    tbody.innerHTML = "";

    data.forEach((item, index) => {

        tbody.innerHTML += `

<tr>

<td>

${index + 1}

</td>

<td>

<img
src="${item.image}"
class="article-thumbnail">

</td>

<td>

<strong>

${item.title}

</strong>

</td>

<td>

${item.date}

</td>

<td>

<span class="${item.status === "Publish"
                ? "status-publish"
                : "status-draft"}">

${item.status}

</span>

</td>

<td>

<button
class="btn-icon edit"
data-id="${item.id}">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn-icon delete"
data-id="${item.id}">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}



/*
=====================
SEARCH
=====================
*/

function initSearch() {

    document
        .getElementById("searchArticle")
        .addEventListener("keyup", function () {

            const keyword =
                this.value.toLowerCase();

            const result =
                articles.filter(item =>
                    item.title
                        .toLowerCase()
                        .includes(keyword)
                );

            renderTable(result);

        });

}



/*
=====================
WEBSITE
=====================
*/

function initWebsite() {

    document
        .getElementById("websitePage")
        .addEventListener("click", (e) => {

            e.preventDefault();

            window.open(
                `${window.location.origin}/page/beranda/`,
                "_blank"
            );

        });

}



/*
=====================
LOGOUT
=====================
*/

function initLogout() {

    const logout =
        document.getElementById("logout");

    const modal =
        document.getElementById("logoutModal");

    const cancel =
        document.getElementById("cancelLogout");

    const confirm =
        document.getElementById("confirmLogout");

    logout.onclick = (e) => {

        e.preventDefault();

        modal.classList.add("show");

    };

    cancel.onclick = () => {

        modal.classList.remove("show");

    };

    modal.onclick = (e) => {

        if (e.target === modal) {

            modal.classList.remove("show");

        }

    };

    confirm.onclick = async () => {

        await Auth.logout();

    };

}