namespace sap.insight.fi;

using { cuid, managed } from '@sap/cds/common';

entity FinancePostings : cuid, managed {
  docNumber      : String(20) @mandatory;
  postingType    : String(2) @mandatory; // AR | AP | RV
  vendor         : String(40);
  customer       : String(40);
  profitCenter   : String(20);
  currency       : String(3) default 'USD';
  amount         : Decimal(15,2) @mandatory;
  postingDate    : Date @mandatory;
  dueDate        : Date;
  status         : String(10) default 'OPEN';
}
