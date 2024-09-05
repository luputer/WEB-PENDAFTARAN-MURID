const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flast = require('connect-flash')
const meothodOverride = require('method-override')




//set up ejs
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended: true}));


//set up  expresejsLyout
const expresejsLyout = require('express-ejs-layouts');
app.use(expresejsLyout);


// contect to database 
require('./util/db');
const Data = require('./model/contact')



// konfigurasi flast massage
app.use(cookieparser('secret'));
app.use(session ({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))


// use flast masage
app.use(flast());


// expres validator
const {validationResult, body, check, Result} = require('express-validator');
const { errors } = require('web3');
const { title } = require('process');



//Gunakan methot Overide
app.use(meothodOverride('_method'));


app.get('/',(req, res) => {
    res.render('home',{
        layout:'layout/mainlayout', 
        titel:'ini tess'
    })
})

//halaman about
app.get('/about',(req, res) => {
    res.render('about', {
        layout:'layout/mainlayout',
        titel:'About Us'
    })
});




// halaman contact

// halaman tedaftar 
app.get('/pendaftar', async(req, res) => {

    const students = await Data.find()
    res.render('pendaftar', {
        layout:'layout/mainlayout',
        titel:'Pendaftaran',
        students,
        msg: req.flash('msg')

    })
})



//halaman register pendaftarkan
app.get('/daftar',(req, res) => {
    res.render('register', {
        layout:'layout/mainlayout',
        titel:'Daftar'
    })
})


app.post('/daftar',[
    [
        body('nama').custom(async(value) => {
            const duplikat = await Data.findOne({nama: value});
            if(duplikat){
                throw new Error('nama sudah terdaftar');
            }
            return true;
        }),
        check('umur','umur tidak valid').isNumeric(),
    ],(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
             return res.render('Register', {
                layout:'layout/mainlayout',
                titel:'Pendaftaran',
                errors: errors.array(),
                students: req.body,

            })
        } else {
            Data.insertMany(req.body);
            req.flash('msg', 'Data Murit baru berhasil di tambahkan');
            res.redirect('/pendaftar');
        }
    }
])



// halaman delete contact
// app.delete('/pendafatar', (req,res) => {
//     Data.deleteOne({nama: req.body.nama}).then((result) => {
//         // req.flash('Msg', 'Data Murit berhasil di hapus')
//         // res.redirect('/pendafatar')
//         res.send('hallo')
//     })
//     // res.send(body.nama)
// })

app.delete('/pendaftar/:id', (req, res) => {
    Data.deleteOne({_id: req.params.id}).then((result) => {
        req.flash('msg', 'Data Murit berhasil di hapus')
        res.redirect('/pendaftar')
    }).catch((err) => {
        res.status(505).send('error deleting student')
    })
})




// kehalaman ubah daata murit 
app.get('/edit/:id',async (req, res) => {
    const student = await Data.findOne({_id: req.params.id});
    if(!student){
        return res.status(404).send('murid tidak ditemukan')
    }
    res.render('edit',{
        layout:'layout/mainlayout',
        titel:'Edit Murid',
        student,
        // errors: []
    })
})


// fugsi ubah data
// app.put('/pedaftar',
//     [body('nama').custom(async (value, {req}) => {
//         const duplikat = await Data.findOne({nama: value});
//         if( value !== req.body.oldNama && duplikat){
//             throw new Error('Nama sudah terdaftar !')
//         }
//         return true;
//     }),
//     check('umur','umur tidak valid').isNumeric(),

//     ], 
//     (req, res) => {
//         const error = validationResult(req);
//         if(!errors.isEmpty()){
//             return res.render('edit',{
//                 layout:'layout/mainlayout',
//                 titel:'Edit Murid',
//                 error: errors.array(),
//                 student: req.body,                
//             });
//         } else {
//             Data.updateOne(
//                 {_id: req.body._id},
//                 {
//                     $set: {
//                         nama: req.body.nama,
//                         umur: req.body.umur,
//                         alamat: req.body.alamat,
//                         asalSekolah: req.body.asalSekolah,
//                         tanggalLahir: req.body.tanggalLahir,

//                     }
//                 }
//             )
//         }
//     }
// )


// ke fituh ubah peserta
// app.put('/pedaftar',
//     [

//         body('nama').custom(async (value, {req} ) => {
//             const duplikat = await Data.findOne({nama: value});
//             if( value !== req.body.oldNama && duplikat) {
//                 throw new Error('nama sudah terdaftar!');
//             }
//             return true;
//         }),
//         check('umur', 'umur harus angka!').isNumeric(),
//     ],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if(!errors.isEmpty()){
//             return res.render('edit',{
//                 layout:'layout/mainlayout',
//                 title:'Edit Murid',
//                 error: errors.array(),
//                 student: req.body,
//             });
//         } else {
//             try {
//                 const { _id, nama, umur, alamat, asalSekolah, tanggalLahir} = req.body;
//                 await Data.updateOne(
//                     {_id: _id}, {
//                         $set: {
//                             nama,
//                             umur,
//                             alamat,
//                             asalSekolah,
//                             tanggalLahir,
//                         }
//                     }
//                 );
//             req.flash('msg', 'Data murit Behasil di ubah');
//             res.redirect('/pendaftar');
//             } catch (err) {
//                 console.log(err);
//                 res.status(500).send('terjadi kesalahan saat memperbaharui data')
//             }
//         }
//     }
// )

app.put('/pendaftar',
    [
        body('nama').custom(async (value, { req }) => {
            const duplikat = await Data.findOne({ nama: value });
            if (value !== req.body.oldNama && duplikat) {
                throw new Error('Nama sudah terdaftar!');
            }
            return true;
        }),
        check('umur', 'Umur harus berupa angka!').isNumeric(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('edit', {
                layout: 'layout/mainlayout',
                title: 'Edit Murid',
                errors: errors.array(),
                student: req.body,
            });
        } else {
            try {
                const { _id, nama, umur, alamat, asalSekolah, tanggalLahir } = req.body;
                await Data.updateOne(
                    { _id: _id },
                    {
                        $set: {
                            nama,
                            umur,
                            alamat,
                            asalSekolah,
                            tanggalLahir,
                        }
                    }
                );
                req.flash('msg', 'Data murid berhasil diubah');
                res.redirect('/pendaftar');
            } catch (err) {
                console.error(err);
                res.status(500).send('Terjadi kesalahan saat memperbarui data');
            }
        }
    }
);









// app.post('/daftar',
//     [
//         body('nama').custom(async(value) => {
//             const duplikat =  await Data.findOne({nama: value});
//             if(duplikat) {
//                 throw new Error('nama kontak sudah terdaptar')
//             } 
//             return true;
//         }),
//         check('umur', 'umur tidak valid !').isNumeric(),
//     ],(req, res) => {
//         const errors = validationResult(req);
//         if(!errors.isEmpty()) {
//             return res.render('Register', {
//                 layout: 'layouts/mainlayout',
//                 titel: 'form ubah data contact',
//                 errors: errors.array(),
//                 contact: req.body,

//             });
//         } else {
//             Data.insertMany(req.body);
//             req.flash('msg','data kontak berhasil di tambahkan');
//             res.redirect('/pendaftar');
//         }

// })



app.listen(port, () => {
    console.log(`monggo app | listen at http://localhost:${port} `)
})