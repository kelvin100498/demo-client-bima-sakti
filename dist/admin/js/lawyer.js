let lawyers = [];

let currentPage = 1;

const LIMIT = 9;

let totalPage = 1;

let selectedLawyerId = null;

/*******************************************************
 * READY
 *******************************************************/
document.addEventListener(
    "DOMContentLoaded",
    initLawyerPage
);

/*******************************************************
 * INIT
 *******************************************************/
async function initLawyerPage() {
    console.log("getLawyers API called");

    await loadLawyers(currentPage);

    setupSearch();

}

/*******************************************************
 * LOAD LAWYERS
 *******************************************************/
async function loadLawyers(page = 1) {

    currentPage = page;

    const lawyerGrid =
        document.getElementById("lawyerGrid");

    const emptyLawyer =
        document.getElementById("emptyLawyer");

    const emptySearch =
        document.getElementById("emptySearch");
    
    const totalLawyer =
        document.getElementById("totalLawyer");

    lawyerGrid.innerHTML = `

        <div class="loading-grid">

            <lottie-player
                src="../../../admin/assets/loading.json"
                background="transparent"
                speed="1"
                class="mini-spinner-lottie"
                loop
                autoplay>
            </lottie-player>

            <p>
                Memuat data advokat...
            </p>

        </div>

    `;

    totalLawyer.innerHTML = `
        <lottie-player
            src="../../../admin/assets/loading.json"
            background="transparent"
            speed="1"
            class="mini-spinner-lottie"
            loop
            autoplay>
        </lottie-player>
    `;


    const result =
        await getLawyers(
            page,
            LIMIT
        );

    if (!result.success) {

        lawyerGrid.innerHTML = "";

        showToast(
            "Gagal memuat data advokat.",
            false
        );

        return;

    }

    lawyers = result.data;

    totalPage = result.totalPage;

    document.getElementById(
        "totalLawyer"
    ).innerHTML = result.total;

    if (lawyers.length === 0) {

        lawyerGrid.style.display = "none";

        emptySearch.style.display = "none";

        emptyLawyer.style.display = "block";

        return;

    }

    lawyerGrid.style.display = "grid";

    emptyLawyer.style.display = "none";

    emptySearch.style.display = "none";

    renderLawyers(lawyers);

    renderPagination();

}

/*******************************************************
 * RENDER LAWYERS
 *******************************************************/
function renderLawyers(data) {

    const lawyerGrid =
        document.getElementById("lawyerGrid");

    let html = "";

    data.forEach(function(item) {

        html += `

        <div class="lawyer-card">

            <div class="lawyer-photo">

                <img
                class="lawyer-image"
                src="data:image/jpeg;base64,${item.photo}"
                alt="${item.name}">

                <div class="lawyer-overlay">

                    <div class="lawyer-name">

                        ${item.name}

                    </div>

                    <div class="lawyer-position">

                        ${item.position}

                    </div>

                </div>

            </div>

            <div class="lawyer-body">

                <div class="lawyer-footer">

                    <button
                        class="btn-action btn-edit"
                        onclick="editLawyer('${item.id}')">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="btn-action btn-delete"
                        onclick="openDeleteModal('${item.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    lawyerGrid.innerHTML = html;

}

/*******************************************************
 * SEARCH
 *******************************************************/
function setupSearch() {

    const input =
        document.getElementById(
            "searchLawyer"
        );

    input.addEventListener(
        "keyup",
        function () {

            const keyword =
                this.value
                    .trim()
                    .toLowerCase();

            const emptySearch =
                document.getElementById(
                    "emptySearch"
                );

            const lawyerGrid =
                document.getElementById(
                    "lawyerGrid"
                );

            if (keyword === "") {

                emptySearch.style.display =
                    "none";

                lawyerGrid.style.display =
                    "grid";

                renderLawyers(lawyers);

                return;

            }

            const result =
                lawyers.filter(function(item){

                    return (
                        item.name
                            .toLowerCase()
                            .includes(keyword) ||

                        item.position
                            .toLowerCase()
                            .includes(keyword)
                    );

                });

            if (result.length === 0) {

                lawyerGrid.style.display =
                    "none";

                emptySearch.style.display =
                    "block";

                return;

            }

            emptySearch.style.display =
                "none";

            lawyerGrid.style.display =
                "grid";

            renderLawyers(result);

        }
    );

}

/*******************************************************
 * RENDER PAGINATION
 *******************************************************/
function renderPagination() {

    let pagination =
        document.getElementById(
            "pagination"
        );

    if (!pagination) {

        pagination =
            document.createElement("div");

        pagination.id =
            "pagination";

        pagination.className =
            "pagination";

        document
            .querySelector(".lawyer-panel")
            .appendChild(pagination);

    }

    let html = "";

    html += `

        <button

            class="page-btn"

            ${currentPage === 1 ? "disabled" : ""}

            onclick="changePage(${currentPage - 1})"

        >

            <i class="fa-solid fa-chevron-left"></i>

        </button>

    `;

    for (
        let i = 1;
        i <= totalPage;
        i++
    ) {

        html += `

            <button

                class="page-btn ${i === currentPage ? "active" : ""}"

                onclick="changePage(${i})"

            >

                ${i}

            </button>

        `;

    }

    html += `

        <button

            class="page-btn"

            ${currentPage === totalPage ? "disabled" : ""}

            onclick="changePage(${currentPage + 1})"

        >

            <i class="fa-solid fa-chevron-right"></i>

        </button>

    `;

    pagination.innerHTML = html;

}

/*******************************************************
 * CHANGE PAGE
 *******************************************************/
function changePage(page) {

    if (
        page < 1 ||
        page > totalPage
    ) {
        return;
    }

    loadLawyers(page);

}

/*******************************************************
 * REFRESH
 *******************************************************/
function refreshLawyers() {

    document.getElementById(
        "searchLawyer"
    ).value = "";

    loadLawyers(currentPage);

}

/*******************************************************
 * DELETE MODAL
 *******************************************************/
function openDeleteModal(id) {

    selectedLawyerId = id;

    document
        .getElementById("deleteModal")
        .style.display = "flex";

}

function closeDeleteModal() {

    selectedLawyerId = null;

    document
        .getElementById("deleteModal")
        .style.display = "none";

}

document
    .getElementById("cancelDelete")
    .addEventListener(
        "click",
        closeDeleteModal
    );

document
    .getElementById("deleteModal")
    .addEventListener(
        "click",
        function(e){

            if(
                e.target.id ===
                "deleteModal"
            ){

                closeDeleteModal();

            }

        }
    );

/*******************************************************
 * CONFIRM DELETE
 *******************************************************/
document
    .getElementById("confirmDelete")
    .addEventListener(
        "click",
        confirmDelete
    );

    async function confirmDelete() {

        if (!selectedLawyerId) {
            return;
        }
    
        const btnConfirm =
            document.getElementById("confirmDelete");
    
        const btnCancel =
            document.getElementById("cancelDelete");
    
        // Disable tombol agar tidak bisa diklik berkali-kali
        btnConfirm.disabled = true;
        btnCancel.disabled = true;
    
        btnConfirm.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Menghapus...';
    
        showLoading();
    
        try {
    
            console.log("Calling API...");
    
            const result =
                await deleteLawyer(selectedLawyerId);
    
            if (result.success) {
    
                showToast(
                    result.message ||
                    "Advokat berhasil dihapus."
                );
    
                closeDeleteModal();
    
                await loadLawyers(currentPage);
    
            } else {
    
                showToast(
                    result.message ||
                    "Gagal menghapus advokat.",
                    false
                );
    
            }
    
        } catch (err) {
    
            console.error(err);
    
            showToast(
                "Terjadi kesalahan.",
                false
            );
    
        } finally {
    
            hideLoading();
    
            btnConfirm.disabled = false;
            btnCancel.disabled = false;
    
            btnConfirm.innerHTML = "Hapus";
    
        }
    
    }

/*******************************************************
 * LOADING
 *******************************************************/
function showLoading() {

    document.getElementById(
        "loadingOverlay"
    ).style.display = "flex";

}

function hideLoading() {

    document.getElementById(
        "loadingOverlay"
    ).style.display = "none";

}

/*******************************************************
 * TOAST
 *******************************************************/
function showToast(
    message,
    success = true
) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.innerHTML = message;

    toast.className =
        success
        ? "toast success show"
        : "toast error show";

    setTimeout(function(){

        toast.classList.remove(
            "show"
        );

    },3000);

}