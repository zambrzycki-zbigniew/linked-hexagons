<template>
  <transition name="figureFade">
    <div v-if="visible" class="parent3d">
      <div v-if="visible" v-bind:style="style" v-bind:class="{character: !inMove, movingCharacter: inMove, parent3d: true}">
        <div v-bind:style="spriteStyle"/>
        <div v-bind:style="clickableStyle" @click="selectCharacter()"></div>
      </div>
        <!-- @mouseover="selectCharacter()"
        @mouseout="selectCharacter()" -->
    </div>
  </transition>
</template>
<script src="./character.js"/>
<style src="./character.css"/>