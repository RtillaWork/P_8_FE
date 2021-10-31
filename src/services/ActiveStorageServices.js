// Active storage
import { DirectUpload } from 'activestorage';
import { API_ACTIVESTORAGE_DIRECTUPLOAD_ROUTE } from './apiServices';

export const uploadGovId = (file, setGovIdFunc) => {
  const upload = new DirectUpload(file, API_ACTIVESTORAGE_DIRECTUPLOAD_ROUTE);
  upload.create((error, blob) => {
    if (error) {
      console.log('##DIRECT UPLOAD ERROR: ', JSON.stringify(error));
      setGovIdFunc(''); // empty govId indicates error, updateUserProfile should block on empty "" govId
    } else {
      console.log('##DIRECT UPLOAD NO ERROR: ', blob);
      // debugger;
      // setGovIdFunc(blob.signed_id);
      setGovIdFunc(blob.service_url.toString()); //or .service_url for direct image access?
    }
  });
};

// export const uploadGovId = (file, setGovIdFunc) => {
//   const upload = new DirectUpload(file, API_ACTIVESTORAGE_DIRECTUPLOAD_ROUTE);
//   upload.create((error, blob) => {
//     if (error) {
//       console.log('##DIRECT UPLOAD ERROR: ', error);
//       setGovIdFunc(''); // empty govId indicates error, updateUserProfile should block on empty "" govId
//     } else {
//       console.log('##DIRECT UPLOAD NO ERROR: ', blob);
//       // debugger;
//       // setGovIdFunc(blob.signed_id);
//       setGovIdFunc(blob.service_url.toString()); //or .service_url for direct image access?
//     }
//   });
// };

////////////////// Blob's shape
/**
 *  ##DIRECT UPLOAD NO ERROR:  
Object { id: 4, key: "p9uvocmmth7irw47xh7yjk3j9ll3", filename: "Firstmatepiggy.jpg", content_type: "image/jpeg", metadata: {}, byte_size: 40282, checksum: "1nlDCEa5pFZMJ2vpHYqIzQ==", created_at: "2021-05-27T04:06:31.469Z", signed_id: "eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBDUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fb0f7107cea9809157e28f4be9adb4ab7308974c", attachable_sgid: "BAh7CEkiCGdpZAY6BkVUSSI3Z2lkOi8vcDhiZXJvcjZ2MDEvQWN0aXZlU3RvcmFnZTo6QmxvYi80P2V4cGlyZXNfaW4GOwBUSSIMcHVycG9zZQY7AFRJIg9hdHRhY2hhYmxlBjsAVEkiD2V4cGlyZXNfYXQGOwBUMA==--92be8c00c55aee40ac120560c2b3d9738b0d268f", … }
​
attachable_sgid: "BAh7CEkiCGdpZAY6BkVUSSI3Z2lkOi8vcDhiZXJvcjZ2MDEvQWN0aXZlU3RvcmFnZTo6QmxvYi80P2V4cGlyZXNfaW4GOwBUSSIMcHVycG9zZQY7AFRJIg9hdHRhY2hhYmxlBjsAVEkiD2V4cGlyZXNfYXQGOwBUMA==--92be8c00c55aee40ac120560c2b3d9738b0d268f"
​
byte_size: 40282
​
checksum: "1nlDCEa5pFZMJ2vpHYqIzQ=="
​
content_type: "image/jpeg"
​
created_at: "2021-05-27T04:06:31.469Z"
​
filename: "Firstmatepiggy.jpg"
​
id: 4
​
key: "p9uvocmmth7irw47xh7yjk3j9ll3"
​
metadata: Object {  }
​​
<prototype>: Object { … }
​
service_url: "http://127.0.0.1:3001/rails/active_storage/blobs/eyJfcmFpbHM…-fb0f7107cea9809157e28f4be9adb4ab7308974c/Firstmatepiggy.jpg"
​
signed_id: "eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBDUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--fb0f7107cea9809157e28f4be9adb4ab7308974c"
​
<prototype>: Object { … }
ActiveStorageServices.js:11
 */
