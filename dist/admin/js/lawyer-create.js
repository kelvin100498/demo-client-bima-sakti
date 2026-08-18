console.log("LAWYER CREATE LOADED");


const form = document.getElementById("lawyerForm");

const txtName = document.getElementById("name");
const txtSlug = document.getElementById("slug");
const txtPosition = document.getElementById("position");
const txtDescription = document.getElementById("description");

const txtInstagram = document.getElementById("instagram");
const txtFacebook = document.getElementById("facebook");
const txtLinkedin = document.getElementById("linkedin");
const txtTiktok = document.getElementById("tiktok");

const filePhoto = document.getElementById("photo");

const dropArea = document.getElementById("dropArea");
const dropContent = document.getElementById("dropContent");

const previewContainer = document.getElementById("previewContainer");
const previewImage = document.getElementById("previewImage");

const photoInfo = document.getElementById("photoInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");

const btnSave = document.getElementById("btnSave");
const btnBack = document.getElementById("btnBack");

const loadingSave = document.getElementById("loadingSave");
const toast = document.getElementById("toast");

const backModal = document.getElementById("backModal");
const cancelBack = document.getElementById("cancelBack");
const confirmBack = document.getElementById("confirmBack");


/*******************************************************
 * ERROR
 *******************************************************/

const nameError = document.getElementById("nameError");
const positionError = document.getElementById("positionError");
const photoError = document.getElementById("photoError");


/*******************************************************
 * GLOBAL VARIABLE
 *******************************************************/

let selectedFile = null;
let photoParts = [];
let isChanged = false;


/*******************************************************
 * INITIALIZE
 *******************************************************/

document.addEventListener("DOMContentLoaded", () => {

    txtName.focus();

});


/*******************************************************
 * GENERATE SLUG
 *******************************************************/

function generateSlug(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}


/*******************************************************
 * AUTO SLUG
 *******************************************************/

txtName.addEventListener("input", () => {

    txtSlug.value = generateSlug(
        txtName.value
    );

    isChanged = true;

});


/*******************************************************
 * PHOTO
 *******************************************************/

dropArea.addEventListener("click", () => {

    filePhoto.click();

});


filePhoto.addEventListener("change", () => {

    if (filePhoto.files.length > 0) {

        processPhoto(
            filePhoto.files[0]
        );

    }

});


/*******************************************************
 * DRAG & DROP
 *******************************************************/

dropArea.addEventListener("dragover", (e) => {

    e.preventDefault();

    dropArea.classList.add("dragover");

});


dropArea.addEventListener("dragleave", () => {

    dropArea.classList.remove("dragover");

});


dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.classList.remove("dragover");


    if (e.dataTransfer.files.length > 0) {

        processPhoto(
            e.dataTransfer.files[0]
        );

    }

});


/*******************************************************
 * PROCESS PHOTO
 *******************************************************/

function processPhoto(file) {

    console.log("PROCESS PHOTO RUN");

    console.log("FILE NAME:", file.name);

    console.log("FILE SIZE BYTE:", file.size);

    console.log(
        "FILE SIZE MB:",
        (file.size / 1024 / 1024).toFixed(2)
    );


    const allowType = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!allowType.includes(file.type)) {

        showToast(
            "Format gambar tidak didukung.",
            "error"
        );

        return;

    }


    if (file.size > 1024 * 1024) {

        console.log(
            "FILE TERLALU BESAR:",
            file.size
        );
    

        filePhoto.value = "";
    
        selectedFile = null;
        photoParts = [];
    
    
        photoInfo.style.display = "none";
    
    
        previewContainer.style.display = "none";
    
        previewImage.src = "";
    
    
        showToast(
            "Ukuran foto terlalu besar. Maksimal 1 MB.",
            "error"
        );
    
    
        return;
    
    }


    selectedFile = file;


    photoError.style.display = "none";


    photoInfo.style.display = "flex";


    fileName.textContent = file.name;


    fileSize.textContent =
        (file.size / 1024).toFixed(2) + " KB";


    const reader = new FileReader();


    reader.onload = function (e) {


        const result = e.target.result;


        /*
        =====================
        PREVIEW IMAGE
        =====================
        */

        previewImage.src = result;


        previewContainer.style.display = "block";


        dropContent.style.display = "none";



        /*
        =====================
        BASE64 UPLOAD
        =====================
        */


        const base64 =
            result.split(",")[1];


        photoParts =
            splitBase64(base64);


    };


    reader.readAsDataURL(file);


    isChanged = true;


}


/*******************************************************
 * SPLIT BASE64
 *******************************************************/

function splitBase64(base64) {


    const chunkSize = 45000;


    const parts = [];


    for (
        let i = 0;
        i < base64.length;
        i += chunkSize
    ) {

        parts.push(
            base64.substring(
                i,
                i + chunkSize
            )
        );

    }


    return parts;

}


/*******************************************************
 * VALIDATION
 *******************************************************/

function validateForm() {


    let valid = true;


    nameError.style.display = "none";
    positionError.style.display = "none";
    photoError.style.display = "none";


    if (txtName.value.trim() === "") {

        nameError.style.display = "block";

        valid = false;

    }


    if (txtPosition.value.trim() === "") {

        positionError.style.display = "block";

        valid = false;

    }


    if (!selectedFile || photoParts.length === 0) {

        photoError.style.display = "block";

        valid = false;

    }


    return valid;


}


/*******************************************************
 * HIDE ERROR WHEN USER INPUT
 *******************************************************/

txtName.addEventListener("input", () => {

    nameError.style.display = "none";

});


txtPosition.addEventListener("input", () => {

    positionError.style.display = "none";

});


filePhoto.addEventListener("change", () => {

    photoError.style.display = "none";

});


/*******************************************************
 * SAVE LAWYER
 *******************************************************/

btnSave.addEventListener(
    "click",
    saveLawyer
);



async function saveLawyer() {
    console.log("SAVE CLICKED");

    const isValid = validateForm();

    console.log("VALID:", isValid);

    if (!isValid) {

        return;

    }
    console.log("VALIDATION PASSED");


    loadingSave.style.display = "flex";


    btnSave.disabled = true;



    try {


        const response = await addLawyerApi({
        
            name: txtName.value.trim(),
        
            slug: txtSlug.value.trim(),
        
            position: txtPosition.value.trim(),
        
            description: txtDescription.value.trim(),
        
            instagram: txtInstagram.value.trim(),
        
            facebook: txtFacebook.value.trim(),
        
            linkedin: txtLinkedin.value.trim(),
        
            tiktok: txtTiktok.value.trim(),
        
            parts: JSON.stringify(photoParts)
        
        });



        loadingSave.style.display = "none";


        btnSave.disabled = false;



        if (!response.success) {


            showToast(
                response.message,
                "error"
            );


            return;


        }



        isChanged = false;



        showToast(
            response.message,
            "success"
        );



        setTimeout(() => {


            window.location.href = "../lawyer/index.html";


        }, 1000);



    } catch (err) {


        loadingSave.style.display = "none";


        btnSave.disabled = false;



        showToast(
            "Terjadi kesalahan server.",
            "error"
        );


        console.error(err);


    }


}

/*******************************************************
 * TOAST
 *******************************************************/

function showToast(message, type = "success") {

    if (!toast) {
        return;
    }


    toast.textContent = message;


    toast.className = "toast " + type;


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

btnBack.addEventListener(
    "click",
    () => {

        backModal.classList.add("show");

    }
);


cancelBack.addEventListener(
    "click",
    () => {

        backModal.classList.remove("show");

    }
);


confirmBack.addEventListener(
    "click",
    () => {

        window.location.href = "../lawyer/index.html";

    }
);
