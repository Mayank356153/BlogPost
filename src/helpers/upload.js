import axios from 'axios';  


export default async function Upload (file)  {;

    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'BlogPost'); // Replace with your preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dgwbhjalu/upload', // Replace your_cloud_name
        formData
      );

      return(response.data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };