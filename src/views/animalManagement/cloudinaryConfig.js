import { config, uploader } from 'cloudinary';

config({
  cloud_name: 'dm1piteis', 
  api_key: '483971647235596', 
  api_secret: 'rfDpS0mV6WSyAkXYXexlUQTp9Vc' 
});

export { uploader };