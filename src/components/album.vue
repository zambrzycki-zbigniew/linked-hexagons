<template>
  <div class="red" style="min-width: 100px; min-height: 100px">
    <Zdjecie
      v-for="(wartosc, index) of listaZdjec"
      :key="index"
      :img="wartosc"
    />
    <div v-if="wybranyKlucz === 'imie'">
        {{czlowiek.imie}}
    </div>
    <div v-if="wybranyKlucz === 'nazwisko'">
        {{czlowiek.nazwisko}}
    </div>
  </div>
</template>

<script>
import Zdjecie from "./zdjecie.vue";
export default {
  components: {
    Zdjecie,
  },
  data() {
    return {
      listaZdjec: [
        "https://i.ytimg.com/vi/EGQJ1HW46iQ/maxresdefault.jpg",
        "https://i.ytimg.com/vi/SqyY-CMpyU8/maxresdefault.jpg",
        "https://i.ytimg.com/vi/LJnpwL-2Drc/maxresdefault.jpg",
        "https://firebasestorage.googleapis.com/v0/b/pgerlipp.appspot.com/o/thumbnails%2Farchitecture-town-roof-city-cityscape-downtown-624454-pxhere.com.jpg?alt=media&token=fd2e5937-5d6b-4336-877f-6b67147a9597",
        require("@/assets/1.jpg"),
        require("@/assets/2.jpg"),
        require("@/assets/3.jpg"),
      ],
      wybranyKlucz: "imie",
      czlowiek: {
        imie: "Zbigniew",
        nazwisko: "Zambrzycki",
        wiek: 29,
        rozmiar: "20cm",
      },
      listaLudzi: [
        {
          imie: "Zbigniew",
          nazwisko: "Zambrzycki",
          wiek: 29,
          rozmiar: "20cm",
        },
        {
          imie: "Marta",
          nazwisko: "Barbieri",
          wiek: 27,
          rozmiar: "nie ma",
        },
      ],
    };
  },
};
</script>