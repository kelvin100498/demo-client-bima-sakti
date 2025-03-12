/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2025 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts

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
            const response = await fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjSNh_ZVYfloYm5VRZdlrOgPog01c71RWZLAL91TTgf6gnWSJHEgkg8iUcBepkDQbjKINqv0UB1HTniiUQHRoyxhGEje08CxXe8PkGvvXpse2T19buaJv6sBhXiJCwQA9p9mII-Bf84wFno5g2ZmfW5tqFsqn-BegY7E2eCcb8Wo8lp4f8584eCfVNP_8aHvIzTeYzz9N1E2COLPJon1mDTSoeL32Ic2MQl17a9ecnTNxOJKYjZc6OJSOYmVWR5VkdLddvWqa4y21o03thsYvfvHFL0ZQ&lib=MVRnV3tDqCH4TyWg0eM07ejJOzZw8k3LO");
            const data = await response.json();

            // Kirim data ke HTML pakai CustomEvent
            document.dispatchEvent(new CustomEvent("beritaLoaded", { detail: data }));
            console.error(" mengambil data:", data);

        } catch (error) {
            console.error("Gagal mengambil data:", error);
        }
    }

    fetchBerita();
});
