import { Router, type IRouter } from "express";
import healthRouter from "./health";
import publicConfigRouter from "./public-config";
import contactRouter from "./contact";
import authRouter from "./auth";
import notificationRouter from "./notifications";
import blogRouter from "./blog";
import adminRouter from "./admin";
import aiRouter from "./ai";
import gatewayRouter from "./gateway";
import shlokasRouter from "./shlokas";
import messagesRouter from "./messages";
import proxyRouter from "./proxy";
import appRouter from "./app";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicConfigRouter);
router.use(contactRouter);
router.use(authRouter);
router.use(notificationRouter);
router.use(blogRouter);
router.use(adminRouter);
router.use(aiRouter);
router.use(gatewayRouter);
router.use(shlokasRouter);
router.use(messagesRouter);
router.use(proxyRouter);
router.use(appRouter);

export default router;
