service JouleService @(path:'/odata/v4/joule') @(requires:'authenticated-user') {
  type JouleResponse {
    intent     : String(60);
    authorized : Boolean;
    payload    : LargeString;
  }

  action askJoule(question : String(500)) returns JouleResponse;
}
