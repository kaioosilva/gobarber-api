import 'reflect-metadata';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import InotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequestDTO {
    provider_id: string,
    user_id: string;
    date: Date
}

@injectable()
class CreateAppointmentService {

    constructor( 
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: InotificationsRepository,
    ) {}

    public async execute({ provider_id, date, user_id }:IRequestDTO): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        if(isBefore(appointmentDate, Date.now())) {
            throw new AppError("You can't create an appointment on a past date");
        }

        if(user_id === provider_id) {
            throw new AppError("You can't create an appointment with yourself");
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17 ) {
            throw new AppError("You can only create appointments between 8am and 5pm");
        }

        const findAppointmentInSameTime = await this.appointmentRepository.findByDate(appointmentDate);

        if(findAppointmentInSameTime) {
            throw new AppError('This time is alredy booked');
        }

        const appointment = await this.appointmentRepository.create({
            provider_id, 
            user_id,
            date: appointmentDate
        });

        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'at' HH:mm'h'");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `New appointment to ${dateFormatted}`,
        })

        return appointment;
    }
    
}

export default CreateAppointmentService;