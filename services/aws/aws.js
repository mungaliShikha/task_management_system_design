const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
    accessKeyId: 'AKIAYOVLRXWEW4VAVIP7',
    secretAccessKey: "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",
    region: 'us-west-2' 
})


const fileFilter = (req, file, callback) => {
    console.log(file) ///object 
    if (file.mimetype.split("/")[0] === "application") { // acting as validation for a pratiular file type extension
        callback(null, true);
    }
    else {
        callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE"))
    }
}


exports.upload = multer({
    storage: multerS3({
        s3,
        ACLs: "public-read",
        bucket: "blogapi",
        metadata: function (req, file, callback) {
            callback(null, { fieldName: file.fieldname })
            console.log(file.fieldname)
        },
        key: function (req, file, callback) {
            callback(null, `multipleFilesUpload/${file.originalname}`)
        }
    }),
    fileFilter,
    limits: { fileSize: 2000000, files: 100 },
})

