import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
