<template>
  <div id="app">
  <header class = "header">
    <img src = "./img/navbar_logo.png" style = "object-fit: cover; height: 85%;" alt = "少女漫畫推薦清單">
  </header>
  <main>
    <div class="filter-nav">
      <div class="container btn-area">
        <button v-for="(item, index) of category"
                :key="item.enName"
                type="button"
                :class="[(index % 3 == 0 ? 'btn btn-y' : (index % 3 == 2 ? 'btn btn-p': 'btn btn-b')),
                              { active: ifSelected(item.enName) == true }]"
                @mousedown="filter(item.enName)" id = "abc">
                  {{ item.chName }}
        </button>
      </div>
      <div class = "detail">
      <a class="link" @click="sortByScore()">推薦排序</a>
      <a class="link" @click="sortByDate()">日期排序</a>
      <span> 共 {{ showList.length }} 部 </span>
    </div>
    </div>
    <div class="list" :class="{ center: loading }" ref = "list">
      <div class="lds-ellipsis" v-show="loading"><div></div><div></div><div></div><div></div></div>
      <ul v-if="showList && showList.length" class="grid-container manga-list">
        <li v-for="manga of showList" 
            :key="manga.jpname"
            class="grid-container manga-content">
          <div class="content-d">
            <img  v-if="manga.score > 1"
                  :src="'img/score' + manga.score + '.png'"
                  style="max-height: 3rem; margin-top: 1rem;"/>
          </div>
          <div  class="content-a">
            <img  v-if="manga.jpname"
                  v-lazy="manga.src"
                  class="manga-img"
                  :title="manga.chname"
                  :alt="manga.chname"/>
            <img  v-else
                  src="img/noimg.png"
                  class="manga-img"
                  :title="manga.chname"
                  :alt="manga.chname"/>
          </div>
          <div class="content-b">
            <div class="content-c">
              <span v-for="(tag,index) of manga.category.split('/')" 
                    :key="tag+index"
                    class="tag">
                {{ convertTochName(tag) }}
              </span>
            </div>
            <strong class="manga-title">{{ manga.chname }}</strong><br/>
            <span class="sub-info">{{ manga.jpname }}</span><br/>
            {{ manga.author }}
          </div>
        </li>
      </ul>
      <ul v-else-if="errors && errors.length">
        <li v-for="error of errors" :key="error">
          {{ error.message }}
        </li>
      </ul>
    </div>
    <button id="scrollTop" @click = "scrollToTop()">
      <!--font-awesome-icon icon="arrow-up" style="color: #5D391E" /-->
    </button>
    <footer class="footer" ref = "footer">
      <span style="margin-right: 2rem;">(c) 2021 by Mandy Chien</span>
    </footer>
  </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  components: {
    
  },
  data: function() {
    return {
      mangaList: [],
      showList: [],
      loading: true,
      errors: [],
      category: require('./category'),
      school: false,
      categorySelected: []
    }
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
    //document.getElementsByTagName("body")[0].style.display = "block";
    axios.get(`https://docs.google.com/spreadsheets/d/e/2PACX-1vR3QWEvIbZNPvtcf-RPzPscQ-hIPUPD33G-M5pJoZ1PpckCbC0tOcA03igkFGRsCzWZNM9bok8T9dM_/pub?output=csv`)
    .then(response => {
      console.log(response);
      /*var d = response.data.feed.entry;
      for(var i in d) {
        var item = {};
        item.jpname = d[i].gsx$jpname.$t;
        item.chname = d[i].gsx$chname.$t;
        item.author = d[i].gsx$author.$t;
        item.score = d[i].gsx$score.$t;
        item.category = d[i].gsx$category.$t;
        item.date = new Date(d[i].gsx$date.$t);
        item.src = 'img/' + d[i].gsx$jpname.$t + '.jpg';
        this.mangaList.push(item);
        this.showList.push(item);
        //Shuffle
        this.showList.sort(() => Math.random() - 0.5);
        this.loading = false;
      }*/
    })
    .catch(e => {
      this.errors.push(e)
    })
  },
  methods: {
    handleScroll: function() {
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
}
</script>
