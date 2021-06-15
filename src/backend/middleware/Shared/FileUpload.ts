import { extname } from 'path';
import multer from 'multer';
//Domain
import Uuid from '../../../application/Shared/domain/value-object/Uuid';

//Constants
const BASE_DESTINATION = 'uploads'

const upload = (destination?: string) => {
    const storage = multer.diskStorage({
        destination: `${ BASE_DESTINATION }/${ destination || '' }`,
        filename: (_, file, cb) => {
            cb(null, `${ Uuid.random().toString() }${ extname(file.originalname) }`)
        }
    })
    return multer({ storage });
}


export default upload;