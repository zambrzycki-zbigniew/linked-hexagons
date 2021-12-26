<template>
  <div v-if="hex" style="transform-style: preserve-3d">
    <Floor
      v-if="hex && height > 0"
      :hex="hex"
      :width="width"
      :height="height"
      @select="passEvent"
    />
  </div>
</template>
<script src="./hexagon.js"/>
<style src="./hexagon.css"/>