import { useValidatedBody, useValidatedParams, z, zh } from 'h3-zod'
import { todoActions } from '~~/server/services/db/TodoActions'

export default defineEventHandler(async (event) => {
	const { id } = await useValidatedParams(event, {
		id: zh.intAsString,
	})
	// 这里只更新todo 是否完成，若要更新todo内容，就加个 title
	const { completed } = await useValidatedBody(event, {
		completed: z.number().int().min(0).max(1),
	})

	const updatedTodo = await todoActions.updateTodo(id, completed)
	return updatedTodo
})
