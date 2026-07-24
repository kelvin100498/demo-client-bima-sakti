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

        initDeleteModal();

        initEdit();

    }
);



/*
=====================
GLOBAL DATA
=====================
*/

let articles = [];
let deleteId = null;



/*
=====================
LOAD ARTICLE
=====================
*/

async function loadArticles() {

    try {

        const body = new URLSearchParams();

        body.append("action", "getArticles");

        // Jika nanti membutuhkan token
        // body.append("token", localStorage.getItem("token"));

        const response = await fetch(API_URL, {

            method: "POST",

            body: body

        });

        if (!response.ok) {

            throw new Error("HTTP Error : " + response.status);

        }

        const result = await response.json();

        console.log(result);

        if (!result.success) {

            articles = [];

            loadStatistic(articles);

            renderTable(articles);

            return;

        }

        articles = result.data.map(item => ({

            id: item.id,

            title: item.title,

            status: item.status,

            date: item.date,

            image: item.thumbnail

        }));

        loadStatistic(articles);

        renderTable(articles);

    } catch (err) {

        console.error(err);

        articles = [];

        loadStatistic(articles);

        renderTable(articles);

    }

}

/*
=====================
DELETE ARTICLE
=====================
*/

async function deleteArticle(id){

    try{

        const body = new URLSearchParams();

        body.append("action","deleteArticle");

        body.append("id",id);

        const response = await fetch(API_URL,{

            method:"POST",

            body:body

        });

        const result = await response.json();

        if(result.success){

            await loadArticles();

            return true;

        }

        alert(result.message);

        return false;

    }catch(err){

        console.error(err);

        showToast("Gagal menghapus artikel.", "error");

        return false;

    }

}

/*
=====================
SHOW DELETE MODAL
=====================
*/

function showDeleteModal(id, title){

    deleteId = id;

    document.getElementById("deleteMessage").innerHTML =
        `Apakah Anda yakin ingin menghapus artikel <b>${title}</b>?`;

    document.getElementById("deleteModal").classList.add("show");

}

/*
=====================
STATISTIC
=====================
*/

function loadStatistic(data) {

    document.getElementById("totalArticle").textContent =
        data.length;

    document.getElementById("totalPublish").textContent =
        data.filter(item => item.status === "PUBLISH").length;

    document.getElementById("totalDraft").textContent =
        data.filter(item => item.status === "DRAFT").length;

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

    const emptySearch =
        document.getElementById("emptySearch");

        tbody.innerHTML = "";

        if(data.length === 0){
        
            emptyArticle.style.display = "block";
        
            emptySearch.style.display = "none";
        
            return;
        
        }
        
        emptyArticle.style.display = "none";
        emptySearch.style.display = "none";

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

<span class="${
    item.status.toUpperCase() === "PUBLISH"
        ? "status-publish"
        : "status-draft"
}">

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
    onclick="showDeleteModal(${item.id}, '${item.title.replace(/'/g, "\\'")}')">
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

    const input =
        document.getElementById("searchArticle");

    input.addEventListener("keyup", function () {

        const keyword =
            this.value.trim().toLowerCase();

        const emptyArticle =
            document.getElementById("emptyArticle");

        const emptySearch =
            document.getElementById("emptySearch");

        /*
        =====================
        INPUT KOSONG
        =====================
        */

        if(keyword === ""){

            emptySearch.style.display = "none";

            renderTable(articles);

            return;

        }

        /*
        =====================
        FILTER
        =====================
        */

        const result =
            articles.filter(item =>
                item.title
                    .toLowerCase()
                    .includes(keyword)
            );

        renderTable(result);

        /*
        =====================
        EMPTY SEARCH
        =====================
        */

        if(result.length === 0){

            emptyArticle.style.display = "none";

            emptySearch.style.display = "block";

        }else{

            emptySearch.style.display = "none";

        }

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

/*
=====================
DELETE MODAL
=====================
*/

function initDeleteModal() {

    const modal = document.getElementById("deleteModal");

    const cancel = document.getElementById("cancelDelete");

    const confirm = document.getElementById("confirmDelete");

    cancel.onclick = () => {

        modal.classList.remove("show");

        deleteId = null;

    };

    modal.onclick = (e) => {

        if (e.target === modal) {

            modal.classList.remove("show");

            deleteId = null;

        }

    };

    confirm.onclick = async () => {

        if (deleteId == null) {
            return;
        }
    
        confirm.disabled = true;
    
        confirm.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Menghapus...
        `;
    
        const success = await deleteArticle(deleteId);
    
        confirm.disabled = false;
    
        confirm.innerHTML = "Hapus";
    
        if (success) {
    
            modal.classList.remove("show");
    
            deleteId = null;
    
            showToast("Artikel berhasil dihapus.");
    
        }
    
    };

}

/*
=====================
TOAST
=====================
*/

function showToast(message, type = "success") {

    const toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.className = "toast";

    if (type === "error") {

        toast.classList.add("error");

    }

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

/*
=====================
EDIT ARTICLE
=====================
*/

function initEdit() {

    document
        .getElementById("articleTableBody")
        .addEventListener("click", (e) => {

            const button =
                e.target.closest(".edit");

            if (!button) {

                return;

            }

            const id =
                button.dataset.id;

            window.location.href =
                `article-edit.html?id=${id}`;

        });

}