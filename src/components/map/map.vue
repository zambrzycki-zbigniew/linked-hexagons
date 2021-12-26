<template>
  <div
    style="height: 100%"
    ref="theParent"
    @mousedown="mouseDownHandler"
    @mouseup="mouseUpHandler"
    @mousemove="mouseMoveHandler"
  >
    <!-- <div style="position: absolute; background-color: #ff0000; height: 100%; width: 2px;"></div> -->
    <!-- <div class="d-flex">
      <v-btn @click="hexes.forEach((hex) => (hex.color = 'pride'))"
        >pride</v-btn
      >
      <v-btn @click="hexes.forEach((hex) => (hex.color = 'no pride'))"
        >no pride</v-btn
      >
      <v-btn @click="hexes.forEach((hex) => (hex.color = 'normal'))"
        >normal</v-btn
      >
      <v-btn @click="addPerspective">drugs</v-btn>
    </div> -->
    <v-row style="background-color: yellow" class="mt-12">
      <v-col cols="3">
        <!-- <v-card color="red"> ta karta ma około 25% szerokości </v-card> -->
      </v-col>
      <v-col cols="6">
        <v-card color="green"> ta karta ma około 50% szerokości </v-card>
      </v-col>
      <v-col cols="3">
        <!-- <v-card color="blue"> ta karta ma około 25% szerokości </v-card> -->
      </v-col>
    </v-row>
    <!-- <div v-bind:style="mapStyle" class="transformTransition parent3d">
      <HexagonComponent
        v-for="(hex, index) in hexes"
        :height="height"
        :width="width"
        :hex="hex"
        :key="'hex' + index"
        @selectedFloor="selectFloor"
        @deselectedFloor="deselectFloor"
        @selectedObject="selectObject"
        @deselectedObject="deselectObject"
      />
      <CharacterComponent
        v-for="figure in figures"
        :figure="figure"
        :key="'figure' + figure.id"
        :transform="transform"
        @selectCharacter="selectCharacter"
      />
    </div> -->
  </div>
</template>
<script src="./map.js"/>
<style src="./map.css"/>