# 🌐 Cloud Level 04: Redes (VPCs), Seguridad IAM y FinOps

Topología de redes virtuales privadas, subnets públicas vs privadas, NAT Gateways, principio de mínimo privilegio IAM y optimización financiera de costes (FinOps).

---

## 🛡️ 1. Topología Segura de VPC (Virtual Private Cloud)

El diseño de red de grado bancario y corporativo divide la VPC en capas aisladas:

```
                      [ INTERNET ]
                           |
                     [ Internet GW ]
                           |
     ================= SUBNET PÚBLICA =================
     [ Application Load Balancer (ALB) ]  [ NAT Gateway ]
     ===================================================
                           |
     ================= SUBNET PRIVADA =================
     [ Kubernetes Pods / Backend Apps ] (Sin IP Pública)
     (Tráfico saliente a Internet enrutado a través de NAT Gateway)
     ===================================================
                           |
     ============= SUBNET AISLADA DE DATOS =============
     [ PostgreSQL Database / Redis Cache ]
     (CERO acceso a Internet ni entrante ni saliente)
     (Solo accesible desde el Security Group del Backend)
     ===================================================
```

- Las bases de datos nunca tienen IP pública ni ruta al Internet Gateway.
- Si un servidor backend es comprometido, el atacante no puede acceder directamente a la base de datos desde el exterior.

---

## 🔑 2. IAM: El Principio de Mínimo Privilegio (Least Privilege)

- **Antipatrón**: Asignar permisos `AdministratorAccess` o políticas comodín (`"Action": "*"`) para que "las cosas funcionen rápido".
- **Regla Staff**: Cada microservicio o función Lambda debe tener un Rol IAM específico con permisos granulares acotados por recurso:
  - Un servicio de facturación solo debe tener permiso de lectura/escritura en la tabla DynamoDB `Invoices` y publicar en el topic SNS `InvoicesPaid`.

---

## 💰 3. Cloud FinOps: Optimización de Costes y Modelos de Precios

1. **On-Demand**: Máxima flexibilidad; coste por segundo sin compromiso. Es la opción más cara.
2. **Reserved Instances / Savings Plans**: Compromiso de consumo a 1 o 3 años a cambio de descuentos de entre el **30% y el 60%** en cargas de trabajo predecibles de base (*Baseline workload*).
3. **Spot Instances (AWS) / Preemptible VMs (GCP)**: Excedente de capacidad de los datacenters vendido con hasta un **70% a 90% de descuento**. El proveedor puede reclamar la máquina con 2 minutos de preaviso.
   - *Caso de Uso Óptimo*: Workers de procesamiento asíncrono, renderizado de vídeo, jobs de batch y entornos de prueba.
4. **Detección de Residuos (*Cloud Waste*)**: Eliminar volúmenes EBS huérfanos sin instancia asociada, snapshots obsoletos y balanceadores de carga sin tráfico.
