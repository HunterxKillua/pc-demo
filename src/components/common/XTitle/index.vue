<script setup lang="ts">
interface Props {
  title: string
  showPlaceholder?: boolean
  size?: 'default' | 'small'
}

withDefaults(defineProps<Props>(), {
  title: '',
  showPlaceholder: true,
  size: 'default',
})
</script>

<template>
  <div class="x-title">
    <div class="x-title-left">
      <div v-if="showPlaceholder" class="x-title-placeholder" />
      <div :class="size === 'small' ? 'x-title-info-small' : 'x-title-info'">
        {{ title }}
      </div>
    </div>
    <div class="x-title-right">
      <slot name="right" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.x-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &-left {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &-info {
    font-weight: 600;
    font-size: 16px;
    color: #27272c;
    line-height: 22px;

    &-small {
      font-weight: 400;
      font-size: 16px;
      color: #121924;
      line-height: 24px;
    }
  }

  &-placeholder {
    width: 4px;
    height: 17px;
    border-radius: 2px;
    background: #0080ff;
    margin-right: 10px;
  }
}
</style>
