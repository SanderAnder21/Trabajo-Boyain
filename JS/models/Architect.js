export class Architect {
    constructor(data) {
        this.id = data.id;
        this.name = data.nombre;
        this.bio = data.biografia || "Arquitecto profesional con experiencia en diseño innovador.";
        this.specialty = data.especialidad || "General";
        this.email = data.email;
        this.phone = data.telefono || "No disponible";
        this.photo = data.foto || 'IMG/avatar1.jpg';
        this.yearsExperience = data.experiencia || 0;
    }

    /**
     * Genera el HTML para la tarjeta de perfil
     */
    toHTMLProfile() {
        return `
            <div class="profile-header">
                <img src="${this.photo}" alt="${this.name}" class="profile-pic">
                <div class="profile-info">
                    <h1>${this.name}</h1>
                    <p class="specialty">${this.specialty}</p>
                    <p class="experience">${this.yearsExperience} años de experiencia</p>
                    <p class="bio">${this.bio}</p>
                    <div class="contact-info">
                        <span>📧 ${this.email}</span>
                        <span>📞 ${this.phone}</span>
                    </div>
                </div>
            </div>
        `;
    }
}