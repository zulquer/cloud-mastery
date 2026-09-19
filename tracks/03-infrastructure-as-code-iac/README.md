# 🏛️ Cloud Level 03: Infraestructura como Código (IaC) con Terraform

Terraform / OpenTofu, gestión remota del estado (`tfstate`), bloqueos de concurrencia con DynamoDB, módulos y prevención de drift.

---

## 🏗️ 1. ¿Por qué Infraestructura como Código Declarativa?

En lugar de crear servidores haciendo clicks manuales en la consola web:
- **Reproducibilidad Inmediata**: Levantar un entorno idéntico de Staging o Disaster Recovery toma minutos.
- **Auditoría y Control de Versiones**: Toda modificación de infraestructura pasa por Pull Request y revisión por pares.
- **Detección de Drift**: `terraform plan` compara el estado del código con los recursos reales de la nube y detecta si alguien alteró algo manualmente.

---

## 🔒 2. El Estado de Terraform (`terraform.tfstate`) y State Locking

El archivo `tfstate` mapea los recursos declarados en el código con los identificadores reales en la nube (ej.: `aws_instance.web` -> `i-09f1a234`).

### Peligro Crítico: Concurrencia sin Bloqueo (*Corrupted State*)
Si dos desarrolladores o dos pipelines de CI ejecutan `terraform apply` al mismo tiempo sobre el mismo entorno, **el archivo de estado se corrompe de forma irreparable**.

### La Solución de Producción (Remote Backend con Lock):
```hcl
terraform {
  backend "s3" {
    bucket         = "empresa-terraform-state-prod"
    key            = "infrastructure/vpc-and-clusters.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-locks" # ¡Lock distribuido atómico!
    encrypt        = true
  }
}
```
- Antes de planificar o aplicar, Terraform adquiere un lock exclusivo en DynamoDB. Si otro pipeline intenta ejecutar, recibe un error inmediato y espera de forma segura.

---

## 🧩 3. Arquitectura Modular y Desacoplada

Nunca almacenes toda la infraestructura de la empresa en un único archivo `main.tf` de 2,000 líneas:
- **Módulo de Redes (Networking)**: VPCs, subnets, gateways (cambia 1 vez cada 6 meses).
- **Módulo de Datos (Persistence)**: Clusters PostgreSQL, Redis (cambia raramente; requiere protección contra borrado accidental).
- **Módulo de Cómputo (Applications)**: Kubernetes, balanceadores, autoscaling groups (cambia frecuentemente en cada release).
