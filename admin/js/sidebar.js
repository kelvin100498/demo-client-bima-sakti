async function loadSidebar(activePage) {

    console.log("Load Sidebar :", activePage);

    const response = await fetch("../../components/sidebar.html", {
        cache: "no-store"
    });

    const html = await response.text();

    document.getElementById("sidebar").innerHTML = html;

    // Hapus semua active terlebih dahulu
    document.querySelectorAll(".sidebar nav a").forEach(function(menu){
        menu.classList.remove("active");
    });

    // Set menu aktif
    const active = document.querySelector(`[data-page="${activePage}"]`);

    console.log("Menu Aktif :", active);

    if(active){
        active.classList.add("active");
    }

    /*
        WEBSITE
    */

    const websitePage = document.getElementById("websitePage");

    if(websitePage){

        websitePage.onclick = function(e){

            e.preventDefault();

            window.open(
                `${window.location.origin}/page/beranda/`,
                "_blank"
            );

        };

    }

    /*
        LOGOUT
    */

    const logout = document.getElementById("logout");

    if(logout){

        logout.onclick = function(e){

            e.preventDefault();

            document
                .getElementById("logoutModal")
                .classList.add("show");

        };

    }

    /*
        CANCEL
    */

    const cancelLogout =
    document.getElementById("cancelLogout");

    if(cancelLogout){

        cancelLogout.onclick = function(){

            document
                .getElementById("logoutModal")
                .classList.remove("show");

        };

    }

    /*
        CONFIRM
    */

    const confirmLogout =
    document.getElementById("confirmLogout");

    if(confirmLogout){

        confirmLogout.onclick = async function(){

            this.disabled = true;
            this.innerHTML = "Logout...";

            await Auth.logout();

        };

    }

    /*
        CLOSE MODAL
    */

    const logoutModal =
    document.getElementById("logoutModal");

    if(logoutModal){

        logoutModal.onclick = function(e){

            if(e.target === logoutModal){

                logoutModal.classList.remove("show");

            }

        };

    }

}