
module.exports = (err,req,res,next) =>{

    return res.status(err.statusCode || 500).json({
        success:false,
        errorMessage: err.message || 'Internal Server Error'
    });
};