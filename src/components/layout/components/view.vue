<script setup lang="ts"></script>

<template>
  <div class="layout-view">
    <RouterView v-slot="{ Component }">
      <Transition>
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </div>
</template>

<style lang="scss" scoped>
.layout-view {
  @apply flex-1 w-[100%] box-border p-[20px];
}
</style>
