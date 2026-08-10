import { Router } from 'express';
import { OverviewController } from './overview.controller';

const OverviewRouter = Router();
const overviewController = new OverviewController();

OverviewRouter.get('/', overviewController.getOverview.bind(overviewController));

export default OverviewRouter;