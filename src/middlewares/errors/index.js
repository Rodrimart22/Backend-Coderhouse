import EErrors from "./enums.js";
export default (error, req, res, next) => {
  switch (error.code) {
    case EErrors.ROUTING_ERROR:
      res.status(404).send({
        status: "error",
        error: error.name,
        description: "Endpoint not found",
      });
      break;
    case EErrors.INVALID_TYPE_ERROR:
      res.status(400).send({
        status: "error",
        error: error.name,
        description: "Invalid data type",
      });
      break;
    case EErrors.USER_NOT_FOUND:
      res.status(404).send({
        status: "error",
        error: error.name,
        description: "User not found",
      });
      break;
    case EErrors.PRODUCT_NOT_FOUND:
      res.status(404).send({
        status: "error",
        error: error.name,
        description: "Product not found",
      });
      break;
    case EErrors.INTERNAL_SERVER_ERROR:
      res.status(500).send({
        status: "error",
        error: error.name,
        description: "Internal server error",
      });
      break;
    case EErrors.DATABASE_ERROR:
      res.status(500).send({
        status: "error",
        error: error.name,
        description: "Database error",
      });
      break;
    // default:
    //   res.status(500).send({
    //     status: "error",
    //     error: error.name,
    //     description: "Unexpected error 2",
    //   });
  }

  next();
};
