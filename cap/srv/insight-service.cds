using sap.insight as db from '../db/schema';

service InsightService @(path:'/odata/v4/insight') {
  entity Insights as projection on db.Insights;

  @readonly
  entity HealthCheck {
    key ID     : UUID;
        status : String;
  }
}
