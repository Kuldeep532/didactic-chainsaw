import { Router, type IRouter } from "express";
import healthRouter from "./health";
import publicConfigRouter from "./public-config";
import contactRouter from "./contact";
import authRouter from "./auth";
import notificationRouter from "./notifications";
import blogRouter from "./blog";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicConfigRouter);
router.use(contactRouter);
router.use(authRouter);
router.use(notificationRouter);
router.use(blogRouter);
router.use(adminRouter);

export default router;
