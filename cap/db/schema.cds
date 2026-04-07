namespace sap.insight;

using { cuid, managed } from '@sap/cds/common';

entity Insights : cuid, managed {
  title       : String(120);
  description : String(500);
  priority    : String(20);
  owner       : String(80);
}
