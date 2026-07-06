import { Router, type IRouter } from "express";
import healthRouter from "./health";
import publicConfigRouter from "./public-config";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicConfigRouter);
router.use(contactRouter);

export default router;
