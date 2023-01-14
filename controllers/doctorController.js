
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

      con.query(`SELECT * FROM doctor_master WHERE mobile='${username}' and password='${password}' order by id desc`, function (err,result) {
        if (err || result.length==0) {
            return next(new ErrorHandler('Password is invalid!',400));     
          }
          const doctorData = result;
            var token = jwt.sign({
                id: result[0].id
              }, process.env.JWT_DOCTOR_SECRET_KEY, { expiresIn: process.env.JWT_DOCTOR_EXPIRES_TIME });   
              
              con.query(`SELECT * FROM doctor_chambers WHERE doctor_id='${doctorData[0].id}'`, function (err,result) {
                if (err ) {
                    return next(new ErrorHandler(err.message,400));     
                  } 
          const doctorChamberData = result;

                  con.query(`SELECT * FROM doctor_chamber_timings WHERE doc_id='${doctorData[0].id}' `, function (err,result) {
                //    console.log(`SELECT * FROM doctor_chamber_timings WHERE doc_id='${doctorData[0].id}' `);
                    if (err) {
                        return next(new ErrorHandler(err.message,400));     
                    } 
          const chamberTimings = result;

              return res.status(200).json({
                success:true,
                token,
                doctorData:doctorData,
                chamberData:doctorChamberData,
                chamberTimings:chamberTimings,
                message:'Successfully logged in!'
            });
          
        });
    });
    
          
       })
   })

 
 });
 
 exports.patientRegistration = catchAsyncError(async (req,res,next) =>{
    const {name,mobile,pincode,
        gender,age_years,age_month,
        age_days,diagnosis,payment_type,chamber_id,
    refer_type,refer_id,refer_name,
advance,date,time} = req.body;

        con.query(`INSERT INTO pre_registration SET
            doc_chamber_id='${chamber_id}',
            pati_name='${name}',
            age_years='${age_years}',
            age_mon='${age_month}',
            age_days='${age_days}',
            gender='${gender}',
            mobile='${mobile}',
            disease_id='${diagnosis}',
            pin_code='${pincode}',
            payment_mode='${payment_type}',
            refer_type='${refer_type}',
            date='${date}',
            time='${time}'
            `, function(err,result) {
                if(err){
                    return next(new ErrorHandler(err.message,500));     

                }                
        con.query(`INSERT INTO patient_master_opd SET
        doctor_id="${refer_id}",
        pati_name='${name}',
        gender='${gender}',
        age_years='${age_years}',
            age_mon='${age_month}',
            age_days='${age_days}',
        mobile='${mobile}',
        pin_code='${pincode}',
        disease_id='${diagnosis}',
        doc_id="${refer_id}",
        payment_mode='${payment_type}',
        chamber_id='${chamber_id}',        
        status="1",
        date='${date}',
        time='${time}'
        `, function(err,result) {
            if(err){
                return next(new ErrorHandler(err.message,500));     

            }
            con.query(`INSERT INTO employee_master SET
            user_type="2",
								 emp_name="${name}",
								job_role="patient",
								user_name="${mobile}",
								user_psswd="${mobile}",
								emp_cnct="${mobile}",
								status="1",
								user_id="last_id",
								doc_id="${refer_id}",
                                date='${date}',
                                `, function(err,result) {
                if(err){
                    return next(new ErrorHandler(err.message,500));     
    
                }
                
              return res.status(200).json({
                success:true,
                message:'Successfully added patient!'
            }); 
                
            });
            
        });
            });
 });

 // getDiseases
 exports.getDiseases = catchAsyncError(async (req,res,next) =>{
    con.query(`SELECT * FROM disease_master`, function(err,result){
        if(err){
            return next(new ErrorHandler(err.message,500));
        }

        res.status(200).json({
            success:true,
            diseases:result,
            message:'Disease fetched successfully!'
        })
    })
 });

 exports.getTodaysPatients = catchAsyncError(async (req,res,next) =>{
    const {doc_id} = req.params;
    con.query(`SELECT * FROM patient_master_opd where status='1' 
    or revisit_status='1'  
    and doctor_id='${doc_id}'  ORDER BY id DESC limit 150`, function(err,result){
        if(err){
            return next(new ErrorHandler(err.message,500));
        }

        res.status(200).json({
            success:true,
            patients:result,
            message:'Current Patients fetched successfully!'
        })
    })
 });
 exports.getAllPatients = catchAsyncError(async (req,res,next) =>{
    const {doc_id} = req.params;
    con.query(`SELECT * FROM patient_master_opd where status='2' 
    and opd='opd' and revisit_status='0' and doctor_id='${doc_id}' 
     ORDER BY id DESC limit 150`, function(err,result){
        if(err){
            return next(new ErrorHandler(err.message,500));
        }

        res.status(200).json({
            success:true,
            patients:result,
            message:'All Patients fetched successfully!'
        })
    })
 });

//prescribe 
 //bp oxygen temp pulse weight height complication_id past_history test_id medicine_id no_of_days 
 //medicine_time per_day_use comments advice patient_id doc_id chamber_id  

 exports.getComplications = catchAsyncError(async (req,res,next) =>{
    const {disease_name} = req.body;

    con.query(`SELECT * FROM disease_master WHERE dise_name LIKE '%${disease_name}%'`, function(err,result) {
        if(err){
            return next(new ErrorHandler(err.message,500));
        }

        res.status(200).json({
            success:true,
            diseases:result,
        });
    });
 });
 exports.getTests = catchAsyncError(async (req,res,next) =>{
    const {test_name} = req.body;

    con.query(`SELECT * FROM blood_master WHERE sub_type LIKE '%${test_name}%'`, function(err,result) {
        if(err){
            return next(new ErrorHandler(err.message,500));
        }
        const blood_tests = result;
        con.query(`SELECT * FROM stool_master WHERE sub_type LIKE '%${test_name}%'`, function(err,result) {
            if(err){
                return next(new ErrorHandler(err.message,500));
            }
            const stool_tests = result;
            con.query(`SELECT * FROM imageing_master WHERE sub_type LIKE '%${test_name}%'`, function(err,result) {
                if(err){
                    return next(new ErrorHandler(err.message,500));
                }
                const imageing_tests = result;
        
                con.query(`SELECT * FROM special_master WHERE sub_type LIKE '%${test_name}%'`, function(err,result) {
                    if(err){
                        return next(new ErrorHandler(err.message,500));
                    }
                    res.status(200).json({
                        success:true,
                        blood_tests:blood_tests,
                        special_tests:result,
                        stool_tests:stool_tests,
                        imageing_tests:imageing_tests

                    });
                    
                });
            });
            
        });
        
        
    });
  
 });

exports.getMedicines = catchAsyncError(async (req,res,next) =>{
    const {medicine_name} = req.body;

    con.query(`SELECT * FROM ph_medicine_master WHERE medici_name LIKE '%${medicine_name}%'`, function(err,result) {
        if(err){
            return next(new ErrorHandler(err.message,500));
        }

        res.status(200).json({
            success:true,
            medicines:result,
        });
    });
 });