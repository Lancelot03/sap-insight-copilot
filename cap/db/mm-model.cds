namespace sap.insight.mm;

using { cuid, managed } from '@sap/cds/common';

entity PurchaseOrders : cuid, managed {
  poNumber     : String(20) @mandatory;
  material     : String(40) @mandatory;
  vendor       : String(40) @mandatory;
  plant        : String(10) @mandatory;
  currency     : String(3) default 'USD';
  netValue     : Decimal(15,2) @mandatory;
  orderedAt    : Date;
}
