<script setup>
	const todos = ref([])
	const newTodo = ref('')
	const inputRef = ref(null)
	const loading = ref(false)
	const AddTodo = () => {
		if (!newTodo.value) return
		loading.value = true

		todos.value.push(newTodo.value)
		newTodo.value = ''

		nextTick(() => {
			inputRef.value?.input?.focus()
		})

		setTimeout(() => {
			loading.value = false
		}, 1000)
	}
</script>

<template>
	<UContainer class="flex items-center justify-center min-h-screen">
		<UCard>
			<template #header> TodoList </template>

			<div class="w-[500px]">
				<Flex class="gap-x-8 items-center justify-between">
					<UInput
						ref="inputRef"
						autofocus
						v-model.trim="newTodo"
						placeholder="Add Todo"
						class="w-full"
						@keyup.native.enter="AddTodo"
						:disabled="loading"
						size="lg"
					/>
					<UButton icon="i-tdesign-enter" trailing @click="AddTodo" :loading="loading"> Add </UButton>
				</Flex>
			</div>

			<template #footer>
				<ul>
					<li v-for="(todo, index) in todos" :key="index" class="text-2xl mb-2 space-y-2">
						<p>{{ todo }}</p>
						<UDivider />
					</li>
				</ul>
			</template>
		</UCard>
	</UContainer>
</template>
