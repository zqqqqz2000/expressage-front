import config from "./config";


export function api(url, data, callback, withToken = true) {
    let token = localStorage.getItem('token');
    if (!token && withToken) {
        this.$message({
            type: "error",
            message: "未登录，请登录后重试"
        });
        this.$router.push("/login");
        return;
    }
    this.axios({
        url: config.serverURL + url,
        method: "post",
        data: data,
    }).then((response) => {
        if ('info' in response.data) {
            this.$message({
                type: response.data.success ? "success" : "error",
                message: response.data.info
            });
        }
        callback(response);
    });
}
