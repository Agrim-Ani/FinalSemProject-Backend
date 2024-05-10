// const {constants} = require("../constants")
let constants = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND : 404,
    SERVER_ERROR: 500
}
const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({title: "Validation Failed!",message: err.message, stackTrace: err.stack});
            break;
        case constants.NOT_FOUND:
             res.json({title: "NOT FOUND!",message: err.message, stackTrace: err.stack});
            break;
            case constants.UNAUTHORIZED:
             res.json({title: "UNAUTHORIZED!",message: err.message, stackTrace: err.stack});
            break;
            case constants.FORBIDDEN:
             res.json({title: "FORBIDDEN!",message: err.message, stackTrace: err.stack});
            break;
            case constants.SERVER_ERROR:
             res.json({title: "SERVER ERROR!",message: err.message, stackTrace: err.stack});
            break;
            default:
            console.log("NO ERROR, ALL GOOD!!!")
            break;
    }
    
   
};

module.exports = errorHandler;