CREATE DATABASE IF NOT EXISTS explora_peru 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE explora_peru;

-- Tabla para mensajes de contacto
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_fecha (fecha_envio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
