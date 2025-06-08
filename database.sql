-- Criar base de dados
CREATE DATABASE intranet;

-- Criar utilizador
CREATE USER IF NOT EXISTS 'internal_user'@'localhost' IDENTIFIED BY '#KgD32581kjhdjssdhdjkdhskahdskjjhasdkjjh';

-- Acesso à base de dados
GRANT SELECT, INSERT, UPDATE, DELETE ON  intranet.* TO 'internal_user'@'localhost';

USE intranet;

-- Criar tabela de utilizadores
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
	firstname VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL, -- será encriptada
	email VARCHAR(100) NOT NULL UNIQUE,
	token VARCHAR(255),
	active BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    cookieConsent BOOLEAN DEFAULT FALSE,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME,
	updated_by INT
	);
