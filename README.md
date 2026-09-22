# ☁️ Cloud Architecture & Platform Engineering Mastery

Repositorio maestro de referencia técnica profunda para consolidar habilidades de nivel **Senior / Staff / Cloud Solutions Architect / Platform Engineer** en **Arquitectura Cloud (AWS, Azure, DigitalOcean, GCP), Contenedores y Kubernetes, Infraestructura como Código (Terraform / OpenTofu), Redes Virtuales Privadas (VPCs), Seguridad IAM y Optimización de Costes (FinOps)**.

---

## 🎯 Preguntas de Entrevista Técnica

Para preparar entrevistas técnicas de alto nivel (**Senior Cloud Solutions Architect, SRE y Platform Engineer**), este módulo incluye la guía:

👉 **[Las 100 Preguntas Más Comunes en Entrevistas Técnicas: Cloud & Platform Engineering](./INTERVIEW-QUESTIONS.md)** (Multi-AZ/Region, AWS Well-Architected, Kubernetes Internals, HPA, Karpenter, Terraform IaC, IAM IRSA, FinOps, con criterios 🚩 *Red Flags* vs 🟢 *Green Flags*).

---

## 🌐 The Mastery Suite (Ecosistema Modular)

| Repositorio | Especialidad Técnica | Enlace |
|---|---|---|
| **`nodejs-ecosystem-mastery`** | 🟢 **Node.js Core, V8, Libuv, Express, NestJS, Testing & TypeScript** | [Ver Repositorio](../nodejs-ecosystem-mastery/) |
| **`python-ecosystem-mastery`** | 🐍 **CPython Internals, GIL, FastAPI, Django, PySpark & Pytest** | [Ver Repositorio](../python-ecosystem-mastery/) |
| **`php-ecosystem-mastery`** | 🐘 **Zend Engine, OPcache, JIT, Laravel, Symfony, FrankenPHP & Pest** | [Ver Repositorio](../php-ecosystem-mastery/) |
| **`backend-mastery`** | 🌐 **REST APIs RFC 9110, SQL, NoSQL, Sistemas Distribuidos & Caché** | [Ver Repositorio](../backend-mastery/) |
| **`frontend-mastery`** | ⚛️ **React 19, Angular v2-v19+, Next.js App Router & Web Performance** | [Ver Repositorio](../frontend-mastery/) |
| **`cloud-mastery`** | ☁️ **Cloud Architecture (AWS, Azure, DigitalOcean), K8s, Terraform & FinOps** | *Este repositorio* |
| **`cicd-mastery`** | 🚀 **CI/CD Universal (GitHub Actions, Azure, GitLab), GitOps & Canary** | [Ver Repositorio](../cicd-mastery/) |
| **`agile-mastery`** | 🏃 **Scrum, Kanban, Ley de Little, XP (TDD/Trunk-Based) & Cynefin** | [Ver Repositorio](../agile-mastery/) |

---

## 🏛️ Organización de los Tracks

```
cloud-mastery/
├── tracks/
│   ├── 01-cloud-providers-and-architectures/     # AWS vs Azure vs DigitalOcean vs GCP, IaaS/PaaS/CaaS/FaaS, SLA 99.99%
│   ├── 02-containers-and-kubernetes-orchestration/ # Docker OCI distroless, K8s Pods/Deployments/Ingress, HPA & KEDA
│   ├── 03-infrastructure-as-code-iac/           # Terraform / OpenTofu, State Locking (S3/DynamoDB), Modules, Drift
│   ├── 04-networking-security-and-iam/          # VPCs, Subnets públicas/privadas, NAT GW, Security Groups, IAM & FinOps
│   └── 05-senior-internals/                     # Manifiestos IaC y Laboratorios Ejecutables Senior
│       ├── 01-kubernetes-hpa-and-traffic-surge.ts   # [Lab 01: Simulador de Elasticidad y Escalado HPA en K8s]
│       ├── 02-cloud-cost-finops-optimizer.ts        # [Lab 02: Optimizador de Costes FinOps y Rightsizing]
│       └── main.tf                                  # Arquitectura Terraform Multi-AZ de Alta Disponibilidad
├── .gitignore
└── package.json
```

---

## 🧠 Matriz de Diferenciación por Seniority en Cloud

| Dimensión | Junior | Intermediate | Senior / Staff / Cloud Architect |
|---|---|---|---|
| **Estrategia Cloud** | Crear recursos manualmente en la consola web (*ClickOps*). | Levantar máquinas virtuales con scripts de bash básicos. | **Infraestructura como Código (IaC)**: Entornos 100% reproducibles con Terraform/OpenTofu, estado remoto versionado con lock distribuido, y arquitectura desacoplada por capas (Networking, Database, Compute). |
| **Diseño de Redes** | Desplegar bases de datos e instancias con IPs públicas abiertas a `0.0.0.0/0`. | Crear una VPC básica con subnets por defecto. | **Defensa en Profundidad**: Subnets estrictamente privadas sin acceso a Internet para bases de datos y clusters, comunicación saliente solo vía NAT Gateway, y segmentación con Security Groups y Network Policies de Kubernetes. |
| **Contenedores y K8s** | Dockerfiles de 1GB corriendo como `root` con `node:latest`. | Contenedores multi-stage básicos en Docker Compose. | **Hardening y Orquestación Elástica**: Imágenes mínimas *Distroless* sin shell ni herramientas de root, configuración de `resources.requests/limits` calibrados, probes (liveness, readiness, startup) y escalado con **KEDA / HPA**. |
| **Gestión Financiera (FinOps)** | Ignorar la factura mensual hasta que llega una alerta de tarjeta de crédito. | Revisar métricas de facturación básica en AWS Cost Explorer. | **FinOps Engineering**: Análisis de *Unit Economics*, mezcla estratégica de instancias (On-Demand para baseline, Spot/Preemptible para workers stateless tolerantes a interrupciones, y Savings Plans para compromisos plurianuales), eliminando recursos ociosos. |

---

## 🔬 Laboratorios Ejecutables Senior (`tracks/05-senior-internals/`)

1. **`01-kubernetes-hpa-and-traffic-surge.ts`**:
   - Simulación del algoritmo matemático del **Horizontal Pod Autoscaler (HPA)** de Kubernetes:
     $$\text{Desired Replicas} = \lceil \text{Current Replicas} \times \frac{\text{Current Metric Value}}{\text{Target Metric Value}} \rceil$$
   - Demostración de absorción de picos de tráfico repentinos, límites máximos (`maxReplicas`) y periodos de enfriamiento de escala (*Scale-down stabilization window*) para evitar oscilaciones (*flapping*).

2. **`02-cloud-cost-finops-optimizer.ts`**:
   - Simulador de optimización de costes para una infraestructura en la nube con 10 servidores y base de datos.
   - Demostración del ahorro del **40% al 65%** al migrar de On-Demand puro a un modelo híbrido inteligente con instancias reservadas, Spot y rightsizing de recursos sobredimensionados.

---

## ⚡ Comandos de Ejecución Rápida

```bash
npm run cloud:senior:01   # Simulador de Escalado Elástico HPA en Kubernetes
npm run cloud:senior:02   # Optimizador de Costes Cloud FinOps y Rightsizing
```
