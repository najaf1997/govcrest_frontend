<template>
  <div>
    <div class="text-right mb-1">
      <b-button
        variant="primary"
        pill
        @click="createUser"
        v-if="hasPermission('create_user')"
      >
        <feather-icon icon="PlusIcon" class="mr-50" />
        <span class="align-middle">Create</span>
      </b-button>
    </div>
    <b-card>
      <b-row class="mb-1" align-v="center">
        <b-col md="7">
          <div v-if="searchType">
            <b-form-group
              label="Name"
              label-for="name"
              class="w-50"
              v-if="searchType.value === 1"
            >
              <b-input-group>
                <template #prepend> </template>
              </b-input-group>
              <b-form-input id="name" v-model="name" placeholder="Name" />
            </b-form-group>
            <b-form-group
              label="Username"
              label-for="username"
              class="w-50"
              v-if="searchType.value === 2"
            >
              <b-form-input
                id="username"
                v-model="username"
                placeholder="Username"
              />
            </b-form-group>
          </div>
        </b-col>
        <b-col md="3">
          <b-form-group label="Search Type" label-for="searchType">
            <v-select
              id="searchType"
              v-model="searchType"
              :options="searchTypes"
              placeholder="Search Type"
              label="name"
            />
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-button variant="primary" pill @click="search">
            <feather-icon icon="SearchIcon" class="mr-50" />
            <span class="align-middle">Search</span>
          </b-button>
        </b-col>
      </b-row>
      <b-table
        responsive="sm"
        :fields="fields"
        :items="users"
        details-td-class="m-0 p-0"
        small
        v-if="hasPermission('read_user')"
        :per-page="0"
      >
        <template #cell(created_by_data)="row">
          {{
            row.item.created_by_data ? row.item.created_by_data.username : ""
          }}
        </template>
        <template #cell(updated_by_data)="row">
          {{
            row.item.updated_by_data ? row.item.updated_by_data.username : ""
          }}
        </template>
        <template #cell(role_data)="row">
          {{ row.item.role_data ? row.item.role_data.name : "" }}
        </template>
        <template #cell(organization_data)="row">
          {{
            row.item.organization_data ? row.item.organization_data.name : ""
          }}
        </template>
        <template #cell(manage)="row">
          <b-button
            variant="info"
            pill
            size="sm"
            class="mr-50"
            @click="editUser(row.item)"
            v-if="hasPermission('update_user')"
          >
            Edit
          </b-button>
          <b-button
            variant="warning"
            pill
            size="sm"
            class="mr-50"
            @click="changePasswordForUser(row.item)"
            v-if="hasRole('ca') || hasRole('su')"
            v-b-tooltip.hover
            :title="`Change password for ${row.item.full_name}`"
          >
            <feather-icon icon="LockIcon" size="14" />
          </b-button>
          <b-button
            variant="danger"
            pill
            size="sm"
            class="mr-50"
            @click="removeUser(row.item)"
            v-if="hasPermission('delete_user')"
          >
            Delete
          </b-button>
        </template>
      </b-table>
      <b-pagination
        size="md"
        :total-rows="totalItems"
        v-model="currentPage"
        :per-page="perPage"
      ></b-pagination>
    </b-card>
    <CreateUserModal
      @modalClosed="onModalClosed"
      :key="`create-${createUserModalCount}`"
    />
    <EditUserModal
      :user="user"
      @modalClosed="onModalClosed"
      :key="`edit-${editUserModalCount}`"
    />
    <ChangePasswordModal
      :user="selectedUser"
      @modalClosed="onPasswordChangeModalClosed"
      :key="`change-password-${changePasswordModalCount}`"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueSelectPaginated from "@/components/ui/VueSelectPaginated.vue";
import CreateUserModal from "@/components/user/CreateUserModal.vue";
import EditUserModal from "@/components/user/EditUserModal.vue";
import ChangePasswordModal from "@/components/user/ChangePasswordModal.vue";
import util from "@/util.js";

export default {
  components: {
    CreateUserModal,
    EditUserModal,
    ChangePasswordModal,
    VueSelectPaginated,
  },
  data() {
    return {
      fields: [
        { key: "full_name", label: "Full Name" },
        { key: "username", label: "Username" },
        { key: "mobile", label: "Mobile" },
        { key: "email", label: "Email" },
        { key: "role_data", label: "Role" },
        { key: "manage", label: "Manage" },
      ],
      currentPage: 1,
      perPage: 0,
      totalItems: 0,
      users: [],
      user: null,
      selectedUser: null,
      editUserModalCount: 0,
      createUserModalCount: 0,
      changePasswordModalCount: 0,
      searchTypes: [
        { value: 1, name: "Name" },
        { value: 2, name: "Username" },
      ],
      searchType: null,
      name: "",
      username: "",
    };
  },
  mixins: [util],
  created() {
    this.searchType = this.searchTypes[0];
  },
  async mounted() {
    await this.fetchPaginatedData();
  },
  methods: {
    ...mapActions({
      getUsers: "appData/getUsers",
      deleteUser: "appData/deleteUser",
    }),
    async search() {
      if (this.searchType) {
        switch (this.searchType.value) {
          case 1:
            this.username = "";
            break;
          case 2:
            this.name = "";
            break;
        }
      } else {
        this.name = "";
        this.username = "";
      }
      this.currentPage = 1;
      await this.fetchPaginatedData();
    },
    async fetchPaginatedData() {
      try {
        const res = await this.getUsers({
          pageNumber: this.currentPage,
          name: this.name,
          username: this.username,
        });
        this.users = res.data.results;
        this.totalItems = res.data.count;
        this.perPage = res.data.per_page;
      } catch (error) {
        this.displayError(error);
      }
    },
    createUser() {
      this.createUserModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("create-user-modal");
      });
    },
    editUser(user) {
      this.user = user;
      this.editUserModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("edit-user-modal");
      });
    },
    async removeUser(user) {
      this.user = user;

      this.$swal({
        title: "Are you sure?",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-danger ml-1",
        },
        buttonsStyling: false,
      }).then(async (result) => {
        if (result.value) {
          try {
            const res = await this.deleteUser({
              pk: this.user.id,
            });
            if (res.status === 204) {
              this.$swal({
                title: "User deleted successfully",
                icon: "success",
              });
              if (
                (this.totalItems - 1) % this.perPage === 0 &&
                this.currentPage !== 1
              ) {
                this.currentPage -= 1;
              } else {
                await this.fetchPaginatedData();
              }
            }
          } catch (error) {
            this.show = false;
            this.displayError(error);
          }
        } else {
          this.show = false;
        }
      });
    },
    async onModalClosed() {
      await this.fetchPaginatedData();
    },
    changePasswordForUser(user) {
      this.selectedUser = user;
      this.changePasswordModalCount += 1;
      this.$nextTick(() => {
        this.$bvModal.show("change-password-modal");
      });
    },
    onPasswordChangeModalClosed() {
      this.selectedUser = null;
    },
  },
  computed: {
    ...mapGetters({
      hasPermission: "appData/hasPermission",
      hasRole: "appData/hasRole",
    }),
  },
  watch: {
    currentPage: async function (val) {
      await this.fetchPaginatedData();
    },
  },
};
</script>

<style></style>
