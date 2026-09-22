import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { RiskPredictionEngine } from './components/RiskPredictionEngine';
import { DemandForecasting } from './components/DemandForecasting';
import { OptimizationSolver } from './components/OptimizationSolver';
import { NetworkGraphView } from './components/NetworkGraphView';
import { SupplierPortal } from './components/SupplierPortal';
import { TelemetryFeed } from './components/TelemetryFeed';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { RoiCalculatorModal } from './components/RoiCalculatorModal';

import { initialSuppliers, initialPurchaseOrders, liveTelemetryEvents } from './data/mockData';
import { Supplier, PurchaseOrder, TelemetryEvent } from './types/supplyChain';

export function App() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryEvent[]>(liveTelemetryEvents);

  const [activeView, setActiveView] = useState<string>('overview');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSupplierPortalMode, setIsSupplierPortalMode] = useState<boolean>(false);

  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isRoiOpen, setIsRoiOpen] = useState<boolean>(false);

  // Quick navigation handlers
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setActiveView('risk');
  };

  const handleUpdatePO = (updatedPO: PurchaseOrder) => {
    setPurchaseOrders(prev => prev.map(po => po.id === updatedPO.id ? updatedPO : po));
  };

  const handleEmitTelemetry = (event: TelemetryEvent) => {
    setTelemetryEvents(prev => [event, ...prev]);
  };

  const handleApplyOptimization = (reallocatedVendors: any[]) => {
    // Generate updated purchase orders based on solver recommendations
    const updatedPOs = purchaseOrders.map(po => {
      if (po.id === 'po-101') {
        // SilicoPrecision PO was throttled from 45k/55k to 15k
        return {
          ...po,
          quantity: 15000,
          totalValue: 15000 * po.unitPrice,
          predictedDelayDays: 0,
          status: 'confirmed' as const
        };
      }
      return po;
    });

    // Add new PO for Dresden
    const dresdenPO: PurchaseOrder = {
      id: `po-auto-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(9000 + Math.random() * 999)}`,
      supplierId: 'sup-04',
      supplierName: 'Apex Microelectronics Dresden GmbH',
      component: 'Automotive Dual-Core 32-bit MCU (ASIL-D) - Fast-Track Allocation',
      quantity: 40000,
      unitPrice: 43.80,
      totalValue: 40000 * 43.80,
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDelivery: '2026-10-14',
      predictedDelayDays: 0,
      status: 'confirmed',
      riskScore: 29,
      destinationFacility: 'Assembly Plant Alpha - Detroit, USA',
      asnNumber: 'ASN-DE-FAST-01',
      carrier: 'Lufthansa Cargo Priority Air'
    };

    setPurchaseOrders([...updatedPOs, dresdenPO]);

    // Emit live telemetry event
    handleEmitTelemetry({
      id: `tel-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'po_status',
      title: 'SciPy LP Re-allocation Executed: 40k Units to Apex Dresden',
      description: 'Single-source dependency on SilicoPrecision throttled; assembly line risk neutralized.',
      severity: 'low',
      poNumber: dresdenPO.poNumber,
      location: 'Dresden, DE'
    });
  };

  const criticalSuppliersCount = suppliers.filter(s => s.riskScore >= 70).length;
  const openPOsCount = purchaseOrders.filter(po => po.status !== 'delivered').length;

  return (
    <div className="min-h-screen bg-[#F4F1F8] text-[#1A0B2E] flex flex-col selection:bg-[#FFB7A5] selection:text-[#1A0B2E]">
      
      {/* Top Header */}
      <Header
        onOpenReport={() => setIsReportOpen(true)}
        onOpenRoi={() => setIsRoiOpen(true)}
        telemetryEvents={telemetryEvents}
        activeView={activeView}
        setActiveView={setActiveView}
        isSupplierPortalMode={isSupplierPortalMode}
        setIsSupplierPortalMode={setIsSupplierPortalMode}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            if (view === 'portal') setIsSupplierPortalMode(true);
            else setIsSupplierPortalMode(false);
          }}
          criticalSuppliersCount={criticalSuppliersCount}
          openPOsCount={openPOsCount}
          isSupplierPortalMode={isSupplierPortalMode}
        />

        {/* View Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          
          {activeView === 'overview' && (
            <DashboardOverview
              suppliers={suppliers}
              purchaseOrders={purchaseOrders}
              onSelectSupplier={handleSelectSupplier}
              onNavigateView={setActiveView}
              onRunOptimization={() => setActiveView('optimizer')}
            />
          )}

          {activeView === 'risk' && (
            <RiskPredictionEngine
              suppliers={suppliers}
              selectedSupplier={selectedSupplier}
              onSelectSupplier={setSelectedSupplier}
              onRunOptimization={() => setActiveView('optimizer')}
            />
          )}

          {activeView === 'forecasting' && (
            <DemandForecasting
              onRunOptimization={() => setActiveView('optimizer')}
            />
          )}

          {activeView === 'optimizer' && (
            <OptimizationSolver
              onApplyOptimization={handleApplyOptimization}
            />
          )}

          {activeView === 'graph' && (
            <NetworkGraphView
              onNavigateRisk={(supplierId) => {
                if (supplierId) {
                  const s = suppliers.find(sup => sup.id === supplierId);
                  if (s) setSelectedSupplier(s);
                }
                setActiveView('risk');
              }}
            />
          )}

          {activeView === 'portal' && (
            <SupplierPortal
              suppliers={suppliers}
              purchaseOrders={purchaseOrders}
              onUpdatePO={handleUpdatePO}
              onEmitTelemetry={handleEmitTelemetry}
            />
          )}

          {activeView === 'telemetry' && (
            <TelemetryFeed
              events={telemetryEvents}
              onEmitEvent={handleEmitTelemetry}
            />
          )}

        </main>
      </div>

      {/* Modals */}
      <ExecutiveReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        suppliers={suppliers}
        purchaseOrders={purchaseOrders}
      />

      <RoiCalculatorModal
        isOpen={isRoiOpen}
        onClose={() => setIsRoiOpen(false)}
      />

    </div>
  );
}
export default App;
