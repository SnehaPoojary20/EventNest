class ApiResponse {
    constructor(status, message, data = null) {
        this.statusCode = this.statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode<400;
    }
}

export { ApiResponse };