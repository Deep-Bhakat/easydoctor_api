
const catchAsyncError = require('../utils/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const connection = require('../utils/database');
const con = require('../utils/database');
const jwt = require('jsonwebtoken');
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
    const dd = Date.now().toLocaleString();
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
            console.log(err);
            return next(new ErrorHandler(err.message, 500));
        }
        for(var i=0;i<docChamberDetails.length;i++) {
        
            const test = docChamberDetails[i];
            con.query(`INSERT INTO doctor_chambers SET
            doctor_id="${docId}",
            chamber_name='${docChamberDetails[i].chamberName}',           
            address='${docChamberDetails[i].address}',
            pincode='${docChamberDetails[i].pincode}',
            fee='${docChamberDetails[i].fee}',
            dated='${dd}'
            `, function(err,result) {
                if(err){
                    console.log(err);

                    return next(new ErrorHandler(err.message, 500));
                }

                const chamberId = result.insertId;            

                // docChamberDetails.timimg
                for(var j=0;j<test.timing.length;j++) {
                    con.query(`INSERT INTO doctor_chamber_timings SET
            doc_id="${docId}",
            chamber_id='${chamberId}',           
            from_time='${test.timing[j].openingTime}',
            to_time='${test.timing[j].closingTime}',
            days='${test.timing[j].days}',
            status='1',
            date='${dd}'
            `, function(err,result) {
                if(err){
                    console.log(err);

                    return next(new ErrorHandler(err.message, 500));
                }


                
        });
                
                }
        });
       
    
           
        }
        return res.status(200).json({
            success:true,
            message: 'Doctor details and chamber details updated successfully!',
            data:result
        });
    });
});
    

exports.login = catchAsyncError(async (req,res,next) =>{
    const {username, password} = req.body;
    
   con.query(`SELECT * FROM doctor_master WHERE mobile='${username}'`, function (err,result) {
    if (err || result.length==0) {
        return next(new ErrorHandler('User doesnt exist!',500));     
      }    

      con.query(`SELECT * FROM doctor_master WHERE mobile='${username}' and password='${password}'`, function (err,result) {
        if (err || result.length==0) {
            return next(new ErrorHandler('Password is invalid!',400));     
          }else{
            var token = jwt.sign({
                id: result[0].id
              }, process.env.JWT_DOCTOR_SECRET_KEY, { expiresIn: process.env.JWT_DOCTOR_EXPIRES_TIME });   
              
              
              return res.status(200).json({
                success:true,
                token,
                data:result,
                message:'Successfully logged in!'
            });
          }    
    
          
       })
   })

 
 });
 