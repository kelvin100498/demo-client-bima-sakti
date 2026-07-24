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

            window.location.href = "/admin";

            return;

        }

        /*
        =====================
        INIT
        =====================
        */

        initBackButton();

        initSlug();

        initThumbnailPreview();

        initButton();

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
AUTO SLUG
=====================
*/

function initSlug(){

    title.addEventListener("input", () => {

        slug.value = generateSlug(title.value);

    });

}


function generateSlug(value){

    return value
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}



/*
=====================
PREVIEW THUMBNAIL
=====================
*/

function initThumbnailPreview(){

    const preview =
        document.getElementById("thumbnailPreview");

    const placeholder =
        document.getElementById("thumbnailPlaceholder");

    thumbnail.addEventListener("input",()=>{

        if(thumbnail.value===""){

            preview.style.display="none";

            placeholder.style.display="flex";

            return;

        }

        preview.src=thumbnail.value;

        preview.onload=()=>{

            preview.style.display="block";

            placeholder.style.display="none";

        };

        preview.onerror=()=>{

            preview.style.display="none";

            placeholder.style.display="flex";

        };

    });

}



/*
=====================
BUTTON
=====================
*/

function initButton(){

    document
    .getElementById("btnDraft")
    .addEventListener("click",()=>{

        saveArticle("DRAFT");

    });

    document
    .getElementById("btnPublish")
    .addEventListener("click",()=>{

        saveArticle("PUBLISH");

    });

}



/*
=====================
SAVE ARTICLE
=====================
*/

async function saveArticle(status){

    /*
    =====================
    VALIDASI
    =====================
    */

    if(title.value.trim()===""){
        showToast("Judul artikel wajib diisi.");
        return;
    }

    if(date.value===""){
        showToast("Tanggal wajib diisi.");
        return;
    }

    if(author.value.trim()===""){
        showToast("Penulis wajib diisi.");
        return;
    }

    if(thumbnail.value.trim()===""){
        showToast("Thumbnail wajib diisi.");
        return;
    }

    if(content.value.trim()===""){
        showToast("Isi artikel wajib diisi.");
        return;
    }

    /*
    =====================
    LOADING
    =====================
    */

    document.getElementById("loadingSave").style.display="flex";

    try{

        const body=new URLSearchParams();

        body.append("action","addArticle");
        body.append("title",title.value);
        body.append("slug",slug.value);
        body.append("date",date.value);
        body.append("author",author.value);
        body.append("thumbnail",thumbnail.value);
        body.append("source",source.value);
        body.append("content",content.value);
        body.append("status",status);

        const response=await fetch(API_URL,{
            method:"POST",
            body:body
        });

        const result=await response.json();

        document.getElementById("loadingSave").style.display="none";

        showToast(result.message);

        if(result.success){

            setTimeout(()=>{

                window.location.href="../article/";

            },1000);

        }

    }catch(error){

        document.getElementById("loadingSave").style.display="none";

        console.error(error);

        showToast("Gagal menyimpan artikel.");

    }

}



/*
=====================
BACK BUTTON
=====================
*/

function initBackButton(){

    const btnBack =
        document.getElementById("btnBack");

    const modal =
        document.getElementById("backModal");

    const cancel =
        document.getElementById("cancelBack");

    const confirm =
        document.getElementById("confirmBack");


    btnBack.addEventListener(
        "click",
        () => {

            modal.classList.add("show");

        }
    );


    cancel.addEventListener(
        "click",
        () => {

            modal.classList.remove("show");

        }
    );


    modal.addEventListener(
        "click",
        (e) => {

            if (e.target === modal) {

                modal.classList.remove("show");

            }

        }
    );


    confirm.addEventListener(
        "click",
        () => {

            window.location.href="../article/";

        }
    );

}



/*
=====================
TOAST
=====================
*/

function showToast(message){

    const toast =
        document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}