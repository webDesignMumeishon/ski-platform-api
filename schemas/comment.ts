import Joi from 'joi'

export const createNewCommentSchema = Joi.object()
		.keys({
			postId: Joi.number().required(),
			text: Joi.string().required()
		})
        .unknown(false)

export const createNewReplySchema = Joi.object()
.keys({
	postId: Joi.number().required(),
	text: Joi.string().required(),
	parent: Joi.number().optional(),
})
.unknown(false)