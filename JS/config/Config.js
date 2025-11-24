/**
 * Configuración Global de la Aplicación
 */
export class Config {
    static API_BASE_URL = 'http://localhost:3000/api';
    static OPENROUTER_KEY = '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';
    
    static ROUTES = {
        LOGIN: 'IniciarSesion.html',
        REGISTER: 'CrearCuenta.html',
        HOME: '../INDEX.html',
        PROJECTS: 'Proyectos.html',
        MY_PROJECTS: 'MisProyectos.html',
        UPLOAD_PROJECT: 'SubirProyecto.html',
        ADMIN_ACCOUNT: 'AdministrarCuenta.html',
        PROJECT_DETAIL: 'ProyectoDetalle.html',
        ARCHITECT_PROFILE: 'PerfilArquitecto.html'
    };

    static STORAGE_KEYS = {
        AUTH_TOKEN: 'authToken',
        USER_ROLE: 'userRole',
        USER_NAME: 'userName',
        USER_ID: 'userId',
        USER_DATA: 'userData'
    };

    static USER_ROLES = {
        ARCHITECT: 'arquitecto',
        CLIENT: 'cliente'
    };

    static PROJECT_TYPES = {
        RESIDENTIAL: 'residencial',
        COMMERCIAL: 'comercial',
        INDUSTRIAL: 'industrial',
        RESTORATION: 'restauracion'
    };
}