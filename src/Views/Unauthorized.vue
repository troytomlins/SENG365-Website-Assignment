<template>
  <div>
    <h1 class="m-5">Unauthorized</h1>
    <button class="btn btn-primary" @click="gotoEvents()">Return to home</button>
  </div>
</template>

<script>
export default {
  name: 'Unauthorized',
  methods: {
    gotoEvents() {
      this.$router.push({name: 'Events'})
    }
  }
}
</script>