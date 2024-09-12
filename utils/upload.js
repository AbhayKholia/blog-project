import pkg from 'multer-gridfs-storage';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const { GridFsStorage } = pkg;

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const storage = new GridFsStorage({
    url: `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.rreg3vq.mongodb.net/Cluster0?retryWrites=true&w=majority`,
    // options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpg", "image/jpeg"];
        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-blog-${file.originalname}`;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        };
    }
});


export default multer({ storage });
