/*
=====================
CONFIG
=====================
*/

const API_URL =
    "https://script.google.com/macros/s/AKfycbzpd3qLEpqFJsND5VVFqGSjds1u50EPJolLYn0bdbrCzZsWmZNYnhVaPhnQkrUpfAgp/exec";


/*
=====================
BASE64 CONFIG
=====================
*/

const CHUNK_SIZE = 45000;
const ADVOCATE_ID = "ADV003";

/*
=====================
ELEMENT
=====================
*/

const dropArea =
    document.getElementById("dropArea");

const fileInput =
    document.getElementById("fileInput");

const dropContent =
    document.getElementById("dropContent");

const previewContainer =
    document.getElementById("previewContainer");

const previewImage =
    document.getElementById("previewImage");

const fileInfo =
    document.getElementById("fileInfo");

const fileName =
    document.getElementById("fileName");

const fileSize =
    document.getElementById("fileSize");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const btnUpload =
    document.getElementById("btnUpload");

const btnReplace =
    document.getElementById("btnReplace");

const btnDelete =
    document.getElementById("btnDelete");



/*
=====================
GLOBAL FILE
=====================
*/

let selectedFile = null;



/*
=====================
OPEN FILE SELECTOR
=====================
*/

dropArea.addEventListener(
    "click",
    () => {

        if (!selectedFile) {

            fileInput.click();

        }

    }
);



/*
=====================
FILE SELECT
=====================
*/

fileInput.addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];

        if (!file) {

            return;

        }

        handleFile(file);

    }
);



/*
=====================
DRAG ENTER
=====================
*/

dropArea.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        dropArea.classList.add("dragging");

    }
);



/*
=====================
DRAG LEAVE
=====================
*/

dropArea.addEventListener(
    "dragleave",
    () => {

        dropArea.classList.remove(
            "dragging"
        );

    }
);



/*
=====================
DROP
=====================
*/

dropArea.addEventListener(
    "drop",
    (event) => {

        event.preventDefault();

        dropArea.classList.remove(
            "dragging"
        );

        const file =
            event.dataTransfer.files[0];

        if (!file) {

            return;

        }

        handleFile(file);

    }
);



/*
=====================
HANDLE FILE
=====================
*/

function handleFile(file) {

    /*
    =====================
    VALIDATE TYPE
    =====================
    */

    if (!file.type.startsWith("image/")) {

        alert(
            "File harus berupa gambar."
        );

        return;

    }


    /*
    =====================
    VALIDATE SIZE
    =====================
    */

    const maxSize =
        5 * 1024 * 1024;

    if (file.size > maxSize) {

        alert(
            "Ukuran file maksimal 5 MB."
        );

        return;

    }


    selectedFile =
        file;


    /*
    =====================
    PREVIEW
    =====================
    */

    const reader =
        new FileReader();

    reader.onload =
        (event) => {

            previewImage.src =
                event.target.result;

            previewContainer.style.display =
                "block";

            dropContent.style.display =
                "none";

        };

    reader.readAsDataURL(file);


    /*
    =====================
    FILE INFO
    =====================
    */

    fileName.textContent =
        file.name;

    fileSize.textContent =
        formatFileSize(
            file.size
        );

    fileInfo.style.display =
        "block";


    progressBar.style.width =
        "0%";

    progressText.textContent =
        "Siap upload";

}



/*
=====================
FORMAT FILE SIZE
=====================
*/

function formatFileSize(bytes) {

    if (bytes === 0) {

        return "0 Bytes";

    }

    const units =
        [
            "Bytes",
            "KB",
            "MB"
        ];

    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );

    return (
        parseFloat(
            (
                bytes /
                Math.pow(
                    1024,
                    index
                )
            ).toFixed(2)
        )
        +
        " "
        +
        units[index]
    );

}



/*
=====================
REPLACE
=====================
*/

btnReplace.addEventListener(
    "click",
    () => {

        fileInput.click();

    }
);



/*
=====================
DELETE
=====================
*/

btnDelete.addEventListener(
    "click",
    () => {

        selectedFile =
            null;

        fileInput.value =
            "";

        previewImage.src =
            "";

        previewContainer.style.display =
            "none";

        dropContent.style.display =
            "flex";

        fileInfo.style.display =
            "none";

        progressBar.style.width =
            "0%";

        progressText.textContent =
            "Belum upload";

    }
);



/*
=====================
UPLOAD
=====================
*/

btnUpload.addEventListener(
    "click",
    async () => {

        if (!selectedFile) {

            alert(
                "Silakan pilih foto terlebih dahulu."
            );

            return;

        }

        btnUpload.disabled =
            true;

        progressText.textContent =
            "Mengupload...";


        try {

            const base64 =
                await fileToBase64(
                    selectedFile
                );
                const parts =
                splitBase64(base64);
            
            console.log(
                "Jumlah Part:",
                parts.length
            );
            
            parts.forEach(
                (part, index) => {
            
                    console.log(
                        `Part ${index + 1}: ${part.length} karakter`
                    );
            
                }
            );

            const body =
            new URLSearchParams();
        
        body.append(
            "action",
            "uploadLawyerPhoto"
        );
        
        body.append(
            "advocateId",
            ADVOCATE_ID
        );
        
        body.append(
            "mimeType",
            selectedFile.type
        );
        
        body.append(
            "parts",
            JSON.stringify(parts)
        );

            const response =
                await fetch(
                    API_URL,
                    {

                        method:
                            "POST",

                        body:
                            body

                    }
                );


            const result =
                await response.json();


            if (
                result.success
            ) {

                progressBar.style.width =
                    "100%";

                progressText.textContent =
                    "Upload berhasil";

                alert(
                    "Foto berhasil diupload."
                );

            } else {

                throw new Error(
                    result.message
                );

            }

        } catch (error) {

            console.error(
                error
            );

            progressText.textContent =
                "Upload gagal";

            alert(
                "Gagal upload foto."
            );

        } finally {

            btnUpload.disabled =
                false;

        }

    }
);



/*
=====================
FILE TO BASE64
=====================
*/

function fileToBase64(file) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();

            reader.onload =
                () => {

                    const base64 =
                        reader.result
                        .split(",")[1];

                    resolve(
                        base64
                    );

                };

            reader.onerror =
                reject;

            reader.readAsDataURL(
                file
            );

        }
    );

}

/*
=====================
SPLIT BASE64
=====================
*/

function splitBase64(base64) {

    const parts = [];

    for (
        let i = 0;
        i < base64.length;
        i += CHUNK_SIZE
    ) {

        parts.push(
            base64.substring(
                i,
                i + CHUNK_SIZE
            )
        );

    }

    return parts;

}

async function loadPhoto() {

    const body =
        new URLSearchParams();

    body.append(
        "action",
        "getLawyerPhoto"
    );

    body.append(
        "advocateId",
        ADVOCATE_ID
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

    console.log(result);

    if (result.success) {

        previewImage.src =
            "data:image/jpeg;base64," +
            result.base64;

        previewContainer.style.display =
            "block";

        dropContent.style.display =
            "none";

    }

}

loadPhoto();