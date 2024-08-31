<script setup>
	import { computed } from 'vue'

	const props = defineProps({
		size: {
			type: String,
			default: 'md',
			validator: (value) => ['sm', 'md', 'lg'].includes(value),
		},
	})

	const marginClasses = computed(() => {
		switch (props.size) {
			case 'sm':
				return 'py-10' // 40px
			case 'lg':
				return 'py-20' // 80px
			default:
				return 'py-16' // 64px
		}
	})
</script>

<template>
	<section :class="marginClasses">
		<slot />
	</section>
</template>
