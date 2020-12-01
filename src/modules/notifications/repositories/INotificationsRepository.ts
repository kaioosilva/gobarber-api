import ICreateNotificationsDTO from '../dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notifications';

export default interface INotificationsRepository {
    create(data: ICreateNotificationsDTO): Promise<Notification>;
}