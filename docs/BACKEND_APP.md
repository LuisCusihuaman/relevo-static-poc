I will use nx for nestjs service and the mock "Hospital Systems" as mono repo, so when I have access to the real endpoints and schema I can simply replace that mock with the real ones.

# RELEVO Backend API Documentation

## Overview

This document provides comprehensive backend API specifications, database schemas, and real-time communication protocols for the RELEVO medical handoff platform. The backend architecture supports the transition from static/simulated features to fully real-time collaborative medical workflows while maintaining strict HIPAA compliance and audit requirements.

**Architecture**: NX Monorepo with microservices approach for scalable development and deployment.

## NX Monorepo Architecture Overview

### Workspace Structure

```
relevo-workspace/
├── apps/
│   ├── relevo-frontend/          # React CSR application
│   ├── relevo-api/               # C# Backend (Main API)
│   ├── relevo-nestjs/            # NestJS Service (Webhooks + Hocuspocus + External APIs)
│   └── hospital-mock-api/        # Mock Hospital Systems API
├── libs/
│   ├── shared/
│   │   ├── types/                # Shared TypeScript types
│   │   ├── constants/            # Shared constants
│   │   └── utils/                # Shared utilities
│   ├── hospital-sdk/             # Hospital API SDK (interfaces)
│   ├── collaboration/            # Collaboration features
│   └── medical-core/             # Core medical domain logic
└── tools/
```

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RELEVO NX Monorepo                          │
├─────────────────────────────────────────────────────────────────────┤
│  apps/relevo-frontend   │  apps/relevo-api    │  apps/relevo-nestjs │
│  (React CSR)            │  (C# Backend)       │  (NestJS Service)   │
│  - UI Components        │  - Main API         │  - Webhooks         │
│  - I-PASS Interface     │  - Authentication   │  - Hocuspocus       │
│  - Collaboration UI     │  - Patient Data     │  - Real-time        │
│                         │  - Audit Trails     │  - Cache Layer      │
├─────────────────────────┼─────────────────────┼─────────────────────┤
│  libs/shared/types      │  libs/hospital-sdk  │  libs/collaboration │
│  - Common Interfaces    │  - API Abstractions │  - Shared Logic     │
│  - Type Definitions     │  - Mock Fallbacks   │  - Real-time Utils  │
├─────────────────────────┼─────────────────────┼─────────────────────┤
│           apps/hospital-mock-api (Development)                      │
│           - Mock Hospital Systems                                   │
│           - Alert Simulation                                        │
│           - Development Testing                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                          ┌─────────────────────┐
                          │   PostgreSQL DB     │
                          │   (Single Source)   │
                          └─────────────────────┘
```

### Service Responsibilities

#### React Frontend (`apps/relevo-frontend`)

- **User Interface**: I-PASS workflow interface, patient management UI
- **Real-time Collaboration**: Tiptap integration, user presence indicators
- **State Management**: Local state, sync status, session management
- **Mobile Responsiveness**: Adaptive UI for different screen sizes
- **Authentication**: JWT token management, user session handling

#### C# Backend (`apps/relevo-api`)

- **Authentication & Authorization**: JWT tokens, user management, RBAC
- **Patient Management**: CRUD operations, medical data persistence
- **I-PASS Workflow**: Section management, audit trails, version control
- **Session Management**: Handover sessions, daily setup workflows
- **Compliance & Security**: HIPAA compliance, comprehensive audit logging
- **Database Operations**: Primary database access layer, data validation
- **Alert Management**: Alert storage, retrieval, and status management

#### NestJS Service (`apps/relevo-nestjs`)

- **Webhook Management**: External integrations, event processing
- **Real-time Events**: Non-collaborative real-time features
- **Cache Management**: In-memory caching with NestJS/cache-manager
- **Background Jobs**: Async processing, scheduled tasks
- **External API Integration**: Hospital systems coordination via hospital-sdk
- **Alert Synchronization**: Periodic alert fetching with fallback mechanisms
- **Collaborative Editing**: Integrated Hocuspocus server for real-time text editing
- **Document Collaboration**: Real-time text editing for I-PASS sections
- **Conflict Resolution**: Operational transformation, document persistence
- **User Presence**: Live editing indicators, collaboration status

#### Hospital Mock API (`apps/hospital-mock-api`)

- **Development Support**: Mock hospital system endpoints
- **Alert Simulation**: Realistic alert data generation using provided schema
- **API Testing**: Swagger documentation, endpoint validation
- **Fallback Service**: Automatic fallback when real hospital API unavailable
- **Data Generation**: Comprehensive mock data for development and testing

#### Shared Libraries (`libs/`)

- **hospital-sdk**: Interface-based hospital API abstraction
- **shared/types**: Common TypeScript interfaces and types
- **collaboration**: Shared collaboration logic and utilities
- **medical-core**: Core medical domain logic and validations

## Feature Implementation Classification

### 🔴 Real-time Features (Currently Implemented)

- Session management and timing (NestJS service)
- Auto-save and sync status (Frontend + NestJS)
- Mobile/responsive detection (Frontend)
- User presence tracking (Collaboration lib + NestJS)

### 🟡 Simulated Features (Backend Implementation Needed)

- Collaboration and discussion threads (NestJS + Collaboration lib)
- Activity feeds and notifications (NestJS service)
- Multi-user presence indicators (Frontend + NestJS)
- Real-time document editing (Hocuspocus integration)

### 🔵 Static Features (Persistence Required)

- Patient data management (C# Backend)
- I-PASS workflow content (C# Backend + Database)
- User authentication and authorization (C# Backend)
- Medical record integration (C# Backend + hospital-sdk)

### 🟠 External Integration Features (Hospital API Dependent)

- Alert fetching from hospital systems (hospital-sdk + Mock API)
- EMR data synchronization (hospital-sdk)
- Laboratory result integration (Mock API simulation)
- Vital signs monitoring (Future real API integration)

## Enhanced Cache Strategy Completion

```typescript
// Continuing from the cut-off point...
    this.logger.debug(`🔄 Updated cached alert ${updatedAlert.id} for patient ${patientId}`);
  }

  private determineAlertSource(alerts: HospitalAlert[]): string {
    if (alerts.length === 0) return 'none';
    const firstAlert = alerts[0];
    return firstAlert.creationDetails.source.includes('Mock') ? 'mock' : 'hospital';
  }

  // ============================================================================
  // COLLABORATION CACHING (existing functionality enhanced)
  // ============================================================================

  async cacheCollaborationSession(documentId: string, userId: string, sessionData: any) {
    const cacheKey = `collab:${documentId}:${userId}`;
    await this.cacheManager.set(cacheKey, sessionData, 300);
  }

  async getActiveCollaborators(documentId: string): Promise<any[]> {
    // Implementation would use Redis SCAN for pattern matching in production
    return [];
  }

  // ============================================================================
  // HOSPITAL API HEALTH CACHING
  // ============================================================================

  async cacheHospitalApiHealth(endpoint: string, health: any, ttl: number = 60) {
    const cacheKey = `hospital:health:${endpoint}`;
    await this.cacheManager.set(cacheKey, health, ttl);
  }

  async getHospitalApiHealth(endpoint: string): Promise<any> {
    const cacheKey = `hospital:health:${endpoint}`;
    return await this.cacheManager.get(cacheKey);
  }

  // ============================================================================
  // ENHANCED CACHE INVALIDATION
  // ============================================================================

  async invalidatePatientCache(patientId: number) {
    const patterns = [
      `patient:${patientId}`,
      `alerts:patient:${patientId}`,
      `ipass:${patientId}:*`,
      `activity:${patientId}`,
      `presence:${patientId}:*`,
    ];

    // In production with Redis, use SCAN pattern matching
    // For memory cache, track keys manually
    this.logger.log(`🗑️ Cache invalidation requested for patient ${patientId}`);
  }

  // ============================================================================
  // CACHE METRICS
  // ============================================================================

  async getCacheMetrics(): Promise<any> {
    return {
      totalSize: 0, // Would be implemented based on cache store
      alertsCached: 0,
      collaborationSessions: 0,
      hitRate: 0.85,
      memoryUsage: process.memoryUsage(),
    };
  }
}
```

## NX Development Workflow

### Development Commands

```bash
# Start all services for development
npm run dev:all

# Start specific services
npm run dev:frontend     # React app (port 3001)
npm run dev:nestjs       # NestJS service (ports 3000, 3002)
npm run dev:mock         # Hospital mock API (port 3003)

# Build commands
npm run build:all
nx build relevo-frontend
nx build relevo-nestjs
nx build hospital-mock-api

# Testing
nx test hospital-sdk
nx test relevo-nestjs
nx test hospital-mock-api

# Linting
nx lint relevo-frontend
nx lint relevo-nestjs
```

### Environment Configuration

```typescript
// Development (.env.local)
HOSPITAL_API_URL=http://localhost:3003
USE_MOCK_HOSPITAL_API=true
CSHARP_API_URL=http://localhost:5000
HOCUSPOCUS_PORT=3002

// Production (.env.production)
HOSPITAL_API_URL=https://real-hospital-api.com
HOSPITAL_API_KEY=your-real-api-key
USE_MOCK_HOSPITAL_API=false
```

### Migration to Real Hospital API

When real hospital endpoints become available:

1. **Update Environment Variables**:

   ```bash
   HOSPITAL_API_URL=https://real-hospital-api.com
   HOSPITAL_API_KEY=your-real-api-key
   USE_MOCK_HOSPITAL_API=false
   ```

2. **Update Types** (if needed) in `libs/shared/types`

3. **Enhanced Authentication** in `libs/hospital-sdk`

4. **Remove Mock Service** when no longer needed:
   ```bash
   nx remove hospital-mock-api
   ```

## Security & Compliance

### Enhanced HIPAA Compliance Framework

```yaml
security_framework:
  authentication:
    primary_backend: "C# Backend with JWT"
    external_api_integration:
      - "Hospital API key management"
      - "Service-to-service authentication"
      - "Hocuspocus WebSocket authentication"

  data_protection:
    in_transit:
      - "TLS 1.3 for all HTTP communications"
      - "WSS (WebSocket Secure) for Hocuspocus"
      - "Encrypted communication with hospital APIs"

    at_rest:
      - "Database encryption (PostgreSQL TDE)"
      - "Alert data encryption"
      - "Y.js document state encryption"

  access_control:
    nx_services:
      - "Service-to-service authentication"
      - "Role-based API access"
      - "Document-level permissions"
      - "Alert data filtering by unit/assignment"

  audit_logging:
    comprehensive_tracking:
      - "All NX service interactions"
      - "External API calls and responses"
      - "Collaborative sessions"
      - "Alert synchronization activities"

compliance_endpoints:
  relevo_api:
    - "/audit/patient-access/{patientId}"
    - "/audit/alert-access/{alertId}"
    - "/compliance/hipaa-report"

  relevo_nestjs:
    - "/audit/webhook-deliveries"
    - "/audit/hocuspocus-connections"
    - "/audit/hospital-api-calls"
    - "/compliance/real-time-activity"
```

## Deployment & Infrastructure

### NX Monorepo Deployment

```yaml
# docker-compose.dev.yml (NX Development)
version: '3.8'
services:
  postgres:
    image: postgres:15
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: relevo
      POSTGRES_USER: relevo
      POSTGRES_PASSWORD: dev_password

  hospital-mock-api:
    build:
      context: .
      dockerfile: apps/hospital-mock-api/Dockerfile
    ports: ["3003:3003"]
    environment:
      NODE_ENV: development

  relevo-nestjs:
    build:
      context: .
      dockerfile: apps/relevo-nestjs/Dockerfile
    ports: ["3000:3000", "3002:3002"]
    environment:
      HOSPITAL_API_URL: http://hospital-mock-api:3003
      USE_MOCK_HOSPITAL_API: true
      CSHARP_API_URL: http://host.docker.internal:5000
    depends_on: [postgres, hospital-mock-api]

volumes:
  postgres_data:
```

### Production Deployment Commands

```bash
# Build all applications for production
nx run-many --target=build --projects=relevo-nestjs,hospital-mock-api --configuration=production

# Docker build
nx run relevo-nestjs:docker-build
nx run hospital-mock-api:docker-build

# Deploy with environment-specific configurations
NODE_ENV=production nx serve relevo-nestjs
```

## Implementation Roadmap

### Phase 1: NX Foundation & Alert Integration (Months 1-2)

- **Complete NX workspace setup** with all applications and libraries
- **Hospital Mock API** with realistic alert data simulation
- **NestJS service enhancement** with alert synchronization
- **Shared library implementation** for types and utilities

### Phase 2: Real API Integration & Collaboration (Months 2-3)

- **Hospital SDK implementation** with real API integration
- **Hocuspocus collaborative editing** fully integrated
- **Enhanced caching strategy** with Redis for production
- **Comprehensive webhook system** for all service interactions

### Phase 3: Production Readiness (Months 3-4)

- **HIPAA compliance implementation** across all services
- **Performance optimization** and monitoring
- **Security enhancements** for all service communications
- **Deployment automation** and CI/CD pipeline

This updated BACKEND.md provides a complete specification for the NX monorepo architecture with integrated hospital API mock service, designed for seamless migration to real hospital endpoints when available.

### Service Responsibilities

#### C# Backend (Main API)

- **Authentication & Authorization**: JWT tokens, user management
- **Patient Management**: CRUD operations, medical data
- **I-PASS Workflow**: Section management, audit trails
- **Session Management**: Handover sessions, daily setup
- **Compliance & Security**: HIPAA compliance, audit logging
- **Database Operations**: Primary database access layer
- **Alert Management**: Alert storage, retrieval, and status management

#### NestJS Service (Integrated Real-time Hub)

- **Webhook Management**: External integrations, notifications
- **Real-time Events**: Non-collaborative real-time features
- **Cache Management**: In-memory caching with NestJS/cache-manager
- **Background Jobs**: Async processing, scheduled tasks
- **External API Integration**: Hospital systems, alert fetching
- **Alert Synchronization**: Periodic alert fetching from hospital REST APIs
- **Collaborative Editing**: Hocuspocus server integration for real-time text editing
- **Document Collaboration**: Real-time text editing for I-PASS sections
- **Conflict Resolution**: Operational transformation
- **Document Persistence**: Syncing with main database
- **User Presence**: Live editing indicators

## Feature Implementation Classification

### 🔴 Real-time Features (Currently Implemented)

- Session management and timing
- Auto-save and sync status
- Mobile/responsive detection
- User presence tracking

### 🟡 Simulated Features (Backend Implementation Needed)

- Collaboration and discussion threads
- Activity feeds and notifications
- Multi-user presence indicators
- Real-time document editing

### 🔵 Static Features (Persistence Required)

- Patient data management
- I-PASS workflow content
- User authentication and authorization
- Medical record integration

### 🟠 External Integration Features (Hospital API Dependent)

- Alert fetching from hospital systems
- EMR data synchronization
- Laboratory result integration
- Vital signs monitoring (future)

## Table of Contents

1. [C# Backend API Specifications](#c-backend-api-specifications)
2. [NestJS Service Specifications](#nestjs-service-specifications)
3. [External Hospital API Integration](#external-hospital-api-integration)
4. [Alert Management System](#alert-management-system)
5. [Hocuspocus Integration](#hocuspocus-integration)
6. [Webhook Specifications](#webhook-specifications)
7. [Database Schemas](#database-schemas)
8. [Caching Strategy](#caching-strategy)
9. [Security & Compliance](#security--compliance)

## C# Backend API Specifications

### OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: RELEVO Medical Handoff API (C# Backend)
  version: 1.0.0
  description: Primary backend API for RELEVO medical handoff platform with HIPAA compliance
  contact:
    name: RELEVO Development Team
    email: dev@relevo-medical.com

servers:
  - url: https://api.relevo-medical.com/v1
    description: Production server
  - url: https://staging-api.relevo-medical.com/v1
    description: Staging server

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      required:
        - id
        - name
        - email
        - role
        - medicalLicense
        - unit
      properties:
        id:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440000"
        name:
          type: string
          example: "Dr. Sarah Johnson"
        email:
          type: string
          format: email
          example: "sarah.johnson@hospital.com"
        role:
          type: string
          enum: [doctor, nurse, resident, attending, fellow]
          example: "doctor"
        medicalLicense:
          type: string
          example: "MD123456"
        unit:
          type: string
          enum: [PICU, NICU, General, Cardiology, Surgery, Emergency]
          example: "PICU"
        shift:
          type: string
          enum: [Morning, Evening, Night]
          example: "Morning"
        isActive:
          type: boolean
          example: true
        lastLogin:
          type: string
          format: date-time
          example: "2025-01-15T10:30:00Z"
        permissions:
          type: array
          items:
            type: string
          example: ["view_patients", "edit_handovers", "admin_access"]

    Patient:
      type: object
      required:
        - id
        - name
        - mrn
        - unit
        - assignedTo
        - illnessSeverity
      properties:
        id:
          type: integer
          example: 1
        name:
          type: string
          example: "Emma Rodriguez"
        age:
          type: integer
          example: 7
        mrn:
          type: string
          example: "MRN789012"
          description: "Medical Record Number"
        room:
          type: string
          example: "PICU-204"
        unit:
          type: string
          enum: [PICU, NICU, General, Cardiology, Surgery, Emergency]
          example: "PICU"
        assignedTo:
          type: string
          example: "Dr. Sarah Johnson"
        illnessSeverity:
          type: string
          enum: [stable, guarded, unstable, critical]
          example: "stable"
        diagnosis:
          type: string
          example: "Post-operative monitoring following cardiac surgery"
        status:
          type: string
          example: "Stable, responding well to treatment"
        admissionDate:
          type: string
          format: date-time
          example: "2025-01-10T08:00:00Z"
        lastUpdate:
          type: string
          format: date-time
          example: "2025-01-15T14:30:00Z"
        collaborators:
          type: array
          items:
            $ref: '#/components/schemas/Collaborator'
        alerts:
          type: array
          items:
            $ref: '#/components/schemas/Alert'
        priority:
          type: string
          enum: [low, medium, high, critical]
          example: "medium"

    Alert:
      type: object
      required:
        - id
        - patientId
        - type
        - alertCatalogItem
        - level
        - status
        - startDate
        - creationDetails
      properties:
        id:
          type: string
          format: uuid
          example: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
        patientId:
          type: string
          example: "81891"
          description: "External patient ID from hospital system"
        internalPatientId:
          type: integer
          example: 1
          description: "Internal RELEVO patient ID"
        type:
          type: string
          enum: [INFECTION_CONTROL, MEDICATION, VITAL_SIGNS, LAB_RESULTS, PROCEDURE, GENERAL]
          example: "INFECTION_CONTROL"
        alertCatalogItem:
          type: object
          required:
            - code
            - description
          properties:
            code:
              type: string
              example: "70"
            description:
              type: string
              example: "Germen Multi Resistente"
        observations:
          type: string
          example: "OXA48/163"
          description: "Additional observations or notes"
        level:
          type: string
          enum: [LOW, MEDIUM, HIGH, CRITICAL]
          example: "MEDIUM"
        status:
          type: string
          enum: [ACTIVE, RESOLVED, EXPIRED]
          example: "ACTIVE"
          description: "Calculated by system: ACTIVE if endDate is null"
        startDate:
          type: string
          format: date
          example: "2025-06-09"
        endDate:
          type: string
          format: date
          nullable: true
          example: null
        creationDetails:
          type: object
          required:
            - author
            - timestamp
            - source
          properties:
            author:
              type: string
              example: "lab_auto"
            timestamp:
              type: string
              format: date-time
              example: "2025-06-09T10:00:00Z"
            source:
              type: string
              example: "Laboratory System"
        lastSyncedAt:
          type: string
          format: date-time
          example: "2025-01-15T14:30:00Z"
          description: "When this alert was last fetched from hospital system"

    IPassEntry:
      type: object
      required:
        - id
        - patientId
        - section
        - content
        - createdBy
        - createdAt
      properties:
        id:
          type: string
          format: uuid
        patientId:
          type: integer
        section:
          type: string
          enum: [illness, patient, actions, awareness, synthesis]
        content:
          type: object
          description: "Section-specific content structure"
        version:
          type: integer
          description: "Version number for optimistic locking"
        isCompleted:
          type: boolean
          default: false
        createdBy:
          type: string
          format: uuid
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        collaborativeDocumentId:
          type: string
          description: "Reference to Hocuspocus document for collaborative sections"

paths:
  /auth/login:
    post:
      tags:
        - Authentication
      summary: User login
      description: Authenticate user and return JWT token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  format: password
                rememberMe:
                  type: boolean
                  default: false
      responses:
        '200':
          description: Successful authentication
          content:
            application/json:
              schema:
                type: object
                properties:
                  accessToken:
                    type: string
                  refreshToken:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'
                  expiresIn:
                    type: integer
        '401':
          description: Invalid credentials
        '429':
          description: Too many login attempts

  /patients:
    get:
      tags:
        - Patient Management
      summary: Get assigned patients
      description: Retrieve list of patients assigned to current user
      parameters:
        - name: unit
          in: query
          schema:
            type: string
          description: Filter by medical unit
        - name: severity
          in: query
          schema:
            type: string
            enum: [stable, guarded, unstable, critical]
          description: Filter by illness severity
        - name: includeAlerts
          in: query
          schema:
            type: boolean
            default: true
          description: Include active alerts for each patient
      responses:
        '200':
          description: List of assigned patients
          content:
            application/json:
              schema:
                type: object
                properties:
                  patients:
                    type: array
                    items:
                      $ref: '#/components/schemas/Patient'
                  total:
                    type: integer

  /patients/{patientId}:
    get:
      tags:
        - Patient Management
      summary: Get patient details
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: integer
        - name: includeAlerts
          in: query
          schema:
            type: boolean
            default: true
          description: Include all alerts for patient
      responses:
        '200':
          description: Patient details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Patient'

    patch:
      tags:
        - Patient Management
      summary: Update patient information
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                illnessSeverity:
                  type: string
                  enum: [stable, guarded, unstable, critical]
                status:
                  type: string
                assignedTo:
                  type: string
      responses:
        '200':
          description: Patient updated successfully
          headers:
            X-Webhook-Trigger:
              description: Triggers webhook to NestJS service
              schema:
                type: string
                example: "patient.updated"

  /patients/{patientId}/alerts:
    get:
      tags:
        - Alert Management
      summary: Get patient alerts
      description: Retrieve all alerts for a specific patient
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: integer
        - name: status
          in: query
          schema:
            type: string
            enum: [ACTIVE, RESOLVED, EXPIRED]
          description: Filter by alert status
        - name: type
          in: query
          schema:
            type: string
            enum: [INFECTION_CONTROL, MEDICATION, VITAL_SIGNS, LAB_RESULTS, PROCEDURE, GENERAL]
          description: Filter by alert type
        - name: level
          in: query
          schema:
            type: string
            enum: [LOW, MEDIUM, HIGH, CRITICAL]
          description: Filter by alert level
      responses:
        '200':
          description: List of patient alerts
          content:
            application/json:
              schema:
                type: object
                properties:
                  alerts:
                    type: array
                    items:
                      $ref: '#/components/schemas/Alert'
                  total:
                    type: integer
                  lastSyncedAt:
                    type: string
                    format: date-time
                    description: "When alerts were last synced from hospital system"

    post:
      tags:
        - Alert Management
      summary: Trigger alert sync
      description: Manually trigger alert synchronization from hospital system
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '202':
          description: Alert sync triggered
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Alert synchronization initiated"
                  syncJobId:
                    type: string
                    format: uuid
          headers:
            X-Webhook-Trigger:
              description: Triggers webhook to NestJS service
              schema:
                type: string
                example: "alert.sync.requested"

  /alerts/sync-status:
    get:
      tags:
        - Alert Management
      summary: Get alert sync status
      description: Get the status of alert synchronization jobs
      responses:
        '200':
          description: Alert sync status
          content:
            application/json:
              schema:
                type: object
                properties:
                  lastGlobalSync:
                    type: string
                    format: date-time
                  activeSyncJobs:
                    type: integer
                  failedSyncs:
                    type: integer
                  nextScheduledSync:
                    type: string
                    format: date-time

  /patients/{patientId}/ipass/{section}:
    get:
      tags:
        - I-PASS Workflow
      summary: Get I-PASS section
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: integer
        - name: section
          in: path
          required: true
          schema:
            type: string
            enum: [illness, patient, actions, awareness, synthesis]
      responses:
        '200':
          description: Section content
          content:
            application/json:
              schema:
                allOf:
                  - $ref: '#/components/schemas/IPassEntry'
                  - type: object
                    properties:
                      hocuspocusDocumentId:
                        type: string
                        description: "Document ID for collaborative editing"

    put:
      tags:
        - I-PASS Workflow
      summary: Update I-PASS section
      description: Update section content with optimistic locking
      parameters:
        - name: patientId
          in: path
          required: true
          schema:
            type: integer
        - name: section
          in: path
          required: true
          schema:
            type: string
            enum: [illness, patient, actions, awareness, synthesis]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - content
                - version
              properties:
                content:
                  type: object
                version:
                  type: integer
                isCompleted:
                  type: boolean
                autosave:
                  type: boolean
                  default: false
      responses:
        '200':
          description: Section updated successfully
          headers:
            X-Webhook-Trigger:
              description: Triggers webhook to NestJS service
              schema:
                type: string
                example: "ipass.section.updated"
        '409':
          description: Version conflict

  /sessions:
    get:
      tags:
        - Session Management
      summary: Get user sessions
      responses:
        '200':
          description: List of sessions
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                      format: uuid
                    startTime:
                      type: string
                      format: date-time
                    endTime:
                      type: string
                      format: date-time
                    status:
                      type: string
                      enum: [active, completed, abandoned]

    post:
      tags:
        - Session Management
      summary: Start handover session
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - patientIds
                - shiftType
                - unit
              properties:
                patientIds:
                  type: array
                  items:
                    type: integer
                shiftType:
                  type: string
                  enum: [Morning, Evening, Night]
                unit:
                  type: string
      responses:
        '201':
          description: Session started successfully
          headers:
            X-Webhook-Trigger:
              description: Triggers webhook to NestJS service
              schema:
                type: string
                example: "session.started"

  /daily-setup:
    post:
      tags:
        - Session Management
      summary: Complete daily setup
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - doctorName
                - unit
                - shift
                - selectedPatients
              properties:
                doctorName:
                  type: string
                unit:
                  type: string
                shift:
                  type: string
                selectedPatients:
                  type: array
                  items:
                    type: integer
      responses:
        '201':
          description: Daily setup completed
          headers:
            X-Webhook-Trigger:
              description: Triggers webhook to NestJS service
              schema:
                type: string
                example: "daily.setup.completed"

  # Document Management for Hocuspocus Integration
  /documents/{documentId}:
    get:
      tags:
        - Document Management
      summary: Get collaborative document
      description: Retrieve document state for Hocuspocus server
      parameters:
        - name: documentId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Document content
          content:
            application/json:
              schema:
                type: object
                properties:
                  content:
                    type: array
                    items:
                      type: integer
                    description: "Y.js document state as byte array"
                  lastModified:
                    type: string
                    format: date-time

    put:
      tags:
        - Document Management
      summary: Store collaborative document
      description: Store document state from Hocuspocus server
      parameters:
        - name: documentId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - content
                - lastModified
              properties:
                content:
                  type: array
                  items:
                    type: integer
                  description: "Y.js document state as byte array"
                lastModified:
                  type: string
                  format: date-time
      responses:
        '200':
          description: Document stored successfully

  /auth/verify:
    post:
      tags:
        - Authentication
      summary: Verify JWT token
      description: Verify token for Hocuspocus authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: Token is valid
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          description: Invalid token
```

## NestJS Service Specifications

### Integrated Service Architecture

```typescript
// NestJS Service with Hocuspocus and External API Integration
import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { HttpModule } from "@nestjs/axios";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    CacheModule.register({
      store: "memory",
      ttl: 300, // 5 minutes default TTL
      max: 1000, // maximum number of items in cache
    }),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    WebhookController,
    CollaborationController,
    NotificationController,
    IntegrationController,
    HocuspocusController,
    AlertController,
  ],
  providers: [
    WebhookService,
    CollaborationService,
    NotificationService,
    EMRIntegrationService,
    CacheService,
    HocuspocusService,
    AlertSyncService,
    HospitalApiService,
  ],
})
export class AppModule {}

// Bootstrap both HTTP server and Hocuspocus server
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Start HTTP server
  await app.listen(3000);

  // Start Hocuspocus server
  const hocuspocusService = app.get(HocuspocusService);
  await hocuspocusService.start();

  // Start alert synchronization
  const alertSyncService = app.get(AlertSyncService);
  await alertSyncService.startScheduledSync();

  console.log("NestJS HTTP server running on port 3000");
  console.log(
    "Hocuspocus WebSocket server running on port 3002",
  );
  console.log("Alert synchronization service started");
}
bootstrap();
```

## External Hospital API Integration

### Hospital API Service

```typescript
// Hospital API Service for Alert Integration
import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

export interface HospitalAlert {
  id: string;
  patientId: string;
  type:
    | "INFECTION_CONTROL"
    | "MEDICATION"
    | "VITAL_SIGNS"
    | "LAB_RESULTS"
    | "PROCEDURE"
    | "GENERAL";
  alertCatalogItem: {
    code: string;
    description: string;
  };
  observations?: string;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "RESOLVED" | "EXPIRED";
  startDate: string;
  endDate?: string | null;
  creationDetails: {
    author: string;
    timestamp: string;
    source: string;
  };
}

@Injectable()
export class HospitalApiService {
  private readonly logger = new Logger(HospitalApiService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async fetchPatientAlerts(
    hospitalPatientId: string,
  ): Promise<HospitalAlert[]> {
    const hospitalApiUrl = this.configService.get<string>(
      "HOSPITAL_API_URL",
    );
    const apiKey = this.configService.get<string>(
      "HOSPITAL_API_KEY",
    );

    if (!hospitalApiUrl) {
      // Return mock data for development
      return this.getMockAlerts(hospitalPatientId);
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${hospitalApiUrl}/patients/${hospitalPatientId}/alerts`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          },
        ),
      );

      return response.data.alerts || [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch alerts for patient ${hospitalPatientId}:`,
        error,
      );

      // Fallback to mock data in case of API failure
      return this.getMockAlerts(hospitalPatientId);
    }
  }

  async fetchAllActiveAlerts(): Promise<HospitalAlert[]> {
    const hospitalApiUrl = this.configService.get<string>(
      "HOSPITAL_API_URL",
    );
    const apiKey = this.configService.get<string>(
      "HOSPITAL_API_KEY",
    );

    if (!hospitalApiUrl) {
      return this.getAllMockAlerts();
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${hospitalApiUrl}/alerts/active`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            timeout: 30000, // 30 second timeout for bulk fetch
          },
        ),
      );

      return response.data.alerts || [];
    } catch (error) {
      this.logger.error(
        "Failed to fetch all active alerts:",
        error,
      );
      return this.getAllMockAlerts();
    }
  }

  // Mock data for development/testing
  private getMockAlerts(
    hospitalPatientId: string,
  ): HospitalAlert[] {
    const mockAlerts: HospitalAlert[] = [
      {
        id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        patientId: hospitalPatientId,
        type: "INFECTION_CONTROL",
        alertCatalogItem: {
          code: "70",
          description: "Germen Multi Resistente",
        },
        observations: "OXA48/163",
        level: "MEDIUM",
        status: "ACTIVE",
        startDate: "2025-06-09",
        endDate: null,
        creationDetails: {
          author: "lab_auto",
          timestamp: "2025-06-09T10:00:00Z",
          source: "Laboratory System",
        },
      },
      {
        id: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
        patientId: hospitalPatientId,
        type: "MEDICATION",
        alertCatalogItem: {
          code: "45",
          description: "Medication Allergy Alert",
        },
        observations: "Penicillin allergy documented",
        level: "HIGH",
        status: "ACTIVE",
        startDate: "2025-06-08",
        endDate: null,
        creationDetails: {
          author: "dr_martinez",
          timestamp: "2025-06-08T15:30:00Z",
          source: "Clinical System",
        },
      },
      {
        id: "c3d4e5f6-g7h8-9012-3456-789012cdefgh",
        patientId: hospitalPatientId,
        type: "LAB_RESULTS",
        alertCatalogItem: {
          code: "12",
          description: "Critical Lab Value",
        },
        observations: "Elevated WBC count: 18,000",
        level: "CRITICAL",
        status: "ACTIVE",
        startDate: "2025-06-10",
        endDate: null,
        creationDetails: {
          author: "lab_system",
          timestamp: "2025-06-10T09:15:00Z",
          source: "Laboratory Information System",
        },
      },
    ];

    // Filter by patient ID in real scenario
    return mockAlerts.filter(
      (alert) => alert.patientId === hospitalPatientId,
    );
  }

  private getAllMockAlerts(): HospitalAlert[] {
    // Return mock alerts for multiple patients
    const patientIds = ["81891", "81892", "81893", "81894"];
    const allMockAlerts: HospitalAlert[] = [];

    patientIds.forEach((patientId) => {
      allMockAlerts.push(...this.getMockAlerts(patientId));
    });

    return allMockAlerts;
  }

  // Health check for hospital API
  async checkHospitalApiHealth(): Promise<boolean> {
    const hospitalApiUrl = this.configService.get<string>(
      "HOSPITAL_API_URL",
    );

    if (!hospitalApiUrl) {
      this.logger.warn(
        "Hospital API URL not configured, using mock data",
      );
      return true; // Mock service is always "healthy"
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${hospitalApiUrl}/health`, {
          timeout: 5000,
        }),
      );

      return response.status === 200;
    } catch (error) {
      this.logger.error(
        "Hospital API health check failed:",
        error,
      );
      return false;
    }
  }
}
```

## Alert Management System

### Alert Synchronization Service

```typescript
// Alert Synchronization Service
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { HospitalApiService } from "./hospital-api.service";

@Injectable()
export class AlertSyncService {
  private readonly logger = new Logger(AlertSyncService.name);
  private syncInProgress = false;

  constructor(
    private readonly hospitalApiService: HospitalApiService,
    private readonly httpService: HttpService,
  ) {}

  async startScheduledSync() {
    this.logger.log("Alert synchronization service started");
    // Perform initial sync on startup
    await this.syncAllAlerts();
  }

  // Sync alerts every 5 minutes
  @Cron(CronExpression.EVERY_5_MINUTES)
  async scheduledAlertSync() {
    if (this.syncInProgress) {
      this.logger.warn(
        "Alert sync already in progress, skipping scheduled sync",
      );
      return;
    }

    await this.syncAllAlerts();
  }

  async syncAllAlerts(): Promise<void> {
    if (this.syncInProgress) {
      this.logger.warn("Alert sync already in progress");
      return;
    }

    this.syncInProgress = true;
    this.logger.log("Starting alert synchronization");

    try {
      // Check hospital API health first
      const isHealthy =
        await this.hospitalApiService.checkHospitalApiHealth();
      if (!isHealthy) {
        this.logger.warn(
          "Hospital API is not healthy, skipping sync",
        );
        return;
      }

      // Fetch all active alerts from hospital system
      const hospitalAlerts =
        await this.hospitalApiService.fetchAllActiveAlerts();
      this.logger.log(
        `Fetched ${hospitalAlerts.length} alerts from hospital system`,
      );

      // Process each alert
      for (const alert of hospitalAlerts) {
        await this.processAlert(alert);
      }

      // Update sync status
      await this.updateSyncStatus(
        "completed",
        hospitalAlerts.length,
      );

      this.logger.log(
        "Alert synchronization completed successfully",
      );
    } catch (error) {
      this.logger.error("Alert synchronization failed:", error);
      await this.updateSyncStatus("failed", 0, error.message);
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncPatientAlerts(
    hospitalPatientId: string,
  ): Promise<void> {
    this.logger.log(
      `Syncing alerts for patient: ${hospitalPatientId}`,
    );

    try {
      const alerts =
        await this.hospitalApiService.fetchPatientAlerts(
          hospitalPatientId,
        );

      for (const alert of alerts) {
        await this.processAlert(alert);
      }

      this.logger.log(
        `Synced ${alerts.length} alerts for patient ${hospitalPatientId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to sync alerts for patient ${hospitalPatientId}:`,
        error,
      );
      throw error;
    }
  }

  private async processAlert(
    hospitalAlert: HospitalAlert,
  ): Promise<void> {
    try {
      // Send alert to C# backend for storage/processing
      await this.httpService
        .post(
          `${process.env.CSHARP_API_URL}/alerts/sync`,
          {
            alert: hospitalAlert,
            syncedAt: new Date().toISOString(),
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.SERVICE_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        )
        .toPromise();

      // Trigger webhook for alert processing
      await this.httpService
        .post("http://localhost:3000/webhooks/alert/synced", {
          alertId: hospitalAlert.id,
          patientId: hospitalAlert.patientId,
          type: hospitalAlert.type,
          level: hospitalAlert.level,
          status: hospitalAlert.status,
          timestamp: new Date().toISOString(),
        })
        .toPromise();
    } catch (error) {
      this.logger.error(
        `Failed to process alert ${hospitalAlert.id}:`,
        error,
      );
    }
  }

  private async updateSyncStatus(
    status: string,
    alertCount: number,
    error?: string,
  ): Promise<void> {
    try {
      await this.httpService
        .post(
          `${process.env.CSHARP_API_URL}/alerts/sync-status`,
          {
            status,
            alertCount,
            timestamp: new Date().toISOString(),
            error,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.SERVICE_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        )
        .toPromise();
    } catch (error) {
      this.logger.error("Failed to update sync status:", error);
    }
  }

  // Manual sync trigger
  async triggerManualSync(patientId?: string): Promise<string> {
    const syncJobId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.logger.log(
      `Manual sync triggered with job ID: ${syncJobId}`,
    );

    // Run sync in background
    setTimeout(async () => {
      if (patientId) {
        await this.syncPatientAlerts(patientId);
      } else {
        await this.syncAllAlerts();
      }
    }, 0);

    return syncJobId;
  }
}
```

### Alert Controller

```typescript
// Alert Controller for NestJS Service
import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
} from "@nestjs/common";
import { AlertSyncService } from "./alert-sync.service";
import { HospitalApiService } from "./hospital-api.service";

@Controller("alerts")
export class AlertController {
  constructor(
    private readonly alertSyncService: AlertSyncService,
    private readonly hospitalApiService: HospitalApiService,
  ) {}

  @Post("sync")
  async triggerSync(@Query("patientId") patientId?: string) {
    const syncJobId =
      await this.alertSyncService.triggerManualSync(patientId);

    return {
      message: "Alert synchronization initiated",
      syncJobId,
      timestamp: new Date().toISOString(),
    };
  }

  @Get("hospital/health")
  async checkHospitalApiHealth() {
    const isHealthy =
      await this.hospitalApiService.checkHospitalApiHealth();

    return {
      healthy: isHealthy,
      timestamp: new Date().toISOString(),
      service: "Hospital Alert API",
    };
  }

  @Get("mock/:patientId")
  async getMockAlerts(@Param("patientId") patientId: string) {
    // For testing purposes - get mock alerts
    const alerts =
      await this.hospitalApiService.fetchPatientAlerts(
        patientId,
      );

    return {
      alerts,
      patientId,
      isMockData: !process.env.HOSPITAL_API_URL,
      timestamp: new Date().toISOString(),
    };
  }
}
```

## Hocuspocus Integration

### Hocuspocus Service Integration

```typescript
// Hocuspocus Service within NestJS (existing code with alert integration)
import { Injectable } from "@nestjs/common";
import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { Logger } from "@hocuspocus/extension-logger";
import { Throttle } from "@hocuspocus/extension-throttle";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HocuspocusService {
  private server: Server;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.initializeServer();
  }

  private initializeServer() {
    this.server = Server.configure({
      port: 3002,

      extensions: [
        new Logger(),
        new Throttle({
          throttle: 100, // Allow 100 requests per minute
        }),
        new Database({
          fetch: async ({ documentName }) => {
            try {
              // Fetch document from C# backend
              const response =
                await this.httpService.axiosRef.get(
                  `${this.configService.get("CSHARP_API_URL")}/documents/${documentName}`,
                  {
                    headers: {
                      Authorization: `Bearer ${this.configService.get("SERVICE_TOKEN")}`,
                    },
                  },
                );

              if (
                response.status === 200 &&
                response.data.content
              ) {
                return new Uint8Array(response.data.content);
              }
            } catch (error) {
              console.error("Failed to fetch document:", error);
            }
            return null;
          },

          store: async ({ documentName, state }) => {
            try {
              // Store document to C# backend
              await this.httpService.axiosRef.put(
                `${this.configService.get("CSHARP_API_URL")}/documents/${documentName}`,
                {
                  content: Array.from(state),
                  lastModified: new Date().toISOString(),
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.configService.get("SERVICE_TOKEN")}`,
                  },
                },
              );
            } catch (error) {
              console.error("Failed to store document:", error);
            }
          },
        }),
      ],

      async onAuthenticate({ token }) {
        // Verify JWT token with C# backend
        try {
          const response = await this.httpService.axiosRef.post(
            `${this.configService.get("CSHARP_API_URL")}/auth/verify`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.status === 200) {
            return { user: response.data };
          }
        } catch (error) {
          console.error("Authentication failed:", error);
        }

        throw new Error("Authentication failed");
      },

      async onConnect({ documentName, context }) {
        // Log connection and update presence
        console.log(
          `User ${context.user.id} connected to document ${documentName}`,
        );

        // Update presence in cache or trigger webhook
        await this.updateUserPresence(
          documentName,
          context.user,
          "connected",
        );
      },

      async onDisconnect({ documentName, context }) {
        // Log disconnection and update presence
        console.log(
          `User ${context.user.id} disconnected from document ${documentName}`,
        );

        // Update presence in cache or trigger webhook
        await this.updateUserPresence(
          documentName,
          context.user,
          "disconnected",
        );
      },

      async onChange({ documentName, context, document }) {
        // Notify about document changes
        await this.notifyDocumentChange(
          documentName,
          context.user,
          document,
        );
      },
    });
  }

  async start() {
    this.server.listen();
  }

  async stop() {
    await this.server.destroy();
  }

  private async updateUserPresence(
    documentName: string,
    user: any,
    action: string,
  ) {
    // Extract patient ID and section from document name
    const [, patientId, section] = documentName.split(":");

    // Trigger internal webhook for presence update
    try {
      await this.httpService.axiosRef.post(
        "http://localhost:3000/webhooks/collaboration/presence-updated",
        {
          patientId: parseInt(patientId),
          section,
          userId: user.id,
          userName: user.name,
          action,
          timestamp: new Date().toISOString(),
        },
      );
    } catch (error) {
      console.error("Failed to update presence:", error);
    }
  }

  private async notifyDocumentChange(
    documentName: string,
    user: any,
    document: any,
  ) {
    // Extract patient ID and section from document name
    const [, patientId, section] = documentName.split(":");

    // Trigger internal webhook for document change
    try {
      await this.httpService.axiosRef.post(
        "http://localhost:3000/webhooks/collaboration/document-changed",
        {
          patientId: parseInt(patientId),
          section,
          userId: user.id,
          documentLength: document.getText().length,
          timestamp: new Date().toISOString(),
        },
      );
    } catch (error) {
      console.error("Failed to notify document change:", error);
    }
  }
}
```

## Webhook Specifications

### Enhanced Webhook Event Types

```yaml
webhook_events:
  alert_events:
    - event: "alert.synced"
      description: "Alert synchronized from hospital system"
      payload:
        alertId: string
        patientId: string (hospital patient ID)
        internalPatientId: integer (RELEVO patient ID)
        type: string
        level: string
        status: string
        syncedAt: datetime
        timestamp: datetime

    - event: "alert.sync.requested"
      description: "Manual alert sync requested"
      payload:
        patientId: integer (optional)
        requestedBy: string
        syncJobId: string
        timestamp: datetime

    - event: "alert.sync.completed"
      description: "Alert sync job completed"
      payload:
        syncJobId: string
        alertCount: integer
        status: string
        duration: integer
        timestamp: datetime

    - event: "alert.sync.failed"
      description: "Alert sync job failed"
      payload:
        syncJobId: string
        error: string
        timestamp: datetime

  patient_events:
    - event: "patient.created"
      description: "New patient admitted"
      payload:
        patientId: integer
        patientData: Patient
        admissionType: string
        timestamp: datetime

    - event: "patient.updated"
      description: "Patient information updated"
      payload:
        patientId: integer
        changes: object
        updatedBy: string
        timestamp: datetime

    - event: "patient.severity_changed"
      description: "Patient illness severity changed"
      payload:
        patientId: integer
        oldSeverity: string
        newSeverity: string
        changedBy: string
        timestamp: datetime

    - event: "patient.alerts_updated"
      description: "Patient alerts were updated from hospital system"
      payload:
        patientId: integer
        newAlerts: integer
        resolvedAlerts: integer
        totalActiveAlerts: integer
        lastSyncedAt: datetime
        timestamp: datetime

  ipass_events:
    - event: "ipass.section.updated"
      description: "I-PASS section updated"
      payload:
        patientId: integer
        section: string
        content: object
        version: integer
        updatedBy: string
        isAutoSave: boolean
        isCollaborative: boolean
        timestamp: datetime

    - event: "ipass.section.completed"
      description: "I-PASS section marked as complete"
      payload:
        patientId: integer
        section: string
        completedBy: string
        timestamp: datetime

    - event: "ipass.handover.completed"
      description: "Full handover process completed"
      payload:
        patientId: integer
        sessionId: string
        handedOverBy: string
        receivedBy: string
        completionTime: datetime

  collaboration_events:
    - event: "collaboration.user_joined"
      description: "User joined patient collaboration"
      payload:
        patientId: integer
        userId: string
        userName: string
        userRole: string
        timestamp: datetime

    - event: "collaboration.user_left"
      description: "User left patient collaboration"
      payload:
        patientId: integer
        userId: string
        timestamp: datetime

    - event: "collaboration.document_edited"
      description: "Collaborative document edited"
      payload:
        documentId: string
        patientId: integer
        section: string
        userId: string
        changeType: string
        timestamp: datetime

    - event: "collaboration.presence_updated"
      description: "User presence status changed"
      payload:
        patientId: integer
        userId: string
        isActive: boolean
        currentSection: string
        timestamp: datetime

  session_events:
    - event: "session.started"
      description: "Handover session started"
      payload:
        sessionId: string
        userId: string
        patientIds: array
        shiftType: string
        unit: string
        startTime: datetime

    - event: "session.completed"
      description: "Handover session completed"
      payload:
        sessionId: string
        userId: string
        duration: integer
        completedPatients: integer
        timestamp: datetime

  system_events:
    - event: "daily.setup.completed"
      description: "Daily setup workflow completed"
      payload:
        userId: string
        doctorName: string
        unit: string
        shift: string
        selectedPatients: array
        timestamp: datetime

    - event: "hospital.api.health_check"
      description: "Hospital API health check result"
      payload:
        healthy: boolean
        responseTime: integer
        error: string (optional)
        timestamp: datetime

    - event: "system.error"
      description: "System error occurred"
      payload:
        errorType: string
        errorMessage: string
        userId: string
        context: object
        timestamp: datetime

  external_integration_events:
    - event: "hospital.alert.received"
      description: "Alert received from hospital system"
      payload:
        hospitalPatientId: string
        internalPatientId: integer
        alertData: object
        source: string
        timestamp: datetime

    - event: "hospital.api.error"
      description: "Error communicating with hospital API"
      payload:
        endpoint: string
        errorCode: integer
        errorMessage: string
        patientId: string (optional)
        timestamp: datetime
```

### Enhanced Webhook Controller

```typescript
// Enhanced Webhook Controller with Alert Integration
@Controller("webhooks")
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly cacheService: CacheService,
    private readonly collaborationService: CollaborationService,
    private readonly alertSyncService: AlertSyncService,
  ) {}

  // Existing webhook handlers...
  @Post("patient/updated")
  @HttpCode(200)
  async handlePatientUpdated(
    @Body() payload: PatientUpdatedPayload,
  ) {
    // Process patient update
    await this.webhookService.processPatientUpdate(payload);

    // Clear related cache
    await this.cacheService.clearPatientCache(
      payload.patientId,
    );

    // Trigger alert sync for updated patient
    await this.alertSyncService.syncPatientAlerts(
      payload.hospitalPatientId,
    );

    // Emit real-time event
    this.webhookService.emitRealTimeEvent(
      "patient.updated",
      payload,
    );

    return { status: "processed" };
  }

  // New alert-specific webhooks
  @Post("alert/synced")
  @HttpCode(200)
  async handleAlertSynced(@Body() payload: AlertSyncedPayload) {
    // Process synced alert
    await this.webhookService.processAlertSync(payload);

    // Update patient alert cache
    await this.cacheService.updatePatientAlerts(
      payload.internalPatientId,
      payload,
    );

    // Add activity feed entry
    await this.collaborationService.addActivityItem(
      payload.internalPatientId,
      {
        id: generateId(),
        type: "alert_updated",
        userId: "system",
        section: null,
        details: {
          alertType: payload.type,
          alertLevel: payload.level,
          alertStatus: payload.status,
        },
        timestamp: new Date(payload.timestamp),
      },
    );

    return { status: "processed" };
  }

  @Post("alert/sync/requested")
  @HttpCode(200)
  async handleAlertSyncRequested(
    @Body() payload: AlertSyncRequestPayload,
  ) {
    // Log sync request
    await this.webhookService.logAlertSyncRequest(payload);

    // Update sync status cache
    await this.cacheService.updateSyncStatus(
      payload.syncJobId,
      "in_progress",
    );

    return { status: "processed" };
  }

  @Post("alert/sync/completed")
  @HttpCode(200)
  async handleAlertSyncCompleted(
    @Body() payload: AlertSyncCompletedPayload,
  ) {
    // Process sync completion
    await this.webhookService.processAlertSyncCompletion(
      payload,
    );

    // Update sync status cache
    await this.cacheService.updateSyncStatus(
      payload.syncJobId,
      "completed",
    );

    // Emit completion event
    this.webhookService.emitRealTimeEvent(
      "alert.sync.completed",
      payload,
    );

    return { status: "processed" };
  }

  @Post("hospital/api/error")
  @HttpCode(200)
  async handleHospitalApiError(
    @Body() payload: HospitalApiErrorPayload,
  ) {
    // Log hospital API error
    await this.webhookService.logHospitalApiError(payload);

    // If critical error, switch to mock data mode temporarily
    if (payload.errorCode >= 500) {
      await this.webhookService.activateTemporaryMockMode(
        payload.endpoint,
      );
    }

    return { status: "processed" };
  }

  // Existing collaboration and other webhooks remain the same...
}
```

## Caching Strategy

### Enhanced Cache Strategy with Alert Management

```typescript
// Enhanced Cache Strategy Service with Alert Support
@Injectable()
export class CacheStrategyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Alert Caching
  async cachePatientAlerts(
    patientId: number,
    alerts: Alert[],
    ttl: number = 300,
  ) {
    const cacheKey = `alerts:${patientId}`;
    await this.cacheManager.set(cacheKey, alerts, ttl);
  }

  async getPatientAlerts(
    patientId: number,
  ): Promise<Alert[] | null> {
    const cacheKey = `alerts:${patientId}`;
    return await this.cacheManager.get<Alert[]>(cacheKey);
  }

  async updatePatientAlerts(
    patientId: number,
    newAlert: Alert,
  ) {
    const cacheKey = `alerts:${patientId}`;
    const existingAlerts =
      (await this.cacheManager.get<Alert[]>(cacheKey)) || [];

    // Update or add the alert
    const alertIndex = existingAlerts.findIndex(
      (alert) => alert.id === newAlert.id,
    );
    if (alertIndex >= 0) {
      existingAlerts[alertIndex] = newAlert;
    } else {
      existingAlerts.push(newAlert);
    }

    // Sort by creation timestamp (newest first)
    existingAlerts.sort(
      (a, b) =>
        new Date(b.creationDetails.timestamp).getTime() -
        new Date(a.creationDetails.timestamp).getTime(),
    );

    await this.cacheManager.set(cacheKey, existingAlerts, 300);
  }

  // Alert Sync Status Caching
  async cacheSyncStatus(
    syncJobId: string,
    status: any,
    ttl: number = 1800,
  ) {
    const cacheKey = `sync:${syncJobId}`;
    await this.cacheManager.set(cacheKey, status, ttl);
  }

  async getSyncStatus(syncJobId: string): Promise<any> {
    const cacheKey = `sync:${syncJobId}`;
    return await this.cacheManager.get(cacheKey);
  }

  async updateSyncStatus(syncJobId: string, status: string) {
    const cacheKey = `sync:${syncJobId}`;
    const existingStatus =
      (await this.cacheManager.get(cacheKey)) || {};

    const updatedStatus = {
      ...existingStatus,
      status,
      lastUpdated: new Date().toISOString(),
    };

    await this.cacheManager.set(cacheKey, updatedStatus, 1800); // 30 minutes TTL
  }

  // Hospital API Health Caching
  async cacheHospitalApiHealth(
    endpoint: string,
    health: any,
    ttl: number = 60,
  ) {
    const cacheKey = `hospital:health:${endpoint}`;
    await this.cacheManager.set(cacheKey, health, ttl);
  }

  async getHospitalApiHealth(endpoint: string): Promise<any> {
    const cacheKey = `hospital:health:${endpoint}`;
    return await this.cacheManager.get(cacheKey);
  }

  // Enhanced Patient Data Caching with Alerts
  async getPatientWithCache(
    patientId: number,
  ): Promise<PatientWithAlerts> {
    const cacheKey = `patient:${patientId}`;

    let patient =
      await this.cacheManager.get<PatientWithAlerts>(cacheKey);

    if (!patient) {
      // Fetch patient from backend
      patient = await this.fetchPatientFromBackend(patientId);

      // Fetch alerts separately and combine
      const alerts = await this.getPatientAlerts(patientId);
      if (alerts) {
        patient.alerts = alerts;
      }

      await this.cacheManager.set(cacheKey, patient, 300);
    }

    return patient;
  }

  // Enhanced cache invalidation for alert features
  async invalidatePatientCache(patientId: number) {
    const patterns = [
      `patient:${patientId}`,
      `alerts:${patientId}`,
      `ipass:${patientId}:*`,
      `activity:${patientId}`,
      `presence:${patientId}:*`,
      `document:ipass:${patientId}:*`,
      `collab:ipass:${patientId}:*`,
    ];

    const keysToDelete =
      await this.getKeysForPatterns(patterns);
    await Promise.all(
      keysToDelete.map((key) => this.cacheManager.del(key)),
    );
  }

  // Cache metrics including alert features
  async getCacheMetrics(): Promise<EnhancedCacheMetrics> {
    const store = this.cacheManager.store as any;

    // Count different types of cached items
    const allKeys = await this.getAllKeys();
    const documentKeys = allKeys.filter((key) =>
      key.startsWith("document:"),
    );
    const collaborationKeys = allKeys.filter((key) =>
      key.startsWith("collab:"),
    );
    const presenceKeys = allKeys.filter((key) =>
      key.startsWith("presence:"),
    );
    const alertKeys = allKeys.filter((key) =>
      key.startsWith("alerts:"),
    );
    const syncKeys = allKeys.filter((key) =>
      key.startsWith("sync:"),
    );
    const hospitalHealthKeys = allKeys.filter((key) =>
      key.startsWith("hospital:health:"),
    );

    return {
      totalSize: store.size || 0,
      maxSize: store.max || 0,
      documentsCached: documentKeys.length,
      activeCollaborations: collaborationKeys.length,
      activePresence: presenceKeys.length,
      cachedAlerts: alertKeys.length,
      activeSyncJobs: syncKeys.length,
      hospitalHealthChecks: hospitalHealthKeys.length,
      hitRate: await this.calculateHitRate(),
      memoryUsage: process.memoryUsage(),
    };
  }

  // Helper methods remain the same...
  private async getKeysMatchingPattern(
    pattern: string,
  ): Promise<string[]> {
    const allKeys = await this.getAllKeys();
    const regex = new RegExp(pattern.replace("*", ".*"));
    return allKeys.filter((key) => regex.test(key));
  }

  private async getAllKeys(): Promise<string[]> {
    // This would need to be implemented based on the cache store
    return [];
  }

  private async getKeysForPatterns(
    patterns: string[],
  ): Promise<string[]> {
    const allKeys: string[] = [];
    for (const pattern of patterns) {
      const keys = await this.getKeysMatchingPattern(pattern);
      allKeys.push(...keys);
    }
    return [...new Set(allKeys)];
  }

  private async calculateHitRate(): Promise<number> {
    return 0.85; // 85% hit rate example
  }

  private async fetchPatientFromBackend(
    patientId: number,
  ): Promise<PatientWithAlerts> {
    const response = await fetch(
      `${process.env.CSHARP_API_URL}/patients/${patientId}?includeAlerts=true`,
    );
    return response.json();
  }
}

interface PatientWithAlerts extends Patient {
  alerts: Alert[];
}

interface EnhancedCacheMetrics {
  totalSize: number;
  maxSize: number;
  documentsCached: number;
  activeCollaborations: number;
  activePresence: number;
  cachedAlerts: number;
  activeSyncJobs: number;
  hospitalHealthChecks: number;
  hitRate: number;
  memoryUsage: NodeJS.MemoryUsage;
}
```

## Security & Compliance

### Enhanced HIPAA Compliance Framework

```yaml
security_framework:
  authentication:
    primary_backend: "C# Backend with JWT"
    external_api_integration:
      - "Hospital API key management"
      - "Service-to-service authentication for alert APIs"
      - "Token refresh for long-running sync processes"

    hocuspocus_integration:
      - "JWT token validation for WebSocket connections"
      - "User context verification on document access"
      - "Session-based authentication tracking"

  data_protection:
    in_transit:
      - "TLS 1.3 for all HTTP communications"
      - "WSS (WebSocket Secure) for Hocuspocus"
      - "Encrypted communication with hospital APIs"
      - "Certificate pinning for external integrations"

    at_rest:
      - "Database encryption (PostgreSQL TDE)"
      - "Alert data encryption"
      - "Y.js document state encryption"
      - "Cache data encryption for sensitive information"

  access_control:
    alert_management:
      - "Role-based alert access control"
      - "Unit-based alert filtering"
      - "Patient assignment-based alert visibility"
      - "Alert sync audit logging"

    collaborative_documents:
      - "Document-level access control"
      - "Real-time permission checking"
      - "User presence validation"
      - "Edit permission verification"

    external_api_access:
      - "Hospital API rate limiting"
      - "Service account permissions"
      - "API endpoint monitoring"
      - "Fallback to mock data on API failures"

  audit_logging:
    alert_tracking:
      - "All alert synchronization activities"
      - "External API calls and responses"
      - "Alert status changes"
      - "Mock data usage periods"

    collaborative_tracking:
      - "All collaborative sessions logged"
      - "Document edit tracking"
      - "User presence monitoring"
      - "WebSocket connection auditing"

    comprehensive_tracking:
      - "All API calls logged"
      - "Webhook deliveries tracked"
      - "EMR integration activities"
      - "Cache access patterns"

compliance_endpoints:
  c_sharp_backend:
    - "/audit/patient-access/{patientId}"
    - "/audit/alert-access/{alertId}"
    - "/audit/collaborative-sessions/{documentId}"
    - "/compliance/hipaa-report"
    - "/compliance/alert-audit"
    - "/compliance/external-api-usage"

  nestjs_service:
    - "/audit/webhook-deliveries"
    - "/audit/hocuspocus-connections"
    - "/audit/hospital-api-calls"
    - "/audit/alert-sync-jobs"
    - "/compliance/real-time-activity"
    - "/compliance/mock-data-usage"

external_api_security:
  hospital_api_integration:
    - endpoint: "Hospital Alert API"
      authentication: "Bearer Token"
      rate_limiting: "100 requests/minute"
      timeout: "10 seconds"
      fallback: "Mock data service"
      monitoring: "Health checks every 60 seconds"

    - endpoint: "EMR Integration API"
      authentication: "API Key + OAuth"
      rate_limiting: "50 requests/minute"
      timeout: "30 seconds"
      fallback: "Cached data"
      monitoring: "Health checks every 300 seconds"
```

## Deployment & Infrastructure

### Enhanced Multi-Service Architecture

```yaml
# docker-compose.yml for integrated system with external API support
version: '3.8'
services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: relevo
      POSTGRES_USER: relevo
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

  # C# Backend (Main API)
  csharp-backend:
    build: ./csharp-backend
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=${DB_CONNECTION_STRING}
      - JwtSettings__SecretKey=${JWT_SECRET}
      - NestJSService__BaseUrl=http://nestjs-service:3000
      - HospitalApi__BaseUrl=${HOSPITAL_API_URL}
      - HospitalApi__ApiKey=${HOSPITAL_API_KEY}
    depends_on:
      - postgres
    restart: unless-stopped

  # NestJS Service with Integrated Hocuspocus and External API Integration
  nestjs-service:
    build: ./nestjs-service
    ports:
      - "3000:3000"  # HTTP API
      - "3002:3002"  # Hocuspocus WebSocket
    environment:
      - NODE_ENV=development
      - DATABASE_URL=${DB_CONNECTION_STRING}
      - CSHARP_API_URL=http://csharp-backend:5000
      - JWT_SECRET=${JWT_SECRET}
      - SERVICE_TOKEN=${SERVICE_JWT_TOKEN}
      - CACHE_TTL=300
      - HOCUSPOCUS_PORT=3002
      - HOSPITAL_API_URL=${HOSPITAL_API_URL}
      - HOSPITAL_API_KEY=${HOSPITAL_API_KEY}
      - ALERT_SYNC_INTERVAL=300000  # 5 minutes
    depends_on:
      - postgres
      - csharp-backend
    restart: unless-stopped

  # React Frontend
  react-frontend:
    build: ./react-frontend
    ports:
      - "3001:3001"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
      - REACT_APP_NESTJS_URL=http://localhost:3000
      - REACT_APP_HOCUSPOCUS_URL=ws://localhost:3002
      - REACT_APP_ENABLE_MOCK_ALERTS=true
    depends_on:
      - csharp-backend
      - nestjs-service
    restart: unless-stopped

volumes:
  postgres_data:

---
# Kubernetes deployment for production
apiVersion: apps/v1
kind: Deployment
metadata:
  name: relevo-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: relevo-system
  template:
    metadata:
      labels:
        app: relevo-system
    spec:
      containers:
      # PostgreSQL
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: "relevo"
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: db-user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: db-password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data

      # C# Backend
      - name: csharp-backend
        image: relevo/csharp-backend:latest
        env:
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: connection-string
        - name: JwtSettings__SecretKey
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: jwt-secret
        - name: HospitalApi__ApiKey
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: hospital-api-key
        ports:
        - containerPort: 5000

      # NestJS Service with Integrated Hocuspocus and Alert Sync
      - name: nestjs-service
        image: relevo/nestjs-service:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: connection-string
        - name: CSHARP_API_URL
          value: "http://localhost:5000"
        - name: SERVICE_TOKEN
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: service-token
        - name: HOSPITAL_API_KEY
          valueFrom:
            secretKeyRef:
              name: relevo-secrets
              key: hospital-api-key
        ports:
        - containerPort: 3000  # HTTP API
        - containerPort: 3002  # Hocuspocus WebSocket

      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

## Implementation Roadmap

### Phase 1: Foundation & Alert Integration (Months 1-2)

- **C# Backend Development**

  - Authentication & authorization system
  - Patient management APIs with hospital patient ID mapping
  - Alert management endpoints
  - Database schema implementation with alert tables
  - Document management endpoints for Hocuspocus

- **NestJS Service Setup**
  - Webhook management infrastructure
  - Cache manager integration
  - Basic collaboration endpoints
  - Hocuspocus server integration
  - Hospital API service implementation
  - Alert synchronization service with mock data fallback

### Phase 2: External API Integration & Collaborative Features (Months 2-3)

- **Hospital API Integration**

  - External alert API connectivity
  - Health check monitoring
  - Fallback to mock data system
  - Alert synchronization scheduling
  - API error handling and recovery

- **Enhanced Collaboration**
  - Document collaboration within NestJS service
  - Tiptap integration with React components
  - User presence tracking
  - Document persistence with C# backend
  - Real-time sync status management

### Phase 3: Advanced Features & Real-time Enhancement (Months 3-4)

- **Enhanced Collaboration**

  - Discussion threads and comments
  - Activity feed with collaborative and alert actions
  - Advanced presence indicators
  - Conflict resolution mechanisms

- **Alert Management Enhancement**
  - Alert-based notifications
  - Alert severity integration with I-PASS workflow
  - Historical alert tracking
  - Alert correlation with patient status changes

### Phase 4: Production Readiness & Monitoring (Months 4-6)

- **HIPAA Compliance**

  - Comprehensive audit trails including collaboration and alerts
  - Security enhancements for WebSocket connections and external APIs
  - Compliance reporting with collaborative and alert metrics

- **Monitoring & Observability**
  - Collaborative session monitoring
  - Document performance metrics
  - Real-time connection health checks
  - Hospital API monitoring and alerting
  - Alert synchronization performance tracking

This updated backend documentation provides a complete architecture specification with proper external hospital API integration for alerts, eliminating the confusion about real-time vital signs while maintaining all collaborative functionality and supporting the transition from static to real-time features with proper external system integration.