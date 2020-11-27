
import { getRepository, Repository, Raw } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import iAppointmentsRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import iCreateAppointmentDTO from '@modules/appointments/dtos/iCreateAppointmentDTO';
import IFindAllInMonthProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

//SOLID
// LISKOV SUBSTITUTION PRINCIPLE

class AppointmentsRepository implements iAppointmentsRepository {
    private ormRepository: Repository<Appointment>

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {

        const findAppointment = await this.ormRepository.findOne({
            where: { date }
        });

        return findAppointment;
    }

    public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });
        console.log('repo 3')

        return appointments;
    }

    public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    public async create({ provider_id, user_id, date }:iCreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;