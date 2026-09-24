import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads';
if(!fs.existsSync(uploadDir))
{
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) =>{
        const uniqueSuffix = Date.now + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
        },
    });
        //PDF amd Word-----
    const fileFilter = (req, file, cb) =>
    {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if(allowedTypes.includes(file.mimetype))
      {
        cb(null, true);
      }
      else
      {
        cb(new Error('Only .pdf, .doc and .docx formats are allowed!'), false);
      }
    };

    //Export file create------------
    export const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {fileSize: 5 * 1024 * 1024}
    });
