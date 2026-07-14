const loginForm = document.getElementById("loginForm");

const username = document.getElementById("username");

const password = document.getElementById("password");

const btnLogin = document.getElementById("btnLogin");

const btnText = document.getElementById("btnText");

const btnLoading = document.getElementById("btnLoading");

const togglePassword = document.getElementById("togglePassword");

const toggleIcon = document.getElementById("toggleIcon");

togglePassword.addEventListener("click",()=>{

    const isPassword = password.type==="password";

    password.type =

        isPassword

            ? "text"

            : "password";

    toggleIcon.classList.toggle("bi-eye");

    toggleIcon.classList.toggle("bi-eye-slash");

});

function startLoading(){

    btnLogin.disabled=true;

    btnText.classList.add("d-none");

    btnLoading.classList.remove("d-none");

}

function stopLoading(){

    btnLogin.disabled=false;

    btnText.classList.remove("d-none");

    btnLoading.classList.add("d-none");

}

loginForm.addEventListener("submit",async(e)=>{

    e.preventDefault();

    if(username.value.trim()===""){

        Swal.fire({

            icon:"warning",

            title:"Username wajib diisi"

        });

        return;

    }

    if(password.value.trim()===""){

        Swal.fire({

            icon:"warning",

            title:"Password wajib diisi"

        });

        return;

    }

    startLoading();

    try{

        const response = await loginApi(

            username.value,

            password.value

        );

        if(response.success){

            Auth.save(response);

            Swal.fire({

                icon:"success",

                title:"Login Berhasil",

                text:`Selamat datang ${response.user.fullname}`,

                timer:1500,

                showConfirmButton:false

            }).then(()=>{

                window.location.href="dashboard.html";

            });

        }else{

            Swal.fire({

                icon:"error",

                title:"Login Gagal",

                text:response.message

            });

        }

    }catch(error){

        Swal.fire({

            icon:"error",

            title:"Server Error",

            text:error.message

        });

    }

    stopLoading();

});