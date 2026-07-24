document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadSidebar("lawyer");

        const valid = await Auth.check();

        if (!valid) {

            window.location.href = "/admin";

            return;

        }

        loadLawyers();

        initSearch();

        initLogout();

    }
);


/*
===================================
GLOBAL DATA
===================================
*/

let lawyers = [];


/*
===================================
LOAD LAWYER (DUMMY)
===================================
*/

function loadLawyers() {

    lawyers = [

        {

            id: 1,

            name: "Novel Suwa",

            position: "Founder",

            photo: "https://lbh-bimasakti.id/assets/img/team/1_3.jpg"

        },

        {

            id: 2,

            name: "Conie Pania Putri",

            position: "Partner",

            photo: "https://lbh-bimasakti.id/assets/img/team/2_1.jpg"

        },

        {

            id: 3,

            name: "Machdum Satria",

            position: "Senior Lawyer",

            photo: "https://lbh-bimasakti.id/assets/img/team/3.jpg"

        },

        {

            id: 4,

            name: "Siti Rahmawati",

            position: "Associate",

            photo: "https://lbh-bimasakti.id/assets/img/team/6.jpg"

        },

        {

            id: 5,

            name: "Agus Setiawan",

            position: "Partner",

            photo: "https://lbh-bimasakti.id/assets/img/team/4.jpg"

        },

        {

            id: 6,

            name: "Dian Kusuma",

            position: "Junior Lawyer",

            photo: "https://lbh-bimasakti.id/assets/img/team/5.jpg"

        }

    ];

    loadStatistic();

    renderLawyer(lawyers);

}


/*
===================================
STATISTIC
===================================
*/

function loadStatistic() {

    document.getElementById("totalLawyer").textContent =
        lawyers.length;

}


/*
===================================
RENDER
===================================
*/

function renderLawyer(data) {

    const container =
        document.getElementById("lawyerGrid");

    const empty =
        document.getElementById("emptyLawyer");

    const emptySearch =
        document.getElementById("emptySearch");

    container.innerHTML = "";

    if (lawyers.length === 0) {

        empty.style.display = "block";

        emptySearch.style.display = "none";

        return;

    }

    empty.style.display = "none";

    if (data.length === 0) {

        emptySearch.style.display = "block";

        return;

    }

    emptySearch.style.display = "none";

    data.forEach(item => {

        container.innerHTML += `

<div class="lawyer-card">

    <img
        src="${item.photo}"
        class="lawyer-image">

    <div class="lawyer-body">

        <div class="lawyer-name">

            ${item.name}

        </div>

        <div class="lawyer-position">

            ${item.position}

        </div>

        <div class="lawyer-footer">

            <button
                class="btn-action btn-edit"
                data-id="${item.id}">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button
                class="btn-action btn-delete"
                data-id="${item.id}">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    </div>

</div>

`;

    });

}


/*
===================================
SEARCH
===================================
*/

function initSearch() {

    document
        .getElementById("searchLawyer")
        .addEventListener("keyup", function () {

            const keyword =
                this.value.toLowerCase();

            const result =
                lawyers.filter(item =>

                    item.name
                        .toLowerCase()
                        .includes(keyword)

                );

            renderLawyer(result);

        });

}


/*
===================================
LOGOUT
===================================
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