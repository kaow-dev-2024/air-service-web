<template>
  <div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  props: {
    overlay: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      closeTimer: null,
    };
  },

  watch: {
    overlay(val) {
      if (!val) return;

      clearTimeout(this.closeTimer);
      this.closeTimer = setTimeout(() => {
        this.$emit("update:overlay", false);
      }, 8000);
    },
  },

  beforeDestroy() {
    clearTimeout(this.closeTimer);
  },
};
</script>

<style lang="scss" scoped></style>
