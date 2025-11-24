import { Config } from '../config/Config.js';
import { User } from '../models/User.js';
import { ValidationUtils } from '../utils/ValidationUtils.js';

/**
 * Servicio de Autenticación
 */
export class AuthService {
    constructor() {
        this.apiUrl = Config.API_BASE_URL;
        this.currentUser = this.loadUserFromStorage();
    }

    async login(email, password) {
        try {
            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error('Email inválido');
            }

            if (!ValidationUtils.isValidPassword(password)) {
                throw new Error('Contraseña debe tener al menos 6 caracteres');
            }

            const response = await fetch(`${this.apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al iniciar sesión');
            }

            const data = await response.json();
            this.saveUserSession(data);
            
            return {
                success: true,
                user: new User(data.user)
            };

        } catch (error) {
            console.error('Error en login:', error);
            
            // Modo offline/prueba
            if (error.message.includes('Failed to fetch')) {
                return this.handleOfflineLogin(email);
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    async register(userData) {
        try {
            const { nombre, email, password, confirmPassword, tipoCuenta } = userData;

            // Validaciones
            if (!ValidationUtils.isNotEmpty(nombre)) {
                throw new Error('El nombre es obligatorio');
            }

            if (!ValidationUtils.isValidEmail(email)) {
                throw new Error('Email inválido');
            }

            if (!ValidationUtils.isValidPassword(password)) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            if (!ValidationUtils.passwordsMatch(password, confirmPassword)) {
                throw new Error('Las contraseñas no coinciden');
            }

            const response = await fetch(`${this.apiUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password, tipoCuenta })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al registrar');
            }

            return {
                success: true,
                message: 'Cuenta creada exitosamente'
            };

        } catch (error) {
            console.error('Error en registro:', error);
            
            // Modo offline/prueba
            if (error.message.includes('Failed to fetch')) {
                return this.handleOfflineRegister(userData);
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    logout() {
        this.clearSession();
        window.location.href = Config.ROUTES.HOME;
    }

    isAuthenticated() {
        return !!this.currentUser && !!this.getToken();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getToken() {
        return localStorage.getItem(Config.STORAGE_KEYS.AUTH_TOKEN);
    }

    getUserRole() {
        return localStorage.getItem(Config.STORAGE_KEYS.USER_ROLE);
    }

    isArchitect() {
        return this.getUserRole() === Config.USER_ROLES.ARCHITECT;
    }

    isClient() {
        return this.getUserRole() === Config.USER_ROLES.CLIENT;
    }

    requireAuth(redirectUrl = Config.ROUTES.LOGIN) {
        if (!this.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    requireArchitect() {
        if (!this.isAuthenticated() || !this.isArchitect()) {
            alert('Acceso denegado. Se requiere cuenta de arquitecto.');
            window.location.href = Config.ROUTES.HOME;
            return false;
        }
        return true;
    }

    // Métodos privados
    saveUserSession(data) {
        const user = new User(data.user);
        
        localStorage.setItem(Config.STORAGE_KEYS.AUTH_TOKEN, data.token);
        localStorage.setItem(Config.STORAGE_KEYS.USER_ROLE, user.rol);
        localStorage.setItem(Config.STORAGE_KEYS.USER_NAME, user.nombre);
        localStorage.setItem(Config.STORAGE_KEYS.USER_ID, user.id);
        localStorage.setItem(Config.STORAGE_KEYS.USER_DATA, JSON.stringify(user.toJSON()));
        
        this.currentUser = user;
    }

    loadUserFromStorage() {
        try {
            const userData = localStorage.getItem(Config.STORAGE_KEYS.USER_DATA);
            return userData ? User.fromJSON(userData) : null;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        }
    }

    clearSession() {
        Object.values(Config.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.currentUser = null;
    }

    handleOfflineLogin(email) {
        console.log('🌐 Modo offline - Simulando login');
        
        const isArchitect = email.toLowerCase().includes('arquitecto');
        const mockUser = {
            id: Math.floor(Math.random() * 1000),
            nombre: email.split('@')[0],
            email: email,
            rol: isArchitect ? 'arquitecto' : 'cliente',
            es_arquitecto: isArchitect
        };

        const mockData = {
            token: 'offline-token-' + Date.now(),
            user: mockUser
        };

        this.saveUserSession(mockData);

        return {
            success: true,
            user: new User(mockUser),
            isOffline: true
        };
    }

    handleOfflineRegister(userData) {
        console.log('🌐 Modo offline - Simulando registro');
        
        return {
            success: true,
            message: 'Cuenta creada (modo offline)',
            isOffline: true
        };
    }
}