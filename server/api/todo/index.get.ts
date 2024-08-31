import { todoActions } from '../../services/db/TodoActions'

export default defineEventHandler(async () => {
	const todos = await todoActions.getAllTodos()
	return todos
})
