const API_URL =
"https://script.google.com/macros/s/AKfycbzpd3qLEpqFJsND5VVFqGSjds1u50EPJolLYn0bdbrCzZsWmZNYnhVaPhnQkrUpfAgp/exec";



async function loadAllArticle(){

    try{

        const body = new URLSearchParams();

        body.append(
            "action",
            "getPublishedArticles"
        );

        const response = await fetch(
            API_URL,
            {
                method:"POST",
                body:body
            }
        );

        const result = await response.json();

        if(result.success){

            renderArticle(result.data);

            /*
            =====================
            HIDE LOADING
            =====================
            */
            document
                .getElementById("loadingOverlay")
                .classList.add("hide");

            document
                .getElementById("allArticleContainer")
                .classList.add("show");

        }

    }
    catch(error){

        console.error(
            "Article error:",
            error
        );

        // Tetap hilangkan loading jika error
        document
            .getElementById("loadingOverlay")
            .classList.add("hide");

    }

}

function formatTanggalBerita(dateString){

    const date =
        new Date(dateString);


    const hari=[
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];


    const bulan=[
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
    ];


    return `${hari[date.getDay()]}, ${bulan[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;

}




function getSourceName(url){

    try{

        return new URL(url)
            .hostname
            .replace(
                "www.",
                ""
            );

    }
    catch(error){

        return url;

    }

}




function renderArticle(data){


    const container =
        document.getElementById(
            "allArticleContainer"
        );



    container.innerHTML="";



    data.forEach(
        (berita,index)=>{


        const modalId =
            `articleModal${index}`;



        const tanggal =
            formatTanggalBerita(
                berita.date
            );



        container.innerHTML += `



        <div class="col-lg-4 col-md-6 mb-4">


            <div class="portfolio-item">


                <a
                    class="portfolio-link"
                    data-bs-toggle="modal"
                    href="#${modalId}"
                >

                    <img
                        class="news-item-img-out"
                        src="${berita.thumbnail}"
                        alt="${berita.title}"
                    />

                </a>



                <div class="portfolio-caption">


                    <div class="portfolio-caption-heading">

                        ${berita.title}

                    </div>


                    <p class="text-muted">

                        ${tanggal}

                    </p>


                </div>


            </div>



        </div>





        <!-- MODAL -->


        <div 
            class="portfolio-modal modal fade"
            id="${modalId}"
        >


            <div class="modal-dialog">


                <div class="modal-content">


                    <div
                        class="close-modal"
                        data-bs-dismiss="modal"
                    >

                        <img
                            src="../../assets/img/close-icon.svg"
                        />

                    </div>




                    <div class="container">


                        <div class="row justify-content-center">


                            <div class="col-lg-8">


                                <div class="modal-body">



                                    <h1 class="text-uppercase">

                                        ${berita.title}

                                    </h1>



                                    <p class="item-intro text-muted">

                                        ${tanggal}

                                    </p>




                                    <img
                                        class="news-item-img"
                                        src="${berita.thumbnail}"
                                    />





                                    <p>

                                        ${berita.content.replace(/\n/g,"<br>")}

                                    </p>





                                    <ul class="list-inline">


                                        <li>

                                            <strong>
                                                Penulis:
                                            </strong>

                                            ${berita.author}

                                        </li>



                                        <li>

                                            <strong>
                                                Source:
                                            </strong>


                                            ${
                                            berita.source
                                            ?
                                            `<a 
                                                href="${berita.source}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                ${getSourceName(berita.source)}
                                            </a>`
                                            :
                                            "-"
                                            }


                                        </li>



                                    </ul>




                                </div>


                            </div>


                        </div>


                    </div>


                </div>


            </div>


        </div>


        `;


    });


}





document.addEventListener(
    "DOMContentLoaded",
    loadAllArticle
);