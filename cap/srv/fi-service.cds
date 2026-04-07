using sap.insight.fi as fi from '../db/fi-model';

service FIService @(path:'/odata/v4/fi') @(requires:'FI_VIEWER') {
  entity FinancePostings as projection on fi.FinancePostings;

  type RevenueByMonth {
    month    : String(7);
    revenue  : Decimal(15,2);
    currency : String(3);
  }

  type MonthlyRevenueResponse {
    totalRevenue : Decimal(15,2);
    currency     : String(3);
    monthly      : many RevenueByMonth;
  }

  type DueAging {
    current   : Decimal(15,2);
    due1To30  : Decimal(15,2);
    due31To60 : Decimal(15,2);
    due61Plus : Decimal(15,2);
  }

  type DueResponse {
    key       : String(40);
    openItems : Integer;
    totalDue  : Decimal(15,2);
    aging     : DueAging;
    currency  : String(3);
  }

  type ProfitCenterRevenueResponse {
    key           : String(20);
    documentCount : Integer;
    totalRevenue  : Decimal(15,2);
    currency      : String(3);
    monthly       : many RevenueByMonth;
  }

  function getMonthlyRevenue() returns MonthlyRevenueResponse;
  function getVendorDue(vendor : String(40)) returns DueResponse;
  function getCustomerDue(customer : String(40)) returns DueResponse;
  function getProfitCenterRevenue(pc : String(20)) returns ProfitCenterRevenueResponse;
}
