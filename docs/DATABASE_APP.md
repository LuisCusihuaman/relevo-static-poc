## Database Schemas

### Oracle Database 11g R2 Express Edition Design

```sql
-- ============================================================================
-- RELEVO Database Schema - Oracle 11g R2 Express Edition
-- Medical Handoff Platform with HIPAA Compliance and External Alert Integration
-- ============================================================================

-- ============================================================================
-- SEQUENCES
-- ============================================================================

CREATE SEQUENCE patients_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE daily_setups_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE handover_sessions_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE session_patients_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE webhook_endpoints_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE webhook_deliveries_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE audit_trail_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;


-- ============================================================================
-- USERS AND AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    email VARCHAR2(255) NOT NULL UNIQUE,
    password_hash VARCHAR2(255) NOT NULL,
    name VARCHAR2(255) NOT NULL,
    medical_license VARCHAR2(100),
    role VARCHAR2(50) NOT NULL CHECK (role IN ('doctor', 'nurse', 'resident', 'attending', 'fellow')),
    unit VARCHAR2(50) CHECK (unit IN ('PICU', 'NICU', 'General', 'Cardiology', 'Surgery', 'Emergency')),
    shift VARCHAR2(20) CHECK (shift IN ('Morning', 'Evening', 'Night')),
    is_active NUMBER(1) DEFAULT 1 NOT NULL CHECK (is_active IN (0,1)),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Permissions are handled in a separate table for normalization, as Oracle < 12c doesn't support arrays easily.
CREATE TABLE user_permissions (
    user_id RAW(16) NOT NULL,
    permission VARCHAR2(100) NOT NULL,
    CONSTRAINT pk_user_permissions PRIMARY KEY (user_id, permission),
    CONSTRAINT fk_user_permissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================================================
-- PATIENTS AND MEDICAL DATA (enhanced with external system references)
-- ============================================================================

CREATE TABLE patients (
    id NUMBER NOT NULL PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    age NUMBER,
    mrn VARCHAR2(100) NOT NULL UNIQUE, -- Medical Record Number
    hospital_patient_id VARCHAR2(100), -- External hospital system patient ID
    room VARCHAR2(50),
    unit VARCHAR2(50) NOT NULL CHECK (unit IN ('PICU', 'NICU', 'General', 'Cardiology', 'Surgery', 'Emergency')),
    assigned_to RAW(16) REFERENCES users(id),
    illness_severity VARCHAR2(20) NOT NULL CHECK (illness_severity IN ('stable', 'guarded', 'unstable', 'critical')),
    diagnosis CLOB,
    status CLOB,
    admission_date TIMESTAMP WITH TIME ZONE,
    priority VARCHAR2(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    emr_patient_id VARCHAR2(100), -- Reference to EMR system
    is_active NUMBER(1) DEFAULT 1 NOT NULL CHECK (is_active IN (0,1)),
    last_alert_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- ALERT MANAGEMENT SYSTEM
-- ============================================================================

CREATE TABLE alerts (
    id RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    external_alert_id VARCHAR2(255) NOT NULL, -- ID from hospital system
    patient_id NUMBER REFERENCES patients(id) ON DELETE CASCADE,
    hospital_patient_id VARCHAR2(100) NOT NULL, -- External patient ID
    type VARCHAR2(50) NOT NULL CHECK (type IN ('INFECTION_CONTROL', 'MEDICATION', 'VITAL_SIGNS', 'LAB_RESULTS', 'PROCEDURE', 'GENERAL')),
    alert_catalog_code VARCHAR2(50) NOT NULL,
    alert_catalog_description CLOB NOT NULL,
    observations CLOB,
    level VARCHAR2(20) NOT NULL CHECK (level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR2(20) NOT NULL CHECK (status IN ('ACTIVE', 'RESOLVED', 'EXPIRED')),
    start_date DATE NOT NULL,
    end_date DATE,
    creation_author VARCHAR2(255) NOT NULL,
    creation_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    creation_source VARCHAR2(255) NOT NULL,
    last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_alerts_external UNIQUE(external_alert_id, hospital_patient_id)
);

-- Alert synchronization tracking
CREATE TABLE alert_sync_jobs (
    id RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    job_id VARCHAR2(255) NOT NULL UNIQUE,
    patient_id NUMBER REFERENCES patients(id),
    hospital_patient_id VARCHAR2(100),
    sync_type VARCHAR2(50) NOT NULL CHECK (sync_type IN ('manual', 'scheduled', 'triggered')),
    status VARCHAR2(50) DEFAULT 'in_progress' NOT NULL CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
    alerts_processed NUMBER DEFAULT 0,
    alerts_created NUMBER DEFAULT 0,
    alerts_updated NUMBER DEFAULT 0,
    alerts_resolved NUMBER DEFAULT 0,
    error_message CLOB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    requested_by RAW(16) REFERENCES users(id)
);

-- Hospital API integration status
CREATE TABLE hospital_api_status (
    id RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    endpoint VARCHAR2(255) NOT NULL,
    status VARCHAR2(50) NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
    last_check TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    response_time_ms NUMBER,
    error_message CLOB,
    consecutive_failures NUMBER DEFAULT 0,
    last_success TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- I-PASS WORKFLOW DATA WITH HOCUSPOCUS INTEGRATION
-- ============================================================================

CREATE TABLE ipass_entries (
    id RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    patient_id NUMBER REFERENCES patients(id) ON DELETE CASCADE,
    section VARCHAR2(20) NOT NULL CHECK (section IN ('illness', 'patient', 'actions', 'awareness', 'synthesis')),
    content CLOB NOT NULL, -- Storing JSON as CLOB, add CHECK constraint for validation if needed
    version NUMBER DEFAULT 1 NOT NULL,
    is_completed NUMBER(1) DEFAULT 0 NOT NULL CHECK(is_completed IN (0,1)),
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by RAW(16) REFERENCES users(id),
    created_by RAW(16) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    hocuspocus_document_id VARCHAR2(255),
    is_collaborative NUMBER(1) DEFAULT 0 NOT NULL CHECK(is_collaborative IN (0,1)),
    last_collaborative_sync TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uk_ipass_entries UNIQUE(patient_id, section),
    CONSTRAINT chk_ipass_content CHECK (content IS NULL OR (SUBSTR(content, 1, 1) IN ('{', '['))) -- Basic JSON check
);

-- Table for storing Hocuspocus document states
CREATE TABLE collaborative_documents (
    id VARCHAR2(255) PRIMARY KEY, -- Document ID format: ipass:patientId:section
    patient_id NUMBER REFERENCES patients(id) ON DELETE CASCADE,
    section VARCHAR2(20) NOT NULL,
    document_state BLOB, -- Y.js document state
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by RAW(16) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    active_collaborators NUMBER DEFAULT 0,
    total_edits NUMBER DEFAULT 0,
    last_editor RAW(16) REFERENCES users(id)
);

-- ============================================================================
-- COLLABORATION TRACKING WITH HOCUSPOCUS
-- ============================================================================

CREATE TABLE collaboration_sessions (
    id RAW(16) DEFAULT SYS_GUID() NOT NULL PRIMARY KEY,
    document_id VARCHAR2(255) REFERENCES collaborative_documents(id),
    patient_id NUMBER REFERENCES patients(id) ON DELETE CASCADE,
    user_id RAW(16) NOT NULL REFERENCES users(id),
    session_type VARCHAR2(20) DEFAULT 'hocuspocus' CHECK (session_type IN ('hocuspocus', 'general')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    is_active NUMBER(1) DEFAULT 1 NOT NULL CHECK(is_active IN (0,1)),
    websocket_connection_id VARCHAR2(255),
    cursor_position NUMBER,
    selection_start NUMBER,
    selection_end NUMBER,
    user_color VARCHAR2(7), -- Hex color for cursor
    total_keystrokes NUMBER DEFAULT 0,
    total_edits NUMBER DEFAULT 0
);

-- ============================================================================
-- SESSION MANAGEMENT
-- ============================================================================

CREATE TABLE handover_sessions (
    id NUMBER NOT NULL PRIMARY KEY,
    user_id RAW(16) NOT NULL REFERENCES users(id),
    shift_type VARCHAR2(20) CHECK (shift_type IN ('Morning', 'Evening', 'Night')),
    unit VARCHAR2(50) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR2(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'completed', 'abandoned')),
    expected_duration NUMBER, -- minutes
    actual_duration NUMBER, -- minutes
    collaborative_documents_created NUMBER DEFAULT 0,
    total_collaborators NUMBER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_patients (
    id NUMBER NOT NULL PRIMARY KEY,
    session_id NUMBER REFERENCES handover_sessions(id) ON DELETE CASCADE,
    patient_id NUMBER REFERENCES patients(id) ON DELETE CASCADE,
    order_index NUMBER,
    is_completed NUMBER(1) DEFAULT 0 NOT NULL CHECK(is_completed IN (0,1)),
    completed_at TIMESTAMP WITH TIME ZONE,
    collaborative_sections CLOB, -- Storing array as comma-separated string in a CLOB
    alerts_at_start NUMBER DEFAULT 0,
    alerts_at_end NUMBER DEFAULT 0,
    CONSTRAINT uk_session_patients UNIQUE(session_id, patient_id)
);

CREATE TABLE daily_setups (
    id NUMBER NOT NULL PRIMARY KEY,
    user_id RAW(16) NOT NULL REFERENCES users(id),
    setup_date DATE NOT NULL,
    doctor_name VARCHAR2(255),
    unit VARCHAR2(50) NOT NULL,
    shift VARCHAR2(20) NOT NULL,
    preferences CLOB, -- Storing JSON as CLOB
    is_completed NUMBER(1) DEFAULT 0 NOT NULL CHECK(is_completed IN (0,1)),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_daily_setups UNIQUE(user_id, setup_date)
);

-- ============================================================================
-- WEBHOOK MANAGEMENT
-- ============================================================================

CREATE TABLE webhook_endpoints (
    id NUMBER NOT NULL PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    url CLOB NOT NULL,
    secret VARCHAR2(255) NOT NULL,
    events CLOB NOT NULL, -- Storing array as comma-separated string in a CLOB
    is_active NUMBER(1) DEFAULT 1 NOT NULL CHECK(is_active IN (0,1)),
    created_by RAW(16) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE webhook_deliveries (
    id NUMBER NOT NULL PRIMARY KEY,
    endpoint_id NUMBER REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type VARCHAR2(100) NOT NULL,
    payload CLOB NOT NULL, -- Storing JSON as CLOB
    status VARCHAR2(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'delivered', 'failed', 'retrying')),
    attempts NUMBER DEFAULT 0,
    last_attempt TIMESTAMP WITH TIME ZONE,
    response_status NUMBER,
    response_body CLOB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ENHANCED AUDIT TRAIL WITH ALERT TRACKING
-- ============================================================================

CREATE TABLE audit_trail (
    id NUMBER NOT NULL PRIMARY KEY,
    user_id RAW(16) NOT NULL REFERENCES users(id),
    action VARCHAR2(50) NOT NULL CHECK (action IN ('view', 'edit', 'handover', 'documentation', 'access', 'export', 'login', 'logout', 'webhook', 'sync', 'collaborate', 'alert_sync')),
    patient_id NUMBER REFERENCES patients(id),
    alert_id RAW(16) REFERENCES alerts(id),
    section_accessed VARCHAR2(20) CHECK (section_accessed IN ('illness', 'patient', 'actions', 'awareness', 'synthesis')),
    session_id RAW(16), -- REFERENCES user_sessions(id) -- user_sessions table does not exist
    collaboration_session_id RAW(16) REFERENCES collaboration_sessions(id),
    document_id VARCHAR2(255),
    ip_address VARCHAR2(39),
    user_agent CLOB,
    data_accessed CLOB, -- Storing array as comma-separated string in a CLOB
    changes_made CLOB, -- Storing JSON as CLOB
    medical_context CLOB, -- Storing JSON as CLOB
    webhook_triggered NUMBER(1) DEFAULT 0 NOT NULL CHECK(webhook_triggered IN (0,1)),
    emr_sync_triggered NUMBER(1) DEFAULT 0 NOT NULL CHECK(emr_sync_triggered IN (0,1)),
    is_collaborative_action NUMBER(1) DEFAULT 0 NOT NULL CHECK(is_collaborative_action IN (0,1)),
    is_external_api_action NUMBER(1) DEFAULT 0 NOT NULL CHECK(is_external_api_action IN (0,1)),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_unit ON users(role, unit);
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_unit_assigned ON patients(unit, assigned_to);
CREATE INDEX idx_patients_hospital_id ON patients(hospital_patient_id);
CREATE INDEX idx_ipass_ent_patient_section ON ipass_entries(patient_id, section);
CREATE INDEX idx_alerts_patient_id ON alerts(patient_id);
CREATE INDEX idx_alerts_hospital_pat_id ON alerts(hospital_patient_id);
CREATE INDEX idx_alerts_external_id ON alerts(external_alert_id);
CREATE INDEX idx_alerts_status_level ON alerts(status, level);
CREATE INDEX idx_alerts_type_status ON alerts(type, status);
CREATE INDEX idx_alerts_last_synced ON alerts(last_synced_at);
CREATE INDEX idx_alerts_creation_ts ON alerts(creation_timestamp DESC);
CREATE INDEX idx_alert_sync_jobs_status ON alert_sync_jobs(status, started_at);
CREATE INDEX idx_alert_sync_jobs_patient ON alert_sync_jobs(patient_id);
CREATE INDEX idx_alert_sync_jobs_hosp_pat ON alert_sync_jobs(hospital_patient_id);
CREATE INDEX idx_hospital_api_stat_endpoint ON hospital_api_status(endpoint);
CREATE INDEX idx_hospital_api_stat_last_chk ON hospital_api_status(last_check DESC);
CREATE INDEX idx_audit_trail_alert ON audit_trail(alert_id, timestamp DESC);
CREATE INDEX idx_audit_trail_ext_api ON audit_trail(is_external_api_action, timestamp DESC);
CREATE INDEX idx_collab_docs_pat_section ON collaborative_documents(patient_id, section);
CREATE INDEX idx_collab_sessions_active ON collaboration_sessions(patient_id, is_active);
CREATE INDEX idx_webhook_deliv_status ON webhook_deliveries(status, created_at);


-- ============================================================================
-- TRIGGERS FOR AUTO-INCREMENTING PRIMARY KEYS
-- ============================================================================

CREATE OR REPLACE TRIGGER trg_patients_pk
BEFORE INSERT ON patients
FOR EACH ROW
BEGIN
  IF :new.id IS NULL THEN
    SELECT patients_seq.NEXTVAL INTO :new.id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_daily_setups_pk
BEFORE INSERT ON daily_setups
FOR EACH ROW
BEGIN
  IF :new.id IS NULL THEN
    SELECT daily_setups_seq.NEXTVAL INTO :new.id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_handover_sessions_pk
BEFORE INSERT ON handover_sessions
FOR EACH ROW
BEGIN
  IF :new.id IS NULL THEN
    SELECT handover_sessions_seq.NEXTVAL INTO :new.id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_session_patients_pk
BEFORE INSERT ON session_patients
FOR EACH ROW
BEGIN
  IF :new.id IS NULL THEN
    SELECT session_patients_seq.NEXTVAL INTO :new.id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_webhook_endpoints_pk
BEFORE INSERT ON webhook_endpoints
FOR EACH ROW
BEGIN
  IF :new.id IS NULL THEN
    SELECT webhook_endpoints_seq.NEXTVAL INTO :new.id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_webhook_deliveries_pk
BEFORE INSERT ON webhook_deliveries
FOR EACH ROW
BEGIN
  IF :new.id IS NULL THEN
    SELECT webhook_deliveries_seq.NEXTVAL INTO :new.id FROM dual;
  END IF;
END;
/

CREATE OR REPLACE TRIGGER trg_audit_trail_pk
BEFORE INSERT ON audit_trail
FOR EACH ROW
BEGIN
  IF :new.id IS NULL THEN
    SELECT audit_trail_seq.NEXTVAL INTO :new.id FROM dual;
  END IF;
END;
/

-- ============================================================================
-- TRIGGERS FOR ALERT MANAGEMENT AND PATIENT SYNC
-- ============================================================================

CREATE OR REPLACE TRIGGER trg_alert_status_update
BEFORE INSERT OR UPDATE ON alerts
FOR EACH ROW
BEGIN
    -- Automatically set status based on end_date
    IF :new.end_date IS NOT NULL AND :new.end_date <= SYSDATE THEN
        :new.status := 'RESOLVED';
    ELSIF :new.end_date IS NULL THEN
        :new.status := 'ACTIVE';
    END IF;

    -- Update last_synced_at
    :new.last_synced_at := CURRENT_TIMESTAMP;
    :new.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_patient_alert_sync
AFTER INSERT OR UPDATE ON alerts
FOR EACH ROW
BEGIN
    -- Update patient's last_alert_sync timestamp
    UPDATE patients
    SET last_alert_sync = CURRENT_TIMESTAMP
    WHERE id = :new.patient_id;
END;
/

-- ============================================================================
-- ENHANCED WEBHOOK TRIGGERS
-- ============================================================================
-- In a real application, this logic would likely live in the application layer (C#/NestJS)
-- to avoid complex database triggers that are hard to maintain and debug.
-- Creating PL/SQL procedures called by simple triggers would be a better approach
-- than one large trigger body, but for this conversion, we'll keep it simple.
-- The following is a conceptual placeholder as a direct conversion is complex
-- and depends on application logic for building the JSON payload.

CREATE OR REPLACE PROCEDURE proc_trigger_alert_webhook (
    p_external_alert_id IN VARCHAR2,
    p_hospital_patient_id IN VARCHAR2,
    p_patient_id IN NUMBER,
    p_type IN VARCHAR2,
    p_level IN VARCHAR2,
    p_status IN VARCHAR2,
    p_synced_at IN TIMESTAMP WITH TIME ZONE
)
IS
  -- This procedure would contain logic to find active webhook endpoints for 'alert.synced'
  -- and insert into the webhook_deliveries table.
  -- The payload construction (e.g., using APEX_JSON) would happen here.
  -- This is a placeholder for demonstration.
BEGIN
  -- Example:
  -- FOR r IN (SELECT url, id FROM webhook_endpoints WHERE is_active = 1 AND events LIKE '%alert.synced%') LOOP
  --   -- build json payload
  --   -- insert into webhook_deliveries...
  -- END LOOP;
  NULL;
END;
/


CREATE OR REPLACE TRIGGER trg_alert_webhook
AFTER INSERT ON alerts
FOR EACH ROW
BEGIN
  -- This trigger calls the procedure that handles webhook delivery logic.
  proc_trigger_alert_webhook(
    :new.external_alert_id,
    :new.hospital_patient_id,
    :new.patient_id,
    :new.type,
    :new.level,
    :new.status,
    :new.last_synced_at
  );
END;
/

-- The trigger for patient updates would follow a similar pattern.

-- ============================================================================
-- Note on Triggers and Webhooks
-- ============================================================================
-- The original PostgreSQL schema had a single large trigger function `trigger_webhook`
-- that handled multiple tables. In Oracle, it's generally better to have separate,
-- specific triggers per table. The logic for creating the JSON payload and
-- inserting it into `webhook_deliveries` is often better handled in the application
-- layer to reduce database load and complexity, and to keep business logic out of the DB.
-- The triggers above are simplified for this reason.
```
