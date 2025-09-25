<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { uniqBy } from 'lodash-es'
import { Icon } from '@iconify/vue'

export interface UserItem {
  label: string
  value: string | number
}

const props = defineProps<{
  modelValue: UserItem[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: UserItem[]): void
  (e: 'batchClick'): void
  (e: 'choose'): void
  (e: 'selectGroup'): void
}>()

const dedupedUsers = computed(() =>
  uniqBy(props.modelValue, 'value'),
)

function removeUser(value: string | number) {
  const filtered = dedupedUsers.value.filter(u => u.value !== value)
  emit('update:modelValue', filtered)
}
</script>

<template>
  <div class="user-selector">
    <div class="user-selector-body">
      <ElButton
        size="small"
        :icon="Plus"
        class="mr-[8px]"
        @click="$emit('batchClick')"
      >
        批量选择
      </ElButton>
      <div class="tags">
        <ElTag
          v-for="user in dedupedUsers"
          :key="user.value"
          closable
          @close="removeUser(user.value)"
        >
          {{ user.label }}
        </ElTag>
        <div class="text-[#333] text-[12px] cursor-pointer" @click="emit('choose')">
          请输入姓名搜索
        </div>
      </div>
    </div>
    <div class="user-selector-footer flex justify-end cursor-pointer" @click="emit('selectGroup')">
      <div class="inline-flex items-center text-[12px] text-[#555]">
        <span class="inline-block bg-[#999] p-[2px] leading-[12px] mr-[2px]">
          已选2人
        </span>
        <Icon icon="mdi:users" :width="20" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-selector {
  display: flex;
  flex-direction: column;
  height: 100%;
	border: 1px solid #dcdfe6;
  border-radius: 4px;
	padding: 4px 12px;
	box-sizing: border-box;
  &-body {
    flex: 1;
    min-height: 120px;
		.tags {
      display: inline-flex;
      flex-wrap: wrap;
			align-items: center;
      gap: 8px;
    }
  }
  &-footer {
    margin-top: 12px;
  }
}
</style>
