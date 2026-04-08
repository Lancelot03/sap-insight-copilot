# API Contracts

## MM APIs
- GET `/odata/v4/mm/getPOCount(material='MAT-1000')`
- GET `/odata/v4/mm/getMaterialSpend(material='MAT-1000')`
- GET `/odata/v4/mm/getVendorSpend(vendor='VEND-001')`
- GET `/odata/v4/mm/getPlantPO(plant='PL01')`
- GET `/odata/v4/mm/getGeneralPO()`
- GET `/odata/v4/mm/getOpenPOs()`
- GET `/odata/v4/mm/getTopVendors(limit=3)`
- GET `/odata/v4/mm/getPlantSpend(plant='PL01')`
- GET `/odata/v4/mm/getMonthlyPOTrend(month='2026-01')`

## FI APIs
- GET `/odata/v4/fi/getMonthlyRevenue()`
- GET `/odata/v4/fi/getVendorDue(vendor='VEND-001')`
- GET `/odata/v4/fi/getCustomerDue(customer='CUST-001')`
- GET `/odata/v4/fi/getProfitCenterRevenue(pc='PC-100')`
- GET `/odata/v4/fi/getProfitMargin()`
- GET `/odata/v4/fi/getTopProfitCenters()`
- GET `/odata/v4/fi/getReceivablesAging()`
- GET `/odata/v4/fi/getPayablesAging()`
See `cap/srv/*-service.cds` for MM/FI/Joule OData contracts.
