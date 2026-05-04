CREATE TABLE tenants (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  industry VARCHAR(80) NOT NULL,
  plan VARCHAR(40) NOT NULL DEFAULT 'starter',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  objective VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_projects_tenant (tenant_id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE contents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  project_id BIGINT NOT NULL,
  type ENUM('post','reel','story','carousel') NOT NULL,
  pillar ENUM('ventas','educativo','emocional','comunidad') NOT NULL,
  title VARCHAR(180) NOT NULL,
  copy_text TEXT,
  status ENUM('draft','scheduled','published') NOT NULL DEFAULT 'draft',
  scheduled_at DATETIME NULL,
  published_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contents_tenant_project (tenant_id, project_id),
  INDEX idx_contents_schedule (scheduled_at),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE rule_alerts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  project_id BIGINT NULL,
  severity ENUM('low','medium','high') NOT NULL,
  code VARCHAR(80) NOT NULL,
  message VARCHAR(255) NOT NULL,
  status ENUM('open','resolved') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rule_alerts_tenant_status (tenant_id, status)
);

CREATE TABLE automation_jobs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  tenant_id BIGINT NOT NULL,
  job_type VARCHAR(60) NOT NULL,
  payload JSON,
  run_at DATETIME NOT NULL,
  status ENUM('queued','running','done','failed') NOT NULL DEFAULT 'queued',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_jobs_queue (status, run_at)
);
