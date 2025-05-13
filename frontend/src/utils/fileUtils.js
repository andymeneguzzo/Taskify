/**
 * Convert a file to base64 string
 * @param {File} file - The file object to convert
 * @returns {Promise<string>} - A promise that resolves to the base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Check if a URL is a base64 data URL
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is a base64 data URL
 */
export const isBase64URL = (url) => {
  return url && url.startsWith('data:');
};
