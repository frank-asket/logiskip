export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ShapFactor {
  name: string;
  impact: number; // positive increases risk, negative decreases risk
  category: 'financial' | 'geopolitical' | 'operational' | 'capacity' | 'weather';
  detail: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  category: string;
  tier: 1 | 2 | 3;
  country: string;
  city: string;
  flag: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskTrend: 'up' | 'down' | 'stable';
  daysToBottleneck: number;
  valueAtRisk: number; // USD
  otifRate: number; // on-time in-full %
  leadTimeDays: number;
  leadTimeVariance: number;
  financialStabilityScore: number; // 0-100
  capacityUtilization: number; // %
  primaryMaterial: string;
  singleSourceRisk: boolean;
  shapFactors: ShapFactor[];
  activePOsCount: number;
  contactPerson: string;
  email: string;
  alternateSupplierIds: string[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  component: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  orderDate: string;
  expectedDelivery: string;
  predictedDelayDays: number;
  status: 'confirmed' | 'in_transit' | 'delayed' | 'customs_hold' | 'delivered';
  riskScore: number;
  destinationFacility: string;
  asnNumber?: string;
  carrier?: string;
  trackingNumber?: string;
}

export interface DemandForecastPoint {
  date: string;
  historical?: number;
  predictedDemand: number;
  upperBound95: number;
  lowerBound95: number;
  upperBound80: number;
  lowerBound80: number;
  plannedSupply: number;
  mape: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'oem' | 'tier1' | 'tier2' | 'tier3' | 'logistics';
  risk: number;
  location: string;
  category: string;
  x: number;
  y: number;
  leadTime: number;
  isBottleneck?: boolean;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  flowVolume: number; // units/month
  leadTimeDays: number;
  isCongested?: boolean;
}

export interface OptimizationVendorOption {
  vendorId: string;
  vendorName: string;
  currentAllocatedUnits: number;
  recommendedAllocatedUnits: number;
  unitCost: number;
  leadTimeDays: number;
  riskScore: number;
  maxCapacity: number;
  minOrderQuantity: number;
  costDelta: number;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type: 'delay_warning' | 'port_congestion' | 'po_status' | 'weather_alert' | 'customs_clearance';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  poNumber?: string;
  location?: string;
}
