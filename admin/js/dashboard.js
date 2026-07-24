document.addEventListener(
    "DOMContentLoaded",
    async()=>{

            
        loadStatistic();

        loadSidebar("dashboard");
    
    
        /*
            CEK AUTH
        */
    
    
        const valid = await Auth.check();
    
    
    
        if(!valid){
    
    
            window.location.href="index.html";
    
    
            return;
    
    
        }
    
    
    
    
    
    
        /*
            AMBIL USER LOGIN
        */
    
    
        const user = Auth.user();
    
    
    
    
    
        document.getElementById("fullname")
        .innerHTML =
        user.fullname ?? "Administrator";
    
    
    
    
        document.getElementById("role")
        .innerHTML =
        user.role ?? "Admin";
    
    
    
    
    
    
    
        /*
            LOGOUT
        */
    
    
            const logout =
            document.getElementById("logout");
            
            
            const logoutModal =
            document.getElementById("logoutModal");
            
            
            const cancelLogout =
            document.getElementById("cancelLogout");
            
            
            const confirmLogout =
            document.getElementById("confirmLogout");
            
            
            
            
            
            // buka modal
            
            logout.addEventListener(
            "click",
            (e)=>{
            
            
                e.preventDefault();
            
            
                logoutModal.classList.add(
                    "show"
                );
            
            
            });
            
            
            
            
            
            
            // batal logout
            
            cancelLogout.addEventListener(
            "click",
            ()=>{
            
            
                logoutModal.classList.remove(
                    "show"
                );
            
            
            });
            
            
            
            
            
            
            
            // konfirmasi logout

            confirmLogout.addEventListener(
                "click",
                async () => {

                    // Disable tombol
                    confirmLogout.disabled = true;
                    cancelLogout.disabled = true;

                    // Simpan teks asli
                    const originalText = confirmLogout.innerHTML;

                    // Loading
                    confirmLogout.innerHTML = `
                        <span class="spinner"></span>
                        Logging out...
                    `;

                    try {

                        await Auth.logout();

                    } catch (error) {

                        console.error(error);

                        // Jika gagal, kembalikan seperti semula
                        confirmLogout.disabled = false;
                        cancelLogout.disabled = false;
                        confirmLogout.innerHTML = originalText;

                        alert("Logout gagal. Silakan coba lagi.");

                    }

                }
            );
            
            
            
            
            
            
            
            // klik area luar modal
            
            logoutModal.addEventListener(
            "click",
            (e)=>{
            
            
                if(e.target === logoutModal){
            
            
                    logoutModal.classList.remove(
                        "show"
                    );
            
            
                }
            
            
            });

            
            // WEBSITE PAGE

            websitePage.addEventListener(
                "click",
                (e) => {
            
                    e.preventDefault();
                    window.open(
                        `${window.location.origin}/page/beranda/`,
                        "_blank"
                    );
            
                }
            );

    });
    
    
    
    
    
    
    
    
    
    async function loadStatistic(){

        try{
    
            /*
            =====================
            TOTAL ARTICLE
            =====================
            */
    
            const body = new URLSearchParams();
    
            body.append("action", "getArticles");
    
            const response = await fetch(API_URL,{
                method:"POST",
                body:body
            });
    
            const result = await response.json();
    
            document.getElementById("totalArticle").innerHTML =
                result.success ? result.total : 0;
    
            /*
            =====================
            TOTAL LAWYER
            =====================
            */
    
            const statistic = {
                lawyer:8
            };
    
            document.getElementById("totalLawyer").innerHTML =
                statistic.lawyer;
    
            /*
            =====================
            TOTAL VISITOR
            =====================
            */
    
            const visitor = await totalVisitorApi();
    
            document.getElementById("totalVisitor").innerHTML =
                visitor.total;
    
        }
        catch(error){
    
            console.error("Dashboard error:", error);
    
        }
    
    }
    