import { useValidatedParams, zh } from 'h3-zod'
import { todoActions } from '~~/server/services/db/TodoActions'

export default defineEventHandler(async (event) => {
	const { id } = await useValidatedParams(event, {
		id: zh.intAsString,
	})

	const deletedTodo = await todoActions.deleteTodo(id)
	if (!deletedTodo) {
		throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
	}
	return deletedTodo
})
