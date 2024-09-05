const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/sekolah');

//membuat scema

// const Sekolah = mongoose.model('murid', {
//     nama: {
//         type: String,
//         require: true,
//     },
//     umur: {
//         type: String,
//         require: true,
//     },
//     alamat: {
//         type: String,
//         require: true,
//     },
//     asalSekolah: {
//         type: String,
//         require: true,
//     },
//     tanggalLahir: {
//         type: String,
//         require: true,
//     }
// })

// //mencoba memasukan data
// const sekolah1 = new Sekolah({
//     nama:'saidi',
//     umur: '12',
//     alamat: 'jalan kelapa gading',
//     asalSekolah: 'SDN kelapa gading',
//     tanggalLahir: '1999-08-12'
// });

// //simpan ke colection database
// sekolah1.save().then((Sekolah) => console.log(Sekolah));
