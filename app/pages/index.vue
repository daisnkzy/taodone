<script setup>
	const newTodo = ref('')
	const inputRef = ref(null)
	const loading = ref(false)
	const originalTodos = ref([])

	//useFetch每次跳转页面都会重新获取数据，用useAsyncData可以缓存数据，跳转回原来的页面就不用重新发出请求
	const { data: todos, refresh } = await useAsyncData('todos', () =>
		$fetch('/api/todo')
	)
	const handleAddTodo = async () => {
		loading.value = true

		originalTodos.value = [...todos.value]

		const tempId = Date.now()
		const optimisticTodo = {
			id: tempId,
			title: newTodo.value,
			completed: 0,
		}

		todos.value.push(optimisticTodo)
		newTodo.value = ''
		await refresh()

		try {
			const createdTodo = await $fetch('/api/todo', {
				method: 'POST',
				body: {
					title: optimisticTodo.title,
				},
			})

			if (createdTodo) {
				//createdTodo存在，确认从服务器返回了新创建的todo，不是数据库操作失败返回的null
				const tempTodo = todos.value.find((todo) => todo.id === tempId)
				//使用find指向要找的tempTodo，所以任何对tempTodo的修改都会反应在todos.value中
				if (tempTodo) {
					//将createdTodo的属性赋值到tempTodo中，用于用服务器生成的Id替换临时Id等等
					Object.assign(tempTodo, createdTodo)
				} else {
					console.error('Cannot find temp Todo')
				}
			}
		} catch (error) {
			todos.value = originalTodos.value
			console.error('create todo error')
		} finally {
			loading.value = false
			nextTick(() => {
				inputRef.value?.input?.focus()
			})
		}
	}

	const handleUpdateTodo = async (todo) => {
		originalTodos.value = [...todos.value]

		const optimisticCompleted = Number(!todo.completed)
		todo.completed = optimisticCompleted
		await refresh()

		try {
			await $fetch(`/api/todo/${todo.id}`, {
				method: 'PATCH',
				body: {
					completed: optimisticCompleted,
				},
			})
		} catch (error) {
			todos.value = originalTodos.value
			console.log('failed update todo')
		} finally {
		}
	}

	const handleDeleteTodo = async (todo) => {
		originalTodos.value = [...todos.value] //保存原始todos

		todos.value = todos.value.filter((item) => item.id !== todo.id) //先在本地删除todo，把UI先更新了
		await refresh()

		try {
			await $fetch(`/api/todo/${todo.id}`, {
				method: 'DELETE', //删除服务端的todo，如果成功了，这事就算完结了
			})
		} catch (error) {
			todos.value = originalTodos.value //服务端删除失败则回退至原始todos，把UI变回来

			console.log('delete todo error', error)
		} finally {
		}
	}
</script>

<template>
	<UContainer class="flex items-center justify-center min-h-screen">
		<UCard>
			<template #header> TaoDone </template>

			<div class="w-[500px]">
				<Flex class="gap-x-8 items-center justify-between">
					<UInput
						ref="inputRef"
						autofocus
						v-model.trim="newTodo"
						placeholder="Add Todo"
						class="w-full"
						@keyup.enter="handleAddTodo"
						:disabled="loading"
						size="sm"
					/>
					<UButton
						icon="i-tdesign-enter"
						trailing
						:disabled="newTodo.trim().length === 0"
						@click="handleAddTodo"
						:loading="loading"
					>
						Add
					</UButton>
				</Flex>
			</div>

			<template #footer>
				<ul>
					<li
						v-for="todo in todos"
						:key="todo.id"
						class="text-2xl mb-2 space-y-2"
					>
						<Flex class="justify-between">
							<Flex class="items-baseline gap-x-4">
								<p :class="{ 'line-through text-gray-500': todo.completed }">
									{{ todo.title }}
								</p>
								<p v-if="todo.completed" class="text-gray-300 text-sm">
									todo completed
								</p>
							</Flex>
							<Flex class="gap-x-4">
								<UButton
									color="red"
									variant="outline"
									@click="handleDeleteTodo(todo)"
									size="xs"
									>delete</UButton
								>
								<UButton @click="handleUpdateTodo(todo)" v-if="!todo.completed"
									>done</UButton
								>
								<UButton @click="handleUpdateTodo(todo)" v-if="todo.completed"
									>cancle</UButton
								>
							</Flex>
						</Flex>
						<UDivider />
					</li>
				</ul>
			</template>
		</UCard>
	</UContainer>
</template>
