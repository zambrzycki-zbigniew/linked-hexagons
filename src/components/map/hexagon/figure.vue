<template>
  <div v-if="hex" class="parent3d">
    <Character
      v-if="hex"
      :hex="hex"
      :sprite="sprites[randomSprite]"
      :transform="transform"
      @selectCharacter="passEvent"
    />
  </div>
</template>
<script src="./figure.js"/>
<style src="./figure.css"/>