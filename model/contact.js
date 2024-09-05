const mongoose = require('mongoose');

 const Sekolah = mongoose.model('murid', {
        nama: {
            type: String,
            require: true,
        },
        umur: {
            type: String,
            require: true,
        },
        alamat: {
            type: String,
            require: true,
        },
        asalSekolah: {
            type: String,
            require: true,
        },
        tanggalLahir: {
            type: String,
            require: true,
        }
    })


    module.exports = Sekolah;