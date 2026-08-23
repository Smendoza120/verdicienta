import { v2 as cloudinary } from 'cloudinary';

// Configuración con las variables de entorno de .env.local
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Sube una imagen codificada en base64 o buffer a una carpeta específica en Cloudinary.
 */
export const uploadImageToCloudinary = async (
  fileBase64: string,
  folder: string = 'verdicienta/products'
): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Limita dimensiones para optimizar tamaño
        { quality: 'auto' }, // Compresión automática sin pérdida de calidad visual
        { fetch_format: 'auto' }, // Formato WebP/AVIF automático según el navegador
      ],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    throw new Error('No se pudo subir la imagen');
  }
};

/**
 * Elimina una imagen de Cloudinary usando su public_id.
 */
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
    throw new Error('No se pudo eliminar la imagen');
  }
};

export default cloudinary;