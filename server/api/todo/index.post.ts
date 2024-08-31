import { useValidatedBody, z } from 'h3-zod'
import { todoActions } from '../../services/db/TodoActions'

export default defineEventHandler(async (event) => {
	const { title } = await useValidatedBody(event, {
		title: z.string().min(1).max(100),
	})

	const newTodo = await todoActions.addTodo(title)
	return newTodo
})
