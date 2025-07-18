export const mockAuthMiddleware = (req, res, next) => {
  req.user = {
    id: "1234",
    email: "admin@bergflow.com",
    role: "admin",
  };
  next();
};
