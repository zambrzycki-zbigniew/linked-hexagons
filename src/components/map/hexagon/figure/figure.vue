<template>
  <div
    style="transform-style: preserve-3d"
    v-if="hex.hasObject && hex && style.top !== null && style.left !== null"
    @click="clickObject()"
  >
    <svg
      v-for="(transform, index) in blockStyles"
      :key="index"
      id="color-fill"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      :width="width"
      :height="height"
      v-bind:style="transform"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      v-bind:class="hex.svgClassObject"
    >
      <polygon
        v-bind:class="hex.classObject"
        points="21.65075,25 64.95224999999999,25 64.95224999999999,75 21.65075,75"
      ></polygon>
    </svg>
  </div>
</template>
<script src="./figure.js"/>
<style src="./figure.css"/>