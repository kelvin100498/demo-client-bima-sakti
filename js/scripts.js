
window.addEventListener('DOMContentLoaded', async (event) => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
   
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // ==============================
    // FETCH BERITA
    // ==============================
    async function fetchBerita() {

        try {
    
            const body = new URLSearchParams();
    
            body.append(
                "action",
                "getPublishedArticles"
            );
    
    
            const response = await fetch(API_URL, {
    
                method: "POST",
    
                body: body
    
            });
    
    
            const result =
                await response.json();
    
    
            if(result.success){
    
                document.dispatchEvent(
                    new CustomEvent(
                        "beritaLoaded",
                        {
                            detail: result.data
                        }
                    )
                );
    
            } else {
    
                document.dispatchEvent(
                    new CustomEvent(
                        "beritaLoaded",
                        {
                            detail: []
                        }
                    )
                );
    
            }
    
    
        } catch(error) {
    
            console.error(
                "Gagal mengambil data:",
                error
            );
    
        }
    
    }

    // async function fetchBerita() {
    //     try {
    //         const response = await fetch("https://script.google.com/macros/s/AKfycbzpNl-wt1Uw6w6QPmhtxoC8IHxMElqnFXLHFxVBaZ8hRPP-CnWmfgTEAyVSPOUzEmqO/exec");
    //         const data = await response.json();

    //         const beritaTerbaru = data;

    //         // Kirim data ke HTML pakai CustomEvent
    //         document.dispatchEvent(new CustomEvent("beritaLoaded", { detail: beritaTerbaru }));

    //     } catch (error) {
    //         console.error("Gagal mengambil data:", error);
    //     }
    // }

    fetchBerita();
});
