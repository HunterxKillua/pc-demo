<script setup lang="tsx">
defineRender(() => {
  return (
    <div class="layout-footer">
      footer
    </div>
  )
})
</script>

<style lang="scss" scoped>
.layout-footer {
  color: var(--color-text);
  box-sizing: border-box;
  padding-bottom: var(--padding-box-normal);
  font-size: var(--font-size-small);
  width: 100%;
  @apply inline-flex items-center justify-center;
}
</style>
