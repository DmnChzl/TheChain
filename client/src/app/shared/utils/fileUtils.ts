const SIZES = ['Bytes', 'KB', 'MB', 'GB'];

/**
 * Format Bytes to Human-Readable size
 *
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes: number): string {
  const k = 1024;
  const idx = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, idx)).toFixed(2));
  return `${value} ${SIZES[idx]}`;
}

/**
 * Get File Extension
 *
 * @param {string} fileName
 * @returns {string}
 */
export function getFileExtension(fileName: string): string {
  const str = fileName.split('.').at(-1);
  return str ? `.${str}` : '.unknown';
}

/**
 * Check if File is Allowed by Extension
 *
 * @param {string} fileName
 * @param {string[]} allowedExtensions
 * @returns {boolean}
 */
export function isValidFileExtension(fileName: string, allowedExtensions: string[]): boolean {
  const ext = getFileExtension(fileName);
  return allowedExtensions.includes(ext);
}

/**
 * Check if File is Allowed by MIME Type
 *
 * @param {string} mimeType
 * @param {string[]} allowedMimeTypes
 * @returns {boolean}
 */
export function isValidFileMimeType(mimeType: string, allowedMimeTypes: string[]): boolean {
  return allowedMimeTypes.includes(mimeType);
}

const DOC_EXTENSIONS = ['.csv', '.md', '.pdf', '.txt'];

/**
 * Check if the File is a Document
 *
 * @param {string} fileName
 * @returns {boolean}
 */
export function isDocument(fileName: string): boolean {
  const ext = getFileExtension(fileName);
  return DOC_EXTENSIONS.includes(ext);
}

const IMG_EXTENSIONS = ['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'];

/**
 * Check if the File is an Image
 *
 * @param {string} fileName
 * @returns {boolean}
 */
export function isImage(fileName: string): boolean {
  const ext = getFileExtension(fileName);
  return IMG_EXTENSIONS.includes(ext);
}
