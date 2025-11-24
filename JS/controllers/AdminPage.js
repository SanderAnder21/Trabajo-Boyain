import { BasePage } from './BasePage.js';
import { User } from '../models/User.js';

export class AdminPage extends BasePage {
    constructor() {
        super();
        // Verificación de seguridad: Solo Admins pueden entrar aquí
        if (!this.authService.hasRole('admin')) {
            alert('Acceso Denegado');
            window.location.href = 'INDEX.html';
        }
    }

    bindEvents() {
        super.bindEvents();
        this.loadUsers();

        // Escuchamos el evento personalizado de eliminar (definido en User.js)
        window.addEventListener('delete-user', (e) => {
            this.deleteUser(e.detail);
        });
    }

    async loadUsers() {
        const tableBody = document.getElementById('users-table-body');
        if (!tableBody) return;

        // MOCK: Simulamos datos de usuarios (esto vendría de DataService en el futuro)
        const mockUsers = [
            { id: 1, nombre: "Carlos Boyain", email: "admin@portarq.com", rol: "admin" },
            { id: 2, nombre: "Ana Arquitecta", email: "ana@design.com", rol: "arquitecto" },
            { id: 3, nombre: "Cliente Feliz", email: "cliente@gmail.com", rol: "cliente" }
        ];

        const users = mockUsers.map(u => new User(u));
        tableBody.innerHTML = users.map(user => user.toHTMLTableRow()).join('');
    }

    deleteUser(userId) {
        if(confirm(`¿Estás seguro de eliminar al usuario ${userId}?`)) {
            // Aquí llamarías a DataService.deleteUser(userId)
            alert('Usuario eliminado (simulación)');
            // Remover la fila visualmente
            const row = document.querySelector(`tr[data-id="${userId}"]`);
            if(row) row.remove();
        }
    }
}