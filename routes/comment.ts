import Router from '@koa/router';
import CommentService from '../services/CommentService'
import checkAndSetUserId from '../middleware/checkAndSetUserId';
import User from '../db/models/user';
import Validator from '../util/joi_validation'
import { createNewReplySchema } from '../schemas/comment';

const router = new Router();

interface CreateNewReplytRequest {
    postId: number;
    text: string;
    parent?: number;
}

router.post('/', checkAndSetUserId,  async (ctx) => {
    const body = ctx.request.body

    const validator = new Validator<CreateNewReplytRequest>(createNewReplySchema);

    if (!validator.validate(body)) {
		return ctx.throw(404, validator.getError().details[0].message)
	}
    const comment = await CommentService.createNewCommentForPost(ctx.userId, body.postId, body.text, body.parent)

    const user = await User.findByPk(ctx.userId)

    const commentResponse = {
        id: comment.id,
        parent: comment.parent,
        text: comment.text,
        created_at: comment.createdAt,
        first_name: user.firstName,
        last_name: user.lastName,
    }

    ctx.body = commentResponse
});


export default router.routes()