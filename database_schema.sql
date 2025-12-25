-- Create database
CREATE DATABASE IF NOT EXISTS biomedak_gmao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE biomedak_gmao;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'Technicien',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipements table
CREATE TABLE IF NOT EXISTS equipements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nom VARCHAR(255) NOT NULL,
    marque VARCHAR(255),
    modele VARCHAR(255),
    num_serie VARCHAR(255),
    service VARCHAR(100) NOT NULL,
    date_acquisition DATE DEFAULT (CURRENT_DATE),
    criticite VARCHAR(50) DEFAULT 'Moyenne',
    statut VARCHAR(50) DEFAULT 'En service',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interventions table
CREATE TABLE IF NOT EXISTS interventions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    equipement_id VARCHAR(36) NOT NULL,
    type_maint VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    priorite VARCHAR(50) DEFAULT 'Normale',
    technicien VARCHAR(255) NOT NULL,
    statut_ot VARCHAR(50) DEFAULT 'Ouvert',
    cause_panne TEXT,
    actions_prises TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_cloture TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (equipement_id) REFERENCES equipements(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better performance
CREATE INDEX idx_equipements_statut ON equipements(statut);
CREATE INDEX idx_equipements_service ON equipements(service);
CREATE INDEX idx_interventions_statut ON interventions(statut_ot);
CREATE INDEX idx_interventions_equipement ON interventions(equipement_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@biomedak.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'Admin')
ON DUPLICATE KEY UPDATE email=email;
