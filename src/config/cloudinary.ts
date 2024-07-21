import { v2 as cloudinary } from 'cloudinary';
import { config } from './config';

cloudinary.config({
    cloud_name: 'dxitqjmqy',
    api_key: config.api_key,
    api_secret: config.api_secret // Click 'View Credentials' below to copy your API secret
});

export default cloudinary;