import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

var user = {}
if(localStorage.getItem("currentUser")){
	user = JSON.parse(localStorage.getItem("currentUser"));
}

export default new Vuex.Store({
	state: {
		user: user,
		token: null
	},
	mutations: {
	}
})