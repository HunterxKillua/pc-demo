<script setup lang="ts">
const props = withDefaults(defineProps<{
	modelValue: boolean,
	title?: string
}>(), {
	value: false,
	title: ''
})

const emits = defineEmits<{
	close: [],
	click: [],
	'update:modelValue': [boolean]
}>()

const visible = computed({
	get() {
		return props.modelValue
	},
	set(val: boolean) {
		if (!val) {
			emits('close')
		}
		emits('update:modelValue', val)
	}
})

function onClick() {
	emits('click')
}

function onCancel() {
	emits('close')
}

function test111() {
	console.log('outside ref')
}

defineExpose({
	test111
})

</script>

<template>
	<ElDialog v-model="visible" title="test">
		<template #default>
			<slot name="default">
				lazy import
			</slot>
		</template>
		<template #header>
			<slot name="header">
				默认类容
			</slot>
		</template>
		<template #footer>
			<ElButton @click="onCancel">取消</ElButton>
			<ElButton type="primary" @click="onClick">确定</ElButton>
		</template>
	</ElDialog>
</template>
