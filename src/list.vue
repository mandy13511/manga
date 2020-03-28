<template>
  <ul v-if = "mangaList && mangaList.length">
    <li v-for = "manga of mangaList">
      <p><strong>{{ manga.chname }}</strong>{{ manga.jpname }}</p>
      <p>{{ manga.author }}</p>
      <span v-for = "tag of manga.category" style = "margin:2px;">{{ tag }}</span>
    </li>
  </ul>

  <ul v-else-if = "errors && errors.length">
    <li v-for = "error of errors">
      {{ error.message }}
    </li>
  </ul>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      mangaList: [],
      errors: []
    }
  },

  // Fetches posts when the component is created.
  created() {
    axios.get(`https://spreadsheets.google.com/feeds/list/1IZ-cGXnLVp6tv9JxgQh1lZiuUEZ7SQOK8ihrCXJ8Cc8/1/public/values?alt=json`)
    .then(response => {
      // JSON responses are automatically parsed.
      //this.posts = response.data.feed.entry
      var d = response.data.feed.entry;
      for(var i in d) {
        var item = {};
        item.jpname = d[i].gsx$jpname.$t;
        item.chname = d[i].gsx$chname.$t;
        item.author = d[i].gsx$author.$t;
        item.score = d[i].gsx$score.$t;
        item.category = d[i].gsx$category.$t.split("/");
        this.mangaList.push(item);
      }
      console.log(this.mangaList);
    })
    .catch(e => {
      this.errors.push(e)
    })

    // async / await version (created() becomes async created())
    //
    // try {
    //   const response = await axios.get(`http://jsonplaceholder.typicode.com/posts`)
    //   this.posts = response.data
    // } catch (e) {
    //   this.errors.push(e)
    // }
  }
}
</script>
