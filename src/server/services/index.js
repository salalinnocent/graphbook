// src/services/index.js
import graphql from "./graphql/index.js";


// src/server/services/index.js
export default utils => ({
  graphql: graphql(utils),
});