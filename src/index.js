import Vue from 'vue'
import axios from 'axios';
import './style.scss';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);

Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  el: '#app',
  data: {
    mangaList: [],
    showList: [],
    loading: true,
    errors: [],
    category: require('./category'),
    school: false,
    categorySelected: []
  },
  created: function() {
    if (screen.width <= 500) {
      window.addEventListener('scroll', this.handleScroll);
    }
  },
  destroyed: function() {
    if (screen.width <= 500){
      window.removeEventListener('scroll', this.handleScroll);
    }
  },
  mounted: function() {
    document.getElementsByTagName("body")[0].style.display = "block";
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
        item.date = new Date(d[i].gsx$date.$t);
        this.mangaList.push(item);
        this.showList.push(item);
        //Shuffle
        this.showList.sort(() => Math.random() - 0.5);
        this.loading = false;
      }
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    handleScroll: function(event) {
      //Show scroll to top button when scrolling
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById('scrollTop').style.display = "flex";
      }
      else {
        document.getElementById('scrollTop').style.display = "none";
      }
    },
    ifSelected: function(pCategory){
      return (this.categorySelected.includes(pCategory) ? true : false);
    },
    sortByScore: function() {
      this.showList.sort(function(a, b) {
        if (a.score > b.score) {
          return -1;
        }
        if (a.score < b.score) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
    },
    sortByDate: function() {
      this.showList.sort((a, b) => b.date - a.date);
    },
    convertTochName: function(pTagEnName) {
      for (var element of this.category) {
        if (pTagEnName == element.enName) {
          return "＃" + element.chName;
        }
      }
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
      this.$refs.list.scrollTop = 0;
    },
    scrollToTop: function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
})
