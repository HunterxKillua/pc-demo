<script setup lang="ts">
interface TabItem {
  label: string
  value: string | number
  [x: string]: any
}

interface Props {
  modelValue: string | number
  tabs: TabItem[]
  alive?: boolean
  componentName?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  tabs: () => [],
  alive: false,
  componentName: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number): void
  (e: 'change', val: string | number): void
}>()

function onClick(val: string | number) {
  if (val !== props.modelValue) {
    emit('update:modelValue', val)
    emit('change', val)
  }
}
</script>

<template>
  <div class="x-tabs">
    <!-- 顶部导航 -->
    <div class="x-tabs-nav">
      <div
        v-for="item in tabs"
        :key="item.value"
        class="x-tabs-nav-item" :class="[
          item.value === modelValue ? 'x-tabs-nav-item-active' : '',
        ]"
        @click.stop="onClick(item.value)"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="x-tabs-body">
      <slot>
        <template v-if="alive && componentName">
          <KeepAlive>
            <component
              :is="componentName"
            />
          </KeepAlive>
        </template>
        <template v-else-if="componentName">
          <component
            :is="componentName"
          />
        </template>
        <template v-else>
          need slots content or asyncComponent
        </template>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.x-tabs {
  &-nav {
    display: flex;
    align-items: center;
    background: #f2f4f7;
    border: 1px solid #ffffff;
    box-sizing: border-box;
    border-radius: 12px 12px 0 0;
    &-item {
      line-height: 22px;
      color: #121924;
      font-size: 14px;
      font-weight: 400;
      text-align: center;
      box-sizing: border-box;
      padding: 11px 20px;
      overflow: hidden;
      cursor: pointer;
      &.x-tabs-nav-item-active {
        background: #ffffff;
        border-radius: 4px 4px 0 0;
        font-weight: 600;
      }
    }
  }
  &-body {
    box-sizing: border-box;
    padding: 20px;
  }
}
</style>
