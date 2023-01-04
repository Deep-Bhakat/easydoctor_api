
const catchAsyncError = require('../utils/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const connection = require('../utils/database');
const con = require('../utils/database');

exports.checkPhone = catchAsyncError(async (req,res,next) => {
    const {phone} = req.params;

    connection.query(`SELECT * FROM employee_master WHERE emp_cnct=${phone} and job_role='doctor'`, function (err, result, fields) {
        console.log(err);
        if(err){
            return next(new ErrorHandler(err.message, 500));
        }
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
function generateRandomString(length = 10) {
    var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    var randomString = '';
    for (i = 0; i < length; i++) {
        randomString += characters[Math.floor(Math.random() * charactersLength - 1)];
    }
    return randomString;
}
exports.addDoctorDetails = catchAsyncError(async (req,res,next) => {
    const {name,phone,email,date} = req.body;
    const roomId = generateRandomString();
    const dd = Date.now().toLocaleString();
    
    var lastId;
    var data;
    con.query(`INSERT INTO doctor_master SET
    title="Dr",
    doctor_name='${name}',
    join_date='${date}',
    mobile='${phone}',
    password='${phone}',
    email='${email}',
    image="avatar.jpg",
    room_id='${roomId}',
    date='${dd}'`, function(err,result) {
        if(err){
            return next(new ErrorHandler(err.message, 500));
        }

        lastId = result.insertId;
        con.query(`INSERT INTO employee_master SET
    user_type="1",
    emp_name='${name}',
   job_role="doctor",
    title="Dr",
    user_name='${phone}',
    user_psswd='${phone}',
    email='${email}',
    emp_cnct='${phone}',
    doc_id='${lastId}',    
    status="1",
    date='${dd}'`, function(err,result) {
        if(err){
            return next(new ErrorHandler(err.message, 500));
        }
        con.query(`SELECT * FROM doctor_master WHERE id=${lastId}`, function(err,result) {
            if(err){
                return next(new ErrorHandler(err.message, 500));
            }
    
            return res.status(200).json({
                success:true,
                message: 'Doctor added successfully!',
                data:result
            });
        })
    });
    })

    
    

    
   
});

exports.addMoreDoctorDetails = catchAsyncError(async (req,res,next) => {
    const {docId,address,pincode,city,state,
        docImgUrl,isVerified,docChamberDetails,
        registrationNo,qualification,department,about,
    bankName,accountNo,ifscCode,branchName} = req.body;
    
    
    con.query(`UPDATE doctor_master SET
    address="${address}",
    pincode='${pincode}',
    city='${city}',
    state='${state}',
    regn_no='${registrationNo}',
    qulifica='${qualification}',
    about_doctor='${about}',
    department='${department}',
    status='${isVerified}',
    bank_name='${bankName}',
    account_no='${accountNo}',
    ifsc_code='${ifscCode}',
    branch_code='${branchName}',
    image='${docImgUrl ? docImgUrl : 'avatar.jpg'}' WHERE id='${docId}'
    `, function(err,result) {
        if(err){
            return next(new ErrorHandler(err.message, 500));
        }

        docChamberDetails.forEach(element => {
            console.log(element);
            con.query(`INSERT INTO doctor_chambers SET
            doctor_id="${docId}",
            chamber_name='${element.chamberName}',           
            address='${element.address}',
            pincode='${element.pincode}',
            fee='${element.fee}'
             WHERE id='${docId}'
            `, function(err,result) {
                if(err){
                    return next(new ErrorHandler(err.message, 500));
                }

                const chamberId = result.insertId;

                // docChamberDetails.
        });
       
    
           
        })
        return res.status(200).json({
            success:true,
            message: 'Doctor details and chamber details updated successfully!',
            data:result
        });
    });
});
    