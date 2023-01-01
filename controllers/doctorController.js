
const catchAsyncError = require('../utils/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const con = require('../utils/database')

exports.checkPhone = catchAsyncError(async (req,res,next) => {
    const {phone} = req.params;

    con.query(`SELECT * FROM employee_master WHERE emp_cnct=${phone} and job_role='doctor'`, function (err, result, fields) {
        if(result.length>0){
            return res.status(200).json({
                success:true,
                message:'Doctor found!'
            });
        }else{
            return res.status(400).json({
                success:false,
                message:'No doctor found!'
            });
        }
    });

    
});