<template>
    <div class="row w-100">
        <div class="col-3">
            <div class="card card-default">
                <div class="card-header">
                    User List
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        <a href="#" class="list-group-item list-group-item-action" @click="getPrivateMessages()">General Chat</a>
                        <a href="#" class="list-group-item list-group-item-action" v-for="(user, index) in userList" :key="index" @click="getPrivateMessages(user.id_users)">
                            {{ (user.customer) != null ? user.customer.full_name : (user.designer != null) ? user.designer.full_name : null }} <br>
                            {{ user.user_role }}
                        </a>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-6">
            <div class="card card-default">
                <div class="card-header">
                    Messages
                </div>
                <div class="card-body p-0">
                    <ul class="list-unstyled" style="height:300px; overflow-y:scroll" v-chat-scroll>
                        <li class="p-2" v-for="(message, index) in messages" :key="index">
                            <strong>{{ (message.user.designer != null) ? message.user.designer.full_name : (message.user.customer != null) ? message.user.customer.full_name : null }}</strong>
                            {{ message.message }}
                        </li>
                    </ul>
                </div>

                <input
                    @keydown="sendTypingEvent"
                    @keyup.enter="sendMessage"
                    v-model="newMessage"
                    type="text"
                    name="message"
                    placeholder="Enter your message..."
                    class="form-control"
                >
            </div>
            <span class="text-muted" v-if="activeUser && activeUser.id == receiver_id"> {{ (activeUser.customer) != null ? activeUser.customer.full_name : (activeUser.designer != null) ? activeUser.designer.full_name : null }} is typing...</span>
        </div>
        <div class="col-3">
            <div class="card card-default">
                <div class="card-header">
                    Active User
                </div>
                <div class="card-body">
                    <ul>
                        <li class="py-2" v-for="(user, index) in users" :key="index">
                            {{ (user.customer) != null ? user.customer.full_name : (user.designer != null) ? user.designer.full_name : null }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <button @click="logout()" class="btn btn-primary w-50 mx-auto mt-3" type="button">Logout</button>
    </div>
</template>

<script>
    import Echo from 'laravel-echo'

    window.Echo = new Echo({
    authEndpoint: 'https://api.nirbana.id/api/broadcasting/auth',
    broadcaster: 'pusher',
    key: '6Lv8ynPWXkFIJ1b1FV37',
    wsHost: 'localhost',
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    encrypted: true,
        auth: {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
    })

    export default {
        props: ['user'],
        data(){
            return {
                messages: [],
                newMessage: '',
                users: [],
                currentUser: null,
                userList: [],
                activeUser: false,
                typingTimer: false,
                messageType: 'General',
                receiver_id: null,

                fdMessage: new FormData()
            }
        },

        created(){
            window.Echo.join('chat')
            .here(user => {
                this.users = user
            })
            .joining(user => {
                this.users.push(user)
            })
            .leaving(user => {
                this.users = this.users.filter(u => u.id_users != user.id_users)
            })
            .listen('MessageSent', (event) => {
                this.messages.push(event.message)
            })
            .listenForWhisper('typing', user => {
                this.activeUser = user
                if(this.typingTimer){
                    clearTimeout(this.typingTimer)
                }
                this.typingTimer = setTimeout(() => {
                    this.activeUser = false
                }, 1500)
            })
            // this.getGeneralMessages()
            this.getAllUser()
            this.getCurrentUser()
        },

        methods: {
            test(){
                console.log(this.messages)
            },

            getCurrentUser(){
                this.$http.get(this.$api + '/getCurrentUser2', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.currentUser = response.data
                })
            },

            getGeneralMessages(){
                this.messages = []
                this.receiver_id = null
                this.messageType = 'General'
                this.$http.get(this.$api + '/generalMessages', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.messages = response.data
                })
            },

            getPrivateMessages(receiver_id){
                this.messages = []
                this.receiver_id = receiver_id
                this.messageType = 'Private'
                this.$http.get(this.$api + '/privateMessages/' + this.receiver_id, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.messages = response.data
                    console.log(this.messages)
                })
            },

            getAllUser(){
                this.$http.get(this.$api + '/getAllUser', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.userList = response.data
                    console.log(response.data)
                })
            },

            sendMessage(){
                var url = ''

                if(this.newMessage != ''){
                    this.messages.push({
                        user: this.currentUser,
                        message: this.newMessage
                    })

                    console.log(this.messages)

                    if(this.messageType == 'General'){
                        this.fdMessage.append('message', this.newMessage)
                        url = this.$api + '/generalMessages'
                    }
                    else{
                        url = this.$api + '/privateMessages'
                        this.fdMessage.append('message', this.newMessage)
                        this.fdMessage.append('receiver_id', this.receiver_id)
                    }

                    this.newMessage = ''
                    this.$http.post(url, this.fdMessage, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token'),
                            'X-Socket-Id': window.Echo.socketId()
                        }
                    })

                    console.log(window.Echo.socketId())
                }
            },

            sendTypingEvent(){
                window.Echo.join('chat')
                .whisper('typing', this.currentUser)
            },

            logout() {
                var url = this.$api + '/logout'
                this.load = true
                this.$http.post(url, null, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message
                    localStorage.setItem('token', 'null')
                    localStorage.setItem('id_users', 'null')
                    localStorage.setItem('email', 'null')
                    localStorage.setItem('user_role', 'null')
                    window.location.href = '/'
                }).catch(error => {
                    this.error_message = error.response.data.message
                })
            }
        }
    }
</script>
