import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import galleryRouter from "./gallery";
import tutorialsRouter from "./tutorials";
import downloadsRouter from "./downloads";
import checkoutRouter from "./checkout";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(galleryRouter);
router.use(tutorialsRouter);
router.use(downloadsRouter);
router.use(checkoutRouter);
router.use(contactRouter);

export default router;
