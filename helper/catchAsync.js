module.exports = fn => {
    return (req, res, next) => {
        console.log("i am here")
    fn(req, res, next).catch((error) => next(error))
    }
}

