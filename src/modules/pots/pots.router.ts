import {Router} from "express";
import { PotsController } from "./pots.controller";

const potRouter: Router = Router();
const potController = new PotsController();

potRouter.post('/', potController.createPot.bind(potController));
potRouter.get('/', potController.getPot.bind(potController));
potRouter.patch('/:id', potController.updatePot.bind(potController));
potRouter.patch('/:id/withdraw', potController.withdrawMoney.bind(potController));
potRouter.patch('/:id/add', potController.addMoney.bind(potController));
potRouter.delete('/:id', potController.deletePot.bind(potController));

export default potRouter