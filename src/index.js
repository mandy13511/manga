import Vue from 'vue'
import axios from 'axios';
import './style.scss';

new Vue({
  el: '#app',
  data: {
    mangaList: [],
    showList: [],
    errors: [],
    categorySelected: []
  },
  mounted: function() {
    //Get manga list from google sheet
    axios.get(`https://spreadsheets.google.com/feeds/list/1IZ-cGXnLVp6tv9JxgQh1lZiuUEZ7SQOK8ihrCXJ8Cc8/1/public/values?alt=json`)
    .then(response => {
      var d = response.data.feed.entry;
      for(var i in d) {
        var item = {};
        item.jpname = d[i].gsx$jpname.$t;
        item.chname = d[i].gsx$chname.$t;
        item.author = d[i].gsx$author.$t;
        item.score = d[i].gsx$score.$t;
        item.category = d[i].gsx$category.$t;
        item.img = d[i].gsx$img.$t;
        this.mangaList.push(item);
        this.showList.push(item);
        //Shuffle
        this.showList.sort(() => Math.random() - 0.5);
      }
      //console.log(this.mangaList);
      //document.getElementById("app").style.visibility = "visible";
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    ifSelected: function(pCategory){
      return (this.categorySelected.includes(pCategory) ? true : false);
    },
    filter: function(pCategory) {
      //Update selected category
      var tCategorySelected = this.categorySelected;
      if (tCategorySelected.includes(pCategory)) {
        const index = tCategorySelected.indexOf(pCategory);
        if (index > -1) {
          tCategorySelected.splice(index, 1);
        }
      }
      else {
        tCategorySelected.push(pCategory);
      }
      this.categorySelected = tCategorySelected;

      //Regular expression
      var i;
      var tCategoryRE = "^"
      for (i = 0 ; i < tCategorySelected.length ; i++){
        tCategoryRE += "(?=.*" + tCategorySelected[i] + ")";
      }
      tCategoryRE += ".*$";

      //Update the list
      const re = new RegExp(tCategoryRE);
      this.showList = this.mangaList.filter(function(element) {
        return re.test(element.category);
      });
      //Shuffle
      this.showList.sort(() => Math.random() - 0.5);
    }
  }
})
