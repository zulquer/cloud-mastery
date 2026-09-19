# 🐳 Cloud Level 02: Contenedores OCI y Orquestación con Kubernetes

Dockerfiles multi-stage de producción, Distroless, Pods, Deployments, Services, Ingress y Autoscaling con HPA y KEDA.

---

## 🔒 1. Dockerfiles Seguros y de Mínimo Tamaño

### Antipatrón Junior:
```dockerfile
# Antipatrón: 1.2GB de tamaño, corre como root, incluye compilers y bash vulnerables
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
```

### Patrón Senior Multi-Stage Distroless:
```dockerfile
# Etapa 1: Compilación
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

# Etapa 2: Runtime de producción mínimo y seguro
FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER nonroot:nonroot
EXPOSE 3000
CMD ["dist/main.js"]
```
- **Tamaño reducido de 1.2GB a ~85MB**.
- **Superficie de ataque mínima**: Cero shell (`sh`, `bash`), cero package managers (`apt`, `apk`), y ejecución bajo usuario sin privilegios (`nonroot`).

---

## ☸️ 2. Primitivas Fundamentales de Kubernetes

1. **Pod**: La unidad más pequeña de computación en K8s. Agrupa uno o más contenedores que comparten la misma IP y volúmenes de almacenamiento.
2. **Deployment**: Gestiona el ciclo de vida declarativo de los Pods (número de réplicas, actualizaciones Rolling Update progresivas y rollbacks automáticos).
3. **Service (ClusterIP, NodePort, LoadBalancer)**: Abstracción de red que proporciona una IP virtual estable y balanceo de carga interno entre los Pods dinámicos.
4. **Ingress**: Controlador que enruta el tráfico HTTP/HTTPS exterior hacia los servicios internos basándose en nombres de host y rutas URL (`api.empresa.com/v1`).

---

## 📈 3. Escalado Automático: HPA y KEDA

- **Horizontal Pod Autoscaler (HPA)**: Ajusta el número de Pods según métricas tradicionales de consumo de recursos (CPU y Memoria).
- **KEDA (Kubernetes Event-driven Autoscaling)**: Permite escalar Pods basándose en métricas de eventos reales de negocio:
  - Número de mensajes encolados en RabbitMQ / Kafka / AWS SQS.
  - Tasa de peticiones por segundo en Redis.
  - Si la cola está vacía, KEDA puede escalar los Pods a **cero réplicas**, ahorrando el 100% del coste.
