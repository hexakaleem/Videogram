class ApiResponse{
    constructor(
        statusCode,
        data,
        message = "Success"
    ){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400 // will be true if less then 400
    }
}

export {ApiResponse}