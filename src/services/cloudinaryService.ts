// src/services/cloudinaryService.ts

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    throw new Error('Cloudinary no configurado. Agrega VITE_CLOUDINARY_UPLOAD_PRESET y VITE_CLOUDINARY_CLOUD_NAME en tu archivo .env');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'FotosPerfil');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error(`Error al subir imagen: ${response.status}`);
  }

  const data = await response.json();
  return data.secure_url as string;
};
