// Higher Order Function
// Function which can take another function as parameter and returns function. Treats other functions as variables
// Here the asyncHandler recieves a function, wraps this function inside another async arrow function,
// execute it there inside try, and return the async function

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise
        .resolve(fn(req, res, next))
        .catch(error => next(error))
    }
}

export {asyncHandler}



/*
// ASYNC METHOD
// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => () => {}
// const  asyncHandler() => async () => {}

const asyncHandler = (fn) => {
    return async(req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
            
        }
    }
}

*/