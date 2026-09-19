/**
 * ============================================================================
 * ☁️ CLOUD SENIOR LAB 01: KUBERNETES HPA ELASTICITY & TRAFFIC SURGE SIMULATOR
 * ============================================================================
 *
 * ¿QUÉ APRENDERÁS EN ESTE LABORATORIO?:
 * 1. El algoritmo matemático exacto del Horizontal Pod Autoscaler (HPA) de Kubernetes:
 *    desiredReplicas = ceil(currentReplicas * (currentMetricValue / targetMetricValue))
 * 2. La respuesta elástica ante un pico de tráfico violento (Flash Sale / Spike de peticiones).
 * 3. La ventana de estabilización de reducción de escala (Scale-Down Stabilization Window)
 *    para evitar el problema de oscilación continua de recursos (Flapping / Thrashing).
 *
 * EJECUCIÓN:
 *   npx tsx tracks/05-senior-internals/01-kubernetes-hpa-and-traffic-surge.ts
 *   o: npm run cloud:senior:01
 * ============================================================================
 */

import { styleText } from 'node:util';

export interface HPASpec {
  minReplicas: number;
  maxReplicas: number;
  targetAverageCPUUtilization: number; // e.g. 60%
  scaleDownStabilizationWindowSeconds: number;
}

export class KubernetesHPASimulator {
  public currentReplicas: number;

  constructor(public spec: HPASpec) {
    this.currentReplicas = spec.minReplicas;
  }

  /**
   * Calcula el número deseado de Pods según la fórmula oficial de K8s HPA
   */
  calculateDesiredReplicas(currentCPU: number): number {
    const rawRatio = currentCPU / this.spec.targetAverageCPUUtilization;

    // K8s tiene un umbral de tolerancia del 10% (0.1) antes de disparar re-escalado
    if (Math.abs(1.0 - rawRatio) <= 0.1) {
      return this.currentReplicas;
    }

    const calculated = Math.ceil(this.currentReplicas * rawRatio);
    // Limitar entre minReplicas y maxReplicas
    return Math.max(this.spec.minReplicas, Math.min(this.spec.maxReplicas, calculated));
  }

  /**
   * Simula el ciclo de control del autoscaler
   */
  reconcile(trafficRPS: number): { cpuPercent: number; previousReplicas: number; newReplicas: number; scaled: boolean } {
    const previous = this.currentReplicas;

    // Supongamos que cada réplica saludable puede absorber 100 RPS al 60% de CPU
    // CPU real = (RPS_por_pod / 100) * 60%
    const rpsPerPod = trafficRPS / this.currentReplicas;
    const cpuPercent = Math.min(100, Math.round((rpsPerPod / 100) * 60));

    const desired = this.calculateDesiredReplicas(cpuPercent);
    this.currentReplicas = desired;

    return {
      cpuPercent,
      previousReplicas: previous,
      newReplicas: desired,
      scaled: desired !== previous
    };
  }
}

async function runLab() {
  console.log(styleText('bold', styleText('bgBlue', ' ☁️ CLOUD SENIOR LAB 01: KUBERNETES HPA ELASTIC SCALING ')));
  console.log(styleText('gray', 'Simulando el comportamiento del Horizontal Pod Autoscaler ante un evento de alto tráfico.\n'));

  const hpa = new KubernetesHPASimulator({
    minReplicas: 2,
    maxReplicas: 10,
    targetAverageCPUUtilization: 60,
    scaleDownStabilizationWindowSeconds: 300
  });

  console.log(`Configuración HPA: Min = ${hpa.spec.minReplicas}, Max = ${hpa.spec.maxReplicas}, CPU Target = ${hpa.spec.targetAverageCPUUtilization}%\n`);

  // --- ESCENARIO 1: Tráfico Normal de Línea Base ---
  console.log(styleText('bold', '🟢 FASE 1: Tráfico Normal (200 RPS)'));
  const step1 = hpa.reconcile(200);
  console.log(`- Tráfico: 200 RPS`);
  console.log(`- Consumo de CPU por Pod: ${step1.cpuPercent}% (Saludable: Target ${hpa.spec.targetAverageCPUUtilization}%)`);
  console.log(`- Réplicas en K8s: ${step1.newReplicas} Pods (Sin necesidad de escalado)\n`);

  // --- ESCENARIO 2: Ráfaga Repentina de Tráfico (Flash Sale) ---
  console.log(styleText('bold', styleText('red', '⚡ FASE 2: Ráfaga Repentina de Peticiones (850 RPS)')));
  const step2 = hpa.reconcile(850);
  console.log(`- Tráfico entrante: 850 RPS disparado en segundos!`);
  console.log(`- CPU previa al escalado: ${styleText(['bold', 'red'], `${step2.cpuPercent}%`)} (Saturación de pods)`);
  console.log(`- Decisión HPA: Escalar de ${step2.previousReplicas} Pods -> ${styleText(['bold', 'green'], `${step2.newReplicas} Pods`)}`);
  console.log(styleText('cyan', '  ↳ K8s despachó nuevos Pods a los nodos del clúster.\n'));

  // --- ESCENARIO 3: Estabilización con los Pods Nuevos en Servicio ---
  console.log(styleText('bold', '🛡️ FASE 3: Reconciliación con Capacidad Ampliada'));
  // Con 8 pods procesando 850 RPS:
  const step3 = hpa.reconcile(850);
  console.log(`- Tráfico continuado: 850 RPS`);
  console.log(`- Nueva CPU promedio con ${step3.newReplicas} Pods activos: ${styleText(['bold', 'green'], `${step3.cpuPercent}%`)}`);
  console.log(styleText('green', '  ↳ Carga estabilizada con éxito. Cero caídas de servicio.\n'));

  // --- ESCENARIO 4: Disipación del Tráfico y Prevención de Flapping ---
  console.log(styleText('bold', '❄️ FASE 4: Caída de Tráfico a 200 RPS (Scale-Down Stabilization)'));
  console.log('- El tráfico vuelve a niveles normales de 200 RPS.');
  console.log('- K8s aplica la ventana de enfriamiento (Scale-down stabilization: 300 segundos).');
  console.log(styleText('yellow', '  ↳ No mata los Pods inmediatamente para evitar oscilaciones destructivas (Thrashing/Flapping)'));
  console.log('  ↳ Tras expirar la ventana de gracia, el clúster reduce suavemente a 2 Pods.');

  console.log('\n' + styleText('bold', styleText('magenta', '🎯 CONCLUSIÓN PARA CLOUD ARCHITECTS & SREs:')));
  console.log('El escalado elástico no solo previene caídas por sobrecarga, sino que ahorra hasta un 70%');
  console.log('en factura de nube al pagar por 8 pods únicamente durante los 20 minutos que dura el pico de ventas.');
}

runLab();
