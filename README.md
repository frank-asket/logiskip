# Logiskip 📦

> **Enterprise AI Supply Chain Risk Prediction & Procurement Optimization Platform**

Logiskip transforms global supply chain operations from reactive firefighting into predictive strategy. By combining real-time XGBoost risk scoring, Facebook Prophet demand forecasting, SciPy linear programming re-allocation solvers, and RAG/LLM automated executive reporting, Logiskip enables enterprise procurement teams to anticipate supplier bottlenecks 30–90 days before they impact production.

---

## 🎨 Visual Identity & Brand System

Logiskip utilizes a visual design anchored by **Linkerry** (`#1A0B2E`) for structural layout and **Peach** (`#FFB7A5`) for high-emphasis accents and risk highlights:

* **Primary Structural Anchor**: Linkerry (`#1A0B2E`)
* **Accent & Alert Color**: Peach (`#FFB7A5`)
* **Background Surface**: Light Lavender (`#F4F1F8`)

---

## 🏗️ Monorepo Architecture

Logiskip is structured as a polyglot monorepo containing Next.js client applications, React Native mobile apps, Python FastAPI microservices, and an infrastructure stack:

```text
logiskip/
├── clients/
│   ├── landing-page/            # Public Next.js Web App (ROI Calculator, Trial Signups)
│   ├── portal/                  # Customer/Supplier Self-Service Portal (PO Confirmations, Uploads)
│   ├── web-dashboard/           # Enterprise Operations Workspace (Risk Gauges, What-If Simulator)
│   └── mobile/                  # React Native / Expo App (Real-time Critical Push Alerts)
├── api-gateway/                 # Nginx Reverse Proxy (SSL Termination, CORS, Rate Limiting)
├── identity-provider/           # Keycloak (OAuth2, OIDC, Enterprise RBAC)
├── message-broker/              # Apache Kafka + ZooKeeper (Real-time PO Telemetry Streaming)
├── microservices/               # Python 3.11 FastAPI Async Microservices
│   ├── risk-prediction/         # XGBoost Classifier (Supplier Risk Scoring 0-100 & SHAP)
│   ├── forecasting/             # Prophet Engine (Time-Series Demand Forecasting <8% MAPE)
│   ├── optimization/            # SciPy Linear Programming Solver (What-If Re-Allocation)
│   └── llm-reporter/            # LangChain + OpenAI RAG Pipeline (Executive Procurement Briefs)
└── databases/                   # Polyglot Data Layer
    ├── database-relational/     # PostgreSQL (POs, Vendor Master Data, Metrics)
    ├── database-graph/          # Neo4j Graph DB (Multi-Tier N-Tier Supplier Network Map)
    └── database-document/       # MongoDB (Unstructured Audit Logs & LLM Briefs)