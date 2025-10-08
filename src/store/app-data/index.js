import axiosIns from "@/libs/axios";

export default {
  namespaced: true,
  state: {
    isLoggedIn: false,
    user: null,
    navMenuItems: [],
  },
  getters: {
    getLoggedInUser: (state) => {
      return state.user;
    },
    hasPermission: (state) => (name) => {
      if (state.user) {
        return state.user.permissions.hasOwnProperty(name);
      }
      return false;
    },
    hasRole: (state) => (name) => {
      if (state.user.role_data.code_name === name) {
        return true;
      }
      return false;
    },
    isLoggedIn: (state) => state.isLoggedIn,
    getNavMenuItems: (state) => state.navMenuItems,
  },
  mutations: {
    login(state, data) {
      state.isLoggedIn = true;
      state.user = data.user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    setNavMenuItems(state) {
      state.navMenuItems = [];

      if (state.user.permissions.hasOwnProperty("show_user")) {
        state.navMenuItems.push({
          title: "User",
          icon: "UserIcon",
          route: "User",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_role")) {
        state.navMenuItems.push({
          title: "Role",
          icon: "UsersIcon",
          route: "Role",
        });
      }

      if (state.user.permissions.hasOwnProperty("show_contract")) {
        state.navMenuItems.push({
          title: "Contract",
          icon: "FileTextIcon",
          route: "Contract",
        });
      }
      const lookupTablesMenuItem = {
        title: "Lookup Tables",
        icon: "ToolIcon",
        children: [],
      };

      if (state.user.permissions.hasOwnProperty("show_company")) {
        state.navMenuItems.push(lookupTablesMenuItem);
      }
      if (state.user.permissions.hasOwnProperty("show_company")) {
        lookupTablesMenuItem.children.push({
          title: "Company",
          route: "Company",
        });
      }
      if (state.user.permissions.hasOwnProperty("show_contract_status")) {
        if (!lookupTablesMenuItem.children.length) {
          state.navMenuItems.push(lookupTablesMenuItem);
        }
        lookupTablesMenuItem.children.push({
          title: "Contract Status",
          route: "ContractStatus",
        });
      }
    },
  },
  actions: {
    async login({ commit }, payload) {
      const res = await axiosIns.post("login", payload);
      if (res.status === 200) {
        commit("login", res.data);
        commit("setNavMenuItems");
      }
      return res;
    },
    async logout({ commit }) {
      const res = await axiosIns.post("logout");
      if (res.status === 204) {
        commit("logout");
      }
      return res;
    },
    async getCurrentUser({ commit }) {
      const res = await axiosIns.get("current");
      if (res.status === 200) {
        commit("login", res.data);
        commit("setNavMenuItems");
      }
    },
    async getRoles({ commit }, { pageNumber, name }) {
      let url = `roles/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getRole({ commit }, { pk }) {
      const res = await axiosIns.get(`roles/${pk}/`);
      return res;
    },
    async createRole({ commit }, payload) {
      const res = await axiosIns.post("roles/", payload);
      return res;
    },
    async updateRole({ commit }, { payload, pk }) {
      const res = await axiosIns.put(`roles/${pk}/`, payload);
      return res;
    },
    async deleteRole({ commit }, { pk }) {
      const res = await axiosIns.delete(`roles/${pk}/`);
      return res;
    },
    async getPermissions({ commit }) {
      const res = await axiosIns.get("permissions");
      return res;
    },
    async getUsers({ commit }, { pageNumber, name, username }) {
      let url = `users/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (username) {
        url += `&username=${username}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getUser({ commit }, { pk }) {
      const res = await axiosIns.get(`users/${pk}/`);
      return res;
    },
    async createUser({ commit }, payload) {
      const res = await axiosIns.post("users/", payload);
      return res;
    },
    async updateUser({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`users/${pk}/`, payload);
      return res;
    },
    async deleteUser({ commit }, { pk }) {
      const res = await axiosIns.delete(`users/${pk}/`);
      return res;
    },
    async getCompanys({ commit }, { pageNumber, name, username }) {
      let url = `company/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (username) {
        url += `&username=${username}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getCompany({ commit }, { pk }) {
      const res = await axiosIns.get(`company/${pk}/`);
      return res;
    },
    async createCompany({ commit }, payload) {
      const res = await axiosIns.post("company/", payload);
      return res;
    },
    async updateCompany({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`company/${pk}/`, payload);
      return res;
    },
    async deleteCompany({ commit }, { pk }) {
      const res = await axiosIns.delete(`company/${pk}/`);
      return res;
    },
    async getContractStatuses({ commit }, { pageNumber, name, description }) {
      let url = `contract-status/?page=${pageNumber}`;
      if (name) {
        url += `&name=${name}`;
      }
      if (description) {
        url += `&description=${description}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getContractStatus({ commit }, { pk }) {
      const res = await axiosIns.get(`contract-status/${pk}/`);
      return res;
    },
    async createContractStatus({ commit }, payload) {
      const res = await axiosIns.post("contract-status/", payload);
      return res;
    },
    async updateContractStatus({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`contract-status/${pk}/`, payload);
      return res;
    },
    async deleteContractStatus({ commit }, { pk }) {
      const res = await axiosIns.delete(`contract-status/${pk}/`);
      return res;
    },
    async getContracts({ commit }, { pageNumber, notice_id, title }) {
      let url = `contract/?page=${pageNumber}`;
      if (notice_id) {
        url += `&notice_id=${notice_id}`;
      }
      if (title) {
        url += `&title=${title}`;
      }
      const res = await axiosIns.get(url);
      return res;
    },
    async getContract({ commit }, { pk }) {
      const res = await axiosIns.get(`contract/${pk}/`);
      return res;
    },
    async createContract({ commit }, payload) {
      const res = await axiosIns.post("contract/", payload);
      return res;
    },
    async updateContract({ commit }, { payload, pk }) {
      const res = await axiosIns.patch(`contract/${pk}/`, payload);
      return res;
    },
    async deleteContract({ commit }, { pk }) {
      const res = await axiosIns.delete(`contract/${pk}/`);
      return res;
    },
  },
};
