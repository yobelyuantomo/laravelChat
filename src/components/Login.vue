<template>
    <div class="container">
        <div class="row w-50 mx-auto">
            <form class="my-auto">
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Email address</label>
                    <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Password</label>
                    <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
                </div>
                <div class="d-grid gap-2">
                    <button @click="submit" class="btn btn-primary" type="button">Masuk</button>
                </div>
            </form>
        </div>
        <div class="d-flex justify-content-center mt-4" v-if="isProgress == true">
            <b-spinner
                label="Text Centered"
                variant="warning"
            ></b-spinner>
            <span class="my-auto ml-2">Loading...</span>
        </div>
        <b-alert
            v-model="alert"
            :variant="variant"
            dismissible
        >
            {{ error_message }}
        </b-alert>
    </div>
</template>
<script>
    export default {
        name: 'Login',
        data() {
            return {
                isProgress: false,
                variant: '',
                alert: false,
                snackbar: false,
                error_message: '',
                color: '',
                valid: false,
                password: '',
                email: ''
            }
        },
        methods: {
            submit() {
                this.isProgress = true
                if (this.email != '' || this.password != '') { //cek apakah data yang akan dikirim sudah valid
                    this.$http.post(this.$api + '/login', {
                        email: this.email,
                        password: this.password
                    }).then(response => {

                        //menyimpan auth token
                        localStorage.setItem('id_users', response.data.user.id_users) //menyimpan id user yang sedang login
                        localStorage.setItem('email', response.data.user.email) //menyimpan email user yang sedang login
                        localStorage.setItem('user_role', response.data.user.user_role) //menyimpan role user yang sedang login
                        localStorage.setItem('token', response.data.access_token)

                        // console.log(response.data)

                        this.error_message = response.data.message
                        this.variant = 'success'
                        this.alert = true

                        this.$router.push('/chats')
                    }).catch(error => {
                        this.isProgress = false
                        this.error_message = error.response.data.message
                        this.variant = 'danger'
                        this.alert = true
                        localStorage.removeItem('token')
                    })
                }
                else{
                    this.error_message = 'Pastikan semua inputan sudah benar'
                    this.alert = true
                }
            }
        }
    }
</script>
