# ☁️ Cloud Level 01: Proveedores Cloud y Modelos de Servicio

Comparativa entre AWS, Azure, DigitalOcean y GCP, modelos IaaS/PaaS/CaaS/FaaS, cálculo de disponibilidad (SLA 99.99%) y resiliencia Multi-AZ.

---

## 🧭 1. Comparativa de los 4 Grandes Proveedores

| Dimensión | AWS (Amazon Web Services) | Microsoft Azure | DigitalOcean | Google Cloud (GCP) |
|---|---|---|---|---|
| **Puntos Fuertes** | Líder indiscutible en variedad de servicios (200+), madurez y adopción global. | Integración nativa con entornos empresariales Microsoft (Active Directory/Entra ID, O365). | **Simplicidad operativa**, precios predecibles, ideal para startups y prototipado rápido sin complejidad corporativa. | Excelencia en Data Analytics (BigQuery), Kubernetes gestionado nativo (GKE) e Inteligencia Artificial. |
| **Computación Clave** | EC2, ECS, EKS, Lambda, App Runner | VMs, AKS, Container Apps, Azure Functions | Droplets, DOKS (Kubernetes), App Platform | Compute Engine, GKE, Cloud Run, Cloud Functions |
| **Bases de Datos** | RDS, Aurora, DynamoDB, ElastiCache | Azure SQL, Cosmos DB, Azure Database for PostgreSQL | Managed Databases (PostgreSQL, MySQL, Redis, Kafka) | Cloud SQL, Spanner, Firestore, Memorystore |

---

## 📦 2. Modelos de Servicio: De IaaS a Serverless

```
 [ IaaS ] -> [ CaaS ] -> [ PaaS ] -> [ FaaS / Serverless ]
  (Control Máximo)                  (Velocidad Máxima)
```

1. **IaaS (Infrastructure as Service)**:
   - Máquinas virtuales (AWS EC2, DigitalOcean Droplets). El ingeniero administra el sistema operativo, parches de seguridad del kernel y red interna.
2. **CaaS (Containers as Service)**:
   - Orquestación de contenedores gestionada (AWS ECS Fargate, Azure Container Apps, Google Cloud Run). No administras máquinas; sólo ejecutas imágenes Docker pagando por segundo de CPU y memoria.
3. **PaaS (Platform as Service)**:
   - Plataformas gestionadas (DigitalOcean App Platform, Heroku, AWS Elastic Beanstalk). Subes código fuente Git y la plataforma compila, despliega y escala automáticamente.
4. **FaaS (Function as Service / Serverless)**:
   - Funciones efímeras invocadas por eventos HTTP o colas (AWS Lambda, Azure Functions). Escala a cero cuando no hay tráfico; coste $0 en reposo.

---

## 🛡️ 3. Cálculo de Alta Disponibilidad y Resiliencia

### Los "Nueves" de Disponibilidad:
- **99.9% (Tres Nueves)**: Permite hasta 8.76 horas de caída al año.
- **99.99% (Cuatro Nueves - Estándar Senior)**: Permite un máximo de **52.56 minutos de caída al año**.
- **99.999% (Cinco Nueves - Grado Telecomunicaciones/Bancario)**: Permite solo **5.26 minutos de caída al año**.

### Regla Arquitectónica Multi-AZ:
Un datacenter individual **puede sufrir incendios, inundaciones o cortes masivos de red**.
- **Nunca desplegar en una sola Zona de Disponibilidad (AZ)**.
- Desplegar siempre instancias y bases de datos con réplicas sincronizadas en al menos **2 o 3 Zonas de Disponibilidad independientes** dentro de la misma región.
