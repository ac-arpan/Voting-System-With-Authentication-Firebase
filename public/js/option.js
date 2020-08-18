var app =  new Vue({
    el: '#app',
    data: {
        options: []
    },
    methods: {
        upvoteOption(id) {
            // console.log(id)
            const upvote = firebase.functions().httpsCallable('upvote')
            upvote({ id })
                .catch( err => {
                    // console.log(err.message)
                    showNotification(err.message)
                })
        }
    },
    mounted() {
        const ref = firebase.firestore().collection('options').orderBy('upvotes', 'desc')
        ref.onSnapshot( snapshot => {

            let options = []
            snapshot.docs.forEach( doc => {
                options.push( {...doc.data(), id: doc.id} )
            })

            this.options = options
        })
    }
})
