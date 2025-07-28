export const mockAuthMiddleware = (req, res, next) => {
  req.user = {
    id: "1234",
    email: "annotator1@bergflow.com",
    role: "annotator",
  };
  next();
};
