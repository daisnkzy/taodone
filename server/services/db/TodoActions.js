class TodoActions {
	// 如果get()返回的是对象，不是数组。不要使用解构赋值 []
	async getAllTodos() {
		try {
			const todos = await useDrizzle().select().from(tables.todos).all()

			return todos || null
		} catch (error) {
			console.log(error)
			return null
		}
	}

	async addTodo(title) {
		try {
			const newTodo = await useDrizzle()
				.insert(tables.todos)
				.values({ title, createdAt: new Date() })
				.returning()
				.get()
			return newTodo || null
		} catch (error) {
			console.log(error)
			return null
		}
	}

	async deleteTodo(id) {
		try {
			const deletedTodo = await useDrizzle()
				.delete(tables.todos)
				.where(eq(tables.todos.id, id))
				.returning()
				.get()

			return deletedTodo || null
		} catch (error) {
			console.log('Error deleting todo with ID:', error)
			return null
		}
	}

	async updateTodo(id, completed) {
		try {
			const updatedTodo = await useDrizzle()
				.update(tables.todos)
				.set({ completed })
				.where(eq(tables.todos.id, id))
				.returning()
				.get()
			return updatedTodo || null
		} catch (error) {
			console.log(error)
			return null
		}
	}
}

export const todoActions = new TodoActions()
