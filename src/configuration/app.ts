/**
 * App configuration
 */
export default {
    name: process.env['APP_NAME'] || 'App',
    locale: process.env['APP_LOCALE']  || 'es',
    basePath: process.env['APP_BASE_PATH'] || '/',
    serverPort: process.env['SERVER_PORT'] || 3000,
    encryptionKey: process.env['APP_KEY'] || '',
    encrptionCipher: process.env['APP_CIPHER'] || 'AES-256-CBC',
}