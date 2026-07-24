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

        const valid =
            await Auth.check();

        if (!valid) {

            window.location.href =
                "index.html";

            return;

        }


        /*
        =====================
        GET ARTICLE ID
        =====================
        */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const articleId =
            params.get("id");


        if (!articleId) {

            showToast(
                "ID artikel tidak ditemukan.",
                "error"
            );

            return;

        }


        /*
        =====================
        INIT
        =====================
        */

        initSlug();

        initThumbnailPreview();

        initButton();
        


        /*
        =====================
        LOAD ARTICLE
        =====================
        */

        await loadArticle(articleId);

        initBackButton();
    }
);



/*
=====================
GLOBAL
=====================
*/

const title =
    document.getElementById("title");

const slug =
    document.getElementById("slug");

const date =
    document.getElementById("date");

const author =
    document.getElementById("author");

const thumbnail =
    document.getElementById("thumbnail");

const source =
    document.getElementById("source");

const content =
    document.getElementById("content");



/*
=====================
LOAD ARTICLE
=====================
*/

async function loadArticle(id) {

    const loading =
        document.getElementById(
            "loadingArticle"
        );

    const form =
        document.getElementById(
            "articleForm"
        );

    const sidebar =
        document.getElementById(
            "articleSidebar"
        );

    loading.style.display =
        "flex";

    form.style.display =
        "none";

    sidebar.style.display =
        "none";

    try {

        const body =
            new URLSearchParams();

        body.append(
            "action",
            "getArticle"
        );

        body.append(
            "id",
            id
        );

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    body: body

                }
            );

        if (!response.ok) {

            throw new Error(
                "HTTP Error : " +
                response.status
            );

        }

        const result =
            await response.json();

        console.log(
            "GET ARTICLE:",
            result
        );

        if (
            !result.success ||
            !result.data
        ) {

            window.location.href =
                "article.html";

            return;

        }

        const article =
            result.data;

        /*
        =====================
        SET ARTICLE ID
        =====================
        */

        document
            .getElementById(
                "articleId"
            )
            .value =
            article.id;


        /*
        =====================
        SET FORM VALUE
        =====================
        */

        title.value =
            article.title || "";

        slug.value =
            article.slug || "";

        date.value =
            article.date || "";

        author.value =
            article.author || "";

        thumbnail.value =
            article.thumbnail || "";

        source.value =
            article.source || "";

        content.value =
            article.content || "";


        /*
        =====================
        UPDATE PREVIEW
        =====================
        */

        updateThumbnailPreview();


        /*
        =====================
        SHOW FORM
        =====================
        */

        loading.style.display =
            "none";

        form.style.display =
            "block";

        sidebar.style.display =
            "flex";


    } catch (error) {

        console.error(
            error
        );

        /*
        =====================
        FETCH GAGAL
        =====================
        */

        window.location.href =
            "article.html";

    }

}



/*
=====================
AUTO SLUG
=====================
*/

function initSlug() {

    title.addEventListener(
        "input",
        () => {

            slug.value =
                generateSlug(
                    title.value
                );

        }
    );

}


function generateSlug(value) {

    return value
        .toString()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9\s-]/g,
            ""
        )
        .replace(
            /\s+/g,
            "-"
        )
        .replace(
            /-+/g,
            "-"
        );

}



/*
=====================
THUMBNAIL PREVIEW
=====================
*/

function initThumbnailPreview() {

    thumbnail.addEventListener(
        "input",
        updateThumbnailPreview
    );

}


function updateThumbnailPreview() {

    const preview =
        document.getElementById(
            "thumbnailPreview"
        );

    const placeholder =
        document.getElementById(
            "thumbnailPlaceholder"
        );


    if (
        thumbnail.value.trim() === ""
    ) {

        preview.style.display =
            "none";

        placeholder.style.display =
            "flex";

        return;

    }


    preview.src =
        thumbnail.value;


    preview.onload = () => {

        preview.style.display =
            "block";

        placeholder.style.display =
            "none";

    };


    preview.onerror = () => {

        preview.style.display =
            "none";

        placeholder.style.display =
            "flex";

    };

}



/*
=====================
BUTTON
=====================
*/

function initButton() {

    document
        .getElementById(
            "btnDraft"
        )
        .addEventListener(
            "click",
            () => {

                updateArticle(
                    "DRAFT"
                );

            }
        );


    document
        .getElementById(
            "btnPublish"
        )
        .addEventListener(
            "click",
            () => {

                updateArticle(
                    "PUBLISH"
                );

            }
        );

}



/*
=====================
UPDATE ARTICLE
=====================
*/

async function updateArticle(
    status
) {

    /*
    =====================
    VALIDATION
    =====================
    */

    if (
        title.value.trim() === ""
    ) {

        showToast(
            "Judul artikel wajib diisi.",
            "error"
        );

        return;

    }


    if (
        date.value === ""
    ) {

        showToast(
            "Tanggal wajib diisi.",
            "error"
        );

        return;

    }


    if (
        author.value.trim() === ""
    ) {

        showToast(
            "Penulis wajib diisi.",
            "error"
        );

        return;

    }


    if (
        thumbnail.value.trim() === ""
    ) {

        showToast(
            "Thumbnail wajib diisi.",
            "error"
        );

        return;

    }


    if (
        content.value.trim() === ""
    ) {

        showToast(
            "Isi artikel wajib diisi.",
            "error"
        );

        return;

    }


    /*
    =====================
    LOADING
    =====================
    */

    document
        .getElementById(
            "loadingSave"
        )
        .style.display =
        "flex";


    try {

        const body =
            new URLSearchParams();


        body.append(
            "action",
            "updateArticle"
        );


        body.append(
            "id",
            document
                .getElementById(
                    "articleId"
                )
                .value
        );


        body.append(
            "title",
            title.value
        );


        body.append(
            "slug",
            slug.value
        );


        body.append(
            "date",
            date.value
        );


        body.append(
            "author",
            author.value
        );


        body.append(
            "thumbnail",
            thumbnail.value
        );


        body.append(
            "source",
            source.value
        );


        body.append(
            "content",
            content.value
        );


        body.append(
            "status",
            status
        );


        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    body: body

                }
            );


        const result =
            await response.json();


        document
            .getElementById(
                "loadingSave"
            )
            .style.display =
            "none";


        showToast(
            result.message,
            result.success
                ? "success"
                : "error"
        );


        if (
            result.success
        ) {

            setTimeout(
                () => {

                    window.location.href =
                        "article.html";

                },
                1000
            );

        }


    } catch (error) {

        document
            .getElementById(
                "loadingSave"
            )
            .style.display =
            "none";


        console.error(
            error
        );


        showToast(
            "Gagal mengupdate artikel.",
            "error"
        );

    }

}


/*
=====================
BACK BUTTON
=====================
*/

function initBackButton(){

    const btnBack =
        document.getElementById(
            "btnBack"
        );

    const modal =
        document.getElementById(
            "backModal"
        );

    const cancel =
        document.getElementById(
            "cancelBack"
        );

    const confirm =
        document.getElementById(
            "confirmBack"
        );


    btnBack.addEventListener(
        "click",
        () => {

            modal.classList.add(
                "show"
            );

        }
    );


    cancel.addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "show"
            );

        }
    );


    modal.addEventListener(
        "click",
        (e) => {

            if (
                e.target === modal
            ) {

                modal.classList.remove(
                    "show"
                );

            }

        }
    );


    confirm.addEventListener(
        "click",
        () => {

            window.location.href =
                "article.html";

        }
    );

}



/*
=====================
TOAST
=====================
*/

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.innerHTML =
        message;


    toast.className =
        "toast";


    if (
        type === "error"
    ) {

        toast.classList.add(
            "error"
        );

    }


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}