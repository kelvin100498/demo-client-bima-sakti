/**
 * ===========================================
 * LBH BIMA SAKTI CMS
 * Authentication Manager
 * ===========================================
 */

const Auth = {

    save(data) {

        localStorage.setItem("cms_token", data.token);

        localStorage.setItem(
            "cms_user",
            JSON.stringify(data.user)
        );

    },

    token() {

        return localStorage.getItem("cms_token");

    },

    user() {

        const user = localStorage.getItem("cms_user");

        if (!user) return null;

        return JSON.parse(user);

    },

    isLogin() {

        return this.token() !== null;

    },

    async logout() {

        const token = this.token();

        if (token) {

            try {

                const response = await logoutApi(token);

                console.log("Logout Response :", response);

            } catch (err) {

                console.error("Logout Error :", err);

            }

        }

        localStorage.removeItem("cms_token");

        localStorage.removeItem("cms_user");

        window.location.href = "/admin";

    },

    async check() {

        if (!this.isLogin()) {

            window.location.href = "/admin";

            return false;

        }

        try {

            const response = await checkTokenApi(
                this.token()
            );

            if (!response.success) {

                await this.logout();

                return false;

            }

            return true;

        } catch (err) {

            await this.logout();

            return false;

        }

    }

};