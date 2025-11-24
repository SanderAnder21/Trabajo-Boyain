export class User {
    constructor({ id, nombre, email, rol, password }) {
        this.id = id || Date.now(); // ID temporal si es nuevo
        this.name = nombre;
        this.email = email;
        this.role = rol || 'cliente'; // 'admin', 'arquitecto', 'cliente'
        this.password = password; // En un backend real, esto no se guarda en el cliente así
    }

    get isAdmin() {
        return this.role === 'admin';
    }

    get isArchitect() {
        return this.role === 'arquitecto';
    }

    /**
     * Genera una fila HTML para la tabla de administración
     */
    toHTMLTableRow() {
        return `
            <tr data-id="${this.id}">
                <td>${this.name}</td>
                <td>${this.email}</td>
                <td><span class="badge ${this.role}">${this.role}</span></td>
                <td>
                    <button class="btn-delete" onclick="window.dispatchEvent(new CustomEvent('delete-user', { detail: ${this.id} }))">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    }
}