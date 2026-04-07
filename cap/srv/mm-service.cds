using sap.insight.mm as mm from '../db/mm-model';

service MMService @(path:'/odata/v4/mm') @(requires:'MM_VIEWER') {
  entity PurchaseOrders as projection on mm.PurchaseOrders;

  type POCountResponse {
    material : String(40);
    poCount  : Integer;
  }

  type SpendResponse {
    key        : String(40);
    poCount    : Integer;
    totalSpend : Decimal(15,2);
    currency   : String(3);
  }

  type PlantPOResponse {
    plant      : String(10);
    poCount    : Integer;
    totalSpend : Decimal(15,2);
    currency   : String(3);
  }

  type GeneralPOResponse {
    totalPOCount  : Integer;
    totalSpend    : Decimal(15,2);
    uniqueVendors : Integer;
    uniquePlants  : Integer;
    currency      : String(3);
  }

  function getPOCount(material : String(40)) returns POCountResponse;
  function getMaterialSpend(material : String(40)) returns SpendResponse;
  function getVendorSpend(vendor : String(40)) returns SpendResponse;
  function getPlantPO(plant : String(10)) returns PlantPOResponse;
  function getGeneralPO() returns GeneralPOResponse;
}
