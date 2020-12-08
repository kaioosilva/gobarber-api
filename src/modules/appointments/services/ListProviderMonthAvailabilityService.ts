import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/iAppointmentsRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {

        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            year,
            month,
        });

        //retorna quantidade de dias no mês
        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        //Cria um array com os dias do mês. [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11...]
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        // Mapeia todos os dias da semana, e depois filtra os dias/horarios que tem appointments marcado.
        const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                //Se o dia tiver agendamento, retorna todos os horarios agendados no dia
                return getDate(appointment.date) === day;
            });

            return {
                day,
                // Se o numero de agendamentos no dia for menor que 10 (Pois so pode ter no maximo, 10 agendamentos no dia), true, se não, false.
                available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
            }
        });

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;