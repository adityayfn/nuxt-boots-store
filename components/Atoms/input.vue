<template lang="">
  <v-text-field
    v-model="props.modelValue"
    @input="updateValue"
    :counter="props.counter"
    :rules="props.rules"
    :label="props.label"
    :type="props.type"
    required
  ></v-text-field>
</template>
<script setup>
const props = defineProps(["modelValue", "counter", "rules", "label", "type"])
const emits = defineEmits(["update:modelValue"])

const updateValue = (event) => {
  emits("update:modelValue", event.target.value)
}
</script>
<style lang=""></style>
