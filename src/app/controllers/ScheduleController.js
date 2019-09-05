// import * as Yup from 'yup';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
    async index(req, res) {
        const checkUserProvider = await User.findOne({
            where: {
                id: req.userId,
                provider: true,
            },
        });

        if (!checkUserProvider) {
            return res.status(401).json({
                error: 'User is not a provider',
            });
        }

        const { date } = req.query;
        const parsedDate = parseISO(date);

        // const { page = 1 } = req.query;

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate),
                    ],
                },
            },
            order: ['date'],
            // limit: 20,
            // offset: (page - 1) * 20,
            // attributes: ['id', 'date'],
            // include: [
            //     {
            //         model: User,
            //         as: 'provider',
            //         attributes: ['id', 'name'],
            //         include: [
            //             {
            //                 model: File,
            //                 as: 'avatar',
            //                 attributes: ['id', 'path', 'url'],
            //             },
            //         ],
            //     },
            // ],
        });

        return res.json(appointments);
    }
}

export default new ScheduleController();
