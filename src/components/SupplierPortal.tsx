import React, { useState } from 'react';
import { 
  UserCheck, 
  Package, 
  FileCheck, 
  Upload, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Send
} from 'lucide-react';
import { PurchaseOrder, Supplier } from '../types/supplyChain';

interface SupplierPortalProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  onUpdatePO: (updatedPO: PurchaseOrder) => void;
  onEmitTelemetry: (event: any) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  suppliers,
  purchaseOrders,
  onUpdatePO,
  onEmitTelemetry
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('sup-01');
  const [activeTab, setActiveTab] = useState<'pos' | 'asn' | 'docs'>('pos');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states for ASN creation
  const [asnPOId, setAsnPOId] = useState<string>('po-101');
  const [carrierName, setCarrierName] = useState<string>('Evergreen Marine');
  const [trackingNumber, setTrackingNumber] = useState<string>('EGLV-99882210');
  const [dispatchDate, setDispatchDate] = useState<string>('2026-09-23');

  const currentSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
  const supplierPOs = purchaseOrders.filter(po => po.supplierId === selectedSupplierId);

  const handleConfirmPO = (po: PurchaseOrder) => {
    const updated: PurchaseOrder = {
      ...po,
      status: 'confirmed'
    };
    onUpdatePO(updated);
    onEmitTelemetry({
      id: `tel-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'po_status',
      title: `PO Confirmed: ${po.poNumber}`,
      description: `${currentSupplier.name} confirmed order fulfillment schedule.`,
      severity: 'low',
      poNumber: po.poNumber,
      location: currentSupplier.city
    });
    setSuccessMessage(`PO ${po.poNumber} confirmed successfully!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleCreateASN = (e: React.FormEvent) => {
    e.preventDefault();
    const po = purchaseOrders.find(p => p.id === asnPOId);
    if (!po) return;

    const newAsn = `ASN-${currentSupplier.country.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const updated: PurchaseOrder = {
      ...po,
      asnNumber: newAsn,
      carrier: carrierName,
      trackingNumber: trackingNumber,
      status: 'in_transit',
      predictedDelayDays: Math.max(0, po.predictedDelayDays - 4) // Dispatch locks schedule
    };

    onUpdatePO(updated);
    onEmitTelemetry({
      id: `tel-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'po_status',
      title: `Advance Shipping Notice Issued: ${newAsn}`,
      description: `Carrier ${carrierName} tracking #${trackingNumber} dispatched from ${currentSupplier.city}.`,
      severity: 'low',
      poNumber: po.poNumber,
      location: currentSupplier.city
    });

    setSuccessMessage(`ASN ${newAsn} created and tracking synced to logistics broker!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Supplier Profile Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#1A0B2E] text-[#FFB7A5]">
              <UserCheck className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-[#1A0B2E]">Supplier Self-Service Portal</h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold">
              External Vendor Gateway
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Supplier workspace for PO confirmations, Advance Shipping Notices (ASN), tracking dispatch, and document compliance.
          </p>
        </div>

        {/* Vendor Selector Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-medium">Logged in as:</span>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="text-xs font-semibold bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A0B2E]"
          >
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.flag} {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Supplier Profile Banner */}
      <div className="bg-[#1A0B2E] text-white p-5 rounded-2xl border border-purple-900/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{currentSupplier.flag}</span>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">{currentSupplier.name}</h2>
              <span className="text-[10px] bg-[#FFB7A5]/20 text-[#FFB7A5] font-mono px-2 py-0.5 rounded border border-[#FFB7A5]/30">
                Tier {currentSupplier.tier} Verified
              </span>
            </div>
            <div className="text-xs text-gray-300 mt-0.5">
              Contact: {currentSupplier.contactPerson} ({currentSupplier.email}) • Facility: {currentSupplier.city}, {currentSupplier.country}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono">
          <div>
            <div className="text-gray-400 text-[10px]">Active Orders</div>
            <div className="text-sm font-bold text-white">{supplierPOs.length} POs</div>
          </div>
          <div className="h-6 w-px bg-purple-800"></div>
          <div>
            <div className="text-gray-400 text-[10px]">OTIF Score</div>
            <div className="text-sm font-bold text-emerald-400">{currentSupplier.otifRate}%</div>
          </div>
          <div className="h-6 w-px bg-purple-800"></div>
          <div>
            <div className="text-gray-400 text-[10px]">Capacity Load</div>
            <div className="text-sm font-bold text-[#FFB7A5]">{currentSupplier.capacityUtilization}%</div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'pos' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Purchase Orders ({supplierPOs.length})
        </button>
        <button
          onClick={() => setActiveTab('asn')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'asn' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Submit Advance Shipping Notice (ASN)
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'docs' ? 'bg-[#1A0B2E] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Compliance & CoA Documents
        </button>
      </div>

      {/* Tab 1: Purchase Orders */}
      {activeTab === 'pos' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Assigned Open Purchase Orders</h3>

          {supplierPOs.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No active purchase orders currently assigned to this vendor.</p>
          ) : (
            <div className="space-y-3">
              {supplierPOs.map(po => (
                <div key={po.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-gray-900">{po.poNumber}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        po.status === 'delayed' ? 'bg-rose-100 text-rose-700' :
                        po.status === 'customs_hold' ? 'bg-amber-100 text-amber-800' :
                        po.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {po.status.replace('_', ' ')}
                      </span>
                      {po.asnNumber && (
                        <span className="text-[10px] font-mono bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                          {po.asnNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-gray-800 mt-1">{po.component}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Qty: <span className="font-mono font-medium">{po.quantity.toLocaleString()} units</span> • Total: <span className="font-mono font-medium">${po.totalValue.toLocaleString()}</span> • Expected: <span className="font-mono">{po.expectedDelivery}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {po.status !== 'confirmed' && po.status !== 'in_transit' && (
                      <button
                        onClick={() => handleConfirmPO(po)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1A0B2E] text-white hover:bg-[#2A1343] transition-colors"
                      >
                        Confirm Schedule
                      </button>
                    )}
                    <button
                      onClick={() => { setAsnPOId(po.id); setActiveTab('asn'); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FFB7A5] text-[#1A0B2E] hover:bg-[#ffa893] transition-colors"
                    >
                      Issue ASN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Create ASN */}
      {activeTab === 'asn' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Dispatch Advance Shipping Notice (ASN)</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Generates EDI 856 transaction and streams carrier dispatch notification directly to OEM procurement teams.
            </p>
          </div>

          <form onSubmit={handleCreateASN} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Target Purchase Order</label>
              <select
                value={asnPOId}
                onChange={(e) => setAsnPOId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-gray-50 font-mono text-gray-900"
              >
                {supplierPOs.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.poNumber} — {p.component} ({p.quantity.toLocaleString()} units)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Carrier Name</label>
                <input
                  type="text"
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tracking / Container Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 bg-gray-50 font-mono text-gray-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Scheduled Departure Date</label>
              <input
                type="date"
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 bg-gray-50 font-mono text-gray-900"
                required
              />
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1A0B2E] text-white hover:bg-[#2A1343] transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#FFB7A5]" />
              <span>Broadcast EDI ASN & Carrier Telemetry</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'docs' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Certificates of Analysis (CoA) & Customs Documents</h3>
            <button
              onClick={() => {
                setSuccessMessage("Document 'CoA-Batch-2026-991.pdf' successfully verified & uploaded to MongoDB audit store!");
                setTimeout(() => setSuccessMessage(null), 4000);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1A0B2E] text-white hover:bg-[#2A1343]"
            >
              <Upload className="w-3.5 h-3.5 text-[#FFB7A5]" />
              <span>Upload Certificate</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-purple-800" />
                <div>
                  <div className="font-semibold text-gray-900">ASIL-D Automotive ISO 26262 Compliance Certificate.pdf</div>
                  <div className="text-[10px] text-gray-500">Verified by TÜV SÜD • Valid through 2027-12</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Active / Compliant</span>
            </div>

            <div className="p-3 rounded-xl border border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-purple-800" />
                <div>
                  <div className="font-semibold text-gray-900">Dual-Use Export Control Declaration (ECCN 3A090).pdf</div>
                  <div className="text-[10px] text-gray-500">Customs clearance document for Hamburg Port hold release</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Under Review</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
