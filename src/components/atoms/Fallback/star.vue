<script setup lang="ts">
import { Star, StarFilled } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 按钮尺寸
  size: {
    type: Number,
    default: 20,
  },
  // 是否显示文本
  showText: {
    type: Boolean,
    default: true,
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
})

// 组件事件
const emit = defineEmits(['update:modelValue', 'change'])

// 收藏状态
const isFavorite = ref(props.modelValue)

// 监听外部值的变化
watch(
  () => props.modelValue,
  (newValue) => {
    isFavorite.value = newValue
  },
)

// 处理点击事件
function handleClick() {
  if (props.disabled)
    return

  // 切换收藏状态
  isFavorite.value = !isFavorite.value

  // 触发事件
  emit('update:modelValue', isFavorite.value)
  emit('change', isFavorite.value)
}
</script>

<template>
  <button
    class="favorite-button"
    :class="{ favorited: isFavorite }"
    :aria-label="isFavorite ? '取消收藏' : '收藏'"
    @click="handleClick"
  >
    <ElIcon :size="size" class="star-icon">
      <StarFilled v-if="isFavorite" />
      <Star v-else />
    </ElIcon>
    <span v-if="showText" class="button-text">{{ isFavorite ? '已收藏' : '收藏' }}</span>
  </button>
</template>

<style scoped>
.favorite-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.favorite-button:hover {
  background-color: #f5f7fa;
}

.favorite-button.favorited {
  color: #f97316;
  border-color: #fed7aa;
}

.favorite-button.favorited:hover {
  background-color: #fff7ed;
}

.favorite-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: transparent;
}

.star-icon {
  transition: transform 0.2s ease;
}

.favorite-button:hover .star-icon {
  transform: scale(1.1);
}

.button-text {
  font-size: 14px;
}

/* 仅图标模式 */
.favorite-button:not(.show-text) {
  padding: 4px 8px;
}
</style>
