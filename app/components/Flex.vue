<script setup>
	defineProps({
		class: String,
		default: '',
	})
</script>

<template>
	<div class="flex" :class="class">
		<slot></slot>
	</div>
</template>
