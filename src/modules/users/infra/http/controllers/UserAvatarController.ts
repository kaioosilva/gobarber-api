import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';


export default class UserAvatarController {
    public async update(request: Request, response: Response): Promise<Response | undefined> {
        try{
            const updateUserAvatar = container.resolve(UpdateUserAvatarService);

            const user = await updateUserAvatar.execute({
                user_id: request.user.id,
                avatarFilename: request.file.filename,
            });

            // Com a atualização do TypeScript, isso se faz necessário
            const userWithoutPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };

            response.json(userWithoutPassword);
        } catch (err){
            return response.status(400).json({ error: err.message });
        }
    }
}