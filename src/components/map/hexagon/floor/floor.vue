<template>
  <transition name="hexFade">
    <div v-if="visible">
      <svg
        class="color-fill"
        xmlns="http://www.w3.org/2000/svg"
        version="2"
        v-bind:style="style"
        viewBox="0 0 86.603 100"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <polygon
          @click="clickFloor()"
          v-bind:style="{ fill: color }"
          v-bind:class="svgClass"
          points="43.302,0 86.603,25 86.603,75 43.302,100 0,75 0,25"
        ></polygon>
      </svg>
      <!-- <svg
        v-for="(floorEdge, index) of floorEdges"
        :key="index"
        class="color-fill"
        xmlns="http://www.w3.org/2000/svg"
        version="2"
        v-bind:style="floorEdge"
        viewBox="0 0 86.603 100"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <polygon
          @click="clickFloor()"
          v-bind:style="{ fill: color }"
          v-bind:class="svgClass"
          :points="edge"
        ></polygon>
      </svg> -->
    </div>
  </transition>
</template>
<script src="./floor.js"/>
<style src="./floor.css"/>